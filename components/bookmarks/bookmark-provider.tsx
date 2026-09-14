"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
    getUserBookmarkedProductIdsAction,
    toggleBookmarkAction,
} from "@/lib/bookmarks/bookmark-actions";
import { toast } from "sonner";

interface BookmarkContextType {
    isBookmarked: (productId: number) => boolean;
    toggleBookmark: (productId: number) => Promise<{ success: boolean; isBookmarked: boolean }>;
    bookmarkedSet: Set<number>;
}

const BookmarkContext = createContext<BookmarkContextType>({
    isBookmarked: () => false,
    toggleBookmark: async () => ({ success: false, isBookmarked: false }),
    bookmarkedSet: new Set(),
});

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
    const { isSignedIn, userId } = useAuth();
    const [prevUserId, setPrevUserId] = useState<string | null | undefined>(userId);
    const [bookmarkedSet, setBookmarkedSet] = useState<Set<number>>(new Set());
    // Reset bookmarked state immediately during render when the active user changes
    if (userId !== prevUserId) {
        setPrevUserId(userId);
        setBookmarkedSet(new Set());
    }

    useEffect(() => {
        if (!isSignedIn || !userId) return;

        let isMounted = true;
        getUserBookmarkedProductIdsAction()
            .then((ids) => {
                if (isMounted) {
                    setBookmarkedSet((prev) => {
                        // Preserve any optimistic user mutations while initializing
                        return prev.size > 0 ? new Set([...ids, ...prev]) : new Set(ids);
                    });
                }
            })
            .catch((error) => {
                console.error("Error loading user bookmarks:", error);
            });

        return () => {
            isMounted = false;
        };
    }, [isSignedIn, userId]);

    const isBookmarked = (productId: number) =>
        isSignedIn ? bookmarkedSet.has(productId) : false;

    const toggleBookmark = async (productId: number) => {
        if (!isSignedIn) {
            toast.error("Please sign in to bookmark products");
            return { success: false, isBookmarked: false };
        }

        const currentlyBookmarked = bookmarkedSet.has(productId);
        const nextBookmarked = !currentlyBookmarked;

        // Optimistic update
        setBookmarkedSet((prev) => {
            const next = new Set(prev);
            if (nextBookmarked) {
                next.add(productId);
            } else {
                next.delete(productId);
            }
            return next;
        });

        try {
            const res = await toggleBookmarkAction(productId);
            if (!res.success) {
                // Rollback
                setBookmarkedSet((prev) => {
                    const rollback = new Set(prev);
                    if (currentlyBookmarked) rollback.add(productId);
                    else rollback.delete(productId);
                    return rollback;
                });
                toast.error(res.message);
                return { success: false, isBookmarked: currentlyBookmarked };
            }

            // Apply authoritative server state
            setBookmarkedSet((prev) => {
                const updated = new Set(prev);
                if (res.isBookmarked) {
                    updated.add(productId);
                } else {
                    updated.delete(productId);
                }
                return updated;
            });

            if (res.isBookmarked) {
                toast.success(res.message || "Bookmarked!");
            } else {
                toast.info("Bookmark removed");
            }

            return { success: true, isBookmarked: res.isBookmarked };
        } catch (error) {
            console.error("Failed to toggle bookmark:", error);
            // Rollback
            setBookmarkedSet((prev) => {
                const rollback = new Set(prev);
                if (currentlyBookmarked) rollback.add(productId);
                else rollback.delete(productId);
                return rollback;
            });
            toast.error("Failed to update bookmark");
            return { success: false, isBookmarked: currentlyBookmarked };
        }
    };

    return (
        <BookmarkContext.Provider value={{ isBookmarked, toggleBookmark, bookmarkedSet }}>
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    return useContext(BookmarkContext);
}
