import { Loader2 } from "lucide-react";

export default function OrgSetupLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
    </div>
  );
}
