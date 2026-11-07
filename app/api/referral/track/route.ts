import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { REF_COOKIE, REF_COOKIE_MAX_AGE } from "@/lib/referral";

// Stores the last-clicked referral code for 30 days; checkout reads it from the cookie.
export async function POST(req: NextRequest) {
  const { code } = await req.json().catch(() => ({}));
  if (typeof code !== "string" || !/^[A-Za-z0-9]{4,16}$/.test(code)) {
    return NextResponse.json({ success: false, message: "Kode tidak valid." }, { status: 400 });
  }

  const normalized = code.toUpperCase();
  const referrer = await prisma.user.findUnique({ where: { referralCode: normalized }, select: { id: true } });
  if (!referrer) return NextResponse.json({ success: false, message: "Kode tidak ditemukan." }, { status: 404 });

  // One click per browser per code, so reloads don't inflate the stat.
  if (req.cookies.get(REF_COOKIE)?.value !== normalized) {
    await prisma.user.update({ where: { id: referrer.id }, data: { referralClicks: { increment: 1 } } });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(REF_COOKIE, normalized, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: REF_COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
