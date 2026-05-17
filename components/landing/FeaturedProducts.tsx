import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import type { Product } from "@/lib/types";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featured = products.slice(0, 4);

  return (
    <section className="py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-[40px] font-semibold text-white leading-none tracking-tight mb-3">
              Produk Populer
            </h2>
            <p className="text-[14px] text-white/40">
              Pilihan terlaris dari pelanggan kami
            </p>
          </div>
          <Link href="/products">
            <ButtonPrimary variant="ghost">Lihat Semua →</ButtonPrimary>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
