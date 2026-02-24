import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "تعذر قراءة الطلبات" },
      { status: 500 }
    );
  }
}

