"use client";

import React, { useState } from "react";
import { useBookmarks } from "./bookmark-provider";
import { BookmarkIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
    productId: number;
    variant?: "icon" | "outline" | "default";
    size?: "sm" | "default" | "lg" | "icon";
    className?: string;
    showLabel?: boolean;
}

export default function BookmarkButton({
    productId,
    variant = "icon",
    size,
    className,
    showLabel = false,
}: BookmarkButtonProps) {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const bookmarked = isBookmarked(productId);
    const [isPending, setIsPending] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;
        setIsPending(true);
        try {
            await toggleBookmark(productId);
        } finally {
            setIsPending(false);
        }
    };

    if (variant === "icon") {
        return (
            <button
                type="button"
                onClick={handleClick}
                disabled={isPending}
                aria-label={bookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
                title={bookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
                className={cn(
                    "p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center",
                    bookmarked
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                    className
                )}
            >
                <BookmarkIcon
                    className={cn(
                        "size-4 transition-transform active:scale-90",
                        bookmarked && "fill-current"
                    )}
                />
            </button>
        );
    }

    return (
        <Button
            type="button"
            variant={bookmarked ? "secondary" : "outline"}
            size={size || "default"}
            onClick={handleClick}
            disabled={isPending}
            className={cn(
                "transition-all cursor-pointer",
                bookmarked && "border-primary/30 text-primary font-medium",
                className
            )}
        >
            <BookmarkIcon
                className={cn(
                    "size-4 transition-transform active:scale-90",
                    bookmarked && "fill-current"
                )}
            />
            {showLabel && (
                <span>{bookmarked ? "Saved" : "Save"}</span>
            )}
        </Button>
    );
}
