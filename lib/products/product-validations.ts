import { z } from "zod";

export const productSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" })
        .max(120, { message: "Name must be less than 120 characters" }),
    slug: z
        .string()
        .min(3, { message: "Slug must be at least 3 characters" })
        .max(140, { message: "Slug must be less than 140 characters" })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: "Slug must be lowercase and contain only letters and numbers and hyphens",
        }),
    tagline: z
        .string()
        .max(200, { message: "Tagline must be less than 200 characters" }),
    description: z.string().optional(),
    websiteUrl: z
        .string()
        .min(1, { message: "Website URL is required" })
        .url({ message: "Must be a valid URL (e.g. https://example.com)" })
        .refine((url) => /^https?:\/\//i.test(url), {
            message: "Website URL must start with http:// or https://",
        }),
    logoUrl: z
        .string()
        .url({ message: "Logo URL must be a valid URL" })
        .refine((url) => /^https?:\/\//i.test(url), {
            message: "Logo URL must start with http:// or https://",
        })
        .optional()
        .or(z.literal("")),
    tags: z
        .string()
        .min(1, { message: "Tags are required" })
        .transform((val) => val.split(",").map((tag) => tag.trim().toLowerCase())),
});
