import { CompassIcon, HomeIcon, Blocks, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Suspense } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Skeleton } from "../ui/skeleton";



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
            <div className="wrapper px-12">
                <div className="flex h-16 items-center justify-between">
                    <Logo />
                    <nav className="flex items-center gap-1">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50"
                        >
                            <HomeIcon className="size-4" />
                            <span>Home</span>
                        </Link>
                        <Link
                            href="/explore"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50"
                        >
                            <CompassIcon className="size-4" />
                            <span>Explore</span>
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Suspense
                            fallback={
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-20" />
                                    <Skeleton className="h-9 w-28" />
                                </div>
                            }
                        >
                            <Show when="signed-out">
                                <SignInButton />
                                <SignUpButton>
                                    <Button>Sign Up</Button>
                                </SignUpButton>
                            </Show>
                            <Show when="signed-in">
                                <Button asChild>
                                    <Link href="/submit">
                                        <SparklesIcon className="size-4" />
                                        Submit Project
                                    </Link>
                                </Button>

                                <UserButton />
                            </Show>
                        </Suspense>
                    </div>
                </div>
            </div>
        </header>
    )
}