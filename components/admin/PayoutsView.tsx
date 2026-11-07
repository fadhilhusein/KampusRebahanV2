"use client";

import { useEffect, useState } from "react";
import { Copy, Landmark, Wallet } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import { payoutMethodLabel, payoutStatus } from "@/components/dashboard/AdminAffiliate";
import { AdminHeader, useAdminSummary } from "@/components/admin/AdminShell";
import { Sheet, copyText, formatDateTime, formatPrice } from "@/components/admin/shared";

interface Payout {
  id: string;
  amount: number;
  method: string;
  accountNumber: string;
  accountName: string;
  status: string;
  adminNote: string | null;
  processedAt: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const { addToast } = useToast();
  return (
    <button
      type="button"
      aria-label={`Salin ${label}`}
      onClick={async () => addToast((await copyText(value)) ? `${label} disalin.` : "Gagal menyalin.", "success")}
      className="kr-press flex size-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface"
    >
      <Copy size={17} aria-hidden="true" />
    </button>
  );
}

function Destination({ p }: { p: Payout }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-card px-4 py-3">
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[17px] font-semibold tracking-wide [overflow-wrap:anywhere]">{p.accountNumber}</span>
        <span className="block truncate text-[13px] text-muted">a.n. {p.accountName}</span>
      </span>
      <CopyButton value={p.accountNumber.replace(/\s/g, "")} label="Nomor akun" />
    </div>
  );
}

export default function PayoutsView() {
  const { addToast } = useToast();
  const { refresh: refreshSummary } = useAdminSummary();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"PENDING" | "DONE">("PENDING");
  const [version, setVersion] = useState(0);
  const [sheet, setSheet] = useState<{ payout: Payout; action: "PAID" | "REJECTED" } | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/payouts")
      .then((r) => r.json())
      .then((d) => d.success && setPayouts(d.data))
      .finally(() => setLoading(false));
  }, [version]);

  async function submit() {
    if (!sheet) return;
    setBusy(true);
    const data = await fetch("/api/admin/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sheet.payout.id, action: sheet.action, note: note.trim() || null }),
    })
      .then((r) => r.json())
      .catch(() => ({ success: false, message: "Terjadi kesalahan. Coba lagi." }));
    setBusy(false);
    addToast(data.message ?? (data.success ? "Tersimpan." : "Gagal."), data.success ? "success" : "error");
    setSheet(null);
    setVersion((v) => v + 1);
    refreshSummary();
  }

  const pending = payouts.filter((p) => p.status === "PENDING");
  const shown = tab === "PENDING" ? pending : payouts.filter((p) => p.status !== "PENDING");
  const pendingTotal = pending.reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <AdminHeader
        title="Pencairan"
        subtitle={loading ? undefined : pending.length ? `${pending.length} menunggu · total ${formatPrice(pendingTotal)}` : "Tidak ada pencairan yang menunggu"}
      />

      <div role="tablist" aria-label="Status pencairan" className="grid grid-cols-2 gap-1 rounded-full bg-pill p-1 md:w-[420px]">
        {([["PENDING", `Menunggu${pending.length ? ` · ${pending.length}` : ""}`], ["DONE", "Selesai"]] as const).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`kr-press min-h-11 rounded-full text-sm font-semibold ${tab === id ? "bg-surface text-ink shadow-card" : "text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton className="h-48 w-full" radius="rounded-[24px]" />
      ) : shown.length === 0 ? (
        <div className="rounded-[24px] bg-surface px-6 py-12 text-center text-sm font-medium text-muted shadow-card">
          {tab === "PENDING" ? "Tidak ada pencairan yang menunggu." : "Belum ada pencairan yang diproses."}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((p) => {
            const Icon = p.method === "BANK" ? Landmark : Wallet;
            return (
              <li key={p.id} className="flex flex-col gap-3 rounded-[24px] bg-surface p-4 shadow-card md:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-pill px-3 py-1.5 text-sm font-semibold">
                    <Icon size={15} aria-hidden="true" /> {payoutMethodLabel[p.method] ?? p.method}
                  </span>
                  <Badge color={payoutStatus[p.status]?.color}>{payoutStatus[p.status]?.label ?? p.status}</Badge>
                </div>
                <span className="font-display text-[34px] font-bold leading-none tabular-nums tracking-[-1px]">{formatPrice(p.amount)}</span>
                <Destination p={p} />
                <p className="text-xs text-muted">
                  {p.user.name ?? p.user.email} · diajukan {formatDateTime(p.createdAt)}
                  {p.processedAt ? ` · diproses ${formatDateTime(p.processedAt)}` : ""}
                  {p.adminNote ? ` · ${p.adminNote}` : ""}
                </p>
                {p.status === "PENDING" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => { setNote(""); setSheet({ payout: p, action: "REJECTED" }); }} className={`${buttonClass("danger")} min-h-12`}>
                      Tolak
                    </button>
                    <button type="button" onClick={() => { setNote(""); setSheet({ payout: p, action: "PAID" }); }} className={`${buttonClass("primary")} min-h-12`}>
                      Tandai dibayar
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {tab === "PENDING" && pending.length > 0 && (
        <p className="text-[13px] text-muted">Tandai dibayar setelah kamu transfer manual. Kalau ditolak, saldo referensi affiliate dikembalikan otomatis.</p>
      )}

      <Sheet
        key={sheet ? `${sheet.payout.id}-${sheet.action}` : "none"}
        open={!!sheet}
        onClose={() => !busy && setSheet(null)}
        labelId="payout-sheet"
        title={sheet?.action === "PAID" ? "Tandai sudah dibayar" : "Tolak pencairan"}
        subtitle={sheet && <span className="text-sm text-muted">{sheet.payout.user.name ?? sheet.payout.user.email}</span>}
      >
        {sheet && (
          <>
            {sheet.action === "PAID" ? (
              <>
                <div className="flex items-center gap-3 rounded-[18px] bg-card px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] text-muted">Nominal transfer</span>
                    <span className="block font-display text-2xl font-bold tabular-nums">{formatPrice(sheet.payout.amount)}</span>
                  </span>
                  <CopyButton value={String(sheet.payout.amount)} label="Nominal" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold">Ke {payoutMethodLabel[sheet.payout.method] ?? sheet.payout.method}</span>
                  <Destination p={sheet.payout} />
                </div>
                <p className="text-[13px] text-muted">Pastikan dana sudah kamu transfer. Tindakan ini tidak bisa dibatalkan.</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted">
                  {formatPrice(sheet.payout.amount)} akan dikembalikan ke saldo referensi affiliate.
                </p>
                <div className="flex flex-col gap-2">
                  <label htmlFor="payout-note" className="text-[13px] font-semibold">Alasan</label>
                  <textarea
                    id="payout-note"
                    rows={3}
                    maxLength={300}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Contoh: nomor akun tidak ditemukan"
                    className="min-h-[88px] resize-none rounded-[14px] border border-hairline bg-surface px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  />
                </div>
              </>
            )}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={submit}
                className={`${buttonClass(sheet.action === "PAID" ? "primary" : "danger")} min-h-12 w-full`}
              >
                {busy ? "Memproses..." : sheet.action === "PAID" ? "Sudah saya transfer" : "Tolak & kembalikan saldo"}
              </button>
              <button type="button" disabled={busy} onClick={() => setSheet(null)} className={`${buttonClass("secondary")} min-h-12 w-full`}>
                Batal
              </button>
            </div>
          </>
        )}
      </Sheet>
    </>
  );
}
