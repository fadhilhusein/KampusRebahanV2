"use client";
import { useRef } from "react";
import { LockKeyhole, ShieldCheck, ShieldOff, UserPlus, Users, Zap } from "lucide-react";
import type { ProductVariant } from "@/lib/types";

// API types can carry suffixes like "Private 1P1U", so match by prefix.
const typeIcon = (type: string) => {
  const t = type.toLowerCase();
  return t.startsWith("private") ? LockKeyhole : t.startsWith("invite") ? UserPlus : Users;
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (v: ProductVariant) => void;
  radius?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusable = variants.findIndex((v) => v.id === selected?.id && v.stock > 0);
  const tabbable = focusable >= 0 ? focusable : variants.findIndex((v) => v.stock > 0);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    for (let step = 1; step <= variants.length; step++) {
      const next = (((index + dir * step) % variants.length) + variants.length) % variants.length;
      if (variants[next].stock > 0) {
        onSelect(variants[next]);
        refs.current[next]?.focus();
        return;
      }
    }
  }

  return (
    <div
      className="grid grid-cols-1 gap-x-3 gap-y-6 pt-3 sm:grid-cols-2"
      role="radiogroup"
      aria-label="Pilihan varian"
    >
      {variants.map((v, i) => {
        const active = selected?.id === v.id,
          out = v.stock === 0,
          low = !out && v.stock <= 3,
          TypeIcon = typeIcon(v.type),
          dim = out ? "text-muted" : "text-ink";
        return (
          <button
            key={v.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-disabled={out || undefined}
            disabled={out}
            tabIndex={i === tabbable ? 0 : -1}
            onClick={() => onSelect(v)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`kr-press relative flex flex-col gap-3 rounded-[20px] border-2 px-[18px] pt-[22px] pb-4 text-left disabled:cursor-not-allowed ${active ? "border-accent bg-accent/5" : out ? "border-hairline bg-card" : "border-hairline bg-surface hover:border-line"}`}
          >
            {!out && (
              <span className="absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-surface">
                <Zap size={12} aria-hidden="true" />
                Pengiriman otomatis
              </span>
            )}
            <span className="flex items-start gap-3">
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className={`font-display text-base leading-[1.3] font-semibold tracking-[-0.3px] ${dim}`}>
                  {v.name} · {v.duration}
                </span>
                <span className={`text-xs ${low ? "font-semibold text-warn" : "font-medium text-muted"}`}>
                  {out ? "Stok habis" : low ? `Sisa ${v.stock}, segera habis` : `Stok tersedia: ${v.stock}`}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-accent" : out ? "border-hairline" : "border-line"}`}
              >
                {active && <span className="size-2.5 rounded-full bg-accent" />}
              </span>
            </span>
            <span className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1 rounded-full bg-pill px-2.5 py-1 text-xs font-semibold ${dim}`}>
                <TypeIcon size={12} aria-hidden="true" />
                {v.type}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[13px] ${out ? "text-muted" : v.warranty ? "text-success" : "text-muted"}`}
              >
                {v.warranty ? <ShieldCheck size={14} aria-hidden="true" /> : <ShieldOff size={14} aria-hidden="true" />}
                {v.warranty ? `Garansi ${v.warranty}` : "Tanpa garansi"}
              </span>
            </span>
            <span className={`border-t border-hairline pt-3 font-display text-xl font-bold tracking-[-0.6px] ${dim}`}>
              {rupiah.format(v.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
