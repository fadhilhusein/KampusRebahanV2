"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Info, Sparkles, TriangleAlert, X } from "lucide-react";
import type { PopupConfig, PopupType } from "@/lib/popup";
import { buttonClass } from "@/components/ui/ButtonPrimary";

type PublicPopup = Omit<PopupConfig, "enabled" | "startDate" | "endDate">;

export const popupTypes: Record<PopupType, { label: string; icon: typeof Info; tone: string }> = {
  info: { label: "Info", icon: Info, tone: "text-accent" },
  promo: { label: "Promo", icon: Sparkles, tone: "text-accent" },
  warning: { label: "Peringatan", icon: TriangleAlert, tone: "text-warn" },
};

const STORE_KEY = "kr-popup-dismissed";

interface CardProps {
  popup: PublicPopup;
  onClose: () => void;
  /** checkbox "Jangan tampilkan lagi"; hidden when the popup already shows once per visitor */
  dontShow?: { checked: boolean; onChange: (v: boolean) => void };
}

/** The popup body. Shared by the landing dialog and the admin preview. */
export function PopupCard({ popup, onClose, dontShow }: CardProps) {
  const t = popupTypes[popup.type] ?? popupTypes.info;
  const Icon = t.icon;
  const chip = (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold ${t.tone}`}>
      <Icon size={14} aria-hidden="true" />
      {t.label}
    </span>
  );
  const close = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Tutup"
      className="kr-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#111113] shadow-soft"
    >
      <X size={18} aria-hidden="true" />
    </button>
  );

  return (
    <div className="@container flex flex-col overflow-hidden">
      {popup.image ? (
        <div className="relative h-44 w-full shrink-0 bg-card @md:h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- banner is a data URL from admin */}
          <img src={popup.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-x-4 top-4 flex items-start justify-between @md:inset-x-6 @md:top-6">
            {chip}
            {close}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-5 pt-5 @md:px-7 @md:pt-6">
          {chip}
          {close}
        </div>
      )}

      <div className="flex flex-col gap-5 px-5 pb-8 pt-5 @md:px-7 @md:pb-7 @md:pt-6">
        <div className="flex flex-col gap-2">
          <h2 id="info-popup-title" className="font-display text-[22px] font-bold tracking-[-0.6px] text-ink @md:text-2xl">
            {popup.title}
          </h2>
          {popup.body && <p className="whitespace-pre-line text-sm leading-relaxed text-muted @md:text-[15px]">{popup.body}</p>}
        </div>
        <div className="flex flex-col gap-2 @md:flex-row @md:gap-2.5">
          {popup.ctaHref && (
            <Link href={popup.ctaHref} onClick={onClose} className={`${buttonClass("primary")} @md:flex-1`}>
              {popup.ctaLabel}
            </Link>
          )}
          <button type="button" onClick={onClose} className={`${buttonClass("secondary")} ${popup.ctaHref ? "" : "@md:flex-1"}`}>
            {popup.ctaHref ? "Nanti saja" : "Mengerti"}
          </button>
        </div>
        {dontShow && (
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
            <input
              type="checkbox"
              checked={dontShow.checked}
              onChange={(e) => dontShow.onChange(e.target.checked)}
              className="h-[18px] w-[18px] accent-[var(--color-ink)]"
            />
            Jangan tampilkan lagi
          </label>
        )}
      </div>
    </div>
  );
}

function read(store: Storage | undefined) {
  try {
    return store?.getItem(STORE_KEY) ?? null;
  } catch {
    return null;
  }
}
function write(store: Storage, version: string) {
  try {
    store.setItem(STORE_KEY, version);
  } catch {}
}

/** Modal dialog around PopupCard: centered on desktop, bottom sheet on mobile. */
export function PopupDialog({ popup, open, onClosed }: { popup: PublicPopup; open: boolean; onClosed: (dontShow: boolean) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="info-popup-title"
      onClose={() => onClosed(dontShow)}
      // Click on the backdrop lands on the dialog element itself.
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="kr-fade-up m-auto w-[min(500px,calc(100%-32px))] max-w-none overflow-hidden rounded-[28px] bg-surface p-0 text-ink shadow-[0_24px_64px_rgba(17,18,19,0.25)] backdrop:bg-[#111113]/65 max-md:mb-0 max-md:w-full max-md:rounded-b-none"
    >
      <PopupCard
        popup={popup}
        onClose={() => ref.current?.close()}
        dontShow={popup.frequency === "session" ? { checked: dontShow, onChange: setDontShow } : undefined}
      />
    </dialog>
  );
}

/** Landing page popup: fetches the live config and shows it unless this visitor already dismissed it. */
export default function InfoPopup() {
  const [popup, setPopup] = useState<PublicPopup | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    fetch("/api/popup")
      .then((r) => r.json())
      .then((res) => {
        const p: PublicPopup | null = res?.data ?? null;
        if (cancelled || !p) return;
        const seen = read(window.localStorage) === p.version || (p.frequency === "session" && read(window.sessionStorage) === p.version);
        if (seen) return;
        setPopup(p);
        // Let the page paint first.
        timer = setTimeout(() => setOpen(true), 800);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (!popup) return null;
  return (
    <PopupDialog
      popup={popup}
      open={open}
      onClosed={(dontShow) => {
        setOpen(false);
        write(popup.frequency === "once" || dontShow ? window.localStorage : window.sessionStorage, popup.version);
      }}
    />
  );
}
