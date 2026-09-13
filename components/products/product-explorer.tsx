"use client";

import { ProductType } from "@/types";
import { useMemo, useState } from "react";
import ProductCard from "./product-card";
import { Button } from "../ui/button";
import { ClockIcon, CompassIcon, RotateCcwIcon, SearchIcon, TagIcon, TrendingUpIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export default function ProductExplorer({
    products,
}: {
    products: ProductType[];
}) {
    const [sortBy, setSortBy] = useState<"trending" | "recent">("trending");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Extract unique categories and their product counts canonicalized by lowercase
    const categories = useMemo(() => {
        const counts: Record<string, { label: string; count: number }> = {};
        for (const product of products) {
            if (product.tags) {
                const seenInProduct = new Set<string>();
                for (const tag of product.tags) {
                    const trimmed = tag.trim();
                    const key = trimmed.toLowerCase();
                    if (key && !seenInProduct.has(key)) {
                        seenInProduct.add(key);
                        if (!counts[key]) {
                            counts[key] = { label: trimmed, count: 0 };
                        }
                        counts[key].count += 1;
                    }
                }
            }
        }
        return Object.entries(counts)
            .sort((a, b) => b[1].count - a[1].count) // highest frequency first
            .map(([key, data]) => ({ key, tag: data.label, count: data.count }));
    }, [products]);

    const filteredProducts = useMemo(() => {
        let list = [...products];

        // Filter by category
        if (selectedCategory !== "all") {
            list = list.filter((product) =>
                product.tags?.some(
                    (tag) => tag.trim().toLowerCase() === selectedCategory.toLowerCase()
                )
            );
        }

        // Filter by search query
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
    }, [products, selectedCategory, searchQuery, sortBy]);

    const isFiltered = searchQuery.trim().length > 0 || selectedCategory !== "all";

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

            {categories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory("all")}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border shrink-0 cursor-pointer",
                            selectedCategory === "all"
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <TagIcon className="size-3" />
                        <span>All</span>
                        <span
                            className={cn(
                                "text-[10px] px-1.5 py-0.2 rounded-full",
                                selectedCategory === "all"
                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            {products.length}
                        </span>
                    </button>
                    {categories.map(({ key, tag, count }) => {
                        const isSelected = selectedCategory.toLowerCase() === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() =>
                                    setSelectedCategory(isSelected ? "all" : key)
                                }
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border shrink-0 cursor-pointer",
                                    isSelected
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <span>{tag}</span>
                                <span
                                    className={cn(
                                        "text-[10px] px-1.5 py-0.2 rounded-full",
                                        isSelected
                                            ? "bg-primary-foreground/20 text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}
                    {selectedCategory !== "all" && (
                        <span>
                            {" "}in <span className="font-medium text-foreground">#{selectedCategory}</span>
                        </span>
                    )}
                    {searchQuery && (
                        <span>
                            {" "}matching &ldquo;{searchQuery}&rdquo;
                        </span>
                    )}
                </p>
                {isFiltered && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs h-7 text-muted-foreground hover:text-foreground"
                    >
                        <RotateCcwIcon className="size-3 mr-1" />
                        Clear filters
                    </Button>
                )}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="border rounded-lg p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/10">
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                        {isFiltered ? (
                            <SearchIcon className="size-6 text-muted-foreground" />
                        ) : (
                            <CompassIcon className="size-6 text-muted-foreground" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                            {isFiltered ? "No matching products" : "No products available"}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {isFiltered
                                ? "No products found matching your active search and category filters. Try clearing your filters."
                                : "There are currently no approved products to show."}
                        </p>
                    </div>
                    {isFiltered && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                        >
                            Clear filters
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