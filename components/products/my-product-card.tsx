"use client";

import { ProductType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { ExternalLinkIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteProductAction } from "@/lib/products/product-actions";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyProductCard({
    product,
}: {
    product: ProductType;
}) {
    const handleDelete = async () => {
        const res = await deleteProductAction(product.id);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
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
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2Icon className="size-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete {product.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your product and remove it from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </div>
        </Card>
    );
}
