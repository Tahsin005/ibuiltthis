import { CalendarIcon, RocketIcon } from "lucide-react";
import SectionHeader from "@/components/common/section-header";
import ProductCard from "@/components/products/product-card";
import EmptyState from "@/components/common/empty-state";

export default async function RecentlyLaunchedProducts() {
    const recentlyLaunchedProducts = [
        {
            id: 1,
            name: "Product 1",
            slug: "product-1",
            description: "Product 1 description",
            tags: ["tag-1", "tag-2", "tag-3"],
            voteCount: 200,
        },
        {
            id: 2,
            name: "Product 2",
            slug: "product-2",
            description: "Product 2 description",
            tags: ["tag-1", "tag-2", "tag-3"],
            voteCount: 120,
        },
        {
            id: 3,
            name: "Product 3",
            slug: "product-3",
            description: "Product 3 description",
            tags: ["tag-1", "tag-2", "tag-3"],
            voteCount: 100,
        },
        {
            id: 4,
            name: "Product 4",
            slug: "product-4",
            description: "Product 4 description",
            tags: ["tag-1", "tag-2", "tag-3"],
            voteCount: 100,
        }
    ];

    return (
        <section className="py-20">
            <div className="wrapper space-y-12">
                <SectionHeader
                    title="Recently Launched"
                    icon={RocketIcon}
                    description="Discover the latest products from our community"
                />

                {recentlyLaunchedProducts.length > 0 ? (
                    <div className="grid-wrapper">
                        {recentlyLaunchedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        message="No products launched in the last week. Check back soon for new launches."
                        icon={CalendarIcon}
                    />
                )}
            </div>
        </section>
    );
}
