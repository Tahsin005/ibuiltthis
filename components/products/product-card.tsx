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
        <Link href={`/products/${product.slug}`} className="block h-full">
            <Card className="group card-hover hover:bg-primary-foreground/10 border-solid border-gray-400 flex flex-col h-full">
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
                                    {product.name}
                                </CardTitle>
                                {product.voteCount > 100 && (
                                    <Badge className="gap-1 bg-primary text-primary-foreground">
                                        <StarIcon className="size-3 fill-current" />
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="line-clamp-2 mt-1">
                                {product.tagline || product.description}
                            </CardDescription>
                        </div>
                        <VotingButtons
                            voteCount={product.voteCount}
                            productId={product.id}
                        />
                    </div>
                </CardHeader>
                <CardFooter className="flex items-center justify-between gap-2 pt-0">
                    <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                        {product.tags?.map((tag) => (
                            <Badge variant="secondary" key={tag}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <BookmarkButton
                        productId={product.id}
                        variant="icon"
                        className="shrink-0 text-muted-foreground"
                    />
                </CardFooter>
            </Card>
        </Link>
    )
}