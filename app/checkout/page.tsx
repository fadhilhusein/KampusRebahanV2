"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ButtonPrimary, { buttonClass } from "@/components/ui/ButtonPrimary";
import { CheckoutSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import type { Product, ProductVariant } from "@/lib/types";
import { Calculator, Gift, Lock, LockOpen, QrCode, Landmark, ScrollText, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import Badge from "@/components/ui/Badge";
import { infoIcons } from "@/components/product/VariantInfoBox";
import { consentText, variantFlags, variantPoints } from "@/lib/variantInfo";

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

type PaymentMethod = "BANK_TRANSFER" | "QRIS_GATEWAY" | "QRIS_BRIDGE" | "BALANCE" | "REFERRAL_BALANCE";

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
  const [selectedPaymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS_GATEWAY");
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [qrisGatewayEnabled, setQrisGatewayEnabled] = useState(true);
  const [qrisBridgeEnabled, setQrisBridgeEnabled] = useState(true);
  const [balance, setBalance] = useState(0);
  const [referralBalance, setReferralBalance] = useState(0);
  const [paymentNote, setPaymentNote] = useState("");
  const [emailInvite, setEmailInvite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

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
      .then((d) => {
        if (!d.success) return;
        setBalance(d.data.balance);
        setReferralBalance(d.data.referralBalance ?? 0);
      })
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
  const referralInsufficient = totalSell > referralBalance;
  const flags = variant ? variantFlags(variant) : null;
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
    REFERRAL_BALANCE: true,
  };
  const methodFallbackOrder = ["QRIS_GATEWAY", "QRIS_BRIDGE", "BANK_TRANSFER", "BALANCE"] as const;
  const paymentMethod = methodAvailable[selectedPaymentMethod]
    ? selectedPaymentMethod
    : methodFallbackOrder.find((m) => methodAvailable[m]) ?? selectedPaymentMethod;
  const noMethodUsable = !methodAvailable.QRIS_GATEWAY && !methodAvailable.QRIS_BRIDGE && !bankTransferEnabled && balanceInsufficient;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!variantId || !agreed) return;
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
      <div className="kr-page">
        <Navbar />
        <main className="flex-1 py-8"><CheckoutSkeleton /></main>
        <Footer />
      </div>
    );
  }

  if (!variantId) {
    return (
      <div className="kr-page">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="kr-fade-up flex flex-col items-center gap-4 text-center">
            <p className="text-base text-muted">Varian tidak ditemukan.</p>
            <Link href="/products" className={buttonClass()}>Pilih produk</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const methods: { id: PaymentMethod; show: boolean; disabled: boolean; Icon: LucideIcon; title: string; sub: string }[] = [
    { id: "QRIS_GATEWAY", show: qrisGatewayEnabled, disabled: qrisGatewayDisabled, Icon: QrCode, title: "QRIS", sub: "Scan dari e-wallet atau bank" },
    { id: "QRIS_BRIDGE", show: qrisBridgeEnabled, disabled: false, Icon: QrCode, title: "QRIS Instan", sub: "Bayar lewat halaman QRIS" },
    { id: "BANK_TRANSFER", show: bankTransferEnabled, disabled: false, Icon: Landmark, title: "Transfer Bank", sub: "Transfer sesuai nominal unik" },
    { id: "BALANCE", show: true, disabled: balanceInsufficient, Icon: Wallet, title: "Saldo", sub: `${formatPrice(balance)} tersedia` },
    {
      id: "REFERRAL_BALANCE",
      show: referralBalance > 0,
      disabled: referralInsufficient,
      Icon: Gift,
      title: "Saldo Referensi",
      sub: referralInsufficient
        ? `${formatPrice(referralBalance)} · kurang ${formatPrice(totalSell - referralBalance)}`
        : `${formatPrice(referralBalance)} tersedia`,
    },
  ];

  return (
    <div className="kr-page">
      <Navbar />
      <main className="flex-1 py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="kr-fade-in mb-6 flex items-center gap-2 text-[13px] text-muted">
          <Link href={`/products/${productId}`} className="hover:text-ink hover:underline">
            {product?.name ?? "Produk"}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-ink">Checkout</span>
        </nav>

        <h1 className="kr-fade-up mb-8 text-4xl font-bold tracking-[-1.5px] text-ink md:text-[56px] md:tracking-[-2.5px]">Checkout</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="kr-fade-up order-2 flex min-w-0 flex-1 flex-col gap-6 lg:order-none" style={{ animationDelay: "120ms" }}>
            <section className="flex flex-col gap-3" aria-labelledby="checkout-method">
              <h2 id="checkout-method" className="text-xl font-semibold text-ink">Metode pembayaran</h2>
              <div role="radiogroup" aria-labelledby="checkout-method" className="grid gap-3 sm:grid-cols-2">
                {methods.filter((m) => m.show).map((m) => {
                  const selected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={m.disabled}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`kr-press flex min-h-11 cursor-pointer flex-col items-start gap-3 rounded-[20px] bg-surface text-left hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-50 md:rounded-3xl ${
                        selected ? "border-2 border-ink p-[14px] md:p-[18px]" : "border border-hairline p-4 md:p-5"
                      }`}
                    >
                      <m.Icon size={24} aria-hidden="true" className="text-ink" />
                      <span>
                        <span className="block text-sm font-semibold text-ink">{m.title}</span>
                        <span className="block text-[13px] text-muted">{m.sub}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {qrisGatewayEnabled && qrisGatewayDisabled && (
                <p className="text-xs font-medium text-muted">
                  QRIS maksimal {formatPrice(QRIS_GATEWAY_MAX_AMOUNT)}{qrisBridgeEnabled ? ", gunakan QRIS Instan untuk nominal ini." : "."}
                </p>
              )}
              {paymentMethod === "BALANCE" && balanceInsufficient && (
                <p className="text-xs font-medium text-danger">
                  Saldo tidak cukup. <Link href="/dashboard/balance" className="font-semibold underline underline-offset-2">Top up saldo</Link>
                </p>
              )}
              {referralBalance > 0 && referralInsufficient && (
                <p className="rounded-[14px] bg-warn-bg px-3.5 py-2.5 text-[13px] font-medium text-warn">
                  Saldo referensi tidak cukup untuk pesanan ini. Pilih metode lain.
                </p>
              )}
              {noMethodUsable && (
                <p className="text-xs font-medium text-danger">
                  Tidak ada metode pembayaran yang tersedia saat ini. Hubungi admin.
                </p>
              )}
            </section>

            <div className="flex flex-col gap-2">
              <label htmlFor="checkout-quantity" className="text-[13px] font-semibold text-ink">
                Jumlah (unit){stock > 0 && <span className="ml-1 font-normal text-muted">· Stok: {stock}</span>}
              </label>
              <input
                id="checkout-quantity"
                type="number"
                min={1}
                max={stock || 100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                aria-invalid={stockExceeded}
                aria-describedby={outOfStock || stockExceeded ? "checkout-quantity-error" : undefined}
                className="kr-field"
              />
              {outOfStock && (
                <p id="checkout-quantity-error" className="text-xs font-medium text-danger">Stok habis. Produk ini tidak tersedia saat ini.</p>
              )}
              {stockExceeded && (
                <p id="checkout-quantity-error" className="text-xs font-medium text-danger">Jumlah melebihi stok tersedia ({stock} unit).</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="checkout-note" className="text-[13px] font-semibold text-ink">
                Catatan <span className="font-normal text-muted">(opsional)</span>
              </label>
              <textarea
                id="checkout-note"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="Informasi tambahan jika ada..."
                rows={2}
                className="kr-field h-auto resize-none py-3"
              />
            </div>

            {isInvite && (
              <div className="flex flex-col gap-2">
                <label htmlFor="checkout-invite" className="text-[13px] font-semibold text-ink">
                  Email invite <span className="font-normal text-danger">(wajib)</span>
                </label>
                <input
                  id="checkout-invite"
                  type="email"
                  value={emailInvite}
                  onChange={(e) => setEmailInvite(e.target.value)}
                  placeholder="nama@email.com"
                  aria-invalid={emailInviteMissing && Boolean(emailInvite)}
                  aria-describedby={emailInviteMissing && emailInvite ? "checkout-invite-error" : "checkout-invite-hint"}
                  className="kr-field"
                />
                <p id="checkout-invite-hint" className="text-[13px] text-muted">
                  Produk ini bertipe Invite. Akun akan dikirim ke email ini.
                </p>
                {emailInviteMissing && emailInvite && (
                  <p id="checkout-invite-error" className="text-xs font-medium text-danger">Format email tidak valid.</p>
                )}
              </div>
            )}

            {variant && (
              <section className="flex flex-col gap-3.5" aria-labelledby="checkout-terms">
                <h2 id="checkout-terms" className="text-xl font-semibold text-ink">Sebelum bayar</h2>
                <div className="flex flex-col gap-3 rounded-[20px] border border-hairline bg-surface p-4 md:rounded-3xl md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">Syarat varian ini</p>
                    <div className="flex flex-wrap gap-1.5">
                      {flags?.noWarranty && <Badge color="tertiary">No Garansi</Badge>}
                      {flags?.sharing && <Badge color="tertiary">Sharing</Badge>}
                      {flags?.po && <Badge color="tertiary">PO</Badge>}
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {variantPoints(variant).map((p) => {
                      const Icon = infoIcons[p.icon];
                      return (
                        <li key={p.key} className="flex gap-2.5 text-[13px] leading-[1.45] text-muted">
                          <Icon size={16} aria-hidden="true" className="mt-px shrink-0" />
                          <span><span className="font-semibold text-ink">{p.title}.</span> {p.desc}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <label
                  className={`flex cursor-pointer gap-3 rounded-[20px] p-4 md:rounded-3xl md:p-[18px] ${agreed ? "border-2 border-accent bg-accent/5" : "border border-line bg-surface"}`}
                >
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-[22px] shrink-0 cursor-pointer accent-[var(--kr-accent)]"
                  />
                  <span className="text-sm leading-[1.45] font-medium text-ink">{consentText(product?.name ?? "Produk", variant)}</span>
                </label>
                <div className="-mt-1 flex flex-wrap gap-x-4 px-1">
                  <Link href="/terms" target="_blank" className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-ink underline underline-offset-2">
                    <ScrollText size={14} aria-hidden="true" /> S&amp;K toko
                  </Link>
                  <Link href="/refund-calculator" target="_blank" className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-ink underline underline-offset-2">
                    <Calculator size={14} aria-hidden="true" /> Kalkulator refund
                  </Link>
                </div>
              </section>
            )}

            {error && (
              <div role="alert" className="kr-fade-in rounded-2xl bg-danger-bg px-4 py-3 text-[13px] font-medium text-danger">
                {error}
              </div>
            )}
            <ButtonPrimary
              type="submit"
              disabled={!agreed || loading || stockExceeded || outOfStock || emailInviteMissing || (paymentMethod === "BALANCE" && balanceInsufficient) || (paymentMethod === "REFERRAL_BALANCE" && referralInsufficient) || noMethodUsable}
              className="w-full"
              aria-describedby={agreed ? undefined : "checkout-agree-hint"}
            >
              {agreed ? <LockOpen size={16} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />}
              {loading ? "Memproses..." : outOfStock ? "Stok habis" : `Bayar ${formatPrice(totalSell)}`}
            </ButtonPrimary>
            <p id="checkout-agree-hint" className="-mt-3 text-center text-xs text-muted">
              {variant && !agreed ? "Centang pernyataan di atas untuk melanjutkan." : "Instruksi pembayaran akan ditampilkan setelah order dibuat."}
            </p>
          </div>

          <aside style={{ animationDelay: "60ms" }} className="kr-fade-up order-1 flex w-full flex-col gap-5 rounded-[28px] bg-surface p-5 shadow-card md:p-7 lg:order-none lg:w-[420px] lg:shrink-0">
            <h2 className="text-xl font-semibold text-ink">Ringkasan pesanan</h2>
            {variant && (
              <div className="flex items-center gap-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl">
                  <ProductImage name={product?.name ?? "Produk"} category={product?.category ?? ""} sizes="56px" iconSize={24} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink">{product?.name}</div>
                  <div className="text-[13px] text-muted">{variant.name} · {variant.duration} · {variant.type}</div>
                </div>
              </div>
            )}
            <dl className="flex flex-col gap-3 border-t border-hairline pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Harga</dt><dd className="font-semibold text-ink">{formatPrice(sellPrice)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Jumlah</dt><dd className="font-semibold text-ink">{quantity}</dd></div>
              <div className="flex items-baseline justify-between border-t border-hairline pt-3">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="text-2xl font-bold text-ink">{formatPrice(totalSell)}</dd>
              </div>
            </dl>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-card" />}>
      <CheckoutContent />
    </Suspense>
  );
}
