import { InferSelectModel } from "drizzle-orm";
import { products, votes, comments, bookmarks } from "@/db/schema";

export type FormState = {
    success: boolean;
    errors?: Record<string, string[]>;
    message: string;
};

export type ProductType = InferSelectModel<typeof products>;
export type VoteType = InferSelectModel<typeof votes>;
export type CommentType = InferSelectModel<typeof comments>;
export type BookmarkType = InferSelectModel<typeof bookmarks>;

