import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-hairline pt-6">
      <Reveal y={8} className="flex flex-col gap-3 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} KampusRebahan. Semua hak dilindungi.</p>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 font-medium"
          aria-label="Navigasi footer"
        >
          <Link href="/terms" className="transition-colors duration-150 hover:text-ink hover:underline">
            Syarat
          </Link>
          <Link href="/privacy" className="transition-colors duration-150 hover:text-ink hover:underline">
            Privasi
          </Link>
          <a
            href="https://wa.me/6285180642043"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-ink hover:underline"
          >
            WhatsApp
          </a>
        </nav>
      </Reveal>
    </footer>
  );
}
