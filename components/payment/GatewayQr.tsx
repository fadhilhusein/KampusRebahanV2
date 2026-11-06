"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function GatewayQr({ value, className = "h-[280px] w-[280px]" }: { value: string; className?: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { width: 560, margin: 1 }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => { cancelled = true; };
  }, [value]);

  const box = `mx-auto flex items-center justify-center rounded-[20px] border-2 border-ink bg-white p-3 ${className}`;

  if (!dataUrl) {
    return <div className={`${box} kr-fade-in text-xs text-[#5B5F66]`}>Membuat QR...</div>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <div className={box}><img src={dataUrl} alt="QRIS Bayar.gg" className="h-full w-full object-contain transition-[opacity,scale] duration-[400ms] ease-(--kr-ease) starting:scale-95 starting:opacity-0" /></div>;
}
