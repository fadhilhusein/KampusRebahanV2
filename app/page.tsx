import { getProductsWithStats } from "@/lib/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EditorialLanding from "@/components/landing/EditorialLanding";
import type { Product } from "@/lib/types";
export const revalidate = 300;
export default async function HomePage() {
  let products: Product[] = [];
  try {
    const res = await getProductsWithStats();
    if (res.success) products = res.data;
  } catch {}
  return (
    <div className="kr-page">
      <Navbar />
      <main className="w-full min-w-0 flex-1 py-8 md:py-10">
        <EditorialLanding products={products} />
      </main>
      <Footer />
    </div>
  );
}
