import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full text-center">
          <GradientBorder>
            <div className="p-12">
              <div
                className="text-[80px] font-semibold leading-none mb-4 tracking-tight"
                style={{
                  background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 40%, transparent), color-mix(in srgb, var(--color-foreground) 8%, transparent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                404
              </div>
              <h1 className="text-[22px] font-semibold text-foreground mb-3">
                Halaman tidak ditemukan
              </h1>
              <p className="text-[14px] text-foreground/40 mb-8">
                Halaman yang kamu cari tidak ada atau sudah dipindahkan.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/products">
                  <ButtonPrimary className="w-full py-3">Lihat Produk</ButtonPrimary>
                </Link>
                <Link href="/">
                  <ButtonPrimary variant="ghost">Kembali ke Beranda</ButtonPrimary>
                </Link>
              </div>
            </div>
          </GradientBorder>
        </div>
      </main>
      <Footer />
    </>
  );
}
