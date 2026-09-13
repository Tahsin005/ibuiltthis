"use client";

import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { recordProductClickAction } from "@/lib/products/product-actions";

interface VisitWebsiteButtonProps {
    productId: number;
    websiteUrl: string;
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    children?: React.ReactNode;
}

export default function VisitWebsiteButton({
    productId,
    websiteUrl,
    className,
    variant = "outline",
    size = "default",
    children,
}: VisitWebsiteButtonProps) {
    const handleClick = () => {
        // Asynchronously record click count in background
        recordProductClickAction(productId).catch((err) => {
            console.error("Failed to record click:", err);
        });
    };

    return (
        <Button
            asChild
            className={className}
            variant={variant}
            size={size}
            onClick={handleClick}
        >
            <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children ?? (
                    <>
                        Visit Website <ExternalLinkIcon className="size-4 ml-2" />
                    </>
                )}
            </a>
        </Button>
    );
}
