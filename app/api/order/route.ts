import { NextRequest, NextResponse } from "next/server";
import { warungApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getMarkupPercent } from "@/lib/settings";

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
    const { variantId, productId, paymentRef, paymentNote, paymentMethod = "BANK_TRANSFER" } = body;

    if (!["BANK_TRANSFER", "QRIS"].includes(paymentMethod)) {
      return NextResponse.json({ success: false, message: "Metode pembayaran tidak valid." }, { status: 400 });
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

    const costPrice = foundVariant.price;
    const markupPct = await getMarkupPercent();
    const sellPrice = Math.ceil(costPrice * (1 + markupPct / 100));

    // Generate unique payment code 1-999 so admin can identify payments by exact amount
    const uniqueCode = Math.floor(Math.random() * 999) + 1;

    const order = await prisma.order.create({
      data: {
        userId,
        variantId,
        productName: foundProduct.name,
        variantName: foundVariant.name,
        duration: foundVariant.duration,
        type: foundVariant.type,
        sellPrice: sellPrice * quantity,
        costPrice: costPrice * quantity,
        quantity,
        uniqueCode,
        paymentRef: paymentRef?.trim() || null,
        paymentNote: paymentNote?.trim() || null,
        paymentMethod,
        status: "PENDING_PAYMENT",
      },
    });

    return NextResponse.json({ success: true, data: { order_id: order.id, unique_code: order.uniqueCode } });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
