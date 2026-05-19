import { NextResponse } from "next/server";
import { getProductsWithStats } from "@/lib/products";

export async function GET() {
  try {
    const data = await getProductsWithStats();

    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate" },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: String(err) },
      { status: 500 }
    );
  }
}
