"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientBorder from "@/components/ui/GradientBorder";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push("/auth/signin?registered=1");
    } else {
      setError(data.message ?? "Gagal mendaftar.");
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-[32px] font-semibold text-foreground leading-none tracking-tight mb-2">
              Daftar
            </h1>
            <p className="text-[13px] text-foreground/40">
              Sudah punya akun?{" "}
              <Link href="/auth/signin" className="text-foreground/70 hover:text-foreground transition-colors underline underline-offset-2">
                Masuk
              </Link>
            </p>
          </div>

          <GradientBorder>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] text-foreground/50 mb-2">
                  Nama <span className="text-foreground/20">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-foreground placeholder-white/20 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors bg-transparent"
                />
              </div>

              <div>
                <label className="block text-[12px] text-foreground/50 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-foreground placeholder-white/20 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors bg-transparent"
                />
              </div>

              <div>
                <label className="block text-[12px] text-foreground/50 mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-foreground placeholder-white/20 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors bg-transparent"
                />
              </div>

              {error && (
                <div className="bg-primary/10 border border-primary/30 rounded-[2px] px-4 py-3 text-[13px] text-primary">
                  {error}
                </div>
              )}

              <ButtonPrimary type="submit" disabled={loading} className="w-full py-3 text-[14px]">
                {loading ? "Memproses..." : "Buat Akun"}
              </ButtonPrimary>
            </form>
          </GradientBorder>
        </div>
      </main>
      <Footer />
    </>
  );
}
