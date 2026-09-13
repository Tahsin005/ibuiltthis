"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
    getUserVotedProductIdsAction,
    upvoteProductAction,
    downvoteProductAction,
} from "@/lib/products/product-actions";
import { toast } from "sonner";

interface VoteContextType {
    isVoted: (productId: number) => boolean;
    toggleVote: (productId: number) => Promise<{ success: boolean; hasVoted: boolean }>;
    removeVote: (productId: number) => Promise<{ success: boolean; hasVoted: boolean }>;
    votedSet: Set<number>;
}

const VoteContext = createContext<VoteContextType>({
    isVoted: () => false,
    toggleVote: async () => ({ success: false, hasVoted: false }),
    removeVote: async () => ({ success: false, hasVoted: false }),
    votedSet: new Set(),
});

export function VoteProvider({ children }: { children: React.ReactNode }) {
    const { isSignedIn, userId } = useAuth();
    const [prevUserId, setPrevUserId] = useState<string | null | undefined>(userId);
    const [votedSet, setVotedSet] = useState<Set<number>>(new Set());

    // Reset voted state immediately during render when the active user changes
    if (userId !== prevUserId) {
        setPrevUserId(userId);
        setVotedSet(new Set());
    }

    useEffect(() => {
        if (!isSignedIn || !userId) return;

        let isMounted = true;
        getUserVotedProductIdsAction()
            .then((ids) => {
                if (isMounted) {
                    setVotedSet(new Set(ids));
                }
            })
            .catch(() => {
                if (isMounted) {
                    setVotedSet(new Set());
                }
            });

        return () => {
            isMounted = false;
        };
    }, [isSignedIn, userId]);

    const isVoted = (productId: number) => (isSignedIn ? votedSet.has(productId) : false);

    const toggleVote = async (productId: number) => {
        if (!isSignedIn) {
            toast.error("Please sign in to vote for products");
            return { success: false, hasVoted: false };
        }

        const currentlyVoted = votedSet.has(productId);
        const nextVoted = !currentlyVoted;

        // Optimistic update
        setVotedSet((prev) => {
            const next = new Set(prev);
            if (nextVoted) {
                next.add(productId);
            } else {
                next.delete(productId);
            }
            return next;
        });

        try {
            const res = await upvoteProductAction(productId);
            if (!res.success) {
                // Rollback
                setVotedSet((prev) => {
                    const rollback = new Set(prev);
                    if (currentlyVoted) rollback.add(productId);
                    else rollback.delete(productId);
                    return rollback;
                });
                toast.error(res.message);
                return { success: false, hasVoted: currentlyVoted };
            }

            if (res.hasVoted) {
                toast.success(res.message || "Upvoted!");
            } else {
                toast.info("Upvote removed");
            }

            return { success: true, hasVoted: res.hasVoted };
        } catch (error) {
            console.error("Failed to toggle vote:", error);
            // Rollback
            setVotedSet((prev) => {
                const rollback = new Set(prev);
                if (currentlyVoted) rollback.add(productId);
                else rollback.delete(productId);
                return rollback;
            });
            toast.error("Failed to update vote");
            return { success: false, hasVoted: currentlyVoted };
        }
    };

    const removeVote = async (productId: number) => {
        if (!isSignedIn) {
            toast.error("Please sign in to vote for products");
            return { success: false, hasVoted: false };
        }

        const currentlyVoted = votedSet.has(productId);
        if (!currentlyVoted) {
            toast.info("You haven't upvoted this product yet");
            return { success: false, hasVoted: false };
        }

        // Optimistic remove
        setVotedSet((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
        });

        try {
            const res = await downvoteProductAction(productId);
            if (!res.success) {
                // Rollback
                setVotedSet((prev) => {
                    const rollback = new Set(prev);
                    rollback.add(productId);
                    return rollback;
                });
                toast.error(res.message);
                return { success: false, hasVoted: true };
            }

            toast.info("Upvote removed");
            return { success: true, hasVoted: false };
        } catch (error) {
            console.error("Failed to remove vote:", error);
            setVotedSet((prev) => {
                const rollback = new Set(prev);
                rollback.add(productId);
                return rollback;
            });
            toast.error("Failed to remove vote");
            return { success: false, hasVoted: true };
        }
    };

    return (
        <VoteContext.Provider value={{ isVoted, toggleVote, removeVote, votedSet }}>
            {children}
        </VoteContext.Provider>
    );
}

export function useVotes() {
    return useContext(VoteContext);
}
