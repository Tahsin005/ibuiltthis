"use cache";

import VotingButtons from "@/components/products/voting-buttons";
import ProductLogo from "@/components/products/product-logo";
import CommentSection from "@/components/comments/comment-section";
import ShareButton from "@/components/products/share-button";
import VisitWebsiteButton from "@/components/products/visit-website-button";
import BookmarkButton from "@/components/bookmarks/bookmark-button";
import { Badge } from "@/components/ui/badge";
import {
    getFeaturedProducts,
    getProductBySlug,
} from "@/lib/products/product-select";
import { getCommentsByProductId } from "@/lib/comments/comment-select";
import {
    ArrowLeftIcon,
    CalendarIcon,
    Share2Icon,
    UserIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const generateStaticParams = async () => {
    try {
        const products = await getFeaturedProducts();
        return products.map((product) => ({
            slug: product.slug.toString(),
        }));
    } catch (err) {
        console.error("Error generating static params for products:", err);
        return [];
    }
};

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const { name, description, websiteUrl, tags, voteCount, tagline } = product;
    const comments = await getCommentsByProductId(product.id);

    return (
        <div className="py-16">
            <div className="wrapper">
                <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeftIcon className="size-4" /> Back to Explore
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-start gap-5">
                            <ProductLogo
                                name={name}
                                logoUrl={product.logoUrl}
                                websiteUrl={websiteUrl}
                                size="lg"
                                className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="mb-4">
                                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                                        {name}
                                    </h1>
                                    {tagline && (
                                        <p className="text-lg text-muted-foreground">
                                            {tagline}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tags?.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <h2 className="text-xl font-semibold mb-4">About</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <div className="border rounded-lg p-6 bg-primary/10">
                            <h2 className="text-lg font-semibold mb-4">Product Details</h2>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <CalendarIcon className="size-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Launched:</span>
                                    <span className="font-medium">
                                        {new Date(product.createdAt?.toISOString() ?? "").toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <UserIcon className="size-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Submitted by:</span>
                                    <Link
                                        href={`/makers/${product.userId}`}
                                        className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
                                    >
                                        {product.submittedBy}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <CommentSection
                            productId={product.id}
                            productAuthorUserId={product.userId}
                            initialComments={comments}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="border rounded-lg p-6 bg-background shadow-xs">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Support this product
                                    </p>
                                    <VotingButtons productId={product.id} voteCount={voteCount} />
                                </div>
                                <div className="pt-4 border-t">
                                    <BookmarkButton
                                        productId={product.id}
                                        variant="default"
                                        showLabel
                                        className="w-full justify-center"
                                    />
                                </div>
                                {voteCount > 100 && (
                                    <div className="pt-4 border-t">
                                        <Badge className="w-full justify-center py-2">
                                            🔥 Featured Product
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            {websiteUrl && (
                                <VisitWebsiteButton
                                    productId={product.id}
                                    websiteUrl={websiteUrl}
                                    className="w-full rounded-lg"
                                />
                            )}

                            <div className="border rounded-lg p-5 bg-background shadow-xs space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Share2Icon className="size-4 text-primary" />
                                    <span>Share Project</span>
                                </div>
                                <ShareButton
                                    productName={name}
                                    productTagline={tagline}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
