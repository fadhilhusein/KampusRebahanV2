import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const userId =
    (session?.user as { id?: string })?.id ??
    (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

  if (!userId) return NextResponse.json({ success: false, message: "User tidak ditemukan." }, { status: 404 });

  const transactions = await prisma.balanceTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ success: true, data: transactions });
}
