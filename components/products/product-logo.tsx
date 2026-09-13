"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductLogoProps {
    name: string;
    logoUrl?: string | null;
    websiteUrl?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const sizeClasses = {
    sm: "size-8 text-xs rounded-md",
    md: "size-10 text-sm rounded-lg",
    lg: "size-14 text-lg rounded-xl",
    xl: "size-20 text-2xl rounded-2xl",
};

export default function ProductLogo({
    name,
    logoUrl,
    websiteUrl,
    size = "md",
    className,
}: ProductLogoProps) {
    const [imgError, setImgError] = useState(false);
    const [faviconError, setFaviconError] = useState(false);

    // Extract domain for favicon fallback
    let domain: string | null = null;
    if (websiteUrl) {
        try {
            domain = new URL(websiteUrl).hostname;
        } catch {
            domain = null;
        }
    }

    const faviconUrl = domain
        ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        : null;

    const initial = name ? name.charAt(0).toUpperCase() : "?";

    // Primary: Custom Logo URL
    if (logoUrl && !imgError) {
        return (
            <div
                className={cn(
                    "relative shrink-0 overflow-hidden bg-muted/40 border border-border/50 flex items-center justify-center shadow-xs",
                    sizeClasses[size],
                    className
                )}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={logoUrl}
                    alt={`${name} logo`}
                    className="h-full w-full object-contain p-1"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    // Secondary: Favicon from Website URL
    if (faviconUrl && !faviconError) {
        return (
            <div
                className={cn(
                    "relative shrink-0 overflow-hidden bg-background border border-border/60 flex items-center justify-center shadow-xs p-1",
                    sizeClasses[size],
                    className
                )}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={faviconUrl}
                    alt={`${name} favicon`}
                    className="h-full w-full object-contain"
                    onError={() => setFaviconError(true)}
                />
            </div>
        );
    }

    // Tertiary fallback: Stylized Gradient Initial Badge
    return (
        <div
            className={cn(
                "shrink-0 flex items-center justify-center font-bold text-primary-foreground bg-linear-to-br from-primary via-primary/80 to-accent shadow-xs select-none",
                sizeClasses[size],
                className
            )}
        >
            {initial}
        </div>
    );
}
