import { InferSelectModel } from "drizzle-orm";
import { products, votes } from "@/db/schema";

export type FormState = {
    success: boolean;
    errors?: Record<string, string[]>;
    message: string;
};

export type ProductType = InferSelectModel<typeof products>;
export type VoteType = InferSelectModel<typeof votes>;

