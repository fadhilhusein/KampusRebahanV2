import { NextResponse } from "next/server";
import { getProductsWithStats } from "@/lib/products";

export async function GET() {
  try {
    const data = await getProductsWithStats();

    // Not cached at the CDN: stock depends on our own open orders and must be live.
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: String(err) },
      { status: 500 }
    );
  }
}
