import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLoyaltyState } from "@/lib/loyalty";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ success: false, message: "Login diperlukan." }, { status: 401 });
    }

    const userId: string | undefined =
      (session?.user as { id?: string })?.id ??
      (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: await getLoyaltyState(userId) });
  } catch (err) {
    console.error("GET /api/loyalty failed:", err);
    return NextResponse.json({ success: false, message: "Gagal memuat data loyalitas." }, { status: 500 });
  }
}
