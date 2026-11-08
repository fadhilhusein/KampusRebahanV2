"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calculator, MessageCircle, Undo2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import { whatsappLink } from "@/lib/contact";

type Estimate =
  | { eligible: true; kind: "UNDELIVERED" | "USED"; amount: number }
  | { eligible: false; reason: string; eligibleAt?: string };

const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

/**
 * Refund / complaint entry on the order detail page, following S&K section 6:
 * undelivered orders can ask for a refund after 48h; delivered ones go through warranty first.
 * `message(opening, extra)` builds the WhatsApp text with the order details.
 */
export default function RefundRequestCard({
  orderId,
  message,
}: {
  orderId: string;
  message: (opening: string, extra?: string[]) => string;
}) {
  const [est, setEst] = useState<Estimate | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/refund-estimate?invoice=${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((d) => !cancelled && d.success && setEst(d.data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const complaint = (
    <a
      href={whatsappLink(message("Halo admin KampusRebahan, saya ingin klaim garansi / komplain."))}
      target="_blank"
      rel="noopener noreferrer"
      className={`kr-press ${buttonClass(est?.eligible && est.kind === "UNDELIVERED" ? "secondary" : "primary")} w-full lg:w-fit`}
    >
      <MessageCircle size={16} aria-hidden="true" />
      {est && !est.eligible ? (est.eligibleAt ? "Tanya admin" : "Hubungi admin") : "Klaim garansi / komplain"}
    </a>
  );

  const refund = est?.eligible && (
    <a
      href={whatsappLink(
        message("Halo admin KampusRebahan, saya ingin mengajukan refund.", [
          `Alasan: ${est.kind === "UNDELIVERED" ? "produk belum terkirim lebih dari 48 jam" : "kendala tidak bisa diselesaikan lewat garansi"}`,
          `Estimasi refund: ${rupiah(est.amount)}`,
        ])
      )}
      target="_blank"
      rel="noopener noreferrer"
      className={`kr-press ${buttonClass(est.kind === "UNDELIVERED" ? "primary" : "secondary")} w-full lg:w-fit`}
    >
      <Undo2 size={16} aria-hidden="true" /> Ajukan refund {rupiah(est.amount)}
    </a>
  );

  let text = "Klaim garansi atau komplain lewat WhatsApp admin. Pesan otomatis berisi ID pesanan dan produk.";
  if (est?.eligible && est.kind === "UNDELIVERED") {
    text = `Produk belum terkirim lebih dari 48 jam, jadi kamu bisa mengajukan refund. Estimasi refund ${rupiah(est.amount)}.`;
  } else if (est?.eligible) {
    text = `Coba klaim garansi dulu (perbaikan atau ganti akun). Jika kendala tidak bisa diselesaikan lewat garansi, kamu bisa mengajukan refund dengan estimasi ${rupiah(est.amount)}.`;
  } else if (est?.eligibleAt) {
    text = `Pesanan masih diproses. Refund bisa diajukan mulai ${dateTime(est.eligibleAt)} (48 jam setelah pesanan dibuat) jika produk belum juga terkirim.`;
  } else if (est) {
    text = `${est.reason} Kamu tetap bisa menghubungi admin jika ada kendala.`;
  }

  return (
    <GlassCard className="flex flex-col gap-3 p-5">
      <h2 className="text-base font-semibold">Ada kendala dengan pesanan ini?</h2>
      <p className="text-[13px] text-muted">{text}</p>
      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap">
        {est?.eligible && est.kind === "UNDELIVERED" ? (
          <>
            {refund}
            {complaint}
          </>
        ) : (
          <>
            {complaint}
            {refund}
          </>
        )}
      </div>
      <Link href="/refund-calculator" className="kr-press inline-flex min-h-11 items-center gap-2 self-start text-[13px] font-semibold text-muted hover:text-ink">
        <Calculator size={15} aria-hidden="true" /> Cara refund dihitung
      </Link>
    </GlassCard>
  );
}
