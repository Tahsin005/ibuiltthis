"use server";

import { FormState } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { productSchema } from "./product-validations";
import { db } from "@/db";
import { products, votes } from "@/db/schema";
import z from "zod";
import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export const addProductAction = async (
    prevState: FormState,
    formData: FormData
) => {
    try {
        const { userId, orgId } = await auth();
        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to submit a product",
                errors: undefined,
            };
        }

        if (!orgId) {
            return {
                success: false,
                message: "You must be a member of an organization to submit a product",
                errors: undefined,
            };
        }
        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous";

        const rawFormData = Object.fromEntries(formData.entries());

        // validate the data
        const validatedData = productSchema.safeParse(rawFormData);

        if (!validatedData.success) {
            return {
                success: false,
                errors: validatedData.error.flatten().fieldErrors,
                message: "Invalid data. Please fix the errors below.",
            };
        }

        const { name, slug, tagline, description, websiteUrl, logoUrl, tags } = validatedData.data;
        const tagsArray = tags ? tags.filter((tag) => typeof tag === "string") : [];

        // Upload logo to Cloudinary if file provided
        const logoFile = formData.get("logoFile");
        let finalLogoUrl = logoUrl || null;

        if (logoFile instanceof File && logoFile.size > 0) {
            try {
                finalLogoUrl = await uploadImageToCloudinary(logoFile);
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return {
                    success: false,
                    message: "Failed to upload logo image to Cloudinary",
                    errors: undefined,
                };
            }
        }

        // transform the data
        await db.insert(products).values({
            name,
            slug,
            tagline,
            description,
            websiteUrl,
            logoUrl: finalLogoUrl,
            tags: tagsArray,
            status: "pending",
            submittedBy: userEmail,
            organizationId: orgId,
            userId,
        });

        revalidatePath("/my-products");
        revalidatePath("/admin");

        return {
            success: true,
            message: "Product submitted successfully! It will be reviewed shortly.",
            errors: undefined,
        };
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: error.flatten().fieldErrors,
                message: "Validation failed. Please check the form.",
            };
        }

        return {
            success: false,
            errors: undefined,
            message: "Failed to submit product. Slug might already be in use.",
        };
    }
};

export const upvoteProductAction = async (productId: number) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to vote",
                hasVoted: false,
            };
        }

        // Check & delete existing vote atomically
        const deleted = await db
            .delete(votes)
            .where(and(eq(votes.productId, productId), eq(votes.userId, userId)))
            .returning({ id: votes.id });

        if (deleted.length > 0) {
            // Was deleted -> Decrement counter
            await db
                .update(products)
                .set({
                    voteCount: sql`GREATEST(0, ${products.voteCount} - 1)`,
                })
                .where(eq(products.id, productId));

            revalidatePath("/explore");
            return {
                success: true,
                hasVoted: false,
                message: "Upvote removed",
            };
        }

        // Was not deleted -> Insert vote (guarded with onConflictDoNothing)
        const inserted = await db
            .insert(votes)
            .values({
                productId,
                userId,
            })
            .onConflictDoNothing()
            .returning({ id: votes.id });

        if (inserted.length > 0) {
            await db
                .update(products)
                .set({
                    voteCount: sql`${products.voteCount} + 1`,
                })
                .where(eq(products.id, productId));
        }

        revalidatePath("/explore");
        return {
            success: true,
            hasVoted: true,
            message: "Product upvoted!",
        };
    } catch (error) {
        console.error("Error in upvoteProductAction:", error);
        return {
            success: false,
            message: "Failed to process vote",
            hasVoted: false,
        };
    }
};

export const downvoteProductAction = async (productId: number) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to vote",
                hasVoted: false,
            };
        }

        const deleted = await db
            .delete(votes)
            .where(and(eq(votes.productId, productId), eq(votes.userId, userId)))
            .returning({ id: votes.id });

        if (deleted.length === 0) {
            return {
                success: false,
                hasVoted: false,
                message: "You haven't upvoted this product yet",
            };
        }

        await db
            .update(products)
            .set({
                voteCount: sql`GREATEST(0, ${products.voteCount} - 1)`,
            })
            .where(eq(products.id, productId));

        revalidatePath("/explore");
        return {
            success: true,
            hasVoted: false,
            message: "Upvote removed",
        };
    } catch (error) {
        console.error("Error in downvoteProductAction:", error);
        return {
            success: false,
            message: "Failed to remove vote",
            hasVoted: false,
        };
    }
};

export const getUserVotedProductIdsAction = async (): Promise<number[]> => {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        const userVotes = await db
            .select({ productId: votes.productId })
            .from(votes)
            .where(eq(votes.userId, userId));

        return userVotes.map((v) => v.productId);
    } catch (error) {
        console.error("Error fetching user votes:", error);
        return [];
    }
};

export const deleteProductAction = async (productId: number) => {
    try {
        const { userId, orgId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in",
            };
        }

        const product = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        if (!product[0]) {
            return { success: false, message: "Product not found" };
        }

        const isOwner =
            product[0].userId === userId ||
            (orgId && product[0].organizationId === orgId);

        if (!isOwner) {
            return {
                success: false,
                message: "You can only delete products you or your organization submitted",
            };
        }

        await db.delete(products).where(eq(products.id, productId));

        revalidatePath("/my-products");
        revalidatePath("/admin");
        revalidatePath("/explore");
        revalidatePath("/");

        return { success: true, message: "Product deleted" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to delete product" };
    }
};

export const editProductAction = async (
    productId: number,
    formData: FormData
) => {
    try {
        const { userId, orgId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in",
                errors: undefined,
            };
        }

        const product = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        if (!product[0]) {
            return { success: false, message: "Product not found", errors: undefined };
        }

        const isOwner =
            product[0].userId === userId ||
            (orgId && product[0].organizationId === orgId);

        if (!isOwner) {
            return {
                success: false,
                message: "You can only edit products you or your organization submitted",
                errors: undefined,
            };
        }

        const rawFormData = Object.fromEntries(formData.entries());
        const validatedData = productSchema.safeParse(rawFormData);

        if (!validatedData.success) {
            return {
                success: false,
                errors: validatedData.error.flatten().fieldErrors,
                message: "Invalid data. Please fix the errors.",
            };
        }

        const { name, slug, tagline, description, websiteUrl, logoUrl, tags } =
            validatedData.data;
        const tagsArray = tags ? tags.filter((tag) => typeof tag === "string") : [];

        // Upload logo to Cloudinary if file provided
        const removeLogo = formData.get("removeLogo") === "true";
        const logoFile = formData.get("logoFile");
        let finalLogoUrl = removeLogo ? null : (logoUrl || product[0].logoUrl || null);

        if (logoFile instanceof File && logoFile.size > 0) {
            try {
                finalLogoUrl = await uploadImageToCloudinary(logoFile);
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return {
                    success: false,
                    message: "Failed to upload logo image to Cloudinary",
                    errors: undefined,
                };
            }
        }

        await db
            .update(products)
            .set({
                name,
                slug,
                tagline,
                description,
                websiteUrl,
                logoUrl: finalLogoUrl,
                tags: tagsArray,
                status: "pending",
            })
            .where(eq(products.id, productId));

        revalidatePath("/my-products");
        revalidatePath("/admin");
        revalidatePath("/explore");
        revalidatePath("/");

        return {
            success: true,
            message: "Product updated and re-submitted for review",
            errors: undefined,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to update product",
            errors: undefined,
        };
    }
};

export const recordProductClickAction = async (productId: number) => {
    try {
        await db
            .update(products)
            .set({
                clickCount: sql`${products.clickCount} + 1`,
            })
            .where(eq(products.id, productId));

        return { success: true };
    } catch (error) {
        console.error("Error recording product click:", error);
        return { success: false };
    }
};
