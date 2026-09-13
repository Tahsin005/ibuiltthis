"use client";

import { useState, useRef } from "react";
import { UploadCloudIcon, XIcon, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LogoUploadProps {
    defaultLogoUrl?: string | null;
    name?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function LogoUpload({ defaultLogoUrl }: LogoUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(defaultLogoUrl ?? null);
    const [useUrlInput, setUseUrlInput] = useState(false);
    const [urlValue, setUrlValue] = useState(defaultLogoUrl ?? "");
    const [isRemoved, setIsRemoved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error("File is too large. Please select an image under 10MB.");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }
            setIsRemoved(false);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleClear = () => {
        setPreviewUrl(null);
        setUrlValue("");
        setIsRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="space-y-3">
            <input type="hidden" name="removeLogo" value={isRemoved ? "true" : "false"} />

            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                    Product Logo / Icon <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setUseUrlInput(!useUrlInput)}
                >
                    {useUrlInput ? (
                        <>
                            <UploadCloudIcon className="size-3.5 mr-1" />
                            Upload image file
                        </>
                    ) : (
                        <>
                            <LinkIcon className="size-3.5 mr-1" />
                            Or paste image URL
                        </>
                    )}
                </Button>
            </div>

            {useUrlInput ? (
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <Input
                            id="logoUrl"
                            name="logoUrl"
                            placeholder="https://example.com/logo.png"
                            value={urlValue}
                            onChange={(e) => {
                                setUrlValue(e.target.value);
                                setPreviewUrl(e.target.value || null);
                                setIsRemoved(false);
                            }}
                        />
                    </div>
                    {previewUrl && (
                        <div className="relative size-10 rounded-lg overflow-hidden border bg-muted/40 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewUrl}
                                alt="Logo preview"
                                className="h-full w-full object-contain p-1"
                                onError={() => setPreviewUrl(null)}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="logoFile"
                        name="logoFile"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {previewUrl ? (
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 border-border/70">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-lg overflow-hidden border bg-background shrink-0 flex items-center justify-center p-1 shadow-xs">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={previewUrl}
                                        alt="Logo preview"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Logo selected</p>
                                    <p className="text-xs text-muted-foreground">
                                        Will be uploaded to Cloudinary on submit
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleClear}
                                className="text-muted-foreground hover:text-destructive h-8 px-2"
                            >
                                <XIcon className="size-4 mr-1" />
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label="Upload logo file"
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={handleKeyDown}
                            className={cn(
                                "border border-dashed border-border/80 rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
                                "hover:border-primary/50 hover:bg-primary/5 group bg-muted/10",
                                "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50"
                            )}
                        >
                            <div className="size-10 rounded-full bg-background border flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                                <UploadCloudIcon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-foreground">
                                    Click to upload logo or drag & drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    PNG, JPG, SVG, WebP up to 10MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
