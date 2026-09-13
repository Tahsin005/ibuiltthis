"use client";

import { useState } from "react";
import { CommentType } from "@/types";
import { useUser } from "@clerk/nextjs";
import { MessageSquareIcon, SparklesIcon } from "lucide-react";
import CommentItem from "./comment-item";
import CommentForm from "./comment-form";
import { Badge } from "@/components/ui/badge";

interface CommentSectionProps {
    productId: number;
    productAuthorUserId?: string | null;
    initialComments: CommentType[];
}

export default function CommentSection({
    productId,
    productAuthorUserId,
    initialComments,
}: CommentSectionProps) {
    const { user } = useUser();
    const [commentsList, setCommentsList] = useState<CommentType[]>(initialComments);

    const currentUserId = user?.id || null;
    const isAdmin = (user?.publicMetadata as { isAdmin?: boolean })?.isAdmin === true;

    const handleCommentAdded = (newComment: CommentType) => {
        setCommentsList((prev) => [...prev, newComment]);
    };

    const handleCommentDeleted = (deletedId: number) => {
        setCommentsList((prev) => prev.filter((c) => c.id !== deletedId));
    };

    return (
        <section className="border rounded-xl p-6 bg-card/60 backdrop-blur-xs shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <MessageSquareIcon className="size-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-foreground">
                                Discussion & Feedback
                            </h2>
                            <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5">
                                {commentsList.length}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Ask questions, share suggestions, or leave feedback for the maker
                        </p>
                    </div>
                </div>
            </div>

            <CommentForm
                productId={productId}
                onCommentAdded={handleCommentAdded}
            />

            {commentsList.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-border/70 bg-muted/10 space-y-2">
                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <SparklesIcon className="size-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                        Be the first to share your thoughts!
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        The creator would love to hear your feedback, impressions, or questions about this project.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 pt-2">
                    {commentsList.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            isAdmin={isAdmin}
                            productAuthorUserId={productAuthorUserId}
                            onDeleted={handleCommentDeleted}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
