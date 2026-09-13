"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CustomUserButton from "./custom-user-button";
import {
    Blocks,
    BookmarkIcon,
    CompassIcon,
    HomeIcon,
    LogInIcon,
    MenuIcon,
    PackageIcon,
    SparklesIcon,
    UserPlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileMenu() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { isSignedIn, user, isLoaded } = useUser();

    const closeMenu = () => setOpen(false);

    const navLinks = [
        { href: "/", label: "Home", icon: HomeIcon },
        { href: "/explore", label: "Explore", icon: CompassIcon },
    ];

    const signedInLinks = [
        { href: "/my-products", label: "My Products", icon: PackageIcon },
        { href: "/bookmarks", label: "Bookmarks", icon: BookmarkIcon },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden size-9 rounded-lg"
                    aria-label="Toggle navigation menu"
                >
                    <MenuIcon className="size-5" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-80 max-w-[85vw] p-0 flex flex-col justify-between bg-card text-card-foreground border-r border-border/40 shadow-2xl"
            >
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <SheetHeader className="px-5 py-4 border-b border-border/30">
                        <SheetTitle className="text-left">
                            <Link
                                href="/"
                                onClick={closeMenu}
                                className="flex items-center gap-2.5 group"
                            >
                                <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-xs">
                                    <Blocks className="size-4 text-primary-foreground" />
                                </div>
                                <span className="text-lg font-bold tracking-tight">
                                    i<span className="text-primary">Built</span>This
                                </span>
                            </Link>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="p-4 space-y-6">
                        <div className="space-y-1">
                            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                                Discover
                            </p>
                            {navLinks.map(({ href, label, icon: Icon }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={closeMenu}
                                        className={cn(
                                            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <Icon className="size-4 shrink-0" />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {isSignedIn && (
                            <div className="space-y-1">
                                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                                    Your Library
                                </p>
                                {signedInLinks.map(({ href, label, icon: Icon }) => {
                                    const isActive = pathname === href;
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            onClick={closeMenu}
                                            className={cn(
                                                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <Icon className="size-4 shrink-0" />
                                            <span>{label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {isSignedIn && (
                            <div className="pt-2">
                                <Button
                                    asChild
                                    className="w-full h-11 rounded-xl font-medium shadow-sm gap-2"
                                >
                                    <Link href="/submit" onClick={closeMenu}>
                                        <SparklesIcon className="size-4" />
                                        <span>Submit Project</span>
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-border/30 bg-muted/10">
                    {isLoaded && isSignedIn && user ? (
                        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-background/60 border border-border/30">
                            <div className="flex items-center gap-3 min-w-0">
                                {user.imageUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={user.imageUrl}
                                        alt={user.fullName || "User"}
                                        className="size-9 rounded-full object-cover shrink-0 border border-border/40"
                                    />
                                ) : (
                                    <div className="size-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                                        {(user.firstName?.[0] || "U").toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold truncate text-foreground leading-snug">
                                        {user.fullName || user.username || "Creator"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user.primaryEmailAddress?.emailAddress || "Signed in"}
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <CustomUserButton />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Button
                                asChild
                                className="w-full h-10 rounded-xl font-medium gap-2"
                            >
                                <Link href="/sign-in" onClick={closeMenu}>
                                    <LogInIcon className="size-4" />
                                    <span>Sign In</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full h-10 rounded-xl font-medium gap-2"
                            >
                                <Link href="/sign-up" onClick={closeMenu}>
                                    <UserPlusIcon className="size-4" />
                                    <span>Create Account</span>
                                </Link>
                            </Button>
                        </div>
                    )}

                    <p className="text-[11px] text-center text-muted-foreground/60 mt-3">
                        iBuiltThis &bull; The launchpad for builders
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
