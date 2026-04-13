"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function OrgSetupPage() {
  const { setActive, isLoaded } = useOrganizationList();
  const router = useRouter();
  const params = useSearchParams();

  const orgId = params.get("orgId");
  const returnTo = params.get("returnTo") ?? "/";

  useEffect(() => {
    if (!isLoaded || !orgId || !setActive) return;

    setActive({ organization: orgId })
      .then(() => {
        router.replace(decodeURIComponent(returnTo));
      })
      .catch((error) => {
        console.error("Failed to activate organization", error);
      });
  }, [isLoaded, orgId, setActive, returnTo, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
    </div>
  );
}
