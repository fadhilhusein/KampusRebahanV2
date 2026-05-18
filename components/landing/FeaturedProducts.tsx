import Link from "next/link";
import * as motion from "motion/react-client";
import ProductCard from "@/components/product/ProductCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import type { Product } from "@/lib/types";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featured = products.slice(0, 4);

  return (
    <motion.section
      className="py-24 px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
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
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              className="h-full"
              initial={{ opacity: 0, y: 34, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.015 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
