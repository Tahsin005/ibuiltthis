import SectionHeader from "@/components/common/section-header";
import ProductSubmitForm from "@/components/products/product-submit-form";
import OrgSelector from "@/components/products/org-selector";
import { SparklesIcon } from "lucide-react";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Loader2 } from "lucide-react";

export default function SubmitPage() {
    return (
        <Suspense fallback={
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin size-8 text-muted-foreground" /></div>
        }>
            <SubmitPageContent />
        </Suspense>
    );
}

async function SubmitPageContent() {
    const { userId, orgId } = await auth();

    if (!userId) redirect("/sign-in");
    if (!orgId) redirect("/org-setup?returnTo=%2Fsubmit");

    const client = await clerkClient();
    const { data: memberships } =
        await client.users.getOrganizationMembershipList({ userId });

    const orgs = memberships.map((membership) => ({
        id: membership.organization.id,
        name: membership.organization.name,
        imageUrl: membership.organization.imageUrl,
    }));

    return (
        <section className="py-20">
            <div className="wrapper">
                <div className="mb-12">
                    <SectionHeader
                        title="Submit Your Product"
                        icon={SparklesIcon}
                        description="Share your creation with the community. Your submission will be reviewed before going live."
                    />
                </div>
                <div className="mb-6">
                    <Suspense fallback={null}>
                        <OrgSelector orgs={orgs} activeOrgId={orgId} />
                    </Suspense>
                </div>
                <div className="max-w-full mx-auto">
                    <Suspense fallback={null}>
                        <ProductSubmitForm />
                    </Suspense>
                </div>
            </div>
        </section>
    );
}
