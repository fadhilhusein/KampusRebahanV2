"use client";

import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";

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
  const reduce = useReducedMotion();

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
      className="hidden justify-center md:flex"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex max-w-full items-center gap-3 rounded-full bg-surface px-6 py-4 shadow-soft">
        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-success" />
        <motion.p
          key={item.id}
          className="truncate text-sm font-medium text-muted"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <span className="text-ink">{item.name}</span>
          <span> baru saja membeli </span>
          <span className="text-ink">{item.product}</span>
          <span> {relativeTime}</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
