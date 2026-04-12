import FeaturedProducts from "@/components/landing-page/featured-products";
import HeroSection from "@/components/landing-page/hero-section";
import RecentlyLaunchedProducts from "@/components/landing-page/recently-launched-products";
import ProductSkeleton from "@/components/products/product-skeleton";
import { RocketIcon } from "lucide-react";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <Suspense fallback={<ProductSkeleton title="Recently Launched" icon={RocketIcon} description="Discover the latest products from our community" />}>
        <RecentlyLaunchedProducts />
      </Suspense>
    </div>
  );
}
