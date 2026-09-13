import { db } from "@/db";
import { comments } from "@/db/schema";
import { CommentType } from "@/types";
import { eq, asc } from "drizzle-orm";

export const getCommentsByProductId = async (
    productId: number
): Promise<CommentType[]> => {
    try {
        const productComments = await db
            .select()
            .from(comments)
            .where(eq(comments.productId, productId))
            .orderBy(asc(comments.createdAt));

        return productComments;
    } catch (error) {
        console.error("Error fetching comments for product:", error);
        return [];
    }
};
