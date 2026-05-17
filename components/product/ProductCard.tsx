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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const inStock = product.variants.some((v) => v.stock > 0);
  const icon = getCategoryIcon(product.category);
  const color = getCategoryColor(product.category);
  const productImage = getProductImage(product.name);

  return (
    <Link href={`/products/${product.id}`}>
      <GradientBorder className="h-full group">
        <div className="p-6 flex flex-col h-full glass-hover transition-all duration-300 rounded-[2px]">
          {/* Image / icon + stock indicator */}
          <div className="flex items-start justify-between mb-4">
            {productImage ? (
              <div className="w-10 h-10 rounded-[2px] overflow-hidden flex-shrink-0">
                <Image src={productImage} alt={product.name} width={40} height={40} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-[2px] glass flex items-center justify-center text-[20px]">
                {icon}
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-green-400" : "bg-white/20"}`} />
              <span className="text-[10px] text-white/30">{inStock ? "Stok ada" : "Habis"}</span>
            </div>
          </div>

          <Badge color={color} className="mb-2 self-start">
            {product.category}
          </Badge>

          <h3 className="text-[16px] font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-[12px] text-white/40 leading-5 mb-4 line-clamp-2 flex-1">
              {product.description}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-white/8">
            <div className="flex flex-col items-start justify-between">
              <div>
                <div className="text-[10px] text-white/30 mb-0.5">Mulai dari</div>
                <div className="text-[18px] font-semibold text-white">
                  {formatPrice(minPrice)}
                </div>
              </div>
              <div className="text-[11px] text-white/30">
                {product.variants.length} varian
              </div>
            </div>
          </div>
        </div>
      </GradientBorder>
    </Link>
  );
}
