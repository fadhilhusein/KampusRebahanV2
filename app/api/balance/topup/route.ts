import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { bayarGg, TOPUP_MIN_AMOUNT, QRIS_GATEWAY_MAX_AMOUNT } from "@/lib/bayarGg";
import { paymentBridge } from "@/lib/paymentBridge";
import { isTopupQrisBridgeEnabled, isTopupQrisGatewayEnabled } from "@/lib/settings";

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

    const limited = await rateLimit(`topup:user:${userId}`, 5, 600);
    if (!limited.ok) return tooManyRequests(limited.retryAfter);

    const body = await req.json();
    const amount = Number(body.amount);
    const method = body.paymentMethod ?? "QRIS_GATEWAY";

    if (method !== "QRIS_GATEWAY" && method !== "QRIS_BRIDGE") {
      return NextResponse.json({ success: false, message: "Metode pembayaran tidak valid." }, { status: 400 });
    }

    const enabled = method === "QRIS_BRIDGE" ? await isTopupQrisBridgeEnabled() : await isTopupQrisGatewayEnabled();
    if (!enabled) {
      return NextResponse.json({ success: false, message: "Metode top up ini sedang tidak tersedia." }, { status: 400 });
    }

    if (!Number.isInteger(amount) || amount < TOPUP_MIN_AMOUNT || amount > QRIS_GATEWAY_MAX_AMOUNT) {
      return NextResponse.json(
        {
          success: false,
          message: `Nominal top up harus antara Rp${TOPUP_MIN_AMOUNT.toLocaleString("id-ID")} – Rp${QRIS_GATEWAY_MAX_AMOUNT.toLocaleString("id-ID")}.`,
        },
        { status: 400 }
      );
    }

    const topup = await prisma.balanceTopUp.create({
      data: { userId, amount, status: "PENDING" },
    });

    const appUrl = process.env.APP_URL || new URL(req.url).origin;
    const topupPage = `${appUrl}/dashboard/balance/topup/${topup.id}`;

    if (method === "QRIS_BRIDGE") {
      // The bridge keys payments by order_id; top up ids are cuids, so they never collide with order ids.
      const bridgeResult = await paymentBridge.createPayment({
        order_id: topup.id,
        amount,
        success_return_url: topupPage,
        cancel_return_url: topupPage,
        metadata: { user_id: userId, kind: "topup" },
      });

      if (!bridgeResult.success) {
        await prisma.balanceTopUp.update({ where: { id: topup.id }, data: { status: "CANCELLED" } });
        return NextResponse.json({ success: false, message: `Gagal membuat pembayaran QRIS Bridge: ${bridgeResult.error}` }, { status: 502 });
      }

      await prisma.balanceTopUp.update({
        where: { id: topup.id },
        data: {
          bridgeRef: bridgeResult.data.ref,
          bridgePaymentUrl: bridgeResult.data.payment_url,
          bridgeStatus: bridgeResult.data.status,
          bridgeExpiresAt: new Date(bridgeResult.data.expires_at),
        },
      });

      return NextResponse.json({ success: true, data: { topupId: topup.id, payment_url: bridgeResult.data.payment_url } });
    }

    const gatewayResult = await bayarGg.createPayment({
      amount,
      payment_url: "https://www.bayar.gg/pay",
      payment_method: "qris",
      use_qris_converter: true,
      description: "Top up saldo KampusRebahan",
      customer_name: session.user?.name ?? undefined,
      customer_email: email,
      redirect_url: topupPage,
    });

    if (!gatewayResult.success) {
      await prisma.balanceTopUp.update({ where: { id: topup.id }, data: { status: "CANCELLED" } });
      return NextResponse.json({ success: false, message: `Gagal membuat pembayaran QRIS: ${gatewayResult.error}` }, { status: 502 });
    }

    await prisma.balanceTopUp.update({
      where: { id: topup.id },
      data: {
        gatewayInvoiceId: gatewayResult.data.invoice_id,
        gatewayQrString: gatewayResult.data.qris_string ?? null,
        gatewayStatus: gatewayResult.data.status,
        gatewayExpiresAt: new Date(gatewayResult.data.expires_at),
      },
    });

    return NextResponse.json({ success: true, data: { topupId: topup.id } });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
