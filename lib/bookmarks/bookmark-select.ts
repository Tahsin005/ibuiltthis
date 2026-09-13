import { db } from "@/db";
import { bookmarks, products } from "@/db/schema";
import { ProductType } from "@/types";
import { desc, eq } from "drizzle-orm";

export const getUserBookmarkedProducts = async (userId: string): Promise<ProductType[]> => {
    try {
        const rows = await db
            .select({
                product: products,
            })
            .from(bookmarks)
            .innerJoin(products, eq(bookmarks.productId, products.id))
            .where(eq(bookmarks.userId, userId))
            .orderBy(desc(bookmarks.createdAt));

        return rows.map((r) => r.product);
    } catch (error) {
        console.error("Error fetching user bookmarked products:", error);
        return [];
    }
};
