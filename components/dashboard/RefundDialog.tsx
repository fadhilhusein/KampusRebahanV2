"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingDown, TriangleAlert, Undo2, X } from "lucide-react";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import type { RefundPreview } from "@/lib/refundPreview";

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

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (orderId && !d.open) d.showModal();
    if (!orderId && d.open) d.close();
    if (!orderId) return;
    // Parent mounts a fresh dialog per order (key={orderId}), so state starts empty here.
    fetch(`/api/admin/reject?orderId=${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((d) => (d.success ? setPreview(d.data) : setError(d.message ?? "Gagal memuat rincian.")))
      .catch(() => setError("Gagal memuat rincian."));
  }, [orderId]);

  async function submit(refund: boolean) {
    if (!orderId) return;
    setBusy(refund ? "refund" : "reject");
    const data = await fetch("/api/admin/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, reason: reason.trim() || null, refund }),
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

        {error ? (
          <div role="alert" className="rounded-2xl bg-danger-bg px-4 py-3 text-[13px] font-medium text-danger">{error}</div>
        ) : !p ? (
          <Skeleton className="h-40 w-full" radius="rounded-[18px]" />
        ) : (
          <>
            <dl className="flex flex-col gap-2.5 rounded-[18px] bg-card p-4 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted">Dibayar</dt><dd className="font-semibold tabular-nums">{formatPrice(p.sellPrice)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Dikembalikan ke</dt><dd className="font-semibold">{walletLabel}</dd></div>
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

            {p.delivered && (
              <p className="rounded-[14px] bg-warn-bg px-3.5 py-2.5 text-[13px] font-medium text-warn">
                Pesanan ini sudah selesai dan akun dari supplier sudah terkirim. Refund tidak menarik akun dari supplier.
              </p>
            )}
            {!p.refundEligible && (
              <p className="rounded-[14px] bg-pill px-3.5 py-2.5 text-[13px] font-medium text-muted">
                Pesanan ini tidak bisa direfund (sudah direfund atau belum dibayar). Kamu tetap bisa menolaknya.
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
                  {busy === "refund" ? "Memproses..." : `Refund ${formatPrice(p.refundAmount)}`}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
