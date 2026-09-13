import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SectionHeader from "@/components/common/section-header";
import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { getUserBookmarkedProducts } from "@/lib/bookmarks/bookmark-select";
import { BookmarkIcon, CompassIcon } from "lucide-react";

export const metadata = {
    title: "Bookmarks - iBuiltThis",
    description: "Your saved projects and tools on iBuiltThis",
};

export default function BookmarksPage() {
    return (
        <div className="py-20">
            <div className="wrapper">
                <div className="mb-12">
                    <SectionHeader
                        title="Saved Bookmarks"
                        icon={BookmarkIcon}
                        description="Projects you've saved for inspiration, reference, or future collaboration"
                    />
                </div>
                <Suspense fallback={<BookmarksSkeleton />}>
                    <BookmarkedProductsList />
                </Suspense>
            </div>
        </div>
    );
}

async function BookmarkedProductsList() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const savedProducts = await getUserBookmarkedProducts(userId);

    if (savedProducts.length === 0) {
        return (
            <div className="border rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/10 max-w-lg mx-auto">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <BookmarkIcon className="size-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No bookmarks yet</h3>
                    <p className="text-sm text-muted-foreground">
                        Whenever you find inspiring projects, click the bookmark icon to save them here for quick access.
                    </p>
                </div>
                <Button asChild className="mt-2">
                    <Link href="/explore">
                        <CompassIcon className="size-4 mr-2" />
                        Explore Projects
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <p className="text-sm text-muted-foreground mb-6">
                You have saved {savedProducts.length} {savedProducts.length === 1 ? "project" : "projects"}
            </p>
            <div className="grid-wrapper">
                {savedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

function BookmarksSkeleton() {
    return (
        <div className="grid-wrapper">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="h-44 rounded-lg border border-border bg-muted/20 animate-pulse"
                />
            ))}
        </div>
    );
}
