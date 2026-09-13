"use client";

import { useState, useEffect } from "react";
import { CommentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Trash2Icon, Loader2Icon } from "lucide-react";
import { deleteCommentAction } from "@/lib/comments/comment-actions";
import { toast } from "sonner";

interface CommentItemProps {
    comment: CommentType;
    currentUserId?: string | null;
    isAdmin?: boolean;
    productAuthorUserId?: string | null;
    onDeleted?: (commentId: number) => void;
}

function formatStaticDate(dateInput: Date | string | null | undefined): string {
    if (!dateInput) return "recently";
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString();
}

export default function CommentItem({
    comment,
    currentUserId,
    isAdmin = false,
    productAuthorUserId,
    onDeleted,
}: CommentItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [timeAgo, setTimeAgo] = useState<string>(() =>
        formatStaticDate(comment.createdAt)
    );

    useEffect(() => {
        if (!comment.createdAt) return;
        const date =
            typeof comment.createdAt === "string"
                ? new Date(comment.createdAt)
                : comment.createdAt;
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            setTimeAgo("just now");
        } else if (diffInSeconds < 3600) {
            setTimeAgo(`${Math.floor(diffInSeconds / 60)}m ago`);
        } else if (diffInSeconds < 86400) {
            setTimeAgo(`${Math.floor(diffInSeconds / 3600)}h ago`);
        } else if (diffInSeconds < 2592000) {
            setTimeAgo(`${Math.floor(diffInSeconds / 86400)}d ago`);
        } else {
            setTimeAgo(date.toLocaleDateString());
        }
    }, [comment.createdAt]);

    const isAuthor = currentUserId && comment.userId === currentUserId;
    const canDelete = isAuthor || isAdmin;
    const isProductMaker = productAuthorUserId && comment.userId === productAuthorUserId;

    const initial = comment.userName ? comment.userName.charAt(0).toUpperCase() : "?";

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteCommentAction(comment.id);
            if (res.success) {
                toast.success("Comment deleted");
                onDeleted?.(comment.id);
            } else {
                toast.error(res.message || "Failed to delete comment");
            }
        } catch (err) {
            console.error("Error deleting comment:", err);
            toast.error("Failed to delete comment");
        } finally {
            setIsDeleting(false);
            setDialogOpen(false);
        }
    };

    return (
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-card border border-border/60 transition-colors hover:border-border">
            <div className="size-9 rounded-full overflow-hidden shrink-0 border border-border/70 flex items-center justify-center bg-linear-to-br from-primary/80 to-accent text-primary-foreground font-semibold text-xs select-none shadow-2xs">
                {comment.userAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={comment.userAvatar}
                        alt={comment.userName || "User"}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span>{initial}</span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                            {comment.userName || "Anonymous"}
                        </span>
                        {isProductMaker && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/40 text-primary font-medium">
                                Maker
                            </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                            {timeAgo}
                        </span>
                    </div>

                    {canDelete && (
                        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                                    aria-label="Delete comment"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <Loader2Icon className="size-3.5 animate-spin" />
                                    ) : (
                                        <Trash2Icon className="size-3.5" />
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. Your comment will be permanently removed.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line break-words">
                    {comment.content}
                </p>
            </div>
        </div>
    );
}
