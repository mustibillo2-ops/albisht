import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
    });

    if (!category || !category.isActive) {
      return NextResponse.json({ error: "الفئة غير موجودة" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { categoryId: category.id, isActive: true },
      include: { category: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Category products error", error);
    return NextResponse.json(
      { error: "تعذر جلب المنتجات" },
      { status: 500 }
    );
  }
}

