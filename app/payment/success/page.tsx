"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import StatusIcon from "../StatusIcon";
import { Check, Loader2, Hourglass, X, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CheckState = "checking" | "paid" | "pending" | "failed" | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";

  const [state, setState] = useState<CheckState>(orderId ? "checking" : "error");
  const [message, setMessage] = useState(orderId ? "" : "order_id tidak ditemukan di URL.");

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    fetch(`/api/order/${orderId}/bridge-status`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) {
          setState("error");
          setMessage(data.message ?? "Gagal memeriksa status pembayaran.");
          return;
        }
        const status = data.data?.status;
        if (status === "paid") setState("paid");
        else if (status === "failed" || status === "expired") setState("failed");
        else setState("pending");
      })
      .catch(() => {
        if (!cancelled) {
          setState("error");
          setMessage("Terjadi kesalahan saat memeriksa status.");
        }
      });

    return () => { cancelled = true; };
  }, [orderId]);

  const content: Record<CheckState, { Icon: LucideIcon; tone: string; spin?: boolean; title: string; desc: string }> = {
    checking: { Icon: Loader2, tone: "bg-pill text-muted", spin: true, title: "Memeriksa pembayaran...", desc: "Mohon tunggu sebentar." },
    paid: { Icon: Check, tone: "bg-success-bg text-success", title: "Pembayaran berhasil", desc: "Order kamu sedang/sudah diproses. Kredensial akan tersedia di halaman pesanan." },
    pending: { Icon: Hourglass, tone: "bg-warn-bg text-warn", title: "Pembayaran sedang diverifikasi", desc: "Ini bisa makan waktu beberapa saat — status akan terupdate otomatis di halaman order." },
    failed: { Icon: X, tone: "bg-danger-bg text-danger", title: "Pembayaran tidak berhasil", desc: "Silakan coba lagi dari halaman order, atau buat order baru." },
    error: { Icon: AlertTriangle, tone: "bg-danger-bg text-danger", title: "Tidak bisa memeriksa status", desc: message || "Cek status pembayaran lewat halaman order." },
  };
  const { Icon, tone, spin, title, desc } = content[state];

  return (
    <div className="kr-page">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-5 py-12 text-center" aria-live="polite">
        <StatusIcon key={state} Icon={Icon} tone={tone} spin={spin} shake={state === "failed" || state === "error"} />
        <div key={`t-${state}`} className="kr-fade-up flex flex-col items-center gap-5" style={{ animationDelay: "80ms" }}>
          <h1 className="text-[32px] font-bold tracking-[-1.5px] text-ink md:text-[64px] md:tracking-[-3px]">{title}</h1>
          <p className="max-w-[480px] text-base text-muted">{desc}</p>
        </div>
        <div className="kr-fade-up flex w-full flex-col gap-3 pt-3 sm:w-auto sm:flex-row" style={{ animationDelay: "160ms" }}>
          {orderId && <Link href={`/order/${orderId}`} className={buttonClass()}>Lihat pesanan</Link>}
          <Link href="/products" className={buttonClass("secondary")}>Belanja lagi</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-card" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
