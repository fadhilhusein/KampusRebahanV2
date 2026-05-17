import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, name: true } } },
  });

  return NextResponse.json({ success: true, data: orders });
}
