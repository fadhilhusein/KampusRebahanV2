import { NextRequest, NextResponse } from "next/server";
import { warungApi } from "@/lib/api";
import { bayarGg, QRIS_GATEWAY_MAX_AMOUNT } from "@/lib/bayarGg";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getMarkupPercent, isBankTransferEnabled } from "@/lib/settings";
import { fulfillOrder } from "@/lib/fulfillOrder";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ success: false, message: "Login diperlukan." }, { status: 401 });
    }

    const userId: string | undefined =
      (session?.user as { id?: string })?.id ??
      (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan." }, { status: 404 });
    }

    const body = await req.json();
    const { variantId, productId, paymentRef, paymentNote, paymentMethod = "BANK_TRANSFER", emailInvite } = body;

    if (!["BANK_TRANSFER", "QRIS_GATEWAY", "BALANCE"].includes(paymentMethod)) {
      return NextResponse.json({ success: false, message: "Metode pembayaran tidak valid." }, { status: 400 });
    }

    if (paymentMethod === "BANK_TRANSFER" && !(await isBankTransferEnabled())) {
      return NextResponse.json({ success: false, message: "Transfer bank manual sedang tidak tersedia." }, { status: 400 });
    }

    const quantity = Number(body.quantity ?? 1);

    if (!variantId || typeof variantId !== "string") {
      return NextResponse.json({ success: false, message: "variantId wajib diisi." }, { status: 400 });
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return NextResponse.json({ success: false, message: "Jumlah harus antara 1–100." }, { status: 400 });
    }

    if (paymentRef && typeof paymentRef === "string" && paymentRef.length > 100) {
      return NextResponse.json({ success: false, message: "Referensi transfer terlalu panjang." }, { status: 400 });
    }

    if (paymentNote && typeof paymentNote === "string" && paymentNote.length > 500) {
      return NextResponse.json({ success: false, message: "Catatan terlalu panjang (maks 500 karakter)." }, { status: 400 });
    }

    // Fetch product to get cost price + info
    const products = await warungApi.getProducts();
    if (!products.success) {
      return NextResponse.json({ success: false, message: "Gagal mengambil data produk." }, { status: 500 });
    }

    let foundProduct: { name: string } | null = null;
    let foundVariant: { id: string; name: string; price: number; duration: string; type: string; stock: number } | null = null;

    for (const p of products.data) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) {
        foundProduct = p;
        foundVariant = v;
        break;
      }
    }

    if (!foundProduct || !foundVariant) {
      return NextResponse.json({ success: false, message: "Varian tidak ditemukan." }, { status: 404 });
    }

    if (foundVariant.stock < quantity) {
      return NextResponse.json({ success: false, message: `Stok tidak mencukupi. Tersedia: ${foundVariant.stock}.` }, { status: 400 });
    }

    if (foundVariant.type === "Invite") {
      if (!emailInvite || typeof emailInvite !== "string" || !/^\S+@\S+\.\S+$/.test(emailInvite)) {
        return NextResponse.json({ success: false, message: "Email invite wajib diisi dengan format valid untuk produk tipe Invite." }, { status: 400 });
      }
    }

    const costPrice = foundVariant.price;
    const markupPct = await getMarkupPercent();
    const sellPrice = Math.ceil(costPrice * (1 + markupPct / 100));
    const totalSellPrice = sellPrice * quantity;

    if (paymentMethod === "QRIS_GATEWAY" && totalSellPrice > QRIS_GATEWAY_MAX_AMOUNT) {
      return NextResponse.json(
        { success: false, message: `QRIS otomatis maksimal Rp${QRIS_GATEWAY_MAX_AMOUNT.toLocaleString("id-ID")}. Gunakan transfer bank untuk nominal ini.` },
        { status: 400 }
      );
    }

    // Generate unique payment code 1-999 so admin can identify manual bank transfers by exact amount
    const uniqueCode = paymentMethod === "BANK_TRANSFER" ? Math.floor(Math.random() * 999) + 1 : 0;

    if (paymentMethod === "BALANCE") {
      // Atomic check-and-debit: only succeeds if balance is still sufficient at
      // the moment of the update, preventing a race from overspending.
      const debited = await prisma.user.updateMany({
        where: { id: userId, balance: { gte: totalSellPrice } },
        data: { balance: { decrement: totalSellPrice } },
      });

      if (debited.count === 0) {
        return NextResponse.json({ success: false, message: "Saldo tidak mencukupi." }, { status: 400 });
      }
    }

    const order = await prisma.order.create({
      data: {
        userId,
        variantId,
        productName: foundProduct.name,
        variantName: foundVariant.name,
        duration: foundVariant.duration,
        type: foundVariant.type,
        sellPrice: totalSellPrice,
        costPrice: costPrice * quantity,
        quantity,
        uniqueCode,
        paymentRef: paymentRef?.trim() || null,
        paymentNote: paymentNote?.trim() || null,
        emailInvite: emailInvite?.trim() || null,
        paymentMethod,
        status: paymentMethod === "BALANCE" ? "PAID" : "PENDING_PAYMENT",
      },
    });

    if (paymentMethod === "BALANCE") {
      const updatedUser = await prisma.user.findUnique({ where: { id: userId }, select: { balance: true } });
      await prisma.balanceTransaction.create({
        data: {
          userId,
          type: "PURCHASE",
          amount: -totalSellPrice,
          balanceAfter: updatedUser?.balance ?? 0,
          orderId: order.id,
        },
      });

      await fulfillOrder(order.id);
      return NextResponse.json({ success: true, data: { order_id: order.id, unique_code: order.uniqueCode } });
    }

    if (paymentMethod === "QRIS_GATEWAY") {
      const appUrl = process.env.APP_URL || new URL(req.url).origin;
      const gatewayResult = await bayarGg.createPayment({
        amount: totalSellPrice,
        payment_url: "https://www.bayar.gg/pay",
        payment_method: "qris",
        use_qris_converter: true,
        description: `${foundProduct.name} - ${foundVariant.name}`,
        customer_name: session.user?.name ?? undefined,
        customer_email: email,
        redirect_url: `${appUrl}/order/${order.id}`,
      });

      if (!gatewayResult.success) {
        await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
        return NextResponse.json({ success: false, message: `Gagal membuat pembayaran QRIS: ${gatewayResult.error}` }, { status: 502 });
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          gatewayInvoiceId: gatewayResult.data.invoice_id,
          gatewayQrString: gatewayResult.data.qris_string ?? null,
          gatewayStatus: gatewayResult.data.status,
          gatewayExpiresAt: new Date(gatewayResult.data.expires_at),
        },
      });
    }

    return NextResponse.json({ success: true, data: { order_id: order.id, unique_code: order.uniqueCode } });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
