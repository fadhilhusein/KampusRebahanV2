import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { getSessionUserId } from "@/lib/referral";
import { warungApi } from "@/lib/api";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { estimateOrderRefund, parseWarrantyDays } from "@/lib/refundCalc";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ success: false, message: "Login dulu untuk cek invoice." }, { status: 401 });

  const limited = await rateLimit(`refund-estimate:user:${userId}`, 30, 600);
  if (!limited.ok) return tooManyRequests(limited.retryAfter);

  const invoice = (req.nextUrl.searchParams.get("invoice") ?? "").trim().replace(/^#/, "");
  const date = req.nextUrl.searchParams.get("date") ?? "";
  if (!invoice || invoice.length > 64) {
    return NextResponse.json({ success: false, message: "Nomor invoice wajib diisi." }, { status: 400 });
  }
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ success: false, message: "Format tanggal tidak valid." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: invoice } });
  // Same answer for "not found" and "not yours" so invoice numbers can't be probed.
  if (!order || (order.userId !== userId && !(await requireAdmin()))) {
    return NextResponse.json({ success: false, message: "Invoice tidak ditemukan di akunmu." }, { status: 404 });
  }

  const products = await warungApi.getProducts().catch(() => null);
  const variant = products?.success
    ? products.data.flatMap((p) => p.variants).find((v) => v.id === order.variantId)
    : undefined;
  if (!variant) {
    return NextResponse.json(
      { success: false, message: "Data garansi produk ini tidak tersedia lagi. Hubungi admin untuk cek manual." },
      { status: 422 }
    );
  }

  const now = new Date();
  // A chosen date counts as midday WIB; capped at now so "today" is never in the future.
  const issueAt = date ? new Date(Math.min(new Date(`${date}T12:00:00+07:00`).getTime(), now.getTime())) : now;
  if (date && isNaN(issueAt.getTime())) {
    return NextResponse.json({ success: false, message: "Format tanggal tidak valid." }, { status: 400 });
  }

  const warrantyDays = parseWarrantyDays(variant.warranty);
  const result = estimateOrderRefund({
    status: order.status,
    sellPrice: order.sellPrice,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    completedAt: order.completedAt,
    refundedAt: order.refundedAt,
    warrantyDays,
    issueAt,
    now,
  });

  return NextResponse.json({
    success: true,
    data: {
      invoice: order.id,
      productName: order.productName,
      variantName: order.variantName,
      price: order.sellPrice,
      paymentMethod: order.paymentMethod,
      warranty: variant.warranty,
      deliveredAt: order.completedAt,
      ...result,
    },
  });
}
