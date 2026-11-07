import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the window resets (0 when allowed). */
  retryAfter: number;
}

/**
 * Fixed-window limiter backed by Postgres, so the limit holds across server processes and restarts.
 * Counts one hit for `key` and allows at most `limit` hits per `windowSec`.
 * Fails open (allows) if the database is unreachable, so an outage never locks everyone out.
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<RateLimitResult> {
  try {
    const rows = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
      INSERT INTO "RateLimit" ("key", "count", "resetAt")
      VALUES (${key}, 1, now() + make_interval(secs => ${windowSec}))
      ON CONFLICT ("key") DO UPDATE SET
        "count"   = CASE WHEN "RateLimit"."resetAt" <= now() THEN 1 ELSE "RateLimit"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimit"."resetAt" <= now() THEN EXCLUDED."resetAt" ELSE "RateLimit"."resetAt" END
      RETURNING "count", "resetAt"`;
    const { count, resetAt } = rows[0];

    // Occasional cleanup of expired windows keeps the table small without a cron job.
    if (Math.random() < 0.01) {
      prisma.rateLimit.deleteMany({ where: { resetAt: { lt: new Date() } } }).catch(() => {});
    }

    if (count <= limit) return { ok: true, retryAfter: 0 };
    return { ok: false, retryAfter: Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 1000)) };
  } catch (err) {
    console.error("rateLimit failed, allowing request", key, err);
    return { ok: true, retryAfter: 0 };
  }
}

/** Checks several limits (e.g. per IP and per account); the first exceeded one wins. */
export async function rateLimitAll(checks: [key: string, limit: number, windowSec: number][]): Promise<RateLimitResult> {
  for (const [key, limit, windowSec] of checks) {
    const r = await rateLimit(key, limit, windowSec);
    if (!r.ok) return r;
  }
  return { ok: true, retryAfter: 0 };
}

/**
 * Client IP from the reverse proxy headers.
 * shortcut: trusts x-forwarded-for as set by the host/proxy; if the app is ever exposed without a
 * proxy that overwrites it, clients could spoof it, so rely on the per-account limits too.
 */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
}

export function tooManyRequests(retryAfter: number) {
  const minutes = Math.ceil(retryAfter / 60);
  return NextResponse.json(
    { success: false, message: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}
