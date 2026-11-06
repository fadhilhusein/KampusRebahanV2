"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { buttonClass } from "@/components/ui/ButtonPrimary";
import StatusIcon from "../StatusIcon";
import { X } from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";

  return (
    <div className="kr-page">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-5 py-12 text-center">
        <StatusIcon Icon={X} tone="bg-danger-bg text-danger" />
        <h1 className="kr-fade-up text-[32px] font-bold tracking-[-1.5px] text-ink md:text-[64px] md:tracking-[-3px]" style={{ animationDelay: "80ms" }}>Pembayaran dibatalkan</h1>
        <p className="kr-fade-up max-w-[480px] text-base text-muted" style={{ animationDelay: "120ms" }}>
          Kamu membatalkan halaman pembayaran. Order belum dihapus — kamu masih bisa menyelesaikan pembayarannya.
        </p>
        <div className="kr-fade-up flex w-full flex-col gap-3 pt-3 sm:w-auto sm:flex-row" style={{ animationDelay: "160ms" }}>
          {orderId ? (
            <Link href={`/order/${orderId}`} className={buttonClass()}>Lanjutkan pembayaran</Link>
          ) : (
            <Link href="/dashboard/transactions" className={buttonClass()}>Lihat riwayat transaksi</Link>
          )}
          <Link href="/products" className={buttonClass("secondary")}>Kembali ke produk</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-card" />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
