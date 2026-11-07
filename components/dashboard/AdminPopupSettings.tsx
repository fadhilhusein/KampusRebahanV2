"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, TriangleAlert } from "lucide-react";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import { PopupCard, PopupDialog, popupTypes } from "@/components/landing/InfoPopup";
import { emptyPopup, POPUP_BODY_MAX, POPUP_IMAGE_MAX_BYTES, POPUP_TITLE_MAX, type PopupConfig, type PopupType } from "@/lib/popup";

const fieldClass =
  "w-full rounded-xl bg-card px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ink";
const labelClass = "text-[13px] font-semibold text-ink";

function formatSaved(v: string) {
  const d = new Date(v);
  return `${d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
}

/** Admin card to edit the landing page info popup, with a live preview on large screens. */
export default function AdminPopupSettings() {
  const { addToast } = useToast();
  const [form, setForm] = useState<PopupConfig>(emptyPopup);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/popup")
      .then((r) => r.json())
      .then((res) => res.success && setForm(res.data))
      .catch(() => addToast("Gagal memuat pengaturan popup.", "error"))
      .finally(() => setLoading(false));
  }, [addToast]);

  const set = <K extends keyof PopupConfig>(key: K, value: PopupConfig[K]) => setForm((f) => ({ ...f, [key]: value }));

  function pickImage(file: File | undefined) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) return addToast("Banner harus PNG, JPG, atau WebP.", "error");
    if (file.size > POPUP_IMAGE_MAX_BYTES) return addToast("Ukuran banner maksimal 300 KB.", "error");
    const reader = new FileReader();
    reader.onload = () => set("image", String(reader.result));
    reader.readAsDataURL(file);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/popup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).then((r) => r.json());
      if (res.success) setForm(res.data);
      addToast(res.message ?? (res.success ? "Tersimpan" : "Gagal menyimpan"), res.success ? "success" : "error");
    } catch {
      addToast("Gagal menyimpan popup.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Skeleton className="h-[520px] w-full" radius="rounded-[22px]" />;

  const imageKb = Math.round((form.image.length * 0.75) / 1024);

  return (
    <section
      aria-labelledby="popup-settings-title"
      className="flex flex-col gap-8 rounded-[22px] bg-surface p-[18px] shadow-card md:rounded-[28px] md:p-7 lg:flex-row lg:items-start"
    >
      <form onSubmit={save} className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <h2 id="popup-settings-title" className="text-xl font-semibold">Popup informasi</h2>
            <p className="text-[13px] text-muted">Tampil di landing page saat pengunjung datang. Banner boleh kosong, popup jadi lebih ringkas.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.enabled}
            aria-label="Popup aktif"
            onClick={() => set("enabled", !form.enabled)}
            className="flex shrink-0 items-center gap-2.5 rounded-full text-[13px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            {form.enabled ? "Aktif" : "Nonaktif"}
            <span className={`flex h-[26px] w-11 items-center rounded-full p-[3px] transition-colors ${form.enabled ? "justify-end bg-success" : "justify-start bg-line"}`}>
              <span className="h-5 w-5 rounded-full bg-white shadow-soft" />
            </span>
          </button>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className={`${labelClass} mb-2`}>Tipe</legend>
          <div className="flex w-full gap-1 rounded-full bg-pill p-1 md:w-fit">
            {(Object.keys(popupTypes) as PopupType[]).map((k) => {
              const { label, icon: Icon, tone } = popupTypes[k];
              const on = form.type === k;
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set("type", k)}
                  className={`kr-press flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[13px] md:flex-none md:px-4 ${on ? "bg-surface font-semibold text-ink shadow-soft" : "font-medium text-muted"}`}
                >
                  <Icon size={14} aria-hidden="true" className={on ? tone : ""} />
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="popup-title" className={labelClass}>Judul</label>
          <input id="popup-title" value={form.title} maxLength={POPUP_TITLE_MAX} onChange={(e) => set("title", e.target.value)} placeholder="Promo akhir pekan sudah mulai" className={fieldClass} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor="popup-body" className={labelClass}>Isi pesan</label>
            <span className="text-xs tabular-nums text-muted">{form.body.length}/{POPUP_BODY_MAX}</span>
          </div>
          <textarea id="popup-body" rows={4} value={form.body} maxLength={POPUP_BODY_MAX} onChange={(e) => set("body", e.target.value)} className={`${fieldClass} resize-y leading-relaxed`} />
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>Banner <span className="font-normal text-muted">opsional</span></span>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" aria-label="Pilih banner" onChange={(e) => { pickImage(e.target.files?.[0]); e.target.value = ""; }} />
          {form.image ? (
            <div className="flex items-center gap-3 rounded-2xl border border-hairline p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
              <img src={form.image} alt="" className="h-11 w-16 shrink-0 rounded-[10px] object-cover" />
              <span className="min-w-0 flex-1 text-xs text-muted">{imageKb} KB · disarankan 1000 × 400</span>
              <button type="button" onClick={() => fileRef.current?.click()} className={`${buttonClass("secondary", "sm")} max-md:hidden`}>Ganti</button>
              <button type="button" onClick={() => set("image", "")} aria-label="Hapus banner" className="kr-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-danger hover:bg-danger-bg">
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className="kr-press flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line px-4 py-4 text-[13px] font-medium text-muted hover:text-ink">
              <ImagePlus size={18} aria-hidden="true" />
              Pilih gambar (PNG, JPG, WebP · maks 300 KB)
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="popup-cta-label" className={labelClass}>Teks tombol</label>
            <input id="popup-cta-label" value={form.ctaLabel} maxLength={40} onChange={(e) => set("ctaLabel", e.target.value)} placeholder="Lihat promo" className={fieldClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="popup-cta-href" className={labelClass}>Link tombol</label>
            <input id="popup-cta-href" value={form.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} placeholder="/products atau https://..." className={fieldClass} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="popup-frequency" className={labelClass}>Tampilkan</label>
            <select id="popup-frequency" value={form.frequency} onChange={(e) => set("frequency", e.target.value as PopupConfig["frequency"])} className={fieldClass}>
              <option value="once">Sekali per pengunjung</option>
              <option value="session">Setiap kunjungan</option>
            </select>
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className={`${labelClass} mb-2`}>Periode tayang <span className="font-normal text-muted">opsional</span></legend>
            <div className="flex items-center gap-2">
              <input type="date" aria-label="Mulai" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={`${fieldClass} min-w-0`} />
              <span className="text-muted" aria-hidden="true">–</span>
              <input type="date" aria-label="Selesai" value={form.endDate} min={form.startDate || undefined} onChange={(e) => set("endDate", e.target.value)} className={`${fieldClass} min-w-0`} />
            </div>
          </fieldset>
        </div>

        {!form.enabled && (
          <p role="status" className="flex items-start gap-2 rounded-2xl bg-warn-bg px-4 py-3 text-[13px] font-medium text-warn">
            <TriangleAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            Popup nonaktif, jadi tidak tampil di landing page. Nyalakan switch Aktif di atas lalu simpan.
          </p>
        )}

        <div className="flex flex-col gap-2 pt-1 md:flex-row md:items-center md:gap-3">
          <span className="flex-1 text-[13px] text-muted">{form.version ? `Disimpan ${formatSaved(form.version)}` : "Belum pernah disimpan"}</span>
          <button type="button" disabled={!form.title.trim()} onClick={() => setPreviewOpen(true)} className={buttonClass("secondary")}>Pratinjau</button>
          <button type="submit" disabled={saving} className={buttonClass("primary")}>{saving ? "Menyimpan..." : "Simpan popup"}</button>
        </div>
      </form>

      <aside aria-label="Pratinjau langsung" className="flex w-[440px] shrink-0 flex-col gap-3.5 rounded-[22px] bg-card p-5 max-lg:hidden">
        <span className={labelClass}>Pratinjau langsung</span>
        <div className="rounded-2xl bg-[#111113]/60 px-5 py-7">
          <div className="overflow-hidden rounded-[20px] bg-surface shadow-card">
            <PopupCard popup={{ ...form, title: form.title || "Judul popup" }} onClose={() => {}} />
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          {form.frequency === "once"
            ? "Pengunjung yang menutup popup tidak melihatnya lagi sampai isi popup disimpan ulang."
            : "Muncul lagi di setiap kunjungan baru, kecuali pengunjung mencentang \"Jangan tampilkan lagi\"."}
        </p>
      </aside>

      {previewOpen && <PopupDialog popup={form} open onClosed={() => setPreviewOpen(false)} />}
    </section>
  );
}
