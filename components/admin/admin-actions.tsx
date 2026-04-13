"use client";
import { CheckCircleIcon, Trash2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        console.log("Approve");
        await approveProductAction(productId);
    };
    const handleReject = async () => {
        console.log("Reject");
        await rejectProductAction(productId);
    };
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await deleteProductAction(productId);
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
            <Button
                variant="outline"
                className="hover:cursor-pointer"
                onClick={handleDelete}
            >
                <Trash2Icon className="size-4" />
                Delete
            </Button>
        </div>
    );
}
