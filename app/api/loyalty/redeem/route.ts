import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { warungApi } from "@/lib/api";
import { fulfillOrder } from "@/lib/fulfillOrder";
import { LOYALTY_REWARD, LOYALTY_REWARD_VARIANT_ID } from "@/lib/loyalty";

class CouponUnavailableError extends Error {}

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

    const body = await req.json().catch(() => ({}));
    const emailInvite = typeof body?.emailInvite === "string" ? body.emailInvite.trim() : "";
    if (!emailInvite || emailInvite.length > 254 || !/^\S+@\S+\.\S+$/.test(emailInvite)) {
      return NextResponse.json({ success: false, message: "Email invite wajib diisi dengan format valid." }, { status: 400 });
    }

    const coupon = await prisma.coupon.findFirst({
      where: { userId, reward: LOYALTY_REWARD, status: "ACTIVE" },
    });
    if (!coupon) {
      return NextResponse.json({ success: false, message: "Tidak ada kupon aktif untuk ditukarkan." }, { status: 400 });
    }

    // Look the reward up before touching the coupon, so an unavailable reward leaves it ACTIVE.
    let products;
    try {
      products = await warungApi.getProducts();
    } catch {
      return NextResponse.json(
        { success: false, message: "Layanan produk sedang tidak dapat dihubungi. Coba lagi sebentar lagi." },
        { status: 502 }
      );
    }
    if (!products.success) {
      return NextResponse.json({ success: false, message: "Gagal mengambil data produk. Coba lagi." }, { status: 502 });
    }

    let productName: string | null = null;
    let variant: { id: string; name: string; price: number; duration: string; type: string; stock: number } | null = null;
    for (const p of products.data) {
      const v = p.variants.find((v) => v.id === LOYALTY_REWARD_VARIANT_ID);
      if (v) {
        productName = p.name;
        variant = v;
        break;
      }
    }

    if (!productName || !variant) {
      return NextResponse.json({ success: false, message: "Produk hadiah sedang tidak tersedia." }, { status: 404 });
    }
    if (variant.stock < 1) {
      return NextResponse.json(
        { success: false, message: "Stok hadiah sedang habis. Kupon kamu tetap aman, coba lagi nanti." },
        { status: 400 }
      );
    }

    const rewardVariant = variant;
    const rewardProductName = productName;

    // Claim the coupon, create the free order and link them atomically: either all happen or none.
    const order = await prisma.$transaction(
      async (tx) => {
        const claimed = await tx.coupon.updateMany({
          where: { id: coupon.id, status: "ACTIVE" },
          data: { status: "REDEEMED", redeemedAt: new Date() },
        });
        if (claimed.count === 0) throw new CouponUnavailableError();

        const created = await tx.order.create({
          data: {
            userId,
            variantId: rewardVariant.id,
            productName: rewardProductName,
            variantName: rewardVariant.name,
            duration: rewardVariant.duration,
            type: rewardVariant.type,
            sellPrice: 0,
            costPrice: rewardVariant.price,
            quantity: 1,
            paymentMethod: "COUPON",
            paymentNote: `Kupon ${coupon.code}`,
            emailInvite,
            status: "PAID",
          },
        });

        await tx.coupon.update({ where: { id: coupon.id }, data: { orderId: created.id } });
        return created;
      },
      { timeout: 20000 }
    );

    // Same fulfilment path as any paid order; on failure it lands in AWAITING_RETRY for admin.
    const result = await fulfillOrder(order.id);

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.id,
        fulfilled: result.success,
        message: result.success
          ? "Kupon berhasil ditukar. Cek email untuk undangan Gemini AI Pro."
          : "Kupon berhasil ditukar. Pesananmu sedang diproses admin.",
      },
    });
  } catch (err) {
    if (err instanceof CouponUnavailableError) {
      return NextResponse.json({ success: false, message: "Kupon sudah ditukarkan." }, { status: 409 });
    }
    console.error("POST /api/loyalty/redeem failed:", err);
    return NextResponse.json({ success: false, message: "Gagal menukar kupon. Coba lagi." }, { status: 500 });
  }
}
