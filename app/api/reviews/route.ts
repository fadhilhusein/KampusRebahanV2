import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function mapReview(review: {
  id: string;
  orderId: string;
  productName: string;
  rating: number;
  testimonial: string;
  createdAt: Date;
  user?: { name: string | null } | null;
}) {
  return {
    id: review.id,
    orderId: review.orderId,
    productName: review.productName,
    rating: review.rating,
    testimonial: review.testimonial,
    userName: review.user?.name || "Pelanggan",
    createdAt: review.createdAt.toISOString(),
  };
}

async function getSessionUserId() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) return null;

  const userId =
    (session.user as { id?: string }).id ??
    (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id;

  return userId ? { id: userId, email } : null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const productName = searchParams.get("productName");

    if (orderId) {
      const sessionUser = await getSessionUserId();
      if (!sessionUser) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { userId: true },
      });

      if (!order) {
        return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });
      }

      if (order.userId !== sessionUser.id) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }

      const review = await prisma.productReview.findUnique({
        where: { orderId },
        include: { user: { select: { name: true } } },
      });

      return NextResponse.json({ success: true, data: review ? mapReview(review) : null });
    }

    if (!productName) {
      return NextResponse.json({ success: false, message: "productName wajib diisi." }, { status: 400 });
    }

    const [reviews, summary] = await Promise.all([
      prisma.productReview.findMany({
        where: { productName },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      prisma.productReview.aggregate({
        where: { productName },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews.map(mapReview),
      summary: {
        averageRating: summary._avg.rating,
        reviewCount: summary._count._all,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUserId();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: "Login diperlukan." }, { status: 401 });
    }

    const body = await req.json();
    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    const rating = Number(body.rating);
    const testimonial = typeof body.testimonial === "string" ? body.testimonial.trim() : "";

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID wajib diisi." }, { status: 400 });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: "Rating harus antara 1 sampai 5." }, { status: 400 });
    }

    if (testimonial.length < 10) {
      return NextResponse.json({ success: false, message: "Testimoni minimal 10 karakter." }, { status: 400 });
    }

    if (testimonial.length > 800) {
      return NextResponse.json({ success: false, message: "Testimoni maksimal 800 karakter." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        productName: true,
        status: true,
        review: { select: { id: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order tidak ditemukan." }, { status: 404 });
    }

    if (order.userId !== sessionUser.id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (order.status !== "COMPLETED") {
      return NextResponse.json(
        { success: false, message: "Review hanya bisa diberikan setelah pembelian selesai disetujui admin." },
        { status: 400 }
      );
    }

    if (order.review) {
      return NextResponse.json({ success: false, message: "Review untuk transaksi ini sudah ada." }, { status: 409 });
    }

    const review = await prisma.productReview.create({
      data: {
        userId: sessionUser.id,
        orderId: order.id,
        productName: order.productName,
        rating,
        testimonial,
      },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({ success: true, data: mapReview(review) });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
