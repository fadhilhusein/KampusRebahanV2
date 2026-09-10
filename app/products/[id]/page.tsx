"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import Badge from "@/components/ui/Badge";
import VariantSelector from "@/components/product/VariantSelector";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import Image from "next/image";
import { getCategoryIcon, getCategoryColor } from "@/lib/categoryIcons";
import { getProductImage } from "@/lib/productImages";
import type { Product, ProductReview, ProductVariant } from "@/lib/types";
import { ScrollText, Truck, ShoppingCart } from "lucide-react";

function NumberedList({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <ol className="space-y-2.5">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-semibold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="text-[13px] text-foreground/80 font-medium leading-6">{line}</span>
        </li>
      ))}
    </ol>
  );
}

function formatReviewDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selected, setSelected] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [termsOpen, setTermsOpen] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewSummary, setReviewSummary] = useState<{
    averageRating: number | null;
    reviewCount: number;
  }>({ averageRating: null, reviewCount: 0 });

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const found = data.data.find((p: Product) => p.id === id);
          if (found) {
            setProduct(found);
            document.title = `${found.name} | KampusRebahan`;
            const firstInStock = found.variants.find((v: ProductVariant) => v.stock > 0);
            setSelected(firstInStock ?? found.variants[0] ?? null);
            fetch(`/api/reviews?productName=${encodeURIComponent(found.name)}`)
              .then((r) => r.json())
              .then((reviewData) => {
                if (reviewData.success) {
                  setReviews(reviewData.data ?? []);
                  setReviewSummary({
                    averageRating: reviewData.summary?.averageRating ?? null,
                    reviewCount: reviewData.summary?.reviewCount ?? 0,
                  });
                }
              })
              .catch(() => {
                setReviews([]);
                setReviewSummary({ averageRating: null, reviewCount: 0 });
              });
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 pb-16 px-8">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 pb-16 px-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground/40 mb-4">Produk tidak ditemukan.</p>
            <Link href="/products">
              <ButtonPrimary>Kembali ke Produk</ButtonPrimary>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const icon = getCategoryIcon(product.category);
  const color = getCategoryColor(product.category);
  const productImage = getProductImage(product.name);
  const averageRating = reviewSummary.averageRating ?? product.averageRating ?? null;
  const reviewCount = reviewSummary.reviewCount || product.reviewCount || 0;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[12px] text-foreground/30 mb-8">
            <Link href="/products" className="hover:text-foreground transition-colors">
              Produk
            </Link>
            <span>/</span>
            <span className="text-foreground/60">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left — Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {productImage ? (
                  <div className="w-12 h-12 rounded-[2px] overflow-hidden flex-shrink-0">
                    <Image src={productImage} alt={product.name} width={48} height={48} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-[2px] glass flex items-center justify-center text-[24px]">
                    {icon}
                  </div>
                )}
                <Badge color={color}>{product.category}</Badge>
              </div>

              <h1 className="text-[32px] font-semibold text-foreground leading-tight tracking-tight mb-4">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-[14px] text-foreground/50 leading-6 mb-6">
                  {product.description}
                </p>
              )}

              {selected && (
                <GlassCard radius="rounded-2xl" className="p-5 mb-6">
                  <div className="text-[11px] text-foreground/30 mb-1">Harga terpilih</div>
                  <div className="text-[28px] font-semibold text-foreground">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(selected.price)}
                  </div>
                  <div className="text-[12px] text-foreground/40 mt-1">
                    {selected.duration} · {selected.type}
                    {selected.warranty ? ` · Garansi ${selected.warranty}` : ""}
                  </div>
                </GlassCard>
              )}

              {/* Right — Variant selector */}
              <div className="mb-6 md:hidden">
                <GradientBorder radius="rounded-2xl">
                  <div className="p-5">
                    <h2 className="text-[14px] font-medium text-foreground">
                      Pilih Varian
                    </h2>
                    <VariantSelector
                      variants={product.variants}
                      selected={selected}
                      onSelect={setSelected}
                      radius="rounded-xl"
                    />
                  </div>
                </GradientBorder>
              </div>              

              {/* Terms accordion */}
              {selected?.terms && (
                <div className="mb-6 space-y-3">
                  <GlassCard radius="rounded-2xl" className="overflow-hidden">
                    <button
                      onClick={() => setTermsOpen(!termsOpen)}
                      className="w-full flex items-center justify-between text-[14px] font-semibold text-foreground px-5 py-4 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <ScrollText size={16} className="text-primary" />
                        Syarat & Ketentuan
                      </span>
                      <span className="text-foreground/40">{termsOpen ? "−" : "+"}</span>
                    </button>
                    {termsOpen && (
                      <div className="px-5 pb-5 pt-4 border-t border-foreground/10">
                        <NumberedList text={selected.terms} />
                      </div>
                    )}
                  </GlassCard>

                  {selected.delivery_terms && (
                    <GlassCard radius="rounded-2xl" className="p-5">
                      <div className="flex items-center gap-2 text-[14px] font-semibold text-foreground mb-3">
                        <Truck size={16} className="text-primary" />
                        Info Pengiriman
                      </div>
                      <NumberedList text={selected.delivery_terms} />
                    </GlassCard>
                  )}
                </div>
              )}

              <ButtonPrimary
                className="w-full py-3 text-[14px] flex items-center justify-center gap-2"
                disabled={!selected || selected.stock === 0}
                onClick={() => {
                  if (selected)
                    router.push(
                      `/checkout?variant_id=${selected.id}&product_id=${product.id}`
                    );
                }}
              >
                {selected?.stock !== 0 && <ShoppingCart size={16} />}
                {selected?.stock === 0 ? "Stok Habis" : "Beli Sekarang"}
              </ButtonPrimary>
            </div>

            {/* Right — Variant selector */}
            <div className="hidden md:inline">
              <GradientBorder radius="rounded-2xl">
                <div className="p-5">
                  <h2 className="text-[14px] font-medium text-foreground mb-4">
                    Pilih Varian
                  </h2>
                  <VariantSelector
                    variants={product.variants}
                    selected={selected}
                    onSelect={setSelected}
                  />
                </div>
              </GradientBorder>
            </div>
          </div>

          <section className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <div className="text-[11px] font-medium text-foreground/50 uppercase tracking-wider mb-2">
                  Testimoni Produk
                </div>
                <h2 className="text-[22px] font-semibold text-foreground tracking-tight">
                  Pengalaman pembeli
                </h2>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-foreground/40">
                <span className="text-tertiary tracking-[1px]" aria-hidden="true">★★★★★</span>
                <span>
                  {averageRating != null ? `${averageRating.toFixed(1)} dari 5` : "Belum ada rating"}
                </span>
                <span className="h-1 w-1 rounded-full bg-foreground/15" />
                <span>{reviewCount} ulasan</span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reviews.map((review) => (
                  <GlassCard key={review.id} className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="text-[13px] font-medium text-foreground">
                          {review.userName}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-tertiary text-[12px] tracking-[1px]" aria-hidden="true">
                            {"★".repeat(review.rating)}
                            <span className="text-foreground/15">{"★".repeat(5 - review.rating)}</span>
                          </span>
                          <span className="text-[11px] text-foreground/30">{review.rating}/5</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-foreground/25">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-[13px] text-foreground/50 leading-6">
                      {review.testimonial}
                    </p>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="p-6">
                <p className="text-[13px] text-foreground/35 leading-6">
                  Belum ada testimoni untuk produk ini. Testimoni akan muncul setelah pembeli menyelesaikan transaksi dan mengirim review.
                </p>
              </GlassCard>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
