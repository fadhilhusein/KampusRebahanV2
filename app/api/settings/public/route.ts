import { NextResponse } from "next/server";
import { isBankTransferEnabled, isQrisGatewayEnabled, isQrisBridgeEnabled } from "@/lib/settings";

export async function GET() {
  const [bankTransferEnabled, qrisGatewayEnabled, qrisBridgeEnabled] = await Promise.all([
    isBankTransferEnabled(),
    isQrisGatewayEnabled(),
    isQrisBridgeEnabled(),
  ]);

  return NextResponse.json({ success: true, data: { bankTransferEnabled, qrisGatewayEnabled, qrisBridgeEnabled } });
}
