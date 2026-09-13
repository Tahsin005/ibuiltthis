import { Suspense } from "react";
import { getMakerProfile } from "@/lib/products/product-select";
import ProductCard from "@/components/products/product-card";
import Link from "next/link";
import {
    ArrowLeftIcon,
    CalendarIcon,
    FlameIcon,
    MousePointerClickIcon,
    RocketIcon,
    UserIcon,
} from "lucide-react";
import { Metadata } from "next";

interface MakerPageProps {
    params: Promise<{ userId: string }>;
}

export const metadata: Metadata = {
    title: "Maker Profile | iBuiltThis",
    description: "Explore products and tools built by creators on iBuiltThis.",
};

export default function MakerProfilePage({ params }: MakerPageProps) {
    return (
        <div className="py-16">
            <div className="wrapper">
                <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm"
                >
                    <ArrowLeftIcon className="size-4" /> Back to Explore
                </Link>

                <Suspense fallback={<MakerProfileSkeleton />}>
                    <MakerProfileContent params={params} />
                </Suspense>
            </div>
        </div>
    );
}

async function MakerProfileContent({ params }: MakerPageProps) {
    const { userId } = await params;
    const profile = await getMakerProfile(userId);

    const initial = profile.displayName.charAt(0).toUpperCase() || "M";

    return (
        <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-5">
                    {profile.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={profile.imageUrl}
                            alt={profile.displayName}
                            className="size-20 sm:size-24 rounded-2xl object-cover shadow-sm"
                        />
                    ) : (
                        <div className="size-20 sm:size-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl select-none">
                            {initial}
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                {profile.displayName}
                            </h1>
                        </div>
                        {profile.username && (
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                                @{profile.username}
                            </p>
                        )}
                        {profile.joinedAt && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <CalendarIcon className="size-3.5" />
                                <span>
                                    Member since{" "}
                                    {profile.joinedAt.toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                    <div className="text-left sm:text-center">
                        <div className="flex items-center sm:justify-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                            <RocketIcon className="size-3.5 text-primary" />
                            <span>Launches</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {profile.stats.totalLaunches}
                        </span>
                    </div>

                    <div className="text-left sm:text-center">
                        <div className="flex items-center sm:justify-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                            <FlameIcon className="size-3.5 text-orange-500" />
                            <span>Upvotes</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {profile.stats.totalVotes}
                        </span>
                    </div>

                    <div className="text-left sm:text-center">
                        <div className="flex items-center sm:justify-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                            <MousePointerClickIcon className="size-3.5 text-blue-500" />
                            <span>Clicks</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {profile.stats.totalClicks}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <RocketIcon className="size-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight">
                            Products by {profile.displayName}
                        </h2>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                        {profile.products.length}{" "}
                        {profile.products.length === 1 ? "project" : "projects"}
                    </span>
                </div>

                {profile.products.length === 0 ? (
                    <div className="rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/10">
                        <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            <UserIcon className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">No launches yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                {profile.displayName} has not launched any public projects yet.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid-wrapper">
                        {profile.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function MakerProfileSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-24 rounded-2xl bg-muted/10" />
            <div className="grid-wrapper">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-44 rounded-lg bg-muted/20"
                    />
                ))}
            </div>
        </div>
    );
}
