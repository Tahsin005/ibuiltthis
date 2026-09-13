import Link from "next/link";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import VotingButtons from "./voting-buttons";
import ProductLogo from "./product-logo";
import BookmarkButton from "@/components/bookmarks/bookmark-button";
import { ProductType } from "@/types";

export default function ProductCard({
    product
}: {
    product: ProductType;
}) {
    return (
        <Card className="group card-hover hover:bg-primary-foreground/10 border-solid border-gray-400 flex flex-col h-full relative">
            <Link
                href={`/products/${product.slug}`}
                className="absolute inset-0 z-0"
                aria-label={`View ${product.name}`}
                tabIndex={-1}
            />
            <CardHeader className="flex-1">
                <div className="flex items-start gap-4">
                    <ProductLogo
                        name={product.name}
                        logoUrl={product.logoUrl}
                        websiteUrl={product.websiteUrl}
                        size="md"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="after:absolute after:inset-0"
                                >
                                    {product.name}
                                </Link>
                            </CardTitle>
                            {product.voteCount > 100 && (
                                <Badge className="gap-1 bg-primary text-primary-foreground relative z-10">
                                    <StarIcon className="size-3 fill-current" />
                                    Featured
                                </Badge>
                            )}
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">
                            {product.tagline || product.description}
                        </CardDescription>
                    </div>
                    <div className="relative z-10">
                        <VotingButtons
                            voteCount={product.voteCount}
                            productId={product.id}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardFooter className="flex items-center justify-between gap-2 pt-0">
                <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 relative z-10">
                    {product.tags?.map((tag) => (
                        <Badge variant="secondary" key={tag}>
                            {tag}
                        </Badge>
                    ))}
                </div>
                <div className="relative z-10">
                    <BookmarkButton
                        productId={product.id}
                        variant="icon"
                        className="shrink-0 text-muted-foreground"
                    />
                </div>
            </CardFooter>
        </Card>
    )
}