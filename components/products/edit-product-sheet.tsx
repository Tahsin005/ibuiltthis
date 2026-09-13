"use client";

import { useState, useTransition } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { ProductType } from "@/types";
import { editProductAction } from "@/lib/products/product-actions";
import { Edit3Icon, Loader2Icon, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import LogoUpload from "./logo-upload";

export default function EditProductSheet({
    product,
}: {
    product: ProductType;
}) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string[]> | undefined>(undefined);
    const [generalError, setGeneralError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(undefined);
        setGeneralError(null);

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const res = await editProductAction(product.id, formData);
            if (res.success) {
                toast.success(res.message);
                setOpen(false);
            } else {
                if (res.errors) {
                    setErrors(res.errors);
                }
                setGeneralError(res.message);
                toast.error(res.message);
            }
        });
    };

    const getFieldErrors = (fieldName: string): string[] => {
        if (!errors) return [];
        return errors[fieldName] ?? [];
    };

    const hasError = (fieldName: string) => getFieldErrors(fieldName).length > 0;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 hover:cursor-pointer">
                    <Edit3Icon className="size-3.5" />
                    Edit
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-6">
                <SheetHeader className="p-0 mb-6">
                    <SheetTitle className="text-xl font-bold">Edit {product.name}</SheetTitle>
                    <SheetDescription>
                        Update your project details. Saving will re-submit your product for review.
                    </SheetDescription>
                </SheetHeader>

                {generalError && (
                    <div className="p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FieldGroup className="flex flex-col gap-4">
                        <Field data-invalid={hasError("name")}>
                            <FieldLabel htmlFor="edit-name">Product Name</FieldLabel>
                            <Input
                                id="edit-name"
                                name="name"
                                defaultValue={product.name}
                                required
                                aria-invalid={hasError("name")}
                            />
                            <FieldError>
                                {getFieldErrors("name").map((err) => (
                                    <p key={err}>{err}</p>
                                ))}
                            </FieldError>
                        </Field>

                        <Field data-invalid={hasError("slug")}>
                            <FieldLabel htmlFor="edit-slug">Slug</FieldLabel>
                            <Input
                                id="edit-slug"
                                name="slug"
                                defaultValue={product.slug}
                                required
                                aria-invalid={hasError("slug")}
                            />
                            <FieldDescription className="text-xs">
                                Unique URL identifier (lowercase, letters, numbers, hyphens)
                            </FieldDescription>
                            <FieldError>
                                {getFieldErrors("slug").map((err) => (
                                    <p key={err}>{err}</p>
                                ))}
                            </FieldError>
                        </Field>

                        <Field data-invalid={hasError("tagline")}>
                            <FieldLabel htmlFor="edit-tagline">Tagline</FieldLabel>
                            <Input
                                id="edit-tagline"
                                name="tagline"
                                defaultValue={product.tagline ?? ""}
                                required
                                aria-invalid={hasError("tagline")}
                            />
                            <FieldError>
                                {getFieldErrors("tagline").map((err) => (
                                    <p key={err}>{err}</p>
                                ))}
                            </FieldError>
                        </Field>

                        <Field data-invalid={hasError("description")}>
                            <FieldLabel htmlFor="edit-description">Description</FieldLabel>
                            <Textarea
                                id="edit-description"
                                name="description"
                                defaultValue={product.description ?? ""}
                                className="min-h-[100px]"
                                aria-invalid={hasError("description")}
                            />
                            <FieldError>
                                {getFieldErrors("description").map((err) => (
                                    <p key={err}>{err}</p>
                                ))}
                            </FieldError>
                        </Field>

                        <Field data-invalid={hasError("websiteUrl")}>
                            <FieldLabel htmlFor="edit-websiteUrl">Website URL</FieldLabel>
                            <Input
                                id="edit-websiteUrl"
                                name="websiteUrl"
                                defaultValue={product.websiteUrl ?? ""}
                                required
                                aria-invalid={hasError("websiteUrl")}
                            />
                            <FieldError>
                                {getFieldErrors("websiteUrl").map((err) => (
                                    <p key={err}>{err}</p>
                                ))}
                            </FieldError>
                        </Field>

                        <LogoUpload defaultLogoUrl={product.logoUrl} name={product.name} />

                        <Field data-invalid={hasError("tags")}>
                            <FieldLabel htmlFor="edit-tags">Tags</FieldLabel>
                            <Input
                                id="edit-tags"
                                name="tags"
                                defaultValue={product.tags?.join(", ") ?? ""}
                                required
                                aria-invalid={hasError("tags")}
                            />
                            <FieldDescription className="text-xs">
                                Comma-separated (e.g., AI, SaaS, Next.js)
                            </FieldDescription>
                            <FieldError>
                                {getFieldErrors("tags").map((err) => (
                                    <p key={err}>{err}</p>
                                ))}
                            </FieldError>
                        </Field>
                    </FieldGroup>

                    <div className="pt-4 border-t flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isPending}>
                            {isPending ? (
                                <Loader2Icon className="size-4 animate-spin mr-2" />
                            ) : (
                                <SaveIcon className="size-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
