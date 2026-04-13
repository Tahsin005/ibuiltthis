import { getProductsByOrgId } from "@/lib/products/product-select";
import MyProductCard from "@/components/products/my-product-card";
import SectionHeader from "@/components/common/section-header";
import EmptyState from "@/components/common/empty-state";
import { LoaderIcon, PackageIcon } from "lucide-react";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function MyProductsPage() {
    return (
        <div className="py-20">
            <div className="wrapper">
                <div className="mb-12">
                    <SectionHeader
                        title="My Products"
                        icon={PackageIcon}
                        description="Manage all products submitted by your organization"
                    />
                </div>
                <Suspense
                    fallback={
                        <div>
                            <LoaderIcon className="size-8 animate-spin text-primary" />
                        </div>
                    }
                >
                    <MyProductsList />
                </Suspense>
            </div>
        </div>
    );
}

async function MyProductsList() {
    const { userId, orgId } = await auth();

    if (!userId) redirect("/sign-in");
    if (!orgId) redirect("/org-setup?returnTo=%2Fmy-products");

    const myProducts = await getProductsByOrgId(orgId);

    if (myProducts.length === 0) {
        return (
            <EmptyState message="No products submitted yet" icon={PackageIcon} />
        );
    }

    return (
        <div className="space-y-4">
            {myProducts.map((product) => (
                <MyProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
