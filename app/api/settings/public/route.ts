import { NextResponse } from "next/server";
import { isBankTransferEnabled } from "@/lib/settings";

export async function GET() {
  const bankTransferEnabled = await isBankTransferEnabled();
  return NextResponse.json({ success: true, data: { bankTransferEnabled } });
}
