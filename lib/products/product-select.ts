import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { connection } from "next/server";

export async function getFeaturedProducts() {
    "use cache";
    const productsData = await db
        .select()
        .from(products)
        .where(eq(products.status, "approved"))
        .orderBy(desc(products.voteCount));

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
    const productsData = await getAllApprovedProducts();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return productsData.filter(
        (product) =>
            product.createdAt &&
            new Date(product.createdAt.toISOString()) >= oneWeekAgo
    );
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