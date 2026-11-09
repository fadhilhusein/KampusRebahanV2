"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  MessageSquare,
  Truck,
  ScrollText,
  RotateCw,
  Inbox,
  TriangleAlert,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductImage from "@/components/product/ProductImage";
import VariantSelector from "@/components/product/VariantSelector";
import VariantInfoBox from "@/components/product/VariantInfoBox";
import { variantFlags } from "@/lib/variantInfo";
import Badge from "@/components/ui/Badge";
import ButtonPrimary, { buttonClass } from "@/components/ui/ButtonPrimary";
import RatingStars from "@/components/ui/RatingStars";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import type { Product, ProductVariant, ProductReview } from "@/lib/types";
function Terms({ text }: { text: string }) {
  return (
    <ol className="list-decimal space-y-3 pl-5 text-sm text-muted">
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
  const price = selected
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(selected.price)
    : null;
  const soldOut = !selected || selected.stock === 0;
  const flags = selected ? variantFlags(selected) : null;
  return (
    <div className="kr-page">
      <Navbar />
      <main className="flex w-full min-w-0 flex-1 flex-col gap-8 py-8 md:gap-12 md:py-10">
        {loading ? (
          <ProductDetailSkeleton />
        ) : !product ? (
          <div className="kr-fade-up flex flex-col items-center gap-3 rounded-[28px] bg-surface p-7 text-center shadow-card">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full ${error ? "bg-danger-bg text-danger" : "bg-pill text-ink"}`}
            >
              {error ? <TriangleAlert size={24} aria-hidden="true" /> : <Inbox size={24} aria-hidden="true" />}
            </span>
            <h1 className="text-xl font-semibold text-ink">
              {error ? "Produk gagal dimuat" : "Produk tidak ditemukan"}
            </h1>
            <p className="text-sm text-muted">{error || "Produk yang kamu cari tidak tersedia."}</p>
            {error ? (
              <ButtonPrimary
                variant="secondary"
                onClick={() => { setLoading(true); setError(""); setRetry((v) => v + 1); }}
              >
                <RotateCw size={16} aria-hidden="true" />
                Coba lagi
              </ButtonPrimary>
            ) : (
              <Link href="/products" className={buttonClass("primary")}>
                Lihat produk
              </Link>
            )}
          </div>
        ) : (
          <>
            <nav aria-label="Breadcrumb" className="kr-fade-in text-[13px] text-muted">
              <Link href="/products" className="hover:text-ink hover:underline">Produk</Link> /{" "}
              {product.category} / <span aria-current="page">{product.name}</span>
            </nav>
            {/* Desktop: left = image, info box, terms (sticky, stays in view when shorter than the right);
                right = variants + buy, normal flow. On mobile the left wrapper is `contents`, and `order`
                keeps the old sequence: image, variants, terms. */}
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start md:gap-10 lg:grid-cols-[minmax(0,1fr)_560px] lg:gap-12">
              <div className="contents md:sticky md:top-6 md:flex md:min-w-0 md:flex-col md:gap-7">
              <div className="kr-fade-up relative order-1 h-[260px] overflow-hidden rounded-[28px] shadow-card md:order-none md:h-[460px] md:rounded-[36px]">
                <ProductImage name={product.name} category={product.category} priority iconSize={96} sizes="(min-width:1024px) 640px, (min-width:768px) 50vw, 100vw" />
              </div>
              {selected && (
                <div id="info-varian-box" className="hidden scroll-mt-6 md:block">
                  <VariantInfoBox variant={selected} link={selected.terms || selected.delivery_terms ? "scroll" : "terms"} />
                </div>
              )}
              {(selected?.terms || selected?.delivery_terms) && (
                <section id="syarat" aria-labelledby="syarat-title" className="order-3 scroll-mt-6 max-md:mt-2 md:order-none">
                  <Reveal className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-semibold tracking-[1.2px] text-muted">SYARAT LENGKAP</p>
                      <h2 id="syarat-title" className="text-2xl font-bold tracking-[-0.8px] text-ink md:text-[28px] md:tracking-[-1px]">
                        Syarat varian {selected.name}
                      </h2>
                    </div>
                    {[
                      { text: selected.terms, title: "Syarat penggunaan akun", Icon: ScrollText },
                      { text: selected.delivery_terms, title: "Info pengiriman", Icon: Truck },
                    ]
                      .filter((t) => t.text)
                      .map(({ text, title, Icon }) => (
                        <div key={title} className="flex flex-col gap-4 rounded-[22px] bg-surface p-[18px] shadow-card md:rounded-[24px] md:p-6">
                          <h3 className="flex items-center gap-2 text-base font-semibold text-ink md:text-lg">
                            <Icon size={18} aria-hidden="true" />
                            {title}
                          </h3>
                          <Terms text={text!} />
                        </div>
                      ))}
                    <div className="flex flex-col gap-1 md:flex-row md:gap-5">
                      <Link href="/terms" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-2">
                        <ScrollText size={16} aria-hidden="true" /> Baca S&amp;K toko
                      </Link>
                      <Link href="/refund-calculator" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-2">
                        <Calculator size={16} aria-hidden="true" /> Hitung estimasi refund
                      </Link>
                    </div>
                  </Reveal>
                </section>
              )}
              </div>
              <div className="kr-fade-up order-2 flex min-w-0 flex-col gap-4 md:order-none md:gap-5" style={{ animationDelay: "100ms" }}>
                <div className="flex flex-wrap gap-2">
                  <Badge>{product.category}</Badge>
                  {!soldOut && <Badge color="secondary">Stok tersedia</Badge>}
                </div>
                <h1 className="text-4xl font-bold tracking-[-1.5px] text-ink md:text-[56px] md:leading-[1.1] md:tracking-[-2.5px]">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 text-[13px] font-medium text-muted md:text-sm">
                  {rating != null && <RatingStars rating={rating} />}
                  <span>
                    {rating == null
                      ? "Belum ada rating"
                      : `${rating.toFixed(1).replace(".", ",")} dari 5 · ${count} ulasan`}
                  </span>
                </div>
                <p className="whitespace-pre-line text-[15px] text-muted md:text-base md:leading-normal">
                  {product.description}
                </p>
                <p className="text-[13px] font-semibold text-ink">Pilih varian</p>
                <VariantSelector
                  variants={product.variants}
                  selected={selected}
                  onSelect={setSelected}
                />
                {selected && (
                  <div className="md:hidden">
                    <VariantInfoBox variant={selected} link={selected.terms || selected.delivery_terms ? "scroll" : "terms"} />
                  </div>
                )}
                <div className="sticky bottom-4 z-10 flex flex-col gap-3.5 rounded-[24px] bg-surface p-4 shadow-card md:static md:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted">Total</p>
                    <p className="font-display text-2xl font-bold tracking-[-0.8px] text-ink md:text-[32px] md:tracking-[-1.2px]">
                      {price ?? "-"}
                    </p>
                  </div>
                  <ButtonPrimary
                    disabled={soldOut}
                    onClick={() => {
                      if (selected)
                        router.push(
                          `/checkout?variant_id=${selected.id}&product_id=${product.id}`,
                        );
                    }}
                  >
                    {soldOut ? "Stok habis" : "Beli sekarang"}
                  </ButtonPrimary>
                </div>
                {selected && (flags?.sharing || flags?.noWarranty || flags?.po) && (
                  <div className="hidden flex-wrap items-center gap-1.5 md:flex">
                    {flags.sharing && <Badge color="tertiary">Sharing</Badge>}
                    {flags.noWarranty && <Badge color="tertiary">No Garansi</Badge>}
                    {flags.po && <Badge color="tertiary">{flags.poDate ? `PO ${flags.poDate}` : "PO"}</Badge>}
                  </div>
                )}
                <a href="#info-varian-box" className="hidden min-h-11 items-center gap-1.5 self-start text-[13px] font-semibold text-ink underline underline-offset-2 md:inline-flex">
                  <ArrowLeft size={14} aria-hidden="true" /> Baca dulu: Yang perlu kamu tahu
                </a>
                </div>
                <p className="text-[13px] text-muted">Bayar via QRIS atau saldo.</p>
              </div>
            </div>
            <section className="flex flex-col gap-5">
              <h2 className="text-[28px] font-bold tracking-[-1px] text-ink md:text-[32px]">
                Ulasan pembeli
              </h2>
              {reviews.length ? (
                <Reveal stagger={0.06} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {reviews.map((r) => (
                    <RevealItem key={r.id}>
                    <article className="kr-lift h-full rounded-[24px] bg-surface p-5 shadow-card hover:shadow-card-hover">
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-ink">{r.userName}</p>
                          <div className="mt-2">
                            <RatingStars rating={r.rating} />
                          </div>
                        </div>
                        <time className="text-xs text-muted">
                          {new Date(r.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                      <p className="mt-4 text-sm text-muted">{r.testimonial}</p>
                    </article>
                    </RevealItem>
                  ))}
                </Reveal>
              ) : (
                <Reveal className="flex flex-col items-center gap-3 rounded-[28px] bg-surface p-7 text-center shadow-card">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pill text-ink">
                    <MessageSquare size={24} aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold text-ink">Belum ada ulasan</h3>
                  <p className="text-sm text-muted">
                    Ulasan muncul setelah pembeli menyelesaikan transaksi dan mengirim review.
                  </p>
                </Reveal>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <ProductDetailContent key={id} id={id} />;
}
