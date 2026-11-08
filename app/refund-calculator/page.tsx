import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RefundCalculator from "./RefundCalculator";
import InvoiceCheck from "./InvoiceCheck";

export const metadata: Metadata = {
  title: "Kalkulator Refund",
  description: "Hitung estimasi refund berdasarkan sisa masa garansi.",
};

export default function RefundCalculatorPage() {
  return (
    <div className="kr-page">
      <Navbar />
      <main className="flex-1 py-10 md:py-16">
        <div className="mx-auto flex max-w-[560px] flex-col gap-7">
          <div className="kr-fade-up flex flex-col items-center gap-3 text-center">
            <h1 className="text-4xl font-bold tracking-[-1.5px] text-ink md:text-[56px] md:tracking-[-2.5px]">Cek estimasi refund</h1>
            <p className="max-w-[460px] text-[15px] text-muted">
              Masukkan nomor invoice untuk melihat perkiraan refund dari sisa masa garansi produkmu, sesuai{" "}
              <Link href="/terms#bagian-6" className="font-medium text-ink underline underline-offset-2">
                Syarat & Ketentuan bagian 6
              </Link>
              . Nominal akhir ditentukan admin setelah pengajuan dicek.
            </p>
          </div>
          <InvoiceCheck />
          <RefundCalculator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
