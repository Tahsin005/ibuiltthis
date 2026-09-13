import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { VoteProvider } from "@/components/products/vote-provider";
import { BookmarkProvider } from "@/components/bookmarks/bookmark-provider";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iBuiltThis - Share Your Creations, Discover New Launches",
  description: "A community platform for creators to showcase their apps, AI tools, SaaS products, and creative projects. Authentic launches, real builders, genuine feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("font-sans", inter.variable)}>
        <body className={`${outfit.className} antialiased`}>
          <VoteProvider>
            <BookmarkProvider>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </BookmarkProvider>
          </VoteProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
