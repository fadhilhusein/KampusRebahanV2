"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { CheckoutSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import type { Product, ProductVariant } from "@/lib/types";
import { ClipboardList, CreditCard, QrCode, Landmark, Wallet, ShoppingCart } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";

// Keep in sync with lib/bayarGg.ts QRIS_GATEWAY_MAX_AMOUNT (kept separate to avoid
// bundling the server-only Bayar.gg client, which uses Node's crypto, into client code).
const QRIS_GATEWAY_MAX_AMOUNT = 500000;

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
  const [dataLoading, setDataLoading] = useState(Boolean(variantId));
  const [quantity, setQuantity] = useState(1);
  const [selectedPaymentMethod, setPaymentMethod] = useState<"BANK_TRANSFER" | "QRIS_GATEWAY" | "QRIS_BRIDGE" | "BALANCE">("QRIS_GATEWAY");
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [qrisGatewayEnabled, setQrisGatewayEnabled] = useState(true);
  const [qrisBridgeEnabled, setQrisBridgeEnabled] = useState(true);
  const [balance, setBalance] = useState(0);
  const [paymentNote, setPaymentNote] = useState("");
  const [emailInvite, setEmailInvite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return;
        setBankTransferEnabled(d.data.bankTransferEnabled);
        setQrisGatewayEnabled(d.data.qrisGatewayEnabled);
        setQrisBridgeEnabled(d.data.qrisBridgeEnabled);
      });
    fetch("/api/balance")
      .then((r) => r.json())
      .then((d) => { if (d.success) setBalance(d.data.balance); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!variantId) return;
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
  const qrisGatewayDisabled = totalSell > QRIS_GATEWAY_MAX_AMOUNT;
  const balanceInsufficient = totalSell > balance;
  const isInvite = variant?.type === "Invite";
  const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
  const emailInviteMissing = isInvite && !isValidEmail(emailInvite);

  // If the selected method becomes unavailable (admin toggle off, or QRIS_GATEWAY's amount
  // cap), fall through to the first still-available method in this priority order.
  const methodAvailable: Record<string, boolean> = {
    QRIS_GATEWAY: qrisGatewayEnabled && !qrisGatewayDisabled,
    QRIS_BRIDGE: qrisBridgeEnabled,
    BANK_TRANSFER: bankTransferEnabled,
    BALANCE: true,
  };
  const methodFallbackOrder = ["QRIS_GATEWAY", "QRIS_BRIDGE", "BANK_TRANSFER", "BALANCE"] as const;
  const paymentMethod = methodAvailable[selectedPaymentMethod]
    ? selectedPaymentMethod
    : methodFallbackOrder.find((m) => methodAvailable[m]) ?? selectedPaymentMethod;
  const noMethodUsable = !methodAvailable.QRIS_GATEWAY && !methodAvailable.QRIS_BRIDGE && !bankTransferEnabled && balanceInsufficient;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!variantId) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, productId, quantity, paymentMethod, paymentNote, emailInvite }),
      });

      const data = await res.json();
      if (data.success) {
        addToast("Order berhasil dibuat!", "success");
        if (data.data.payment_url) {
          window.location.href = data.data.payment_url;
        } else {
          router.push(`/order/${data.data.order_id}`);
        }
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
            <p className="text-foreground/40 mb-4">Varian tidak ditemukan.</p>
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[12px] text-foreground/30 mb-8">
            <Link href={`/products/${productId}`} className="hover:text-foreground transition-colors">
              {product?.name ?? "Produk"}
            </Link>
            <span>/</span>
            <span className="text-foreground/60">Checkout</span>
          </div>

          <h1 className="text-[32px] font-semibold text-foreground leading-none tracking-tight mb-8">
            Selesaikan pesananmu.
          </h1>

          <GradientBorder radius="rounded-2xl">
            <form onSubmit={handleSubmit} className="kr-checkout-form p-6 md:p-8">
              <div className="space-y-6 min-w-0">

              {/* Order summary */}
              {variant && (
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-3">
                    <ClipboardList size={12} />
                    Ringkasan Order
                  </div>
                  <div className="flex items-center gap-5 mb-3">
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md"><ProductImage name={product?.name ?? "Produk"} sizes="96px" /></div>
                    <div>
                      <div className="text-[15px] font-medium text-foreground">{product?.name}</div>
                      <div className="text-[12px] text-foreground/40 mt-0.5">
                        {variant.name} · {variant.duration} · {variant.type}
                      </div>
                    </div>
                    <div className="text-[14px] font-semibold text-foreground ml-4 flex-shrink-0">
                      {formatPrice(sellPrice)}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-foreground/8" />

              {/* Payment method */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-3">
                  <CreditCard size={12} />
                  Metode Pembayaran
                </div>
                <div className="flex flex-col gap-3">
                  {qrisGatewayEnabled && (
                    <button
                      type="button"
                      disabled={qrisGatewayDisabled}
                      onClick={() => setPaymentMethod("QRIS_GATEWAY")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[12px] font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                        paymentMethod === "QRIS_GATEWAY"
                          ? "border-primary text-primary bg-primary/5"
                          : "border-foreground/10 text-foreground/40 hover:text-foreground hover:border-foreground/20"
                      }`}
                    >
                      <QrCode size={14} /> QRIS
                    </button>
                  )}
                  {qrisBridgeEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("QRIS_BRIDGE")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[12px] font-medium transition-colors cursor-pointer ${
                        paymentMethod === "QRIS_BRIDGE"
                          ? "border-primary text-primary bg-primary/5"
                          : "border-foreground/10 text-foreground/40 hover:text-foreground hover:border-foreground/20"
                      }`}
                    >
                      <QrCode size={14} /> QRIS Instan
                    </button>
                  )}
                  {bankTransferEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("BANK_TRANSFER")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[12px] font-medium transition-colors cursor-pointer ${
                        paymentMethod === "BANK_TRANSFER"
                          ? "border-primary text-primary bg-primary/5"
                          : "border-foreground/10 text-foreground/40 hover:text-foreground hover:border-foreground/20"
                      }`}
                    >
                      <Landmark size={14} /> Transfer Bank
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={balanceInsufficient}
                    onClick={() => setPaymentMethod("BALANCE")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[12px] font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      paymentMethod === "BALANCE"
                        ? "border-primary text-primary bg-primary/5"
                        : "border-foreground/10 text-foreground/40 hover:text-foreground hover:border-foreground/20"
                    }`}
                  >
                    <Wallet size={14} /> Saldo ({formatPrice(balance)})
                  </button>
                </div>
                {qrisGatewayEnabled && qrisGatewayDisabled && (
                  <p className="text-[11px] text-foreground/30 mt-2">
                    QRIS maksimal {formatPrice(QRIS_GATEWAY_MAX_AMOUNT)}{qrisBridgeEnabled ? ", gunakan QRIS Instan untuk nominal ini." : "."}
                  </p>
                )}
                {paymentMethod === "BALANCE" && balanceInsufficient && (
                  <p className="text-[11px] text-primary mt-2">
                    Saldo tidak cukup. <Link href="/dashboard/balance" className="underline underline-offset-2">Top up saldo</Link>
                  </p>
                )}
                {noMethodUsable && (
                  <p className="text-[11px] text-primary mt-2">
                    Tidak ada metode pembayaran yang tersedia saat ini. Hubungi admin.
                  </p>
                )}
              </div>

              <div className="border-t border-foreground/8" />

              {/* Quantity */}
              <div>
                <label htmlFor="checkout-quantity" className="block text-[13px] font-semibold text-foreground/70 mb-2">
                  Jumlah <span className="text-foreground/40 font-normal">(unit)</span>
                  {stock > 0 && <span className="text-foreground/40 font-normal ml-1">· Stok: {stock}</span>}
                </label>
                <input
                  id="checkout-quantity"
                  type="number"
                  min={1}
                  max={stock || 100}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className={`w-full glass rounded-xl px-4 py-3 text-[14px] text-foreground border focus:outline-none transition-colors bg-transparent ${
                    stockExceeded ? "border-primary/60 focus:border-primary" : "border-foreground/10 focus:border-foreground/30"
                  }`}
                />
                {outOfStock && (
                  <p className="text-[12px] text-primary mt-2">Stok habis. Produk ini tidak tersedia saat ini.</p>
                )}
                {stockExceeded && (
                  <p className="text-[12px] text-primary mt-2">Jumlah melebihi stok tersedia ({stock} unit).</p>
                )}
              </div>

              {/* Note */}
              <div>
                <label htmlFor="checkout-note" className="block text-[13px] font-semibold text-foreground/70 mb-2">
                  Catatan <span className="text-foreground/40 font-normal">(opsional)</span>
                </label>
                <textarea
                  id="checkout-note"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Informasi tambahan jika ada..."
                  rows={2}
                  className="w-full glass rounded-xl px-4 py-3 text-[14px] text-foreground placeholder-foreground/20 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors bg-transparent resize-none"
                />
              </div>

              {/* Email Invite (required for Invite-type products) */}
              {isInvite && (
                <div>
                  <label htmlFor="checkout-invite" className="block text-[13px] font-semibold text-foreground/70 mb-2">
                    Email Invite <span className="text-primary font-normal">(wajib)</span>
                  </label>
                  <input
                    id="checkout-invite"
                    type="email"
                    value={emailInvite}
                    onChange={(e) => setEmailInvite(e.target.value)}
                    placeholder="email@contoh.com"
                    className={`w-full glass rounded-xl px-4 py-3 text-[14px] text-foreground placeholder-foreground/20 border focus:outline-none transition-colors bg-transparent ${
                      emailInviteMissing && emailInvite ? "border-primary/60 focus:border-primary" : "border-foreground/10 focus:border-foreground/30"
                    }`}
                  />
                  <p className="text-[11px] text-foreground/30 mt-2">
                    Produk ini bertipe Invite. Akun akan dikirim ke email ini.
                  </p>
                  {emailInviteMissing && emailInvite && (
                    <p className="text-[12px] text-primary mt-2">Format email tidak valid.</p>
                  )}
                </div>
              )}

              </div>
              <aside className="kr-checkout-summary space-y-6">
                <h2 className="text-[23px] font-medium tracking-tight">Ringkasan pesanan</h2>
                <p className="text-sm text-foreground/60">{quantity} × {product?.name}</p>
                <div className="border-t border-foreground/10 pt-5"><p className="text-xs text-foreground/50 mb-2">Total pembayaran</p><p className="text-[34px] font-medium tracking-tight">{formatPrice(totalSell)}</p></div>
              {error && (
                <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-[13px] font-medium text-primary">
                  {error}
                </div>
              )}

              <ButtonPrimary
                type="submit"
                disabled={loading || stockExceeded || outOfStock || emailInviteMissing || (paymentMethod === "BALANCE" && balanceInsufficient) || noMethodUsable}
                className="w-full py-3 text-[14px] flex items-center justify-center gap-2"
              >
                {!outOfStock && !loading && <ShoppingCart size={16} />}
                {loading ? "Memproses..." : outOfStock ? "Stok Habis" : "Buat Order"}
              </ButtonPrimary>

              <p className="text-[11px] text-foreground/20 text-center">
                Instruksi pembayaran akan ditampilkan setelah order dibuat.
              </p>
              </aside>
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
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CheckoutContent />
    </Suspense>
  );
}
