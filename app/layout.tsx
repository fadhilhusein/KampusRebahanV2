import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastContext";
import NextAuthSessionProvider from "@/components/ui/SessionProvider";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "KampusRebahan — Akun Digital Premium",
    template: "%s | KampusRebahan",
  },
  description:
    "Dapatkan akun Netflix, Spotify, Disney+, dan ratusan layanan digital premium dengan harga terjangkau.",
  openGraph: {
    siteName: "KampusRebahan",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white">
        <NextAuthSessionProvider>
          <ToastProvider>{children}</ToastProvider>
          <WhatsAppButton />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
