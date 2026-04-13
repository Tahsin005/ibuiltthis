import { Card, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyProductSkeleton() {
    return (
        <Card className="border rounded-lg p-6 bg-background">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full max-w-md" />
                        <Skeleton className="h-4 w-5/6 max-w-sm" />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                </div>
                <CardFooter className="flex gap-2 p-0 mt-4 lg:mt-0">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                </CardFooter>
            </div>
        </Card>
    );
}

export function MyProductSkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <MyProductSkeleton key={i} />
            ))}
        </div>
    );
}
