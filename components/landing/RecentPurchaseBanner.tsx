"use client";

import { useEffect, useState } from "react";
import * as motion from "motion/react-client";

interface RecentPurchase {
  id: string;
  name: string;
  product: string;
  purchasedAt: string;
  timeLabel: string;
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (Number.isNaN(date.getTime()) || diffMinutes < 1) return "baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam yang lalu`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari yang lalu`;
}

export default function RecentPurchaseBanner() {
  const [items, setItems] = useState<RecentPurchase[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setTimeTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/recent-purchases", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success && Array.isArray(data.data)) {
          setItems(data.data);
        }
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    if (items.length === 0) return;

    const timer = window.setInterval(() => {
      setTimeTick((current) => current + 1);
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const item = items[activeIndex];
  const relativeTime = item.purchasedAt
    ? formatRelativeTime(item.purchasedAt)
    : item.timeLabel;

  return (
    <motion.div
      className="fixed inset-x-0 top-18 z-[60] px-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.9, ease: "easeOut" }}
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-[620px] items-center justify-center">
        <div className="glass flex max-w-full items-center gap-3 rounded-full border-white/15 bg-black/70 px-4 py-2.5 shadow-lg shadow-primary/15 backdrop-blur-[12px]">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          <motion.p
            key={item.id}
            className="truncate text-[12px] font-medium text-white/70"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <span className="text-white">{item.name}</span>
            <span> baru saja membeli </span>
            <span className="text-white">{item.product}</span>
            <span className="text-white/35"> {relativeTime}</span>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
