"use client";
import { motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";

/** Lingkaran ikon status bayar (SPEC 3.7/3.8): pop-in; `shake` menggoyang sekali untuk gagal. */
export default function StatusIcon({
  Icon,
  tone,
  spin = false,
  shake = false,
}: {
  Icon: LucideIcon;
  tone: string;
  spin?: boolean;
  shake?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`flex size-24 items-center justify-center rounded-full ${tone}`}
      aria-hidden="true"
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={shake && !reduce ? { scale: 1, opacity: 1, x: [0, -8, 8, -5, 5, 0] } : { scale: 1, opacity: 1 }}
      transition={{
        scale: { type: "spring", stiffness: 320, damping: 18 },
        opacity: { duration: 0.25 },
        x: { duration: 0.4, delay: 0.3 },
      }}
    >
      <motion.span
        className="flex"
        initial={reduce || spin ? false : { scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.12 }}
      >
        <Icon size={48} className={spin ? "animate-spin" : ""} />
      </motion.span>
    </motion.div>
  );
}
