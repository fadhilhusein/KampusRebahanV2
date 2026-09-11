import Image from "next/image";
import Link from "next/link";
import GradientBorder from "@/components/ui/GradientBorder";
import Badge from "@/components/ui/Badge";
import { getCategoryIcon, getCategoryColor } from "@/lib/categoryIcons";
import { getProductImage } from "@/lib/productImages";
import type { Product } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

const iconBgMap: Record<string, string> = {
  primary: "bg-primary/15",
  secondary: "bg-secondary/15",
  tertiary: "bg-tertiary/15",
  default: "bg-foreground/10",
};

const glowMap: Record<string, string> = {
  primary: "hover:shadow-primary/20",
  secondary: "hover:shadow-secondary/20",
  tertiary: "hover:shadow-tertiary/20",
  default: "hover:shadow-foreground/10",
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const inStock = product.variants.some((v) => v.stock > 0);
  const icon = getCategoryIcon(product.category);
  const color = getCategoryColor(product.category);
  const productImage = getProductImage(product.name);
  const rating = product.averageRating != null ? product.averageRating.toFixed(1) : "Baru";
  const soldCount = product.soldCount ?? 0;

  return (
    <Link href={`/products/${product.id}`}>
      <GradientBorder
        radius="rounded-2xl"
        className={`h-full group transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl ${glowMap[color]}`}
      >
        <div className="p-6 flex flex-col h-full glass-hover transition-all duration-300 rounded-2xl">
          {/* Image / icon + stock indicator */}
          <div className="flex items-start justify-between mb-4">
            {productImage ? (
              <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Image src={productImage} alt={product.name} width={48} height={48} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[22px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconBgMap[color]}`}>
                {icon}
              </div>
            )}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              inStock ? "bg-green-400/15 text-green-500" : "bg-foreground/10 text-foreground/40"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-green-400" : "bg-foreground/30"}`} />
              {inStock ? "Stok ada" : "Habis"}
            </span>
          </div>

          <Badge color={color} className="mb-2 self-start">
            {product.category}
          </Badge>

          <h3 className="text-[16px] font-semibold text-foreground mb-2 group-hover:text-foreground/90 transition-colors">
            {product.name}
          </h3>

          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1 text-tertiary">
              <span className="tracking-[1px]" aria-hidden="true">★★★★★</span>
              <span className="font-medium text-foreground/60">{rating}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-foreground/15" />
            <span className="text-foreground/35">
              {product.reviewCount ? `${product.reviewCount} ulasan` : "Belum ada ulasan"}
            </span>
            <span className="h-1 w-1 rounded-full bg-foreground/15" />
            <span className="text-foreground/35">{soldCount} terjual</span>
          </div>

          {product.description && (
            <p className="text-[12px] text-foreground/40 leading-5 mb-4 line-clamp-2 flex-1">
              {product.description}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-foreground/8">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] text-foreground/30 mb-0.5">Mulai dari</div>
                <div className="text-[18px] font-semibold text-foreground">
                  {formatPrice(minPrice)}
                </div>
                <div className="text-[11px] text-foreground/30">
                  {product.variants.length} varian
                </div>
              </div>
              <span className="text-[16px] text-foreground/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary">
                →
              </span>
            </div>
          </div>
        </div>
      </GradientBorder>
    </Link>
  );
}
