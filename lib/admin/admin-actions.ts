"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductType } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";

async function verifyAdmin(): Promise<{ authorized: boolean; error?: string }> {
    const { userId } = await auth();
    if (!userId) {
        return { authorized: false, error: "You must be signed in to perform this action" };
    }

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const isAdmin = user.publicMetadata?.isAdmin === true;

        if (!isAdmin) {
            return { authorized: false, error: "Unauthorized: Admin access required" };
        }

        return { authorized: true };
    } catch (error) {
        console.error("Error verifying admin status:", error);
        return { authorized: false, error: "Failed to verify admin status" };
    }
}

export const approveProductAction = async (productId: ProductType["id"]) => {
    try {
        const authCheck = await verifyAdmin();
        if (!authCheck.authorized) {
            return {
                success: false,
                message: authCheck.error || "Unauthorized",
            };
        }

        await db
            .update(products)
            .set({ status: "approved", approvedAt: new Date() })
            .where(eq(products.id, productId));

        revalidatePath("/admin");
        revalidatePath("/");
        revalidatePath("/explore");

        return {
            success: true,
            message: "Product approved successfully",
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to approve product",
        };
    }
};

export const rejectProductAction = async (productId: ProductType["id"]) => {
    try {
        const authCheck = await verifyAdmin();
        if (!authCheck.authorized) {
            return {
                success: false,
                message: authCheck.error || "Unauthorized",
            };
        }

        await db
            .update(products)
            .set({ status: "rejected", approvedAt: null })
            .where(eq(products.id, productId));

        revalidatePath("/admin");
        revalidatePath("/");
        revalidatePath("/explore");

        return {
            success: true,
            message: "Product rejected successfully",
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to reject product",
        };
    }
};

export const deleteProductAction = async (productId: ProductType["id"]) => {
    try {
        const authCheck = await verifyAdmin();
        if (!authCheck.authorized) {
            return {
                success: false,
                message: authCheck.error || "Unauthorized",
            };
        }

        await db.delete(products).where(eq(products.id, productId));

        revalidatePath("/admin");
        revalidatePath("/");
        revalidatePath("/explore");

        return {
            success: true,
            message: "Product deleted",
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to delete product",
        };
    }
};
