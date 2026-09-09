import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { bayarGg, TOPUP_MIN_AMOUNT, QRIS_GATEWAY_MAX_AMOUNT } from "@/lib/bayarGg";

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
    const amount = Number(body.amount);

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
    const gatewayResult = await bayarGg.createPayment({
      amount,
      payment_url: "https://www.bayar.gg/pay",
      payment_method: "qris",
      use_qris_converter: true,
      description: "Top up saldo KampusRebahan",
      customer_name: session.user?.name ?? undefined,
      customer_email: email,
      redirect_url: `${appUrl}/balance/topup/${topup.id}`,
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
