"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  // The admin area has its own bottom bar, and the store owner doesn't need "contact admin".
  if (usePathname().startsWith("/dashboard/admin")) return null;

  return (
    <a
      href="https://wa.me/6285180642043"
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: "600ms" }}
      className="kr-fade-up kr-press fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-soft hover:-translate-y-0.5 hover:bg-pill hover:shadow-card"
      aria-label="Kontak admin melalui WhatsApp"
    >
      <MessageCircle size={22} />
    </a>
  );
}
