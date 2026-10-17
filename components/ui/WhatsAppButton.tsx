import { MessageCircle } from "lucide-react";
export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/6285180642043"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#E01C20] text-white shadow-md transition-colors hover:bg-[#B81520]"
      aria-label="Kontak admin melalui WhatsApp"
    >
      <MessageCircle size={23} />
    </a>
  );
}
