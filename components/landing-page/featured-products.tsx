import { ArrowUpRightIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SectionHeader from "@/components/common/section-header";
import ProductCard from "../products/product-card";

const featuredProducts = [
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
]

export default async function FeaturedProducts() {
    return (
        <section className="py-20 bg-muted/20">
            <div className="wrapper">
                <div className="flex items-center justify-between mb-8">
                    <SectionHeader
                        title="Featured Today"
                        icon={StarIcon}
                        description="Top picks from our community this week"
                    />
                    <Button variant="outline" asChild className="hidden sm:flex">
                        <Link href="/explore">
                            View All <ArrowUpRightIcon className="size-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid-wrapper">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}