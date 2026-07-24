import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { fulfillOrder } from "@/lib/fulfillOrder";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ success: false, message: "orderId wajib diisi." }, { status: 400 });

  const result = await fulfillOrder(orderId);

  if (result.success) {
    return NextResponse.json({ success: true, message: result.message, data: { apiOrderId: result.apiOrderId } });
  }

  return NextResponse.json({ success: false, message: result.message }, { status: 400 });
}
