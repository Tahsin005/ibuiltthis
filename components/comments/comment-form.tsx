"use client";

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, Loader2Icon, LogInIcon } from "lucide-react";
import { addCommentAction } from "@/lib/comments/comment-actions";
import { CommentType } from "@/types";
import { toast } from "sonner";

interface CommentFormProps {
    productId: number;
    onCommentAdded?: (comment: CommentType) => void;
}

const MAX_CHARS = 1000;

export default function CommentForm({
    productId,
    onCommentAdded,
}: CommentFormProps) {
    const { isSignedIn, isLoaded, user } = useUser();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isLoaded) {
        return (
            <div className="p-4 rounded-xl border bg-muted/20 animate-pulse h-24" />
        );
    }

    if (!isSignedIn) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-dashed border-border/80 bg-muted/10 text-center sm:text-left">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                        Join the discussion
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Sign in to ask questions, share feedback, or celebrate this launch with the maker.
                    </p>
                </div>
                <SignInButton mode="modal">
                    <Button size="sm" className="shrink-0 gap-1.5 shadow-xs">
                        <LogInIcon className="size-3.5" /> Sign in to comment
                    </Button>
                </SignInButton>
            </div>
        );
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = content.trim();
        if (!trimmed || isSubmitting) return;

        if (trimmed.length > MAX_CHARS) {
            toast.error(`Comment cannot exceed ${MAX_CHARS} characters`);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await addCommentAction(productId, trimmed);
            if (res.success && res.comment) {
                toast.success(res.message);
                setContent("");
                onCommentAdded?.(res.comment);
            } else {
                toast.error(res.message || "Failed to post comment");
            }
        } catch (err) {
            console.error("Error submitting comment:", err);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "?";

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-start gap-3">
                <div className="size-9 rounded-full overflow-hidden shrink-0 border border-border/70 flex items-center justify-center bg-linear-to-br from-primary/80 to-accent text-primary-foreground font-semibold text-xs select-none shadow-2xs mt-1">
                    {user?.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={user.imageUrl}
                            alt={user.fullName || "User"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span>{initial}</span>
                    )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Leave feedback, ask questions, or share what you think... (Cmd + Enter to send)"
                        className="min-h-[88px] resize-y text-sm bg-background border-border/70 focus-visible:ring-primary/40 rounded-xl"
                        maxLength={MAX_CHARS}
                        disabled={isSubmitting}
                    />

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className={content.length > MAX_CHARS * 0.9 ? "text-amber-500 font-medium" : ""}>
                            {content.length}/{MAX_CHARS}
                        </span>

                        <Button
                            type="submit"
                            size="sm"
                            disabled={!content.trim() || isSubmitting}
                            className="gap-1.5 rounded-lg shadow-xs"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2Icon className="size-3.5 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <SendIcon className="size-3.5" />
                                    Post comment
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
