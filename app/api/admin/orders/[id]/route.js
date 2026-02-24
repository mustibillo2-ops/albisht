import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: { items: { include: { product: true } } },
  });
  if (!order) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  try {
    const order = await prisma.order.update({
      where: { id: Number(params.id) },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("Update order error", error);
    return NextResponse.json(
      { error: "تعذر تحديث الطلب" },
      { status: 500 }
    );
  }
}

