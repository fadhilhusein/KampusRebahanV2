"use client";

import { useEffect, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Sheet, formatPrice } from "@/components/admin/shared";

interface BalanceUser {
  id: string;
  name: string | null;
  email: string;
  balance: number;
}

const PRESETS = [10000, 25000, 50000, 100000];

export default function BalanceView() {
  const { addToast } = useToast();
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<BalanceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [target, setTarget] = useState<BalanceUser | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  // Debounced search; an empty query lists the newest users.
  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/admin/balance?q=${encodeURIComponent(q.trim())}`)
        .then((r) => r.json())
        .then((d) => d.success && setUsers(d.data))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [q, version]);

  function open(u: BalanceUser) {
    setAmount("");
    setNote("");
    setTarget(u);
  }

  async function submit() {
    if (!target || !amount) return;
    setBusy(true);
    const data = await fetch("/api/admin/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: target.id, amount, note: note.trim() || null }),
    })
      .then((r) => r.json())
      .catch(() => ({ success: false, message: "Terjadi kesalahan. Coba lagi." }));
    setBusy(false);
    addToast(data.message ?? (data.success ? "Tersimpan." : "Gagal."), data.success ? "success" : "error");
    if (data.success) {
      setTarget(null);
      setVersion((v) => v + 1);
    }
  }

  const valid = typeof amount === "number" && Number.isInteger(amount) && amount >= 1;

  return (
    <>
      <AdminHeader title="Saldo" subtitle="Tambahkan saldo ke akun pengguna secara manual. Tercatat di riwayat saldo mereka." />

      <div className="relative">
        <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Cari pengguna"
          placeholder="Cari email atau nama pengguna"
          className="kr-field min-h-12 pl-11 md:max-w-[480px]"
        />
      </div>

      {loading ? (
        <Skeleton className="h-48 w-full" radius="rounded-[24px]" />
      ) : users.length === 0 ? (
        <div className="rounded-[24px] bg-surface px-6 py-12 text-center text-sm font-medium text-muted shadow-card">Pengguna tidak ditemukan.</div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {users.map((u) => (
            <li key={u.id} className="flex flex-col gap-3 rounded-[24px] bg-surface p-4 shadow-card md:p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-pill">
                  <UserRound size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{u.name ?? u.email}</span>
                  {u.name && <span className="block truncate text-[13px] text-muted">{u.email}</span>}
                </span>
              </div>
              <div>
                <span className="block text-[13px] text-muted">Saldo saat ini</span>
                <span className="font-display text-[28px] font-bold leading-none tabular-nums tracking-[-1px]">{formatPrice(u.balance)}</span>
              </div>
              <button type="button" onClick={() => open(u)} className={`${buttonClass("primary")} min-h-12`}>
                Tambah saldo
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet
        key={target?.id ?? "none"}
        open={!!target}
        onClose={() => !busy && setTarget(null)}
        labelId="balance-sheet"
        title="Tambah saldo"
        subtitle={target && <span className="text-sm text-muted">{target.name ?? target.email}</span>}
      >
        {target && (
          <>
            <div className="rounded-[18px] bg-card px-4 py-3">
              <span className="block text-[13px] text-muted">Saldo saat ini</span>
              <span className="block font-display text-2xl font-bold tabular-nums">{formatPrice(target.balance)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="balance-amount" className="text-[13px] font-semibold">Nominal (Rp)</label>
              <input
                id="balance-amount"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Contoh: 50000"
                className="kr-field min-h-12"
              />
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`kr-press min-h-11 rounded-full px-4 text-sm font-semibold ${amount === p ? "bg-ink text-on-ink" : "bg-pill text-ink"}`}
                  >
                    {formatPrice(p)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="balance-note" className="text-[13px] font-semibold">Catatan (opsional)</label>
              <textarea
                id="balance-note"
                rows={3}
                maxLength={300}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: kompensasi pesanan gagal"
                className="min-h-[88px] resize-none rounded-[14px] border border-hairline bg-surface px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              />
              <p className="text-xs text-muted">Catatan terlihat oleh pengguna di riwayat saldo.</p>
            </div>
            {valid && (
              <p className="text-sm text-muted">
                Saldo menjadi <strong className="text-ink">{formatPrice(target.balance + amount)}</strong>. Tindakan ini tidak bisa dibatalkan.
              </p>
            )}
            <div className="flex flex-col gap-2">
              <button type="button" disabled={busy || !valid} onClick={submit} className={`${buttonClass("primary")} min-h-12 w-full`}>
                {busy ? "Memproses..." : "Tambah saldo"}
              </button>
              <button type="button" disabled={busy} onClick={() => setTarget(null)} className={`${buttonClass("secondary")} min-h-12 w-full`}>
                Batal
              </button>
            </div>
          </>
        )}
      </Sheet>
    </>
  );
}
