"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import CountUp from "@/components/dashboard/CountUp";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { payoutMethodLabel, payoutStatus } from "@/components/dashboard/AdminAffiliate";
import Badge from "@/components/ui/Badge";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

interface AffiliateData {
  code: string | null;
  balance: number;
  clicks: number;
  orders: number;
  totalEarned: number;
  percent: number;
  minPayout: number;
  commissions: { id: string; amount: number; status: string; createdAt: string; order: { productName: string; variantName: string } }[];
  payouts: { id: string; amount: number; method: string; status: string; createdAt: string; adminNote: string | null }[];
}

const cardClass = "rounded-[28px] bg-surface p-5 shadow-card md:p-7";
const METHODS = Object.keys(payoutMethodLabel);

export default function AffiliatePage() {
  const { addToast } = useToast();
  const [data, setData] = useState<AffiliateData | null>(null);
  const [version, setVersion] = useState(0);
  const [joining, setJoining] = useState(false);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [productId, setProductId] = useState("");
  const [copied, setCopied] = useState(false);

  const [method, setMethod] = useState("DANA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState("");

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => r.json())
      .then((d) => d.success && setData(d.data));
  }, [version]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return;
        setProducts(d.data.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })));
      });
  }, []);

  async function join() {
    setJoining(true);
    const d = await fetch("/api/referral", { method: "POST" }).then((r) => r.json()).catch(() => null);
    setJoining(false);
    if (d?.success) {
      addToast("Kamu sudah bergabung. Bagikan link pertamamu!", "success");
      setVersion((v) => v + 1);
    } else addToast(d?.message ?? "Gagal bergabung, coba lagi.", "error");
  }

  // Only rendered after the client-side fetch, so window is always defined here.
  const link = data?.code ? `${window.location.origin}${productId ? `/products/${productId}` : "/"}?ref=${data.code}` : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      addToast("Gagal menyalin, salin manual dari kolom link.", "error");
    }
  }

  async function requestPayout(e: React.FormEvent) {
    e.preventDefault();
    setPayoutError("");
    setPayoutLoading(true);
    const d = await fetch("/api/referral/payout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, accountNumber, accountName, amount: Number(amount) }),
    })
      .then((r) => r.json())
      .catch(() => ({ success: false, message: "Terjadi kesalahan. Coba lagi." }));
    setPayoutLoading(false);
    if (d.success) {
      addToast("Permintaan pencairan terkirim.", "success");
      setAmount("");
      setVersion((v) => v + 1);
    } else setPayoutError(d.message ?? "Gagal mengajukan pencairan.");
  }

  const header = <DashboardHeader title="Afiliasi" subtitle="Bagikan link produk, dapat komisi dari setiap pembelian." />;

  if (!data) {
    return (
      <div className="flex flex-col gap-5 md:gap-7">
        {header}
        <Skeleton className="kr-shimmer h-64 w-full" radius="rounded-[28px]" />
      </div>
    );
  }

  if (!data.code) {
    const steps = [
      ["Gabung dan dapat kode", "Kode unik langsung aktif, gratis."],
      ["Bagikan link produk", "Salin link produk mana pun yang memuat kode kamu."],
      [`Terima komisi ${data.percent}%`, "Masuk ke saldo referensi saat pesanan teman selesai."],
    ];
    return (
      <div className="flex flex-col gap-5 md:gap-7">
        {header}
        <Reveal onMount stagger={0.06} className="flex flex-col gap-4 md:gap-6 lg:flex-row">
          <RevealItem className={`${cardClass} flex min-w-0 flex-1 flex-col gap-5 md:gap-6 md:p-10`}>
            <h2 className="font-display text-[26px] font-bold leading-[1.1] tracking-[-1px] md:text-[40px] md:tracking-[-1.5px]">
              Ajak teman belanja, dapat komisi.
            </h2>
            <ol className="flex flex-col gap-4">
              {steps.map(([title, desc], i) => (
                <li key={title} className="flex gap-3.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pill text-[13px] font-bold">{i + 1}</span>
                  <span>
                    <span className="block text-[15px] font-semibold">{title}</span>
                    <span className="block text-[13px] text-muted">{desc}</span>
                  </span>
                </li>
              ))}
            </ol>
            <ButtonPrimary onClick={join} disabled={joining} className="w-full md:w-fit">
              <Share2 size={16} aria-hidden="true" />
              {joining ? "Memproses..." : "Gabung program afiliasi"}
            </ButtonPrimary>
            <p className="text-xs text-muted">Pembelian oleh akun kamu sendiri tidak dihitung. Link berlaku 30 hari sejak diklik.</p>
          </RevealItem>
          <RevealItem className="flex flex-col gap-2.5 rounded-[28px] bg-ink p-6 text-on-ink shadow-card md:p-7 lg:w-[420px] lg:shrink-0">
            <span className="text-sm font-medium text-on-ink-muted">Contoh komisi</span>
            <span className="font-display text-4xl font-bold leading-none tracking-[-2px] md:text-[56px]">
              {formatPrice(Math.floor((45000 * data.percent) / 100))}
            </span>
            <p className="text-[13px] leading-relaxed text-on-ink-muted">
              dari 1 pembelian Rp45.000 lewat link kamu. Bisa dipakai belanja atau dicairkan ke DANA, OVO, GoPay, ShopeePay, atau bank.
            </p>
          </RevealItem>
        </Reveal>
      </div>
    );
  }

  const stats = [
    ["Klik link", data.clicks.toLocaleString("id-ID"), "dari semua link kamu"],
    ["Pesanan berhasil", data.orders.toLocaleString("id-ID"), "lewat link kamu"],
    ["Total komisi", formatPrice(data.totalEarned), "sejak bergabung"],
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      {header}

      <Reveal onMount stagger={0.06} className="flex flex-col gap-4 md:gap-6 lg:flex-row">
        <RevealItem className="flex flex-col justify-center gap-2 rounded-[28px] bg-ink p-6 text-on-ink shadow-card md:gap-4 md:p-7 lg:w-[420px] lg:shrink-0">
          <span className="text-sm font-medium text-on-ink-muted">Saldo referensi</span>
          <span className="font-display text-4xl font-bold leading-none [overflow-wrap:anywhere] md:text-[56px]">
            <CountUp value={data.balance} format={formatPrice} />
          </span>
          <p className="hidden text-[13px] leading-relaxed text-on-ink-muted md:block">
            Pakai untuk belanja di checkout, atau cairkan ke e-wallet/bank.
          </p>
        </RevealItem>

        <RevealItem className={`${cardClass} flex min-w-0 flex-1 flex-col gap-4`}>
          <h2 className="text-lg font-semibold md:text-xl">Link afiliasi kamu</h2>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <span className="flex items-center gap-2.5 rounded-[14px] bg-pill px-4 py-3">
              <span className="text-xs font-semibold text-muted">Kode</span>
              <span className="font-display text-lg font-bold tracking-[1px]">{data.code}</span>
            </span>
            <p className="text-[13px] text-muted">Komisi {data.percent}% dari total pembelian, masuk saat pesanan selesai.</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex flex-col gap-2 md:w-60">
              <label htmlFor="aff-product" className="text-[13px] font-semibold">Produk</label>
              <select id="aff-product" value={productId} onChange={(e) => setProductId(e.target.value)} className="kr-field">
                <option value="">Beranda (semua produk)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label htmlFor="aff-link" className="text-[13px] font-semibold">Link untuk dibagikan</label>
              <input id="aff-link" readOnly value={link} onFocus={(e) => e.currentTarget.select()} className="kr-field truncate" />
            </div>
            <ButtonPrimary type="button" onClick={copyLink} className="w-full md:w-auto">
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              <span aria-live="polite">{copied ? "Tersalin" : "Salin link"}</span>
            </ButtonPrimary>
          </div>
        </RevealItem>
      </Reveal>

      <div className="grid grid-cols-3 gap-2 md:gap-6">
        {stats.map(([label, value, hint]) => (
          <div key={label} className="flex min-w-0 flex-col gap-1 rounded-[18px] bg-surface p-3.5 shadow-card md:rounded-[24px] md:p-6">
            <span className="text-xs font-semibold text-muted md:text-[13px]">{label}</span>
            <span className="truncate font-display text-xl font-bold tracking-[-0.5px] md:text-[32px] md:tracking-[-1px]">{value}</span>
            <span className="hidden text-xs text-muted md:block">{hint}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-start">
        <section className="order-2 flex min-w-0 flex-1 flex-col gap-4 lg:order-none" aria-labelledby="aff-history">
          <h2 id="aff-history" className="text-xl font-semibold md:text-2xl">Riwayat komisi</h2>
          {data.commissions.length === 0 ? (
            <div className="rounded-[24px] bg-surface px-6 py-10 text-center text-sm font-medium text-muted shadow-card">
              Belum ada komisi. Bagikan link kamu untuk mulai.
            </div>
          ) : (
            <ul className="flex flex-col overflow-hidden rounded-[24px] bg-surface p-2 shadow-card">
              {data.commissions.map((c) => (
                <li key={c.id} className="flex items-center gap-3 border-t border-hairline px-4 py-3.5 first:border-t-0">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{c.order.productName} · {c.order.variantName}</span>
                    <span className="block text-xs text-muted">{formatDate(c.createdAt)}</span>
                  </span>
                  <Badge color={c.status === "CREDITED" ? "secondary" : "primary"}>{c.status === "CREDITED" ? "Masuk" : "Ditarik"}</Badge>
                  <span className={`w-24 text-right text-sm font-semibold tabular-nums ${c.status === "CREDITED" ? "" : "text-muted line-through"}`}>
                    +{formatPrice(c.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${cardClass} flex flex-col gap-4 lg:w-[420px] lg:shrink-0`} aria-labelledby="aff-payout">
          <h2 id="aff-payout" className="text-lg font-semibold md:text-xl">Cairkan saldo</h2>
          <form onSubmit={requestPayout} className="flex flex-col gap-4">
            <div role="radiogroup" aria-label="Metode pencairan" className="grid grid-cols-3 gap-1.5 md:grid-cols-5">
              {METHODS.map((m) => (
                <button key={m} type="button" role="radio" aria-checked={method === m} onClick={() => setMethod(m)}
                  className={`kr-chip kr-press px-1 text-xs ${method === m ? "!bg-ink !text-on-ink" : ""}`}>
                  {payoutMethodLabel[m]}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="aff-number" className="text-[13px] font-semibold">{method === "BANK" ? "Bank dan nomor rekening" : "Nomor akun"}</label>
              <input id="aff-number" required inputMode="numeric" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="0812 3456 7890" className="kr-field" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="aff-name" className="text-[13px] font-semibold">Nama pemilik</label>
              <input id="aff-name" required value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Sesuai nama di akun" className="kr-field" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="aff-amount" className="text-[13px] font-semibold">Nominal</label>
              <input id="aff-amount" required type="number" min={data.minPayout} max={data.balance} value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder={String(data.minPayout)} aria-invalid={payoutError ? true : undefined}
                aria-describedby="aff-payout-hint" className="kr-field" />
              <p id="aff-payout-hint" className="text-xs text-muted">Minimal {formatPrice(data.minPayout)}. Diproses admin maks. 2×24 jam.</p>
            </div>
            {payoutError && (
              <div role="alert" className="rounded-2xl bg-danger-bg px-4 py-3 text-[13px] font-medium text-danger">{payoutError}</div>
            )}
            <ButtonPrimary type="submit" disabled={payoutLoading || data.balance < data.minPayout} className="w-full">
              {payoutLoading ? "Memproses..." : "Ajukan pencairan"}
            </ButtonPrimary>
          </form>

          {data.payouts.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-hairline pt-4">
              <h3 className="text-[13px] font-semibold">Riwayat pencairan</h3>
              <ul className="flex flex-col gap-3">
                {data.payouts.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{formatPrice(p.amount)} · {payoutMethodLabel[p.method] ?? p.method}</span>
                      <span className="block truncate text-xs text-muted">{formatDate(p.createdAt)}{p.adminNote ? ` · ${p.adminNote}` : ""}</span>
                    </span>
                    <Badge color={payoutStatus[p.status]?.color}>{p.status === "PENDING" ? "Diproses" : payoutStatus[p.status]?.label}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
