import { NextResponse } from "next/server";
import { warungApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId: string | undefined =
      (session?.user as { id?: string })?.id ??
      (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan." }, { status: 404 });
    }

    // Primary source: DB orders (all statuses, sell price)
    const dbOrders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Secondary: warungrebahan API for account_details on completed orders
    const apiData = await warungApi.getTransactions();
    const apiTxMap = new Map<string, Record<string, unknown>>();
    if (apiData.success) {
      for (const tx of apiData.data as Array<Record<string, unknown>>) {
        if (tx.order_id) apiTxMap.set(tx.order_id as string, tx);
      }
    }

    const merged = dbOrders.map((order) => {
      const apiTx = order.apiOrderId ? apiTxMap.get(order.apiOrderId) : null;
      return {
        order_id: order.id,
        db_order_id: order.id,
        db_status: order.status,
        status: apiTx?.status ?? order.status.toLowerCase(),
        payment_status: apiTx?.payment_status ?? order.status.toLowerCase(),
        total_amount: order.sellPrice,
        products: (apiTx?.products as unknown[]) ?? [],
        account_details: (apiTx?.account_details as unknown[]) ?? [],
        created_at: order.createdAt.toISOString(),
        productName: order.productName,
        variantName: order.variantName,
        duration: order.duration,
        type: order.type,
        quantity: order.quantity,
        paymentMethod: order.paymentMethod,
      };
    });

    return NextResponse.json({ success: true, data: merged });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: String(err) },
      { status: 500 }
    );
  }
}
