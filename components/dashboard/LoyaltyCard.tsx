"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Check, Copy, Gift, Loader2, Mail, Ticket } from "lucide-react";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { ShineBorder } from "@/components/ui/shine-border";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastContext";
import type { LoyaltyState } from "@/lib/loyalty";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

type LoyaltyResult = { state: LoyaltyState } | { error: string };

async function fetchLoyalty(): Promise<LoyaltyResult> {
  try {
    const res = await fetch("/api/loyalty");
    const data = await res.json();
    return data.success ? { state: data.data } : { error: data.message ?? "Gagal memuat progres hadiah." };
  } catch {
    return { error: "Terjadi kesalahan saat memuat progres hadiah." };
  }
}

const SHINE_COLORS =["var(--color-primary)", "var(--color-tertiary)", "var(--color-secondary)"];

// Full-width loyalty card for the dashboard overview: progress towards the reward, then the coupon
// and its redeem form once the threshold is reached.
export default function LoyaltyCard() {
  const { data: session } = useSession();
  const { addToast } = useToast();

  const [state, setState] = useState<LoyaltyState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [redeemOpen, setRedeemOpen] = useState(false);
  const [emailInvite, setEmailInvite] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState("");
  const [copied, setCopied] = useState(false);

  const applyResult = useCallback((result: LoyaltyResult) => {
    if ("state" in result) {
      setState(result.state);
      setLoadError("");
    } else {
      setLoadError(result.error);
    }
    setLoading(false);
  }, []);

  const reload = useCallback(async () => applyResult(await fetchLoyalty()), [applyResult]);

  useEffect(() => {
    let cancelled = false;
    fetchLoyalty().then((result) => {
      if (!cancelled) applyResult(result);
    });
    return () => {
      cancelled = true;
    };
  }, [applyResult]);

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      addToast("Gagal menyalin kode kupon.", "error");
    }
  }

  function openRedeem() {
    setRedeemError("");
    setEmailInvite((current) => current || session?.user?.email || "");
    setRedeemOpen(true);
  }

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    setRedeeming(true);
    setRedeemError("");

    try {
      const res = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailInvite }),
      });
      const data = await res.json();

      if (data.success) {
        addToast(data.data.message, "success");
        setRedeemOpen(false);
        await reload();
      } else {
        const msg = data.message ?? "Gagal menukar kupon.";
        setRedeemError(msg);
        addToast(msg, "error");
      }
    } catch {
      const msg = "Terjadi kesalahan. Coba lagi.";
      setRedeemError(msg);
      addToast(msg, "error");
    } finally {
      setRedeeming(false);
    }
  }

  const coupon = state?.coupon ?? null;
  const unlocked = coupon?.status === "ACTIVE";
  const redeemed = coupon?.status === "REDEEMED";

  return (
    <section
      aria-label="Hadiah loyalitas"
      className="relative overflow-hidden rounded-2xl border border-foreground/20 bg-surface p-6"
    >
      <ShineBorder borderWidth={2} duration={10} shineColor={SHINE_COLORS} />

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Gift size={28} />
        </div>

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" radius="rounded-lg" />
              <Skeleton className="h-4 w-72 max-w-full" radius="rounded-lg" />
              <Skeleton className="mt-4 h-3 w-full" radius="rounded-full" />
            </div>
          ) : !state ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[14px] font-medium text-foreground/60">{loadError}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  reload();
                }}
                className="cursor-pointer rounded-full border border-foreground/20 px-4 py-1.5 text-[12px] font-semibold text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                Coba lagi
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-[18px] font-bold leading-tight text-foreground">Hadiah Loyalitas</h2>
                {unlocked && (
                  <span className="rounded-full bg-green-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-green-500">
                    Kupon siap ditukar
                  </span>
                )}
                {redeemed && (
                  <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-[11px] font-semibold text-foreground/60">
                    Sudah ditukar
                  </span>
                )}
              </div>
              <p className="mt-1 text-[14px] text-foreground/60">
                Total belanja {formatPrice(state.threshold)} dan dapatkan{" "}
                <span className="font-semibold text-foreground">{state.rewardLabel}</span> gratis.
              </p>

              <div className="mt-4">
                <div className="mb-2 flex items-baseline justify-between gap-3 text-[12px] font-semibold">
                  <span className="text-foreground">
                    {formatPrice(Math.min(state.total, state.threshold))}
                    <span className="text-foreground/40"> / {formatPrice(state.threshold)}</span>
                  </span>
                  <span className="text-foreground/50">{state.percent}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Progres hadiah loyalitas"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={state.percent}
                  className="h-3 overflow-hidden rounded-full bg-foreground/10"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                    style={{ width: `${state.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-[12px] font-medium text-foreground/50">
                  {coupon ? "Target tercapai." : `Kurang ${formatPrice(state.remaining)} lagi untuk membuka kupon.`}
                </p>
              </div>

              {coupon && (
                <div className="mt-5 border-t border-foreground/10 pt-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-foreground/30 px-3.5 py-2">
                      <Ticket size={16} className="text-primary" />
                      <span className="font-mono text-[14px] font-bold tracking-wider text-foreground">{coupon.code}</span>
                      <button
                        type="button"
                        onClick={() => copyCode(coupon.code)}
                        aria-label="Salin kode kupon"
                        className="cursor-pointer text-foreground/40 transition-colors hover:text-foreground"
                      >
                        {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                      </button>
                    </div>

                    {unlocked && !redeemOpen && (
                      <ButtonPrimary type="button" onClick={openRedeem} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold">
                        <Gift size={15} />
                        Tukar Kupon
                      </ButtonPrimary>
                    )}

                    {redeemed && coupon.orderId && (
                      <Link
                        href={`/dashboard/transactions/${coupon.orderId}`}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground/70 underline underline-offset-2 transition-colors hover:text-foreground"
                      >
                        Lihat pesanan hadiah
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>

                  {unlocked && redeemOpen && (
                    <form onSubmit={handleRedeem} className="mt-4 max-w-md space-y-3">
                      <div>
                        <label htmlFor="loyalty-email" className="mb-2 block text-[12px] font-semibold text-foreground/70">
                          Email untuk undangan {state.rewardLabel}
                        </label>
                        <div className="relative">
                          <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                          <input
                            id="loyalty-email"
                            type="email"
                            required
                            value={emailInvite}
                            onChange={(e) => setEmailInvite(e.target.value)}
                            placeholder="email-google@contoh.com"
                            className="w-full rounded-xl border border-foreground/15 bg-background py-3 pl-10 pr-4 text-[14px] text-foreground transition-colors placeholder:text-foreground/30 focus:border-foreground/40 focus:outline-none"
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] text-foreground/40">Pastikan email ini benar, undangan akan dikirim ke sini.</p>
                      </div>

                      {redeemError && (
                        <div role="alert" className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-[13px] font-medium text-primary">
                          {redeemError}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <ButtonPrimary
                          type="submit"
                          disabled={redeeming}
                          className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold disabled:opacity-60"
                        >
                          {redeeming ? <Loader2 size={15} className="animate-spin" /> : <Gift size={15} />}
                          {redeeming ? "Memproses..." : "Konfirmasi Tukar"}
                        </ButtonPrimary>
                        <button
                          type="button"
                          onClick={() => setRedeemOpen(false)}
                          disabled={redeeming}
                          className="cursor-pointer text-[13px] font-semibold text-foreground/50 transition-colors hover:text-foreground disabled:opacity-50"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
