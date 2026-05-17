import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 mt-auto">
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-white font-semibold text-[14px]">
              Kampus<span className="text-primary">Rebahan</span>
            </span>
            <p className="text-white/30 text-[11px] mt-1">
              Akun digital premium, harga terjangkau.
            </p>
          </div>

          <nav className="flex items-center gap-6 flex-wrap justify-center">
            <Link href="/" className="text-white/40 hover:text-white text-[12px] transition-colors duration-150">
              Home
            </Link>
            <Link href="/products" className="text-white/40 hover:text-white text-[12px] transition-colors duration-150">
              Produk
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-white text-[12px] transition-colors duration-150">
              Syarat & Ketentuan
            </Link>
            <Link href="/privacy" className="text-white/40 hover:text-white text-[12px] transition-colors duration-150">
              Kebijakan Privasi
            </Link>
          </nav>

          <p className="text-white/20 text-[11px]">
            © {new Date().getFullYear()} KampusRebahan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
