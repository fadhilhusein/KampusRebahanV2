import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ topupId: string }> }) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { topupId } = await params;
  const topup = await prisma.balanceTopUp.findUnique({ where: { id: topupId } });
  if (!topup) return NextResponse.json({ success: false, message: "Top up tidak ditemukan." }, { status: 404 });

  const userId =
    (session?.user as { id?: string })?.id ??
    (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

  if (topup.userId !== userId) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ success: true, data: topup });
}
