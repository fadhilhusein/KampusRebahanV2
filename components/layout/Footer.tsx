import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="kr-footer mt-auto">
      <div className="kr-container">
        <div className="kr-footer-top">
          <Link href="/">
            <Image
              src="/logo_website.png"
              alt="KampusRebahan"
              width={184}
              height={46}
              className="kr-logo"
            />
          </Link>
          <nav
            className="flex flex-wrap gap-x-7 gap-y-4 text-xs kr-muted"
            aria-label="Navigasi footer"
          >
            <Link href="/">Beranda</Link>
            <Link href="/products">Produk</Link>
            <Link href="/terms">Syarat &amp; Ketentuan</Link>
            <Link href="/privacy">Kebijakan Privasi</Link>
          </nav>
        </div>
        <div className="kr-footer-bottom">
          <p>
            © {new Date().getFullYear()} KampusRebahan. All rights reserved.
          </p>
          <p>Akun digital premium, harga terjangkau.</p>
        </div>
      </div>
    </footer>
  );
}
