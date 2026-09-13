import { db } from "@/db";
import { products } from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { connection } from "next/server";

export async function getFeaturedProducts() {
    "use cache";
    const productsData = await db
        .select()
        .from(products)
        .where(eq(products.status, "approved"))
        .orderBy(desc(products.voteCount))
        .limit(6);

    return productsData;
}

export async function getAllApprovedProducts() {
    "use cache";
    const productsData = await db
        .select()
        .from(products)
        .where(eq(products.status, "approved"))
        .orderBy(desc(products.voteCount));

    return productsData;
}

export async function getAllProducts() {
    "use cache";
    const productsData = await db
        .select()
        .from(products)
        .orderBy(desc(products.voteCount));

    return productsData;
}

export async function getRecentlyLaunchedProducts() {
    await connection();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const productsData = await db
        .select()
        .from(products)
        .where(
            and(
                eq(products.status, "approved"),
                gte(products.createdAt, oneWeekAgo)
            )
        )
        .orderBy(desc(products.createdAt))
        .limit(12);

    return productsData;
}

export async function getProductsByOrgId(orgId: string) {
    await connection();

    return db
        .select()
        .from(products)
        .where(eq(products.organizationId, orgId))
        .orderBy(desc(products.createdAt));
}

export async function getProductBySlug(slug: string) {
    "use cache";
    const product = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1);

    return product?.[0] ?? null;
}