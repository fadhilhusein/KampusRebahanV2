import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { creditCommission } from "@/lib/referral";
import { notifyOrderCompleted } from "@/lib/supplierSync";

const CHANNELS = ["WHATSAPP", "EMAIL"] as const;
// Paid orders the supplier hasn't delivered yet (incl. a confirmed bank transfer and failed supplier calls).
const STARTABLE = ["PAID", "PROCESSING", "AWAITING_RETRY"] as const;

/**
 * Manual delivery by the admin.
 * START: { orderId, action: "START", channel: "WHATSAPP" | "EMAIL", note? } shows the customer
 *   "diproses manual" and keeps the order PROCESSING until the admin marks it done.
 * COMPLETE: { orderId, action: "COMPLETE" } finishes it like a supplier delivery would.
 */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { orderId, action, channel, note } = await req.json();
  if (!orderId || typeof orderId !== "string") {
    return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });
  }

  if (action === "START") {
    if (!CHANNELS.includes(channel)) {
      return NextResponse.json({ success: false, message: "Pilih saluran WhatsApp atau email." }, { status: 400 });
    }
    if (note != null && (typeof note !== "string" || note.length > 300)) {
      return NextResponse.json({ success: false, message: "Catatan maksimal 300 karakter." }, { status: 400 });
    }
    const claimed = await prisma.order.updateMany({
      where: { id: orderId, status: { in: [...STARTABLE] }, refundedAt: null, manualAt: null },
      data: { status: "PROCESSING", manualChannel: channel, manualAt: new Date(), manualNote: note?.trim() || null },
    });
    if (claimed.count === 0) {
      return NextResponse.json({ success: false, message: "Pesanan ini tidak bisa diproses manual (sudah selesai, direfund, atau sudah manual)." }, { status: 409 });
    }
    return NextResponse.json({ success: true, message: `Pesanan ditandai diproses manual via ${channel === "WHATSAPP" ? "WhatsApp" : "email"}.` });
  }

  if (action === "COMPLETE") {
    const claimed = await prisma.order.updateMany({
      where: { id: orderId, status: "PROCESSING", manualAt: { not: null }, refundedAt: null },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    if (claimed.count === 0) {
      return NextResponse.json({ success: false, message: "Pesanan ini belum diproses manual atau sudah selesai." }, { status: 409 });
    }
    // Same follow-ups as a supplier delivery (lib/supplierSync markOrderCompleted).
    await creditCommission(orderId);
    await notifyOrderCompleted(orderId);
    return NextResponse.json({ success: true, message: "Pesanan ditandai selesai." });
  }

  return NextResponse.json({ success: false, message: "Aksi tidak dikenali." }, { status: 400 });
}
