"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { BuildingIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Org = {
    id: string;
    name: string;
    imageUrl?: string | null;
};

export default function OrgSelector({
    orgs,
    activeOrgId,
}: {
    orgs: Org[];
    activeOrgId: string;
}) {
    const { setActive } = useOrganizationList();

    if (orgs.length <= 1) {
        return (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                <BuildingIcon className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    Submitting as{" "}
                    <span className="font-semibold text-foreground">
                        {orgs[0]?.name ?? "Your organization"}
                    </span>
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
                Submit under which organization?
            </p>
            <div className="flex flex-wrap gap-3">
                {orgs.map((org) => (
                    <Button
                        key={org.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setActive?.({ organization: org.id })}
                        className={cn(
                            "flex items-center gap-2",
                            org.id === activeOrgId &&
                                "border-primary bg-primary/10 text-primary"
                        )}
                    >
                        <BuildingIcon className="size-4" />
                        {org.name}
                        {org.id === activeOrgId && <CheckIcon className="size-3" />}
                    </Button>
                ))}
            </div>
        </div>
    );
}
