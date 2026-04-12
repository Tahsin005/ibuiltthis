"use server";

import { FormState } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { productSchema } from "./product-validations";
import { db } from "@/db";
import { products } from "@/db/schema";
import z from "zod";

export const addProductAction = async (
    prevState: FormState,
    formData: FormData
) => {
    try {
        const { userId, orgId } = await auth();
        console.log(userId, orgId);
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

        //validate the data
        const validatedData = productSchema.safeParse(rawFormData);

        if (!validatedData.success) {
            console.log(validatedData.error.flatten().fieldErrors);
            return {
                success: false,
                errors: validatedData.error.flatten().fieldErrors,
                message: "Invalid data",
            };
        }

        const { name, slug, tagline, description, websiteUrl, tags } = validatedData.data;
        const tagsArray = tags ? tags.filter((tag) => typeof tag === "string") : [];

        // transform the data
        await db.insert(products).values({
            name,
            slug,
            tagline,
            description,
            websiteUrl,
            tags: tagsArray,
            status: "pending",
            submittedBy: userEmail,
            organizationId: orgId,
            userId,
        });

        return {
            success: true,
            message: "Product submitted successfully! It will be reviewed shortly.",
            errors: undefined,
        };
    } catch (error) {
        console.log(error);
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
            message: "Failed to submit product",
        };
    }
}