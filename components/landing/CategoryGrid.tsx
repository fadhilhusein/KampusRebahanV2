import Link from "next/link";
import * as motion from "motion/react-client";
import GlassCard from "@/components/ui/GlassCard";
import type { Product } from "@/lib/types";

interface CategoryGridProps {
  products: Product[];
}

export default function CategoryGrid({ products }: CategoryGridProps) {
  const categoryMap = new Map<string, number>();
  for (const p of products) {
    categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
  }

  const categories = Array.from(categoryMap.entries()).slice(0, 8);

  if (categories.length === 0) return null;

  return (
    <motion.section
      className="py-16 px-8 border-t border-foreground/6"
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-[32px] font-semibold text-foreground tracking-tight mb-2">
            Kategori
          </h2>
          <p className="text-[14px] text-foreground/40">
            Temukan produk berdasarkan kategori
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(([category, count], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.045, ease: "easeOut" }}
              whileHover={{ y: -3, scale: 1.03 }}
            >
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
              >
                <GlassCard
                  hover
                  className="px-5 py-3 flex items-center gap-3"
                >
                  <span className="text-[14px] font-medium text-foreground">
                    {category}
                  </span>
                  <span className="text-[11px] text-foreground/30 bg-foreground/8 rounded-full px-2 py-0.5">
                    {count}
                  </span>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
