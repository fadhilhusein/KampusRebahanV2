"use client";
import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, ChevronDown, MessageCircle, ReceiptText, ShieldCheck, Users, X } from "lucide-react";
import { buttonClass } from "@/components/ui/ButtonPrimary";

// Ordered by how often customers ask (garansi first), answers follow S&K section 6.
const FAQ = [
  {
    Icon: ShieldCheck,
    q: "Akun saya error. Ada garansi?",
    a: "Selama masa garansi, admin memperbaiki atau mengganti akun, bukan mengembalikan uang. Varian berlabel No Garansi tidak diganti setelah akun dikirim. Garansi hangus jika syarat produk dilanggar.",
    link: { href: "/terms", label: "Baca S&K bagian garansi" },
  },
  {
    Icon: CalendarClock,
    q: "Kapan akun saya dikirim?",
    a: "Varian biasa dikirim otomatis setelah pembayaran terdeteksi. Varian PO dikirim sesuai estimasi di nama varian, misalnya 13–16 November. Kredensial muncul di halaman pesanan dan email. Belum terkirim setelah 48 jam? Kamu bisa ajukan refund.",
  },
  {
    Icon: ReceiptText,
    q: "Bisa refund? Kenapa tidak penuh?",
    a: "Refund berlaku jika akun belum terkirim setelah 48 jam, atau jika masalah tidak bisa diselesaikan lewat garansi. Nominalnya harga × sisa/masa garansi × 90% − biaya operasional (QRIS Instan 0,7% + Rp300), jadi makin lama dipakai, makin kecil refundnya.",
    link: { href: "/refund-calculator", label: "Hitung estimasi refund" },
  },
  {
    Icon: Users,
    q: "Kenapa akun dipakai orang lain?",
    a: "Varian Sharing memang dipakai bersama, kamu dapat 1 slot atau profil. Varian Invite mengundang ke email kamu. Kalau ingin akun sendiri, pilih varian Private.",
  },
];

/** Opens "Sebelum chat admin" (common answers) before the WhatsApp link, so buyers check the S&K first. */
export default function BeforeChatButton({
  href,
  context,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  /** e.g. "#KR-20481 · Netflix Sharing", shown so the buyer knows which order the chat is about. */
  context?: string;
  className: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} aria-label={ariaLabel} aria-haspopup="dialog" className={className}>
        {children}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="before-chat-title"
        // Click on the backdrop (the dialog element itself) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="kr-fade-up m-auto max-h-[calc(100dvh-32px)] w-[min(520px,calc(100%-32px))] max-w-none rounded-[28px] bg-surface p-0 text-ink shadow-[0_24px_64px_rgba(17,18,19,0.25)] backdrop:bg-[#111113]/65 max-md:mb-0 max-md:max-h-[90dvh] max-md:w-full max-md:rounded-b-none"
      >
        <div className="flex flex-col gap-[18px] p-5 pb-7 md:p-7">
          <div aria-hidden="true" className="mx-auto -mt-1 h-1 w-10 rounded-full bg-hairline md:hidden" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 id="before-chat-title" className="font-display text-[22px] font-bold tracking-[-0.6px] md:text-2xl">
                Sebelum chat admin
              </h2>
              <p className="text-sm leading-normal text-muted">
                Pertanyaan ini paling sering masuk dan jawabannya sudah ada. Cek dulu, mungkin langsung beres.
              </p>
            </div>
            <button type="button" onClick={close} aria-label="Tutup" className="kr-press flex size-10 shrink-0 items-center justify-center rounded-full bg-pill">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          {context && (
            <p className="self-start rounded-full border border-hairline bg-card px-3 py-1.5 text-xs font-semibold">{context}</p>
          )}
          <div className="flex flex-col gap-2">
            {FAQ.map(({ Icon, q, a, link }, i) => (
              <details key={q} open={i === 0} className="group rounded-[18px] border border-hairline bg-surface open:bg-card">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  <Icon size={18} aria-hidden="true" className="shrink-0" />
                  <span className="flex-1">{q}</span>
                  <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <div className="flex flex-col gap-2 px-4 pb-4 pl-[46px]">
                  <p className="text-[13px] leading-normal text-muted">{a}</p>
                  {link && (
                    <Link href={link.href} className="inline-flex items-center gap-1 self-start text-[13px] font-semibold underline underline-offset-2">
                      {link.label} <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>
          <div className="flex flex-col gap-2.5 md:flex-row">
            <button type="button" onClick={close} className={`kr-press ${buttonClass("secondary")} w-full md:flex-1`}>
              Sudah terjawab
            </button>
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={close} className={`kr-press ${buttonClass("primary")} w-full md:flex-1`}>
              <MessageCircle size={16} aria-hidden="true" /> Tetap chat admin
            </a>
          </div>
          <p className="text-center text-xs font-medium text-muted">
            {context ? "Pesan WhatsApp otomatis berisi ID pesanan dan nama produk." : "Kalau soal pesanan tertentu, sertakan ID pesanannya."}
          </p>
        </div>
      </dialog>
    </>
  );
}
