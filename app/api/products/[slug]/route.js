import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: params.slug, isActive: true },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product slug error", error);
    return NextResponse.json(
      { error: "تعذر قراءة بيانات المنتج" },
      { status: 500 }
    );
  }
}

