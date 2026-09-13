"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useVotes } from "./vote-provider";

export default function VotingButtons({
    voteCount: initialVoteCount,
    productId,
}: {
    hasVoted?: boolean;
    voteCount: number;
    productId: number;
}) {
    const { isSignedIn } = useAuth();
    const { isVoted, toggleVote, removeVote } = useVotes();
    const hasVoted = isVoted(productId);

    const [voteDelta, setVoteDelta] = useState(0);
    const [isPending, startTransition] = useTransition();

    const displayVoteCount = Math.max(0, initialVoteCount + voteDelta);

    const handleUpvote = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSignedIn) {
            toast.error("You must be logged in to vote");
            return;
        }

        const willBeVoted = !hasVoted;
        setVoteDelta((prev) => prev + (willBeVoted ? 1 : -1));

        startTransition(async () => {
            const res = await toggleVote(productId);
            if (!res.success) {
                // Revert local delta if failed
                setVoteDelta((prev) => prev + (willBeVoted ? -1 : 1));
            }
        });
    };

    const handleDownvote = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSignedIn) {
            toast.error("You must be logged in to vote");
            return;
        }

        if (!hasVoted) {
            toast.info("You haven't upvoted this product yet");
            return;
        }

        setVoteDelta((prev) => prev - 1);

        startTransition(async () => {
            const res = await removeVote(productId);
            if (!res.success) {
                setVoteDelta((prev) => prev + 1);
            }
        });
    };

    return (
        <div
            className="flex flex-col items-center gap-1 shrink-0 select-none"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <Button
                onClick={handleUpvote}
                variant="ghost"
                size="icon-sm"
                aria-label={hasVoted ? "Remove upvote" : "Upvote product"}
                className={cn(
                    "h-8 w-8 transition-all duration-200",
                    hasVoted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )}
                disabled={isPending}
            >
                <ChevronUpIcon className="size-5" />
            </Button>
            <span
                className={cn(
                    "text-sm font-semibold transition-colors",
                    hasVoted ? "text-primary font-bold" : "text-foreground"
                )}
            >
                {displayVoteCount}
            </span>
            <Button
                onClick={handleDownvote}
                variant="ghost"
                size="icon-sm"
                aria-label="Remove upvote"
                disabled={isPending || !hasVoted}
                className={cn(
                    "h-8 w-8 transition-all duration-200",
                    hasVoted
                        ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        : "text-muted-foreground/30 opacity-40 cursor-not-allowed hover:bg-transparent"
                )}
            >
                <ChevronDownIcon className="size-5" />
            </Button>
        </div>
    );
}

