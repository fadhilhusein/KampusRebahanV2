"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, SlidersHorizontal, ArrowRight } from "lucide-react";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { REFUND_PAYMENT_METHODS, REFUND_SERVICE_FEE_PERCENT } from "@/lib/refundCalc";

type Estimate = {
  productName: string;
  variantName: string;
  price: number;
  paymentMethod: string;
  warranty: string;
} & (
  | { eligible: true; kind: "UNDELIVERED" | "USED"; warrantyDays: number | null; usedDays: number; remainingDays: number; gross: number; opFee: number; amount: number }
  | { eligible: false; reason: string; eligibleAt?: string }
);

const rupiah = (n: number) => n.toLocaleString("id-ID");
const todayWib = () => new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10);
const dateTime = (iso: string) => new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function InvoiceCheck() {
  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ message: string; login?: boolean } | null>(null);
  const [result, setResult] = useState<Estimate | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!invoice.trim()) {
      setError({ message: "Nomor invoice wajib diisi." });
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    const qs = new URLSearchParams({ invoice: invoice.trim() });
    if (date) qs.set("date", date);
    try {
      const res = await fetch(`/api/refund-estimate?${qs}`);
      const data = await res.json();
      if (data.success) setResult(data.data);
      else setError({ message: data.message ?? "Gagal menghitung estimasi.", login: res.status === 401 });
    } catch {
      setError({ message: "Terjadi kesalahan. Coba lagi." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="invoice-title" className="kr-fade-up flex flex-col gap-5 rounded-[28px] bg-surface p-5 shadow-card md:p-7" style={{ animationDelay: "60ms" }}>
      <h2 id="invoice-title" className="text-xl font-semibold">Cek dari invoice</h2>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="invoice" className="text-[13px] font-semibold">Nomor invoice</label>
          <input
            id="invoice"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            placeholder="Contoh: cmw6t5wl00001ocran37wvdgt"
            autoComplete="off"
            spellCheck={false}
            aria-describedby="invoice-hint"
            className="kr-field min-h-12 font-mono"
          />
          <span id="invoice-hint" className="text-xs text-muted">Ada di halaman detail pesanan, setelah tanda #.</span>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="issue-date" className="text-[13px] font-semibold">
            Tanggal error / kendala <span className="font-normal text-muted">(opsional)</span>
          </label>
          <input
            id="issue-date"
            type="date"
            max={todayWib()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-describedby="issue-date-hint"
            className="kr-field min-h-12"
          />
          <span id="issue-date-hint" className="text-xs text-muted">
            Kosongkan jika kendala terjadi hari ini. Isi jika kendalanya sudah terjadi sebelumnya, karena estimasi dihitung sampai tanggal itu.
          </span>
        </div>
        <button type="submit" disabled={busy} className={`${buttonClass()} kr-press min-h-12 w-full`}>
          <Calculator size={16} aria-hidden="true" /> {busy ? "Menghitung..." : "Cek estimasi refund"}
        </button>
      </form>

      <div aria-live="polite" className="flex flex-col gap-3 empty:hidden">
        {error && (
          <div role="alert" className="rounded-2xl bg-danger-bg px-4 py-3 text-[13px] font-medium text-danger">
            {error.message}{" "}
            {error.login && (
              <Link href="/auth/signin?callbackUrl=/refund-calculator" className="font-semibold underline underline-offset-2">
                Login
              </Link>
            )}
          </div>
        )}

        {result && (
          <>
            <div className="rounded-[18px] bg-card px-4 py-3">
              <span className="block truncate text-[15px] font-semibold">{result.productName} · {result.variantName}</span>
              <span className="block text-[13px] text-muted">
                Harga beli Rp{rupiah(result.price)} · garansi {result.warranty} · dibayar via{" "}
                {REFUND_PAYMENT_METHODS[result.paymentMethod as keyof typeof REFUND_PAYMENT_METHODS] ?? result.paymentMethod}
              </span>
            </div>
            {result.eligible ? (
              <div className="flex flex-col gap-1 rounded-[22px] bg-ink p-5 text-on-ink md:p-6">
                <span className="text-sm font-medium text-on-ink-muted">
                  {result.kind === "UNDELIVERED" ? "Estimasi refund · belum terkirim lebih dari 48 jam" : `Estimasi refund · terpakai ${result.usedDays} hari`}
                </span>
                <span className="font-display text-4xl font-bold tabular-nums [overflow-wrap:anywhere] md:text-5xl">Rp{rupiah(result.amount)}</span>
                <span className="text-[13px] tabular-nums text-on-ink-muted">
                  {result.warrantyDays
                    ? `${rupiah(result.price)} × ${result.remainingDays}/${result.warrantyDays} × ${100 - REFUND_SERVICE_FEE_PERCENT}%`
                    : `${rupiah(result.price)} × ${100 - REFUND_SERVICE_FEE_PERCENT}%`}
                  {result.opFee > 0 && ` − biaya operasional ${rupiah(result.opFee)}`}
                </span>
              </div>
            ) : (
              <div className="rounded-[22px] bg-pill p-5 md:p-6">
                <span className="block text-sm font-medium text-muted">Estimasi refund</span>
                <span className="block font-display text-4xl font-bold tabular-nums">Rp0</span>
                <span className="mt-1 block text-[13px] text-muted">
                  {result.reason}
                  {result.eligibleAt ? ` Bisa diajukan mulai ${dateTime(result.eligibleAt)}.` : ""}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <a href="#simulasi" className="kr-press inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold">
        <SlidersHorizontal size={16} aria-hidden="true" /> Coba simulasinya dulu <ArrowRight size={14} aria-hidden="true" />
      </a>
    </section>
  );
}
