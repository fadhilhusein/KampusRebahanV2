"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

export default function Countdown({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(expiresAt).getTime() - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, new Date(expiresAt).getTime() - Date.now())), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (remaining <= 0) return <span className="kr-fade-in text-sm font-semibold text-danger">Kadaluarsa</span>;
  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);
  return (
    <span className="kr-fade-in inline-flex items-center gap-2 text-sm font-semibold tabular-nums text-warn">
      <Timer size={18} aria-hidden="true" />
      Berlaku {mm}:{String(ss).padStart(2, "0")} lagi
    </span>
  );
}
