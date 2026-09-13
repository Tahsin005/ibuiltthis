"use client";

import { ProductType } from "@/types";
import { useMemo, useState } from "react";
import ProductCard from "./product-card";
import { Button } from "../ui/button";
import { ClockIcon, CompassIcon, RotateCcwIcon, SearchIcon, TrendingUpIcon } from "lucide-react";
import { Input } from "../ui/input";

export default function ProductExplorer({
    products,
}: {
    products: ProductType[];
}) {
    const [sortBy, setSortBy] = useState<"trending" | "recent">("trending");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        let list = [...products];

        const query = searchQuery.trim().toLowerCase();
        if (query.length > 0) {
            list = list.filter((product) => {
                const nameMatch = product.name?.toLowerCase().includes(query);
                const taglineMatch = product.tagline?.toLowerCase().includes(query);
                const descMatch = product.description?.toLowerCase().includes(query);
                const tagsMatch = product.tags?.some((tag) => tag.toLowerCase().includes(query));
                return nameMatch || taglineMatch || descMatch || tagsMatch;
            });
        }

        switch (sortBy) {
            case "trending":
                return list.sort((a, b) => b.voteCount - a.voteCount);

            case "recent":
                return list.sort(
                    (a, b) =>
                        new Date(b.createdAt || "").getTime() -
                        new Date(a.createdAt || "").getTime()
                );
            default:
                return list;
        }
    }, [searchQuery, products, sortBy]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                        type="text"
                        placeholder="Search by name, tagline, description, or tags..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={sortBy === "trending" ? "default" : "outline"}
                        onClick={() => setSortBy("trending")}
                    >
                        <TrendingUpIcon className="size-4" />
                        Trending
                    </Button>
                    <Button
                        variant={sortBy === "recent" ? "default" : "outline"}
                        onClick={() => setSortBy("recent")}
                    >
                        <ClockIcon className="size-4" />
                        Recent
                    </Button>
                </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                    {searchQuery && ` matching "${searchQuery}"`}
                </p>
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="text-xs h-7 text-muted-foreground hover:text-foreground"
                    >
                        <RotateCcwIcon className="size-3 mr-1" />
                        Clear filter
                    </Button>
                )}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="border rounded-lg p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/10">
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                        {searchQuery ? (
                            <SearchIcon className="size-6 text-muted-foreground" />
                        ) : (
                            <CompassIcon className="size-6 text-muted-foreground" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                            {searchQuery ? "No matching products" : "No products available"}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {searchQuery
                                ? `We couldn't find any products matching "${searchQuery}". Try using different keywords.`
                                : "There are currently no approved products to show."}
                        </p>
                    </div>
                    {searchQuery && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                        >
                            Clear search
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid-wrapper">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}