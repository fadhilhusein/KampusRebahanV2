"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingDown, TriangleAlert, Undo2, X } from "lucide-react";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import type { RefundPreview } from "@/lib/refundPreview";
import { REFUND_SERVICE_FEE_PERCENT } from "@/lib/refundCalc";

const todayWib = () => new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10);

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

/**
 * Confirms a reject or refund for one order. Shows the server's dry-run of what will happen
 * (wallet, Gemini deduction, coupon, commission, loyalty progress) before the admin commits.
 */
export default function RefundDialog({
  orderId,
  onClose,
  onDone,
}: {
  orderId: string | null;
  onClose: () => void;
  onDone: (result: { ok: boolean; text: string }) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<RefundPreview | null>(null);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<"refund" | "reject" | null>(null);
  // Issue date and warranty override feed the S&K formula; "" means today / the supplier's warranty.
  const [date, setDate] = useState("");
  const [warranty, setWarranty] = useState("");
  // BALANCE credits the customer's wallet; MANUAL only records a payout the admin made themselves.
  const [method, setMethod] = useState<"BALANCE" | "MANUAL">("BALANCE");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (orderId && !d.open) d.showModal();
    if (!orderId && d.open) d.close();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    // Parent mounts a fresh dialog per order (key={orderId}), so state starts empty here.
    const qs = new URLSearchParams({ orderId });
    if (date) qs.set("date", date);
    if (warranty !== "") qs.set("warranty", warranty);
    let cancelled = false;
    const t = setTimeout(() => {
      fetch(`/api/admin/reject?${qs}`)
        .then((r) => r.json())
        .then((d) => {
          if (cancelled) return;
          if (d.success) {
            setPreview(d.data);
            setError("");
          } else setError(d.message ?? "Gagal memuat rincian.");
        })
        .catch(() => !cancelled && setError("Gagal memuat rincian."));
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [orderId, date, warranty]);

  async function submit(refund: boolean) {
    if (!orderId) return;
    setBusy(refund ? "refund" : "reject");
    const data = await fetch("/api/admin/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, reason: reason.trim() || null, refund, date: date || null, warranty: warranty === "" ? null : warranty, method }),
    })
      .then((r) => r.json())
      .catch(() => ({ success: false, message: "Terjadi kesalahan. Coba lagi." }));
    setBusy(null);
    onDone({ ok: !!data.success, text: data.message ?? (data.success ? "Berhasil." : "Gagal.") });
    if (data.success) ref.current?.close();
  }

  const p = preview;
  const walletLabel = p?.wallet === "REFERRAL" ? "Saldo referensi" : "Saldo";

  return (
    <dialog
      ref={ref}
      aria-labelledby="refund-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && !busy && ref.current?.close()}
      className="kr-fade-up m-auto w-[min(520px,calc(100%-32px))] max-w-none rounded-[28px] bg-surface p-0 text-ink shadow-[0_24px_64px_rgba(17,18,19,0.25)] backdrop:bg-[#111113]/65 max-md:mb-0 max-md:w-full max-md:rounded-b-none"
    >
      <div className="flex flex-col gap-5 p-5 pb-8 md:p-7">
        <div aria-hidden="true" className="mx-auto -mt-1 h-1 w-10 rounded-full bg-hairline md:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="refund-title" className="font-display text-[22px] font-bold tracking-[-0.6px] md:text-2xl">Refund pesanan</h2>
            {p && <p className="truncate text-sm text-muted">{p.productName} · {p.variantName} · {p.customer}</p>}
          </div>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Tutup" className="kr-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pill">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {error && <div role="alert" className="rounded-2xl bg-danger-bg px-4 py-3 text-[13px] font-medium text-danger">{error}</div>}
        {!p ? (
          !error && <Skeleton className="h-40 w-full" radius="rounded-[18px]" />
        ) : (
          <>
            {p.refundEligible || p.notEligibleReason ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="refund-date" className="text-[13px] font-semibold">Tanggal kendala</label>
                  <input id="refund-date" type="date" max={todayWib()} value={date} onChange={(e) => setDate(e.target.value)} className="kr-field min-h-11" />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="refund-warranty" className="text-[13px] font-semibold">Masa garansi (hari)</label>
                  <input
                    id="refund-warranty"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={warranty}
                    placeholder={p.warrantyDays ? String(p.warrantyDays) : p.warrantyKnown ? "0" : "?"}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="kr-field min-h-11"
                  />
                </div>
                <p className="col-span-2 -mt-1 text-xs text-muted">
                  Kosongkan tanggal untuk hari ini. Garansi dari supplier: {p.warrantyKnown ? (p.warrantyText ?? "-") : "tidak tersedia"}. Isi 0 untuk tanpa garansi.
                </p>
              </div>
            ) : null}

            <dl className="flex flex-col gap-2.5 rounded-[18px] bg-card p-4 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted">Dibayar</dt><dd className="font-semibold tabular-nums">{formatPrice(p.sellPrice)}</dd></div>
              {p.refundEligible && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">
                    {p.warrantyDays ? `× ${p.remainingDays}/${p.warrantyDays} hari × ${100 - REFUND_SERVICE_FEE_PERCENT}%` : `× ${100 - REFUND_SERVICE_FEE_PERCENT}% (belum terkirim)`}
                  </dt>
                  <dd className="font-semibold tabular-nums">{formatPrice(p.gross)}</dd>
                </div>
              )}
              {p.opFee > 0 && (
                <div className="flex justify-between gap-3"><dt className="text-muted">Biaya operasional (QRIS Instan)</dt><dd className="font-semibold tabular-nums text-danger">-{formatPrice(p.opFee)}</dd></div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Dikembalikan ke</dt>
                <dd className="font-semibold">{method === "MANUAL" ? "Manual (e-wallet / bank)" : walletLabel}</dd>
              </div>
              {p.withheld > 0 && (
                <div className="flex justify-between gap-3"><dt className="text-muted">Potongan hadiah Gemini AI Pro</dt><dd className="font-semibold tabular-nums text-danger">-{formatPrice(p.withheld)}</dd></div>
              )}
              <div className="flex justify-between gap-3 border-t border-hairline pt-2.5"><dt className="font-semibold">Total refund</dt><dd className="font-display text-lg font-bold tabular-nums">{formatPrice(p.refundAmount)}</dd></div>
            </dl>

            {(p.couponEffect || p.commission || p.progressAfter !== p.progressBefore) && (
              <ul className="flex flex-col gap-2.5 text-[13px]">
                {p.couponEffect === "DEDUCT" && (
                  <li className="flex gap-2.5"><TriangleAlert size={16} aria-hidden="true" className="mt-px shrink-0 text-warn" />Kupon Gemini AI Pro sudah ditukar, nilai hadiah dipotong dari refund.</li>
                )}
                {p.couponEffect === "REVOKE" && (
                  <li className="flex gap-2.5"><TriangleAlert size={16} aria-hidden="true" className="mt-px shrink-0 text-warn" />Kupon Gemini AI Pro user belum ditukar dan akan dicabut.</li>
                )}
                {p.commission && (
                  <li className="flex gap-2.5"><Undo2 size={16} aria-hidden="true" className="mt-px shrink-0 text-muted" />Komisi afiliasi {formatPrice(p.commission.amount)}{p.commission.referrerCode ? ` ke affiliate ${p.commission.referrerCode}` : ""} ditarik.</li>
                )}
                {p.progressAfter !== p.progressBefore && (
                  <li className="flex gap-2.5"><TrendingDown size={16} aria-hidden="true" className="mt-px shrink-0 text-muted" />Progres kupon user turun ke {formatPrice(p.progressAfter)} / {formatPrice(p.threshold)}.</li>
                )}
              </ul>
            )}

            {p.refundEligible && (
              <div className="flex flex-col gap-2">
                <span id="refund-method" className="text-[13px] font-semibold">Cara refund</span>
                <div role="group" aria-labelledby="refund-method" className="grid grid-cols-2 gap-2">
                  {([["BALANCE", walletLabel], ["MANUAL", "Manual (e-wallet / bank)"]] as const).map(([id, label]) => (
                    <button key={id} type="button" aria-pressed={method === id} onClick={() => setMethod(id)} className="kr-chip kr-press px-2 text-[13px]">
                      {label}
                    </button>
                  ))}
                </div>
                {method === "MANUAL" && (
                  <p className="rounded-[14px] bg-warn-bg px-3.5 py-2.5 text-[13px] font-medium text-warn">
                    Transfer {formatPrice(p.refundAmount)} ke e-wallet / rekening user sendiri dulu. Tombol ini hanya mencatat refund, saldo user tidak bertambah. Tulis tujuan transfer di Alasan.
                  </p>
                )}
              </div>
            )}

            {p.delivered && (
              <p className="rounded-[14px] bg-warn-bg px-3.5 py-2.5 text-[13px] font-medium text-warn">
                Pesanan ini sudah selesai dan akun dari supplier sudah terkirim. Refund tidak menarik akun dari supplier.
              </p>
            )}
            {!p.refundEligible && (
              <p className="rounded-[14px] bg-pill px-3.5 py-2.5 text-[13px] font-medium text-muted">
                {p.notEligibleReason ?? "Pesanan ini tidak bisa direfund (sudah direfund atau belum dibayar)."} Kamu tetap bisa menolaknya.
              </p>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="refund-reason" className="text-[13px] font-semibold">Alasan</label>
              <textarea
                id="refund-reason"
                rows={3}
                maxLength={300}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: akun tidak bisa login, sudah dicek admin"
                className="min-h-[88px] resize-none rounded-[14px] border border-hairline bg-surface px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              />
            </div>

            <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
              <button type="button" onClick={() => ref.current?.close()} disabled={!!busy} className={`${buttonClass("secondary")} max-md:w-full`}>Batal</button>
              <button type="button" onClick={() => submit(false)} disabled={!!busy} className={`${buttonClass("secondary")} max-md:w-full`}>
                {busy === "reject" ? "Memproses..." : "Tolak tanpa refund"}
              </button>
              {p.refundEligible && (
                <button type="button" onClick={() => submit(true)} disabled={!!busy} className={`${buttonClass("danger")} max-md:w-full`}>
                  {busy === "refund" ? "Memproses..." : method === "MANUAL" ? `Tandai sudah ditransfer ${formatPrice(p.refundAmount)}` : `Refund ${formatPrice(p.refundAmount)} ke ${walletLabel.toLowerCase()}`}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
