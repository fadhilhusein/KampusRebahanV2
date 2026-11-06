import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { buttonClass } from "@/components/ui/ButtonPrimary";

export default function NotFound() {
  return (
    <div className="kr-page">
      <Navbar />
      <main className="flex flex-1 items-center justify-center py-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="kr-fade-up font-display text-[120px] font-bold leading-[0.9] tracking-[-6px] text-ink md:text-[200px] md:tracking-[-10px]">
            404
          </div>
          <h1 className="kr-fade-up text-[26px] font-semibold text-ink md:text-[40px]" style={{ animationDelay: "80ms" }}>
            Halaman tidak ditemukan
          </h1>
          <p className="kr-fade-up text-base text-muted" style={{ animationDelay: "140ms" }}>
            Alamat yang kamu buka tidak ada atau sudah dipindahkan.
          </p>
          <Link href="/" className={`kr-fade-up ${buttonClass("primary")}`} style={{ animationDelay: "200ms" }}>
            Kembali ke beranda
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
