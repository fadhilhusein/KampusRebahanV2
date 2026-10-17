import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import type { Product } from "@/lib/types";
export default function ProductCard({ product }: { product: Product }) {
  const minPrice = product.variants.length
    ? Math.min(...product.variants.map((v) => v.price))
    : null;
  const inStock = product.variants.some((v) => v.stock > 0);
  return (
    <Link
      href={`/products/${product.id}`}
      className="kr-product-card"
      aria-label={`Lihat ${product.name}`}
    >
      <div className="kr-product-photo">
        <ProductImage
          name={product.name}
          sizes="(min-width:1024px) 25vw, 50vw"
        />
      </div>
      <div className="kr-product-info">
        <span className={`kr-stock ${inStock ? "kr-stock-available" : ""}`}>
          {inStock ? "Stok tersedia" : "Stok habis"}
        </span>
        <h3 className="kr-product-title">{product.name}</h3>
        <p className="kr-product-desc">{product.description}</p>
        {product.averageRating != null && (
          <div className="flex gap-1.5 items-center text-xs kr-muted">
            <Star size={12} className="text-primary" />
            {product.averageRating.toFixed(1)}{" "}
            <span>({product.reviewCount ?? 0} ulasan)</span>
          </div>
        )}
        <div className="kr-product-price">
          {minPrice == null ? (
            "Belum tersedia"
          ) : (
            <>
              {product.variants.length > 1 && (
                <span className="block text-[10px] font-normal kr-muted">
                  Mulai dari
                </span>
              )}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(minPrice)}
            </>
          )}
        </div>
        <span className="kr-product-buy" data-unavailable={!inStock}>
          {inStock ? (
            <>
              Lihat Produk <ArrowUpRight size={14} />
            </>
          ) : (
            "Stok Habis"
          )}
        </span>
      </div>
    </Link>
  );
}
