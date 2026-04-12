"use client";

import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { addProductAction } from "@/lib/products/product-actions";
import { cn } from "@/lib/utils";
import { FormState } from "@/types";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { useActionState } from "react";

const initialState: FormState = {
    success: false,
    errors: undefined,
    message: "",
};

export default function ProductSubmitForm() {
    const [state, formAction, isPending] = useActionState(
        addProductAction,
        initialState
    );

    const { errors, message, success } = state;

    const getFieldErrors = (fieldName: string): string[] => {
        if (!errors) return [];
        return (errors as Record<string, string[]>)[fieldName] ?? [];
    };

    const hasError = (fieldName: string) => getFieldErrors(fieldName).length > 0;

    return (
        <form className="space-y-6" action={formAction}>
            {message && (
                <div
                    className={cn(
                        "p-4 rounded-lg border text-sm",
                        success
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-destructive/10 border-destructive text-destructive"
                    )}
                    role="alert"
                    aria-live="polite"
                >
                    {message}
                </div>
            )}

            <FieldGroup className="flex flex-col gap-6">
                <Field data-invalid={hasError("name")}>
                    <FieldLabel htmlFor="name">Product Name</FieldLabel>
                    <Input
                        id="name"
                        name="name"
                        placeholder="My Awesome Product"
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
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Input
                        id="slug"
                        name="slug"
                        placeholder="my-awesome-product"
                        required
                        aria-invalid={hasError("slug")}
                    />
                    <FieldDescription>
                        URL-friendly version of your product name
                    </FieldDescription>
                    <FieldError>
                        {getFieldErrors("slug").map((err) => (
                            <p key={err}>{err}</p>
                        ))}
                    </FieldError>
                </Field>

                <Field data-invalid={hasError("tagline")}>
                    <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
                    <Input
                        id="tagline"
                        name="tagline"
                        placeholder="A brief, catchy description"
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
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Tell us more about your product..."
                        required
                        className="min-h-[140px]"
                        aria-invalid={hasError("description")}
                    />
                    <FieldError>
                        {getFieldErrors("description").map((err) => (
                            <p key={err}>{err}</p>
                        ))}
                    </FieldError>
                </Field>

                <Field data-invalid={hasError("websiteUrl")}>
                    <FieldLabel htmlFor="websiteUrl">Website URL</FieldLabel>
                    <Input
                        id="websiteUrl"
                        name="websiteUrl"
                        placeholder="https://yourproduct.com"
                        required
                        aria-invalid={hasError("websiteUrl")}
                    />
                    <FieldDescription>
                        Enter your product's website or landing page
                    </FieldDescription>
                    <FieldError>
                        {getFieldErrors("websiteUrl").map((err) => (
                            <p key={err}>{err}</p>
                        ))}
                    </FieldError>
                </Field>

                <Field data-invalid={hasError("tags")}>
                    <FieldLabel htmlFor="tags">Tags</FieldLabel>
                    <Input
                        id="tags"
                        name="tags"
                        placeholder="AI, Productivity, SaaS"
                        required
                        aria-invalid={hasError("tags")}
                    />
                    <FieldDescription>
                        Comma-separated tags (e.g., AI, SaaS, Productivity)
                    </FieldDescription>
                    <FieldError>
                        {getFieldErrors("tags").map((err) => (
                            <p key={err}>{err}</p>
                        ))}
                    </FieldError>
                </Field>
            </FieldGroup>

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                {isPending ? (
                    <Loader2Icon className="size-4 animate-spin" />
                ) : (
                    <>
                        <SparklesIcon className="size-4" />
                        Submit Product
                    </>
                )}
            </Button>
        </form>
    );
}