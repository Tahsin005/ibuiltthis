import { db } from "@/db";
import { products } from "@/db/schema";
import { and, desc, eq, gte, or, count, countDistinct, sum } from "drizzle-orm";
import { connection } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

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

export async function getProductsForUser(userId: string, orgId?: string | null) {
    await connection();

    const condition = orgId
        ? or(eq(products.organizationId, orgId), eq(products.userId, userId))
        : eq(products.userId, userId);

    return db
        .select()
        .from(products)
        .where(condition)
        .orderBy(desc(products.createdAt));
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

export async function getPlatformStats() {
    "use cache";
    try {
        const [productStats] = await db
            .select({
                totalProducts: count(products.id),
                totalVotes: sum(products.voteCount),
                totalCreators: countDistinct(products.userId),
            })
            .from(products)
            .where(eq(products.status, "approved"));

        const productCount = Number(productStats?.totalProducts ?? 0);
        const voteCount = Number(productStats?.totalVotes ?? 0);
        const creatorCount = Number(productStats?.totalCreators ?? 0);

        return {
            productsCount: productCount,
            votesCount: voteCount,
            creatorsCount: creatorCount,
        };
    } catch (err) {
        console.error("Error fetching platform stats:", err);
        return {
            productsCount: 0,
            votesCount: 0,
            creatorsCount: 0,
        };
    }
}

export async function getMakerProfile(userId: string) {
    await connection();

    const makerProducts = await db
        .select()
        .from(products)
        .where(
            and(
                eq(products.userId, userId),
                eq(products.status, "approved")
            )
        )
        .orderBy(desc(products.voteCount));

    let clerkUser: {
        id: string;
        fullName: string | null;
        username: string | null;
        imageUrl: string | null;
        createdAt: number;
    } | null = null;

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        if (user) {
            clerkUser = {
                id: user.id,
                fullName: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
                username: user.username || null,
                imageUrl: user.imageUrl || null,
                createdAt: user.createdAt,
            };
        }
    } catch (error) {
        console.warn(`Could not fetch Clerk user profile for ${userId}:`, error);
    }

    const fallbackName = makerProducts[0]?.submittedBy || "Maker";
    const displayName = clerkUser?.fullName || clerkUser?.username || fallbackName;
    const totalLaunches = makerProducts.length;
    const totalVotes = makerProducts.reduce((acc, p) => acc + (p.voteCount || 0), 0);
    const totalClicks = makerProducts.reduce((acc, p) => acc + (p.clickCount || 0), 0);

    return {
        userId,
        displayName,
        username: clerkUser?.username,
        imageUrl: clerkUser?.imageUrl,
        joinedAt: clerkUser?.createdAt ? new Date(clerkUser.createdAt) : null,
        stats: {
            totalLaunches,
            totalVotes,
            totalClicks,
        },
        products: makerProducts,
    };
}