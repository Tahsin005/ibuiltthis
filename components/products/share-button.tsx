"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
    productName: string;
    productTagline?: string | null;
    className?: string;
}

export default function ShareButton({
    productName,
    productTagline,
    className,
}: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const handleShareTwitter = () => {
        const text = encodeURIComponent(
            `Check out ${productName}${productTagline ? ` — ${productTagline}` : ""} on iBuiltThis!`
        );
        const url = encodeURIComponent(window.location.href);
        window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            "_blank",
            "noopener,noreferrer,width=600,height=400"
        );
    };

    const handleShareLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            "_blank",
            "noopener,noreferrer,width=600,height=500"
        );
    };

    return (
        <div className="space-y-2">
            <Button
                variant="outline"
                size="sm"
                className={`w-full gap-2 rounded-lg ${className ?? ""}`}
                onClick={handleCopy}
            >
                {copied ? (
                    <>
                        <CheckIcon className="size-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Link Copied!</span>
                    </>
                ) : (
                    <>
                        <CopyIcon className="size-4" />
                        Copy Share Link
                    </>
                )}
            </Button>

            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs text-muted-foreground hover:text-foreground h-8"
                    onClick={handleShareTwitter}
                >
                    Share on 𝕏
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs text-muted-foreground hover:text-foreground h-8"
                    onClick={handleShareLinkedIn}
                >
                    Share on LinkedIn
                </Button>
            </div>
        </div>
    );
}
