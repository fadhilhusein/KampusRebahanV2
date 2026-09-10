"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function GatewayQr({ value }: { value: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { width: 288, margin: 1 }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => { cancelled = true; };
  }, [value]);

  if (!dataUrl) {
    return <div className="w-72 h-72 mx-auto flex items-center justify-center text-foreground/30 text-[12px]">Membuat QR...</div>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={dataUrl} alt="QRIS Bayar.gg" className="w-72 h-72 object-contain" />;
}
