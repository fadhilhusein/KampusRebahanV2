import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { getProductImage } from "@/lib/productImages";
import type { Product } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// Same look as the bundled product tiles (public/products): cyan top-left, near-black top-right,
// light blue bottom-right over a vivid blue base.
const TILE_BACKGROUND = [
  "radial-gradient(90% 70% at 0% 0%, #19b9ff 0%, rgba(25,185,255,0) 60%)",
  "radial-gradient(80% 70% at 100% 0%, #0c0d10 0%, rgba(12,13,16,0) 65%)",
  "radial-gradient(90% 80% at 100% 100%, #8fb8ff 0%, rgba(143,184,255,0) 65%)",
  "linear-gradient(160deg, #0a4bff 0%, #0a2a9c 100%)",
].join(", ");

// Stand-in for products that have no tile image yet: the same gradient with the product name on it.
function FallbackTile({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-4" style={{ background: TILE_BACKGROUND }}>
      <span className="line-clamp-3 break-words text-center text-[18px] font-black leading-tight tracking-tight text-white sm:text-[22px]">
        {name}
      </span>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const inStock = product.variants.some((v) => v.stock > 0);
  const productImage = getProductImage(product.name);
  const soldCount = product.soldCount ?? 0;
  const rating = product.averageRating != null ? Math.round(product.averageRating) : null;

  return (
    // @container: sizes below follow the card's own width, compact under 200px (two-column phones)
    // and roomy from 200px up (tablet, desktop, single-column landing).
    <Link href={`/products/${product.id}`} className="group block h-full @container">
      <article className="flex h-full flex-col rounded-2xl border border-foreground/20 bg-surface p-2 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-foreground/40 group-hover:shadow-xl group-hover:shadow-primary/20 @min-[200px]:rounded-[28px] @min-[200px]:p-3">
        <div className="relative aspect-square overflow-hidden rounded-xl @min-[200px]:rounded-3xl">
          <div className={`h-full w-full ${inStock ? "" : "opacity-70"}`}>
            {productImage ? (
              <Image
                src={productImage}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            ) : (
              <FallbackTile name={product.name} />
            )}
          </div>

          <span className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-sm sm:right-3 sm:top-3 sm:px-2.5 sm:text-[10px]">
            <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-green-400" : "bg-white/50"}`} />
            {inStock ? "Stok ada" : "Habis"}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-0.5 pb-0.5 pt-2.5 @min-[200px]:px-2 @min-[200px]:pb-1 @min-[200px]:pt-4">
          {/* Neutral title: pure white in dark mode, pure black in light mode (the theme sets data-theme on <html>). */}
          <h4 className="line-clamp-1 text-[13px] font-black leading-tight text-white [[data-theme=light]_&]:text-black @min-[200px]:text-[14px] lg:text-[15px]">
            {product.name}
          </h4>
          <p className="mt-1 line-clamp-1 text-[11px] text-foreground/50 @min-[200px]:mt-1.5 @min-[200px]:text-[12px]">{product.description}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold @min-[200px]:mt-3 @min-[200px]:text-[12px]">
            {rating != null ? (
              <span className="flex items-center gap-0.5" aria-label={`Rating ${rating} dari 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-[11px] w-[11px] @min-[200px]:h-[13px] @min-[200px]:w-[13px] ${
                      n <= rating ? "fill-amber-400 text-amber-400" : "text-foreground/20"
                    }`}
                  />
                ))}
              </span>
            ) : (
              <span className="text-foreground/40">Baru</span>
            )}
            <span className="h-3 w-px bg-foreground/20" aria-hidden="true" />
            <span className="text-foreground/50">{soldCount} Terjual</span>
          </div>

          <div className="mt-2.5 @min-[200px]:mt-4">
            {product.variants.length > 1 && (
              <div className="text-[10px] font-bold text-foreground/40 @min-[200px]:text-[11px]">Mulai dari</div>
            )}
            <div className="text-[15px] font-black leading-tight text-primary @min-[200px]:text-[22px]">{formatPrice(minPrice)}</div>
          </div>

          {/* Visual only: the whole card is the link, where the variant gets picked. */}
          <div className="mt-auto pt-3 @min-[200px]:pt-4">
            <span
              className={`flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl py-2 text-[10px] font-black uppercase tracking-wide transition-colors @min-[200px]:gap-2 @min-[200px]:rounded-2xl @min-[200px]:py-3 @min-[200px]:text-[12px] ${
                inStock ? "bg-primary text-white group-hover:bg-primary/90" : "bg-foreground/10 text-foreground/40"
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5 shrink-0 @min-[200px]:h-[15px] @min-[200px]:w-[15px]" />
              {inStock ? "Beli Sekarang" : "Stok Habis"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
