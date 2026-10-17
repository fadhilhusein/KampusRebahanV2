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
    <>
      <Navbar />
      <main className="flex-1 w-full min-w-0">
        <EditorialLanding products={products} />
      </main>
      <Footer />
    </>
  );
}
