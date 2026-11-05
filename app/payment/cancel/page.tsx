"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <GlassCard radius="rounded-2xl" className="p-8">
            <div className="text-[48px] mb-3">🚫</div>
            <h1 className="text-[20px] font-semibold text-foreground mb-2">Pembayaran dibatalkan</h1>
            <p className="text-[13px] text-foreground/40 mb-6">
              Kamu membatalkan halaman pembayaran. Order belum dihapus — kamu masih bisa menyelesaikan pembayarannya.
            </p>
            {orderId ? (
              <Link href={`/order/${orderId}`}>
                <ButtonPrimary className="w-full justify-center py-3">Lanjutkan Pembayaran →</ButtonPrimary>
              </Link>
            ) : (
              <Link href="/dashboard/transactions">
                <ButtonPrimary className="w-full justify-center py-3">Lihat Riwayat Transaksi →</ButtonPrimary>
              </Link>
            )}
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
