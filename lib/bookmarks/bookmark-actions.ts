"use server";

import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const toggleBookmarkAction = async (productId: number) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                isBookmarked: false,
                message: "You must be signed in to bookmark products",
            };
        }

        const existing = await db
            .select({ id: bookmarks.id })
            .from(bookmarks)
            .where(and(eq(bookmarks.userId, userId), eq(bookmarks.productId, productId)))
            .limit(1);

        if (existing.length > 0) {
            await db
                .delete(bookmarks)
                .where(and(eq(bookmarks.userId, userId), eq(bookmarks.productId, productId)));

            revalidatePath("/bookmarks");
            return {
                success: true,
                isBookmarked: false,
                message: "Bookmark removed",
            };
        } else {
            await db
                .insert(bookmarks)
                .values({
                    userId,
                    productId,
                })
                .onConflictDoNothing();

            revalidatePath("/bookmarks");
            return {
                success: true,
                isBookmarked: true,
                message: "Product saved to bookmarks!",
            };
        }
    } catch (error) {
        console.error("Error in toggleBookmarkAction:", error);
        return {
            success: false,
            isBookmarked: false,
            message: "Failed to update bookmark",
        };
    }
};

export const getUserBookmarkedProductIdsAction = async (): Promise<number[]> => {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        const userBookmarks = await db
            .select({ productId: bookmarks.productId })
            .from(bookmarks)
            .where(eq(bookmarks.userId, userId));

        return userBookmarks.map((b) => b.productId);
    } catch (error) {
        console.error("Error fetching user bookmarked product IDs:", error);
        return [];
    }
};
