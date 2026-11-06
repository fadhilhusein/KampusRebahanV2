import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import RatingStars from "@/components/ui/RatingStars";
import type { Product } from "@/lib/types";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function ProductCard({
  product,
  variant = "default",
  className = "",
}: {
  product: Product;
  variant?: "default" | "gallery";
  className?: string;
}) {
  const minPrice = product.variants.length
    ? Math.min(...product.variants.map((v) => v.price))
    : null;
  const stock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const cheapest = product.variants
    .filter((v) => v.stock > 0)
    .sort((a, b) => a.price - b.price)[0];
  const href = `/products/${product.id}`;
  const rating = product.averageRating;

  if (variant === "gallery") {
    return (
      <div className="rounded-[26px] bg-surface p-2 shadow-card">
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <ProductImage name={product.name} category={product.category} sizes="210px" />
        </div>
      </div>
    );
  }

  return (
    <article className={`group relative flex flex-col gap-2.5 rounded-[22px] bg-surface p-2 shadow-card transition-shadow duration-[var(--kr-dur)] hover:shadow-card-hover has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent md:gap-3.5 md:rounded-[28px] md:p-3 ${className}`}>
      <div className="relative aspect-square overflow-hidden rounded-[16px] md:aspect-auto md:h-[180px] md:rounded-[20px] [&>*]:transition-transform [&>*]:duration-500 [&>*]:ease-[var(--kr-ease)] group-hover:[&>*]:scale-[1.04]">
        <ProductImage
          name={product.name}
          category={product.category}
          sizes="(min-width:1024px) 25vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-1 md:gap-1.5 md:px-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] font-semibold tracking-wide text-accent uppercase">{product.category}</p>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold md:text-[11px] ${stock === 0 ? "bg-pill text-muted" : stock <= 3 ? "bg-warn-bg text-warn" : "bg-success-bg text-success"}`}
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
            {stock === 0 ? "Habis" : stock <= 3 ? `Sisa ${stock}` : `Stok ${stock}`}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold tracking-[-0.3px] text-ink md:text-lg">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-[22px] focus-visible:outline-none md:after:rounded-[28px]"
          >
            {product.name}
          </Link>
        </h3>
        <p className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted md:text-xs">
          {rating != null && <RatingStars rating={rating} size={11} />}
          <span>{(product.soldCount ?? 0).toLocaleString("id-ID")} Terjual</span>
        </p>
        <p className="line-clamp-2 text-[13px] text-muted max-md:hidden">{product.description}</p>
      </div>
      <div className="flex flex-col items-stretch gap-2 border-t border-hairline px-1 pt-2.5 pb-1 md:px-1.5 md:pb-1.5">
        <div className="font-display text-base font-bold text-ink md:text-lg">
          {minPrice == null ? (
            <span className="text-[13px] font-semibold text-muted">Belum tersedia</span>
          ) : (
            <>
              {product.variants.length > 1 && (
                <span className="mr-1 text-[11px] font-medium text-muted md:text-xs">Mulai</span>
              )}
              {rupiah.format(minPrice)}
            </>
          )}
        </div>
        {cheapest ? (
          <Link
            href={`/checkout?variant_id=${cheapest.id}&product_id=${product.id}`}
            aria-label={`Beli ${product.name}`}
            className="kr-press relative z-10 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-on-ink hover:bg-ink-hover"
          >
            <ShoppingCart size={14} aria-hidden="true" />
            Beli
          </Link>
        ) : (
          <span className="inline-flex min-h-10 items-center justify-center rounded-full bg-pill px-4 py-2 text-[13px] font-semibold text-muted">
            Stok habis
          </span>
        )}
        {/* the title link already covers the card, so this is a visual duplicate only */}
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="kr-press relative z-10 inline-flex min-h-10 items-center justify-center rounded-full border-[1.5px] border-hairline px-4 py-2 text-[13px] font-semibold text-ink hover:border-line"
        >
          Detail
        </Link>
      </div>
    </article>
  );
}
