import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { syncSupplierOrders } from "@/lib/supplierSync";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  await syncSupplierOrders();

  const [orders, userCount] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.user.count(),
  ]);

  return NextResponse.json({ success: true, data: orders, userCount });
}
