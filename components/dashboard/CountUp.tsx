"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { EASE } from "@/components/ui/Reveal";

/** Angka yang naik halus dari nilai sebelumnya (awal 0) ke `value`. Pembaca layar hanya mendengar nilai akhir. */
export default function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(from.current, value, {
      duration: 0.8,
      ease: EASE,
      onUpdate: (v) => {
        // dilacak per frame agar effect yang dihentikan (StrictMode, nilai baru) lanjut dari posisi terakhir
        from.current = v;
        setShown(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <>
      <span aria-hidden="true" className="tabular-nums">
        {format(reduce ? value : shown)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
