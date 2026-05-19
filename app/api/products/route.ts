import { NextResponse } from "next/server";
import { warungApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getMarkupPercent } from "@/lib/settings";
import type { Product } from "@/lib/types";

export async function GET() {
  try {
    const data = await warungApi.getProducts();

    if (data.success) {
      const soldRows = await prisma.order.groupBy({
        by: ["productName"],
        where: { status: "COMPLETED" },
        _sum: { quantity: true },
      });
      const soldByProduct = new Map(
        soldRows.map((row) => [row.productName, row._sum.quantity ?? 0])
      );
      const reviewRows = await prisma.productReview.groupBy({
        by: ["productName"],
        _avg: { rating: true },
        _count: { _all: true },
      });
      const reviewsByProduct = new Map(
        reviewRows.map((row) => [
          row.productName,
          {
            averageRating: row._avg.rating,
            reviewCount: row._count._all,
          },
        ])
      );
      const markup = await getMarkupPercent();
      data.data = data.data.map((product: Product) => ({
        ...product,
        soldCount: soldByProduct.get(product.name) ?? 0,
        averageRating: reviewsByProduct.get(product.name)?.averageRating ?? null,
        reviewCount: reviewsByProduct.get(product.name)?.reviewCount ?? 0,
        variants:
          markup > 0
            ? product.variants.map((v) => ({
                ...v,
                price: Math.ceil(v.price * (1 + markup / 100)),
              }))
            : product.variants,
      }));
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
