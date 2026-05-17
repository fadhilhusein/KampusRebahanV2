"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { CheckoutSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import type { Product, ProductVariant } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();

  const variantId = searchParams.get("variant_id") ?? "";
  const productId = searchParams.get("product_id") ?? "";

  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"BANK_TRANSFER" | "QRIS">("BANK_TRANSFER");
  const [paymentNote, setPaymentNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!variantId) { setDataLoading(false); return; }
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          for (const p of data.data) {
            const v = p.variants.find((v: ProductVariant) => v.id === variantId);
            if (v) { setProduct(p); setVariant(v); break; }
          }
        }
      })
      .finally(() => setDataLoading(false));
  }, [variantId]);

  const sellPrice = variant ? variant.price : 0;
  const totalSell = sellPrice * quantity;
  const stock = variant?.stock ?? 0;
  const stockExceeded = stock > 0 && quantity > stock;
  const outOfStock = stock === 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!variantId) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, productId, quantity, paymentMethod, paymentNote }),
      });

      const data = await res.json();
      if (data.success) {
        addToast("Order berhasil dibuat!", "success");
        router.push(`/order/${data.data.order_id}`);
      } else {
        const msg = data.message ?? "Gagal membuat order.";
        setError(msg);
        addToast(msg, "error");
      }
    } catch {
      const msg = "Terjadi kesalahan. Coba lagi.";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  if (dataLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 pb-16 px-8"><CheckoutSkeleton /></main>
        <Footer />
      </>
    );
  }

  if (!variantId) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/40 mb-4">Varian tidak ditemukan.</p>
            <Link href="/products"><ButtonPrimary>Pilih Produk</ButtonPrimary></Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 text-[12px] text-white/30 mb-8">
            <Link href={`/products/${productId}`} className="hover:text-white transition-colors">
              {product?.name ?? "Produk"}
            </Link>
            <span>/</span>
            <span className="text-white/60">Checkout</span>
          </div>

          <h1 className="text-[32px] font-semibold text-white leading-none tracking-tight mb-8">
            Checkout
          </h1>

          <GradientBorder>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">

              {/* Order summary */}
              {variant && (
                <div>
                  <div className="text-[11px] text-white/30 uppercase tracking-wider mb-3">Ringkasan Order</div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[15px] font-medium text-white">{product?.name}</div>
                      <div className="text-[12px] text-white/40 mt-0.5">
                        {variant.name} · {variant.duration} · {variant.type}
                      </div>
                    </div>
                    <div className="text-[14px] font-semibold text-white ml-4 flex-shrink-0">
                      {formatPrice(sellPrice)}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-white/8" />

              {/* Payment method */}
              <div>
                <div className="text-[11px] text-white/30 uppercase tracking-wider mb-3">Metode Pembayaran</div>
                <div className="flex gap-3">
                  {(["BANK_TRANSFER", "QRIS"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 py-2.5 rounded-[2px] border text-[12px] font-medium transition-colors cursor-pointer ${
                        paymentMethod === m
                          ? "border-white/50 text-white bg-white/10"
                          : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {m === "BANK_TRANSFER" ? "🏦 Transfer Bank" : "📱 QRIS"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/8" />

              {/* Quantity */}
              <div>
                <label className="block text-[12px] text-white/50 mb-2">
                  Jumlah <span className="text-white/20">(unit)</span>
                  {stock > 0 && <span className="text-white/20 ml-1">· Stok: {stock}</span>}
                </label>
                <input
                  type="number"
                  min={1}
                  max={stock || 100}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className={`w-full glass rounded-[2px] px-4 py-3 text-[14px] text-white border focus:outline-none transition-colors bg-transparent ${
                    stockExceeded ? "border-primary/60 focus:border-primary" : "border-white/10 focus:border-white/30"
                  }`}
                />
                {outOfStock && (
                  <p className="text-[12px] text-primary mt-2">Stok habis. Produk ini tidak tersedia saat ini.</p>
                )}
                {stockExceeded && (
                  <p className="text-[12px] text-primary mt-2">Jumlah melebihi stok tersedia ({stock} unit).</p>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between bg-white/5 rounded-[2px] px-4 py-3">
                <span className="text-[13px] text-white/50">Total ({quantity}x)</span>
                <span className="text-[20px] font-semibold text-white">{formatPrice(totalSell)}</span>
              </div>

              {/* Note */}
              <div>
                <label className="block text-[12px] text-white/50 mb-2">
                  Catatan <span className="text-white/20">(opsional)</span>
                </label>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Informasi tambahan jika ada..."
                  rows={2}
                  className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-white placeholder-white/20 border border-white/10 focus:border-white/30 focus:outline-none transition-colors bg-transparent resize-none"
                />
              </div>

              {error && (
                <div className="bg-primary/10 border border-primary/30 rounded-[2px] px-4 py-3 text-[13px] text-primary">
                  {error}
                </div>
              )}

              <ButtonPrimary type="submit" disabled={loading || stockExceeded || outOfStock} className="w-full py-3 text-[14px]">
                {loading ? "Memproses..." : outOfStock ? "Stok Habis" : "Buat Order →"}
              </ButtonPrimary>

              <p className="text-[11px] text-white/20 text-center">
                Instruksi pembayaran akan ditampilkan setelah order dibuat.
              </p>
            </form>
          </GradientBorder>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CheckoutContent />
    </Suspense>
  );
}
