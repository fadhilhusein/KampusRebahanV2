"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import { AdminHeader } from "@/components/admin/AdminShell";

interface Settings {
  markup_percent: number;
  bank_transfer_enabled: boolean;
  qris_gateway_enabled: boolean;
  qris_bridge_enabled: boolean;
  referral_commission_percent: number;
  referral_min_payout: number;
  topup_qris_gateway_enabled: boolean;
  topup_qris_bridge_enabled: boolean;
}

const methods = [
  ["bank_transfer_enabled", "Transfer bank", "Dikonfirmasi manual oleh admin"],
  ["qris_gateway_enabled", "QRIS Bayar.gg", "Terverifikasi otomatis"],
  ["qris_bridge_enabled", "QRIS Instan (Bridge)", "Terverifikasi otomatis"],
] as const;

const topupMethods = [
  ["topup_qris_gateway_enabled", "QRIS Bayar.gg", "QR tampil di halaman top up"],
  ["topup_qris_bridge_enabled", "QRIS Instan (Bridge)", "User diarahkan ke halaman bayar Bridge"],
] as const;

type MethodKey = (typeof methods)[number][0] | (typeof topupMethods)[number][0];
type MethodList = readonly (readonly [MethodKey, string, string])[];

async function post(body: Record<string, unknown>) {
  return fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    .then((r) => r.json())
    .catch(() => ({ success: false, message: "Terjadi kesalahan. Coba lagi." }));
}

function Group({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-[28px] bg-surface p-5 shadow-card md:p-6" aria-label={title}>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-[13px] text-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({ id, label, value, onChange, suffix, ...rest }: { id: string; label: string; value: number | ""; onChange: (v: number | "") => void; suffix?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-semibold">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className={`kr-field min-h-12 ${suffix ? "pr-12" : ""}`}
          {...rest}
        />
        {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">{suffix}</span>}
      </div>
    </div>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`kr-press relative h-8 w-14 shrink-0 rounded-full transition-colors ${checked ? "bg-success" : "bg-pill"}`}
    >
      <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition-[left] ${checked ? "left-7" : "left-1"}`} />
    </button>
  );
}

export default function SettingsView() {
  const { addToast } = useToast();
  const [s, setS] = useState<Settings | null>(null);
  const [markup, setMarkup] = useState<number | "">("");
  const [enabled, setEnabled] = useState<Record<MethodKey, boolean>>({
    bank_transfer_enabled: true,
    qris_gateway_enabled: true,
    qris_bridge_enabled: true,
    topup_qris_gateway_enabled: true,
    topup_qris_bridge_enabled: false,
  });
  const [percent, setPercent] = useState<number | "">("");
  const [minPayout, setMinPayout] = useState<number | "">("");
  const [popup, setPopup] = useState<{ enabled: boolean; title: string } | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return;
        setS(d.data);
        setMarkup(d.data.markup_percent);
        setEnabled({
          bank_transfer_enabled: d.data.bank_transfer_enabled,
          qris_gateway_enabled: d.data.qris_gateway_enabled,
          qris_bridge_enabled: d.data.qris_bridge_enabled,
          topup_qris_gateway_enabled: d.data.topup_qris_gateway_enabled,
          topup_qris_bridge_enabled: d.data.topup_qris_bridge_enabled,
        });
        setPercent(d.data.referral_commission_percent);
        setMinPayout(d.data.referral_min_payout);
      });
    fetch("/api/admin/popup")
      .then((r) => r.json())
      .then((d) => d.success && setPopup({ enabled: d.data.enabled, title: d.data.title }));
  }, []);

  async function save(group: string, requests: Record<string, unknown>[]) {
    setSaving(group);
    let last: { success: boolean; message?: string } = { success: true };
    // The settings API takes one setting per request; stop at the first failure.
    for (const body of requests) {
      last = await post(body);
      if (!last.success) break;
    }
    setSaving(null);
    addToast(last.message ?? (last.success ? "Tersimpan." : "Gagal menyimpan."), last.success ? "success" : "error");
    if (last.success && s) setS({ ...s, ...Object.assign({}, ...requests) });
  }

  const dirty = (list: MethodList) => !!s && list.some(([k]) => s[k] !== enabled[k]);

  function methodGroup(group: string, list: MethodList, saveLabel: string) {
    const isDirty = dirty(list);
    return (
      <>
        <ul>
          {list.map(([key, title, sub]) => (
            <li key={key} className="flex min-h-16 items-center gap-4 border-t border-hairline py-2 first:border-t-0">
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{title}</span>
                <span className="block text-[13px] text-muted">{sub}</span>
              </span>
              <Switch label={title} checked={enabled[key]} onChange={(v) => setEnabled((e) => ({ ...e, [key]: v }))} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={!isDirty || saving === group}
          onClick={() => save(group, list.filter(([k]) => s![k] !== enabled[k]).map(([k]) => ({ [k]: enabled[k] })))}
          className={`${buttonClass("primary")} min-h-12 w-full`}
        >
          {saving === group ? "Menyimpan..." : isDirty ? saveLabel : "Tidak ada perubahan"}
        </button>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Pengaturan" subtitle="Setiap grup disimpan sendiri dan langsung berlaku." />

      {!s ? (
        <Skeleton className="h-96 w-full" radius="rounded-[28px]" />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
          <Group title="Harga" description="Markup ditambahkan ke harga modal dari supplier.">
            <Field id="markup" label="Markup harga" suffix="%" min={0} max={1000} step={0.1} value={markup} onChange={setMarkup} />
            <button type="button" disabled={saving === "price"} onClick={() => save("price", [{ markup_percent: Number(markup) }])} className={`${buttonClass("primary")} min-h-12 w-full`}>
              {saving === "price" ? "Menyimpan..." : "Simpan harga"}
            </button>
          </Group>

          <Group title="Metode pembayaran" description="Metode yang nonaktif disembunyikan di checkout.">
            {methodGroup("methods", methods, "Simpan metode")}
          </Group>

          <Group title="Top up saldo" description="Metode QRIS untuk isi saldo. Kalau keduanya aktif, user memilih sendiri.">
            {methodGroup("topup", topupMethods, "Simpan metode top up")}
            {!enabled.topup_qris_gateway_enabled && !enabled.topup_qris_bridge_enabled && (
              <p className="text-[13px] font-medium text-danger">Keduanya mati: user tidak bisa top up saldo.</p>
            )}
          </Group>

          <Group title="Afiliasi" description="Komisi dihitung dengan persentase yang berlaku saat pesanan selesai, dibatasi margin toko.">
            <Field id="ref-percent" label="Komisi afiliasi" suffix="%" min={0} max={50} step={0.1} value={percent} onChange={setPercent} />
            <Field id="ref-min" label="Minimum pencairan" suffix="Rp" min={10000} step={1000} value={minPayout} onChange={setMinPayout} />
            <button
              type="button"
              disabled={saving === "affiliate"}
              onClick={() => save("affiliate", [{ referral_commission_percent: Number(percent), referral_min_payout: Number(minPayout) }])}
              className={`${buttonClass("primary")} min-h-12 w-full`}
            >
              {saving === "affiliate" ? "Menyimpan..." : "Simpan afiliasi"}
            </button>
          </Group>

          <Group title="Popup informasi" description="Popup yang tampil di beranda situs.">
            <Link href="/dashboard/admin/settings/popup" className="kr-press flex min-h-16 items-center gap-3 rounded-[18px] bg-card px-4 py-3">
              {popup ? (
                <Badge color={popup.enabled ? "secondary" : "default"}>{popup.enabled ? "Aktif" : "Nonaktif"}</Badge>
              ) : (
                <Skeleton className="h-6 w-16" radius="rounded-full" />
              )}
              <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{popup?.title || "Belum ada popup"}</span>
              <ChevronRight size={18} aria-hidden="true" className="text-muted" />
            </Link>
          </Group>
        </div>
      )}
    </>
  );
}
