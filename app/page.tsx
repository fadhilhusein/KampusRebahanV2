import { warungApi } from "@/lib/api";
import { getMarkupPercent } from "@/lib/settings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import CategoryGrid from "@/components/landing/CategoryGrid";
import HowItWorks from "@/components/landing/HowItWorks";

export const revalidate = 300;

export default async function HomePage() {
  let products: import("@/lib/types").Product[] = [];

  try {
    const [res, markup] = await Promise.all([warungApi.getProducts(), getMarkupPercent()]);
    if (res.success) {
      products = markup > 0
        ? res.data.map((p) => ({
            ...p,
            variants: p.variants.map((v) => ({
              ...v,
              price: Math.ceil(v.price * (1 + markup / 100)),
            })),
          }))
        : res.data;
    }
  } catch {
    // graceful empty state
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        {products.length > 0 && (
          <>
            <CategoryGrid products={products} />
            <FeaturedProducts products={products} />
          </>
        )}
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
