"use client";
import { CheckCircleIcon, Trash2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

import { ProductType } from "@/types";
import {
    approveProductAction,
    deleteProductAction,
    rejectProductAction,
} from "@/lib/admin/admin-actions";

export default function AdminActions({
    status,
    productId,
}: {
    status: string;
    productId: ProductType["id"];
}) {
    const handleApprove = async () => {
        const res = await approveProductAction(productId);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    };
    const handleReject = async () => {
        const res = await rejectProductAction(productId);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    };
    const handleDelete = async () => {
        const res = await deleteProductAction(productId);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    };
    return (
        <div className="space-y-2">
            {status === "pending" && (
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        className="hover:cursor-pointer"
                        onClick={handleApprove}
                    >
                        <CheckCircleIcon className="size-4" />
                        Approve
                    </Button>
                    <Button
                        variant="destructive"
                        className="hover:cursor-pointer"
                        onClick={handleReject}
                    >
                        <XCircleIcon className="size-4" />
                        Reject
                    </Button>
                </div>
            )}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="hover:cursor-pointer"
                    >
                        <Trash2Icon className="size-4" />
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this product and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
