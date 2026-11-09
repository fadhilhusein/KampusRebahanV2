import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/adminAuth";
import { syncSupplierOrders } from "@/lib/supplierSync";
import { isBankTransferExpired } from "@/lib/stockRules";

/** Unpaid bank transfer past the window: mark EXPIRED (lazily, when the order is read). */
async function expireStaleBankTransfer(order: { id: string; status: string; paymentMethod: string; createdAt: Date }) {
  if (order.paymentMethod !== "BANK_TRANSFER" || order.status !== "PENDING_PAYMENT") return false;
  if (!isBankTransferExpired(order.createdAt, new Date())) return false;
  await prisma.order.updateMany({ where: { id: order.id, status: "PENDING_PAYMENT" }, data: { status: "EXPIRED" } });
  return true;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { orderId } = await params;
  await syncSupplierOrders({ orderId });
  const found = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true, status: true, paymentMethod: true, createdAt: true } });
  if (found) await expireStaleBankTransfer(found);
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  const userId =
    (session?.user as { id?: string })?.id ??
    (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

  if (order.userId !== userId && !(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ success: true, data: order });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { orderId } = await params;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });

  const userId =
    (session?.user as { id?: string })?.id ??
    (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

  if (order.userId !== userId) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { action } = body;

  if (action === "confirm_payment") {
    // Only manual bank transfers are self-reported (then verified by admin). QRIS orders are
    // marked paid by the gateway alone, so a customer must not flip them to PAID.
    if (order.paymentMethod !== "BANK_TRANSFER") {
      return NextResponse.json(
        { success: false, message: "Pembayaran QRIS dikonfirmasi otomatis oleh sistem." },
        { status: 400 }
      );
    }
    if (await expireStaleBankTransfer(order)) {
      return NextResponse.json(
        { success: false, message: "Batas waktu pembayaran 1 jam sudah lewat. Jika kamu sudah transfer, hubungi admin lewat WhatsApp." },
        { status: 400 }
      );
    }
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ success: false, message: "Status order tidak valid." }, { status: 400 });
    }
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });
    return NextResponse.json({ success: true, data: updated });
  }

  return NextResponse.json({ success: false, message: "Action tidak dikenali." }, { status: 400 });
}
