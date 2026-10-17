"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  MessageSquare,
  Truck,
  ScrollText,
  RotateCw,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductImage from "@/components/product/ProductImage";
import VariantSelector from "@/components/product/VariantSelector";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import RatingStars from "@/components/ui/RatingStars";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import type { Product, ProductVariant, ProductReview } from "@/lib/types";
function Terms({ text }: { text: string }) {
  return (
    <ol className="space-y-3 list-decimal pl-5 text-sm leading-7 kr-muted">
      {text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l, i) => (
          <li key={i}>{l}</li>
        ))}
    </ol>
  );
}
function ProductDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null),
    [selected, setSelected] = useState<ProductVariant | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [reviews, setReviews] = useState<ProductReview[]>([]),
    [summary, setSummary] = useState<{
      averageRating: number | null;
      reviewCount: number;
    }>({ averageRating: null, reviewCount: 0 }),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (!d.success) throw new Error("Gagal memuat produk");
        const found = d.data.find((p: Product) => p.id === id);
        if (found) {
          setProduct(found);
          setSelected(
            found.variants.find((v: ProductVariant) => v.stock > 0) ??
              found.variants[0] ??
              null,
          );
          document.title = found.name + " | KampusRebahan";
          fetch("/api/reviews?productName=" + encodeURIComponent(found.name))
            .then((r) => r.json())
            .then((d) => {
              if (active && d.success) {
                setReviews(d.data ?? []);
                setSummary({
                  averageRating: d.summary?.averageRating ?? null,
                  reviewCount: d.summary?.reviewCount ?? 0,
                });
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        if (active) setError("Produk belum dapat dimuat. Coba lagi.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, retry]);
  const rating = summary.averageRating ?? product?.averageRating ?? null,
    count = summary.reviewCount || product?.reviewCount || 0;
  return (
    <>
      <Navbar />
      <main className="kr-container flex-1 py-12 md:py-14">
        {loading ? (
          <ProductDetailSkeleton />
        ) : !product ? (
          <div className="py-20 text-center">
            <p className="kr-muted mb-5">
              {error || "Produk tidak ditemukan."}
            </p>
            {error ? (
              <ButtonPrimary onClick={() => { setLoading(true); setError(""); setRetry((v) => v + 1); }}>
                <RotateCw size={16} />
                Coba Lagi
              </ButtonPrimary>
            ) : (
              <Link href="/products" className="kr-link">
                Kembali ke Produk
              </Link>
            )}
          </div>
        ) : (
          <>
            <nav aria-label="Breadcrumb" className="text-xs kr-muted mb-9">
              <Link href="/">Beranda</Link> /{" "}
              <Link href="/products">Produk</Link> / {product.name}
            </nav>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
              <div>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-[#74131C]">
                  <ProductImage name={product.name} priority />
                </div>
                <p className="kr-eyebrow mt-5">
                  {product.name} / {product.category}
                </p>
              </div>
              <div className="min-w-0">
                <span className="inline-block bg-primary/5 text-primary rounded px-3 py-1 text-xs mb-5">
                  {product.category}
                </span>
                <h1 className="kr-heading mb-5">{product.name}</h1>
                <p className="kr-muted text-sm leading-7 mb-6 whitespace-pre-line">
                  {product.description}
                </p>
                {selected && (
                  <div className="mb-7">
                    <p className="text-xs kr-muted mb-2">Harga pilihan</p>
                    <p className="text-3xl font-medium">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(selected.price)}
                    </p>
                  </div>
                )}
                <h2 className="text-sm font-medium mb-4">Pilih varian</h2>
                <VariantSelector
                  variants={product.variants}
                  selected={selected}
                  onSelect={setSelected}
                />
                <ButtonPrimary
                  className="w-full mt-6"
                  disabled={!selected || selected.stock === 0}
                  onClick={() => {
                    if (selected)
                      router.push(
                        `/checkout?variant_id=${selected.id}&product_id=${product.id}`,
                      );
                  }}
                >
                  <ShoppingCart size={16} />
                  {!selected || selected.stock === 0
                    ? "Stok Habis"
                    : "Beli Sekarang"}
                </ButtonPrimary>
                <p className="text-xs kr-muted mt-4">
                  Periksa syarat penggunaan sebelum membeli.
                </p>
              </div>
            </div>
            {(selected?.terms || selected?.delivery_terms) && (
              <section className="mt-12 rounded-lg bg-[var(--kr-soft)] p-6 md:p-8 space-y-8">
                {selected.terms && (
                  <div>
                    <p className="kr-eyebrow mb-3">Sebelum mulai</p>
                    <h2 className="flex items-center gap-3 text-2xl font-medium mb-6">
                      <ScrollText size={21} />
                      Syarat penggunaan akun
                    </h2>
                    <Terms text={selected.terms} />
                  </div>
                )}
                {selected.delivery_terms && (
                  <div>
                    <h2 className="flex items-center gap-3 text-xl mb-5">
                      <Truck size={20} />
                      Info pengiriman
                    </h2>
                    <Terms text={selected.delivery_terms} />
                  </div>
                )}
              </section>
            )}
            <section className="mt-14 mb-6">
              <p className="kr-eyebrow mb-4">Testimoni produk</p>
              <div className="flex flex-wrap justify-between gap-5 items-center mb-7">
                <h2 className="text-[28px] font-medium tracking-tight">
                  Pengalaman pembeli
                </h2>
                <div className="flex items-center gap-3 text-xs kr-muted">
                  {rating != null && <RatingStars rating={rating} />}
                  <span>
                    {rating == null
                      ? "Belum ada rating"
                      : rating.toFixed(1) + " dari 5"}
                  </span>
                  <span>{count} ulasan</span>
                </div>
              </div>
              {reviews.length ? (
                <div className="grid md:grid-cols-2 gap-5">
                  {reviews.map((r) => (
                    <article key={r.id} className="glass rounded-lg p-6">
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">{r.userName}</p>
                          <div className="mt-2">
                            <RatingStars rating={r.rating} />
                          </div>
                        </div>
                        <time className="text-xs kr-muted">
                          {new Date(r.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                      <p className="text-sm leading-7 kr-muted mt-5">
                        {r.testimonial}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-lg p-10 text-center">
                  <MessageSquare
                    size={28}
                    className="mx-auto mb-4 text-foreground/40"
                  />
                  <p className="font-medium">Belum ada rating</p>
                  <p className="text-sm kr-muted mt-3">
                    Testimoni muncul setelah pembeli menyelesaikan transaksi dan
                    mengirim review.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <ProductDetailContent key={id} id={id} />;
}
