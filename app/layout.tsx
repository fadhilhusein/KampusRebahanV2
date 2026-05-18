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
    url: "https://kampus-rebahan.my.id",
    title: "KampusRebahan — Akun Digital Premium",
    description: "Dapatkan akun Netflix, Spotify, Disney+, dan ratusan layanan digital premium dengan harga terjangkau.",
    images: [
      {
        url: "/KAMPUSREBAHAN.jpg",
        width: 1200,
        height: 630,
        alt: "KampusRebahan — Akun Digital Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KampusRebahan — Akun Digital Premium",
    description: "Dapatkan akun Netflix, Spotify, Disney+, dan ratusan layanan digital premium dengan harga terjangkau.",
    images: ["/KAMPUSREBAHAN.jpg"],
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
