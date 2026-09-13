"use server";

import { db } from "@/db";
import { comments, products } from "@/db/schema";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const addCommentAction = async (productId: number, content: string) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to leave a comment",
            };
        }

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            return {
                success: false,
                message: "Comment cannot be empty",
            };
        }

        if (trimmedContent.length > 1000) {
            return {
                success: false,
                message: "Comment cannot exceed 1000 characters",
            };
        }

        // Verify product exists
        const product = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        if (!product[0]) {
            return {
                success: false,
                message: "Product not found",
            };
        }

        const user = await currentUser();
        const userName =
            user?.fullName ||
            user?.username ||
            (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Anonymous");
        const userAvatar = user?.imageUrl || null;

        const [newComment] = await db
            .insert(comments)
            .values({
                productId,
                userId,
                userName,
                userAvatar,
                content: trimmedContent,
            })
            .returning();

        revalidatePath(`/products/${product[0].slug}`);
        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Comment posted successfully!",
            comment: newComment,
        };
    } catch (error) {
        console.error("Error in addCommentAction:", error);
        return {
            success: false,
            message: "Failed to post comment",
        };
    }
};

export const deleteCommentAction = async (commentId: number) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to delete a comment",
            };
        }

        const existingComment = await db
            .select()
            .from(comments)
            .where(eq(comments.id, commentId))
            .limit(1);

        if (!existingComment[0]) {
            return {
                success: false,
                message: "Comment not found",
            };
        }

        let isAuthorized = existingComment[0].userId === userId;

        if (!isAuthorized) {
            try {
                const client = await clerkClient();
                const user = await client.users.getUser(userId);
                if (user.publicMetadata?.isAdmin === true) {
                    isAuthorized = true;
                }
            } catch (err) {
                console.error("Error verifying admin during comment deletion:", err);
            }
        }

        if (!isAuthorized) {
            return {
                success: false,
                message: "You are not authorized to delete this comment",
            };
        }

        // Find product slug for revalidation
        const product = await db
            .select({ slug: products.slug })
            .from(products)
            .where(eq(products.id, existingComment[0].productId))
            .limit(1);

        await db.delete(comments).where(eq(comments.id, commentId));

        if (product[0]?.slug) {
            revalidatePath(`/products/${product[0].slug}`);
        }
        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Comment deleted",
        };
    } catch (error) {
        console.error("Error in deleteCommentAction:", error);
        return {
            success: false,
            message: "Failed to delete comment",
        };
    }
};
