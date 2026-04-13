"use client";

import { ProductType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { ExternalLinkIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteProductAction } from "@/lib/products/product-actions";

export default function MyProductCard({
    product,
}: {
    product: ProductType;
}) {
    const handleDelete = async () => {
        if (!confirm(`Delete "${product.name}"?`)) return;
        await deleteProductAction(product.id);
    };

    return (
        <Card className="border rounded-lg p-6 bg-background hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                        <Badge
                            className={cn(
                                product.status === "pending" &&
                                "bg-yellow-600/10 text-yellow-600 border-yellow-600",
                                product.status === "approved" &&
                                "bg-green-500/10 text-green-500 border-green-500",
                                product.status === "rejected" &&
                                "bg-red-500/10 text-red-500 border-red-500"
                            )}
                        >
                            {product.status}
                        </Badge>
                    </div>
                    <CardDescription>{product.tagline}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                        {product.tags?.map((tag) => (
                            <Badge variant="secondary" key={tag}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
                <CardFooter className="flex gap-2 p-0">
                    <Button variant="outline" size="sm" asChild>
                        <a href={product.websiteUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon className="size-4" />
                        Visit
                        </a>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2Icon className="size-4" />
                        Delete
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
}
