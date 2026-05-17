import { NextResponse } from "next/server";
import { warungApi } from "@/lib/api";
import type { Product } from "@/lib/types";

export async function GET() {
  try {
    const data = await warungApi.getProducts();

    if (data.success) {
      const markup = Number(process.env.MARKUP_PERCENT ?? "0");
      if (markup > 0) {
        data.data = data.data.map((product: Product) => ({
          ...product,
          variants: product.variants.map((v) => ({
            ...v,
            price: Math.ceil(v.price * (1 + markup / 100)),
          })),
        }));
      }
    }

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
