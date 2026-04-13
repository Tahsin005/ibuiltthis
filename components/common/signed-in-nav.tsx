"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function SignedInNav() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return null;

  return (
    <>
      <Link
        href="/my-products"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50"
      >
        <span>My Products</span>
      </Link>
    </>
  );
}
