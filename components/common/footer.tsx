import { Blocks } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t bg-muted/20 py-12 mt-auto">
            <div className="wrapper px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
                <div className="flex flex-col items-center md:items-start gap-4 md:gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                            <Blocks className="size-4 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">
                            i<span className="text-primary">Built</span>This
                        </span>
                    </Link>
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        A community platform for creators to showcase their apps,<br className="hidden md:block" /> AI tools, SaaS products, and creative projects.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/explore" className="hover:text-foreground transition-colors">
                        Explore
                    </Link>
                </div>
            </div>
            
            <div className="wrapper px-4 md:px-12 mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                <p>&copy; 2026 iBuiltThis Inc. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
