"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";

const fieldClass = "rounded-xl bg-card px-4 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export const payoutMethodLabel: Record<string, string> = {
  DANA: "DANA",
  OVO: "OVO",
  GOPAY: "GoPay",
  SHOPEEPAY: "ShopeePay",
  BANK: "Bank",
};

export const payoutStatus: Record<string, { label: string; color: "primary" | "secondary" | "tertiary" }> = {
  PENDING: { label: "Menunggu", color: "tertiary" },
  PAID: { label: "Dibayar", color: "secondary" },
  REJECTED: { label: "Ditolak", color: "primary" },
};

/** Commission % and minimum payout, saved together. */
export function AffiliateSettingsForm() {
  const [percent, setPercent] = useState<number | "">("");
  const [minPayout, setMinPayout] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return;
        setPercent(d.data.referral_commission_percent);
        setMinPayout(d.data.referral_min_payout);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referral_commission_percent: Number(percent), referral_min_payout: Number(minPayout) }),
    });
    const data = await res.json();
    setMsg({ ok: data.success, text: data.message ?? (data.success ? "Tersimpan" : "Gagal") });
    setSaving(false);
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-2 border-t border-hairline pt-4">
      <label htmlFor="ref-percent" className="text-sm font-semibold">Komisi afiliasi (%)</label>
      <input id="ref-percent" type="number" min={0} max={50} step={0.1} value={percent} placeholder="5"
        onChange={(e) => setPercent(e.target.value === "" ? "" : Number(e.target.value))} className={fieldClass} />
      <label htmlFor="ref-min" className="mt-2 text-sm font-semibold">Minimum pencairan (Rp)</label>
      <input id="ref-min" type="number" min={10000} step={1000} value={minPayout} placeholder="50000"
        onChange={(e) => setMinPayout(e.target.value === "" ? "" : Number(e.target.value))} className={fieldClass} />
      <p className="text-[13px] text-muted">Komisi dihitung dari total pembelian, dibatasi margin toko.</p>
      <button type="submit" disabled={saving} className={`${buttonClass("primary")} w-full`}>
        {saving ? "..." : "Simpan pengaturan afiliasi"}
      </button>
      {msg && (
        <div key={msg.text} role={msg.ok ? "status" : "alert"} className={`kr-fade-in text-[13px] font-medium ${msg.ok ? "text-success" : "text-danger"}`}>
          {msg.text}
        </div>
      )}
    </form>
  );
}

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

export function AdminPayouts() {
  const { addToast } = useToast();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    fetch("/api/admin/payouts")
      .then((r) => r.json())
      .then((d) => d.success && setPayouts(d.data))
      .finally(() => setLoading(false));
  }, [version]);

  async function process(p: Payout, action: "PAID" | "REJECTED") {
    let note: string | null = null;
    if (action === "REJECTED") {
      note = window.prompt("Alasan penolakan (opsional):");
      if (note === null) return;
    } else if (!window.confirm(`Sudah transfer ${formatPrice(p.amount)} ke ${payoutMethodLabel[p.method] ?? p.method} ${p.accountNumber}?`)) {
      return;
    }
    setBusy(p.id);
    const res = await fetch("/api/admin/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, action, note }),
    });
    const data = await res.json();
    addToast(data.message ?? (data.success ? "Tersimpan" : "Gagal"), data.success ? "success" : "error");
    setBusy(null);
    setVersion((v) => v + 1);
  }

  const pending = payouts.filter((p) => p.status === "PENDING").length;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold md:text-2xl">Permintaan pencairan</h2>
        {pending > 0 && <Badge color="tertiary">{pending} menunggu</Badge>}
      </div>

      {loading ? (
        <Skeleton className="h-28 w-full" radius="rounded-[22px]" />
      ) : payouts.length === 0 ? (
        <div className="py-10 text-center text-sm font-medium text-muted">Belum ada permintaan pencairan.</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {payouts.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 rounded-[22px] bg-surface p-4 shadow-card md:flex-row md:items-center md:gap-6 md:px-6">
              <div className="min-w-0 md:flex-1">
                <div className="truncate text-sm font-semibold">{p.user.name ?? p.user.email}</div>
                <div className="truncate text-xs text-muted">{p.user.email} · {formatDate(p.createdAt)}</div>
              </div>
              <div className="min-w-0 rounded-xl bg-card px-3 py-2 md:w-[260px] md:bg-transparent md:p-0">
                <div className="truncate text-[13px] font-semibold">{payoutMethodLabel[p.method] ?? p.method} · {p.accountNumber}</div>
                <div className="truncate text-xs text-muted">a.n. {p.accountName}</div>
              </div>
              <div className="flex items-center justify-between gap-3 md:w-[220px]">
                <span className="font-display text-lg font-bold tabular-nums md:text-base">{formatPrice(p.amount)}</span>
                <Badge color={payoutStatus[p.status]?.color}>{payoutStatus[p.status]?.label ?? p.status}</Badge>
              </div>
              <div className="flex gap-2 md:w-[230px] md:justify-end">
                {p.status === "PENDING" ? (
                  <>
                    <button disabled={busy === p.id} onClick={() => process(p, "PAID")} className={`${buttonClass("primary", "sm")} kr-press flex-1 md:flex-none`}>
                      Tandai dibayar
                    </button>
                    <button disabled={busy === p.id} onClick={() => process(p, "REJECTED")} className={`${buttonClass("danger", "sm")} kr-press`}>
                      Tolak
                    </button>
                  </>
                ) : (
                  <span className="text-[13px] text-muted">
                    {p.processedAt ? `Diproses ${formatDate(p.processedAt)}` : ""}
                    {p.adminNote ? ` · ${p.adminNote}` : ""}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
