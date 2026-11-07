import { NextResponse } from "next/server";
import {
  isBankTransferEnabled,
  isQrisGatewayEnabled,
  isQrisBridgeEnabled,
  isTopupQrisGatewayEnabled,
  isTopupQrisBridgeEnabled,
} from "@/lib/settings";

export async function GET() {
  const [bankTransferEnabled, qrisGatewayEnabled, qrisBridgeEnabled, topupQrisGatewayEnabled, topupQrisBridgeEnabled] = await Promise.all([
    isBankTransferEnabled(),
    isQrisGatewayEnabled(),
    isQrisBridgeEnabled(),
    isTopupQrisGatewayEnabled(),
    isTopupQrisBridgeEnabled(),
  ]);

  return NextResponse.json({
    success: true,
    data: { bankTransferEnabled, qrisGatewayEnabled, qrisBridgeEnabled, topupQrisGatewayEnabled, topupQrisBridgeEnabled },
  });
}
