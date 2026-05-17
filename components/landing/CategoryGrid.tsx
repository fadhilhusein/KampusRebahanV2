import Link from "next/link";
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
    <section className="py-16 px-8 border-t border-white/6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-[32px] font-semibold text-white tracking-tight mb-2">
            Kategori
          </h2>
          <p className="text-[14px] text-white/40">
            Temukan produk berdasarkan kategori
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(([category, count]) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
            >
              <GlassCard
                hover
                className="px-5 py-3 flex items-center gap-3"
              >
                <span className="text-[14px] font-medium text-white">
                  {category}
                </span>
                <span className="text-[11px] text-white/30 bg-white/8 rounded-full px-2 py-0.5">
                  {count}
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
