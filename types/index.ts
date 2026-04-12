import { InferSelectModel } from "drizzle-orm";
import { products } from "@/db/schema";

export type ProductType = InferSelectModel<typeof products>;
