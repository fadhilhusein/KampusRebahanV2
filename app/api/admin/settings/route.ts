import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  getMarkupPercent,
  setMarkupPercent,
  isBankTransferEnabled,
  setBankTransferEnabled,
  isQrisGatewayEnabled,
  setQrisGatewayEnabled,
  isQrisBridgeEnabled,
  setQrisBridgeEnabled,
} from "@/lib/settings";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const [markup, bankTransferEnabled, qrisGatewayEnabled, qrisBridgeEnabled] = await Promise.all([
    getMarkupPercent(),
    isBankTransferEnabled(),
    isQrisGatewayEnabled(),
    isQrisBridgeEnabled(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      markup_percent: markup,
      bank_transfer_enabled: bankTransferEnabled,
      qris_gateway_enabled: qrisGatewayEnabled,
      qris_bridge_enabled: qrisBridgeEnabled,
    },
  });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

  const body = await req.json();

  if (body.markup_percent !== undefined) {
    const value = Number(body.markup_percent);

    if (isNaN(value) || value < 0 || value > 1000) {
      return NextResponse.json({ success: false, message: "Nilai markup tidak valid (0–1000)." }, { status: 400 });
    }

    await setMarkupPercent(value);
    return NextResponse.json({ success: true, message: `Markup diupdate ke ${value}%` });
  }

  if (body.bank_transfer_enabled !== undefined) {
    await setBankTransferEnabled(Boolean(body.bank_transfer_enabled));
    return NextResponse.json({
      success: true,
      message: body.bank_transfer_enabled ? "Transfer bank diaktifkan." : "Transfer bank dimatikan.",
    });
  }

  if (body.qris_gateway_enabled !== undefined) {
    await setQrisGatewayEnabled(Boolean(body.qris_gateway_enabled));
    return NextResponse.json({
      success: true,
      message: body.qris_gateway_enabled ? "QRIS (Bayar.gg) diaktifkan." : "QRIS (Bayar.gg) dimatikan.",
    });
  }

  if (body.qris_bridge_enabled !== undefined) {
    await setQrisBridgeEnabled(Boolean(body.qris_bridge_enabled));
    return NextResponse.json({
      success: true,
      message: body.qris_bridge_enabled ? "QRIS Instan (Bridge) diaktifkan." : "QRIS Instan (Bridge) dimatikan.",
    });
  }

  return NextResponse.json({ success: false, message: "Tidak ada pengaturan yang dikirim." }, { status: 400 });
}
