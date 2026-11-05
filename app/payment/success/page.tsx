"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

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

  const content = {
    checking: { icon: "⏳", title: "Memeriksa pembayaran...", desc: "Mohon tunggu sebentar." },
    paid: { icon: "🎉", title: "Pembayaran berhasil!", desc: "Order kamu sedang/sudah diproses." },
    pending: { icon: "🔍", title: "Pembayaran sedang diverifikasi", desc: "Ini bisa makan waktu beberapa saat — status akan terupdate otomatis di halaman order." },
    failed: { icon: "❌", title: "Pembayaran tidak berhasil", desc: "Silakan coba lagi dari halaman order, atau buat order baru." },
    error: { icon: "⚠️", title: "Tidak bisa memeriksa status", desc: message || "Cek status pembayaran lewat halaman order." },
  }[state];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <GlassCard className="p-8">
            <div className="text-[48px] mb-3">{content.icon}</div>
            <h1 className="text-[20px] font-semibold text-white mb-2">{content.title}</h1>
            <p className="text-[13px] text-white/40 mb-6">{content.desc}</p>
            {orderId && (
              <Link href={`/order/${orderId}`}>
                <ButtonPrimary className="w-full justify-center py-3">Lihat Detail Order →</ButtonPrimary>
              </Link>
            )}
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
