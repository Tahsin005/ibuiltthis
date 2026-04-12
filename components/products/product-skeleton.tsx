import { LucideIcon } from "lucide-react";
import SectionHeader from "../common/section-header";
import { Skeleton } from "../ui/skeleton";

export default function ProductSkeleton({
    title,
    icon: Icon,
    description,
}: {
    title: string;
    icon: LucideIcon;
    description: string;
}) {
    return (
        <section className="py-20">
            <div className="wrapper space-y-12">
                <SectionHeader
                    title={title}
                    icon={Icon}
                    description={description}
                />

                <div className="grid-wrapper">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="border rounded-lg p-6 min-h-[200px]">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-1">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
