"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarClock,
  Info,
  KeyRound,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  ShieldOff,
  UserPlus,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { variantPoints, type InfoIcon, type InfoTone } from "@/lib/variantInfo";
import type { Product, ProductVariant } from "@/lib/types";

export const infoIcons: Record<InfoIcon, LucideIcon> = {
  "shield-check": ShieldCheck,
  "shield-off": ShieldOff,
  "calendar-clock": CalendarClock,
  zap: Zap,
  users: Users,
  lock: LockKeyhole,
  "user-plus": UserPlus,
  key: KeyRound,
  receipt: ReceiptText,
};

const tone: Record<InfoTone, { dot: string; title: string }> = {
  warn: { dot: "bg-warn-bg text-warn", title: "text-warn" },
  success: { dot: "bg-success-bg text-success", title: "text-success" },
  neutral: { dot: "bg-pill text-ink", title: "text-ink" },
};

type VariantLike = Pick<ProductVariant, "name" | "type" | "warranty">;

/** "Yang perlu kamu tahu": warranty, delivery, account type and refund for one variant. */
export default function VariantInfoBox({
  variant,
  link = "terms",
  className = "",
}: {
  variant: VariantLike;
  /** "scroll" jumps to #syarat on the product page; "terms" opens /terms. */
  link?: "scroll" | "terms";
  className?: string;
}) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className={`flex flex-col gap-4 rounded-[22px] border border-hairline bg-surface p-4 md:rounded-[24px] md:p-5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id={titleId}className="flex items-center gap-2 font-display text-base font-semibold tracking-[-0.3px] text-ink md:text-lg">
          <Info size={18} aria-hidden="true" /> Yang perlu kamu tahu
        </h2>
        {link === "scroll" ? (
          <a href="#syarat" className="inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-ink underline underline-offset-2">
            <span className="md:hidden">Syarat lengkap</span>
            <span className="hidden md:inline">Lihat syarat lengkap</span>
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        ) : (
          <Link href="/terms" className="inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-ink underline underline-offset-2">
            Baca S&amp;K <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>
      <ul className="flex flex-col gap-4">
        {variantPoints(variant).map((p) => {
          const Icon = infoIcons[p.icon];
          return (
            <li key={p.key} className="flex gap-3">
              <span aria-hidden="true" className={`flex size-8 shrink-0 items-center justify-center rounded-full ${tone[p.tone].dot}`}>
                <Icon size={16} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className={`text-sm font-semibold ${tone[p.tone].title}`}>{p.title}</span>
                <span className="text-[13px] leading-[1.45] text-muted">{p.desc}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Same box for an order, which stores only the variant id; warranty comes from the live product list. */
export function VariantInfoById({ variantId }: { variantId: string }) {
  const [variant, setVariant] = useState<VariantLike | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const v = d.success && (d.data as Product[]).flatMap((p) => p.variants).find((x) => x.id === variantId);
        if (active && v) setVariant(v);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [variantId]);
  // Supplier may have dropped the variant: without its warranty text the box would claim "Tanpa garansi", so hide it.
  if (!variant) return null;
  return <VariantInfoBox variant={variant} />;
}
