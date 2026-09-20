"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn, Mail, User, UserPlus } from "lucide-react";
import {
  AuthCard,
  AuthField,
  AuthNotice,
  AuthPasswordField,
  AuthShell,
  AuthSubmit,
} from "@/components/ui/auth-kit";

type AuthMode = "signin" | "signup";

const DEFAULT_CALLBACK = "/dashboard";

// Only same-origin paths are allowed as post-login redirect target.
function safeCallbackUrl(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return DEFAULT_CALLBACK;
  }
  return raw;
}

function SignInSignUpCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl = safeCallbackUrl(rawCallback);
  const isSignIn = mode === "signin";

  let notice = "";
  if (isSignIn && searchParams.get("registered") === "1") notice = "Akun berhasil dibuat. Silakan masuk.";
  if (isSignIn && searchParams.get("reset") === "1") notice = "Password berhasil direset. Silakan masuk.";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep the post-login destination when hopping between sign-in and sign-up.
  const query = rawCallback ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignIn) {
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) {
          setError("Email atau password salah.");
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (data.success) {
          const params = new URLSearchParams({ registered: "1" });
          if (rawCallback) params.set("callbackUrl", callbackUrl);
          router.push(`/auth/signin?${params.toString()}`);
        } else {
          setError(data.message ?? "Gagal mendaftar.");
        }
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const HeaderIcon = isSignIn ? LogIn : UserPlus;

  return (
    <AuthCard
      icon={HeaderIcon}
      title={isSignIn ? "Masuk ke Akun" : "Buat Akun Baru"}
      subtitle={isSignIn ? "Masuk untuk lanjut belanja dan lihat transaksi kamu." : "Buat akun untuk mulai berbelanja."}
    >
      {notice && (
        <div className="mb-4">
          <AuthNotice tone="success">{notice}</AuthNotice>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isSignIn && (
          <AuthField
            id="auth-name"
            label={<>Nama <span className="font-normal text-foreground/30">(opsional)</span></>}
            icon={User}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kamu"
          />
        )}

        <AuthField
          id="auth-email"
          label="Email"
          icon={Mail}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@contoh.com"
        />

        <AuthPasswordField
          id="auth-password"
          label="Password"
          labelExtra={
            isSignIn && (
              <Link
                href="/auth/forgot-password"
                className="text-[12px] font-medium text-foreground/50 underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Lupa password?
              </Link>
            )
          }
          required
          minLength={isSignIn ? undefined : 8}
          autoComplete={isSignIn ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignIn ? "••••••••" : "Minimal 8 karakter"}
        />

        {error && <AuthNotice tone="error">{error}</AuthNotice>}

        <AuthSubmit loading={loading} loadingText="Memproses..." icon={HeaderIcon}>
          {isSignIn ? "Masuk" : "Buat Akun"}
        </AuthSubmit>
      </form>

      <p className="mt-5 text-center text-[13px] text-foreground/50">
        {isSignIn ? "Belum punya akun? " : "Sudah punya akun? "}
        <Link
          href={isSignIn ? `/auth/signup${query}` : `/auth/signin${query}`}
          className="font-semibold text-foreground underline underline-offset-2 transition-colors hover:text-primary"
        >
          {isSignIn ? "Daftar sekarang" : "Masuk"}
        </Link>
      </p>

      <p className="mt-4 text-center text-[11px] leading-5 text-foreground/40">
        Dengan melanjutkan, kamu menyetujui{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">Syarat &amp; Ketentuan</Link>
        {" "}dan{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">Kebijakan Privasi</Link>.
      </p>
    </AuthCard>
  );
}

interface ModernLoginSignupProps {
  mode?: AuthMode;
}

export default function Component({ mode = "signin" }: ModernLoginSignupProps) {
  return (
    <AuthShell>
      {/* useSearchParams needs a Suspense boundary */}
      <Suspense fallback={<div className="h-[420px] w-full max-w-[420px]" />}>
        <SignInSignUpCard mode={mode} />
      </Suspense>
    </AuthShell>
  );
}
