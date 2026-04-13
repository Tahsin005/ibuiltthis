import { CompassIcon, HomeIcon, Blocks, SparklesIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Suspense } from "react";
import { Show } from '@clerk/nextjs'
import { Skeleton } from "../ui/skeleton";
import CustomUserButton from "./custom-user-button";
import SignedInNav from "./signed-in-nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Blocks className="size-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
                i<span className="text-primary">Built</span>This
            </span>
        </Link>
    );
};

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="wrapper px-4 md:px-12">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MobileMenu />
                        <Logo />
                    </div>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded-md"
                        >
                            <HomeIcon className="size-4" />
                            <span>Home</span>
                        </Link>
                        <Link
                            href="/explore"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded-md"
                        >
                            <CompassIcon className="size-4" />
                            <span>Explore</span>
                        </Link>
                        <Suspense fallback={null}>
                            <SignedInNav />
                        </Suspense>
                    </nav>

                    {/* Desktop & Mobile Actions */}
                    <div className="flex items-center gap-3">
                        <Suspense
                            fallback={
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-20" />
                                    <Skeleton className="h-9 w-28" />
                                </div>
                            }
                        >
                            <div className="hidden md:flex items-center gap-3">
                                <Show when="signed-out">
                                    <Button variant="ghost" asChild>
                                        <Link href="/sign-in">Sign In</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/sign-up">Sign Up</Link>
                                    </Button>
                                </Show>
                                <Show when="signed-in">
                                    <Button asChild>
                                        <Link href="/submit">
                                            <SparklesIcon className="size-4" />
                                            Submit Project
                                        </Link>
                                    </Button>
                                </Show>
                            </div>

                            <Show when="signed-in">
                                <CustomUserButton />
                            </Show>
                        </Suspense>
                    </div>
                </div>
            </div>
        </header>
    )
}

function MobileMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <MenuIcon className="size-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col border-r shadow-none">
                <SheetHeader>
                    <SheetTitle className="text-left">
                        <Logo />
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded-md"
                    >
                        <HomeIcon className="size-4" />
                        <span>Home</span>
                    </Link>
                    <Link
                        href="/explore"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded-md"
                    >
                        <CompassIcon className="size-4" />
                        <span>Explore</span>
                    </Link>
                    <Suspense fallback={null}>
                        <SignedInNav />
                    </Suspense>
                    <div className="pt-4 mt-2 border-t flex flex-col gap-3">
                        <Suspense fallback={<Skeleton className="h-9 w-full" />}>
                            <Show when="signed-out">
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/sign-in">Sign In</Link>
                                    </Button>
                                    <Button className="w-full" asChild>
                                        <Link href="/sign-up">Sign Up</Link>
                                    </Button>
                                </div>
                            </Show>
                            <Show when="signed-in">
                                <Button asChild className="w-full">
                                    <Link href="/submit">
                                        <SparklesIcon className="size-4" />
                                        Submit Project
                                    </Link>
                                </Button>
                            </Show>
                        </Suspense>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}