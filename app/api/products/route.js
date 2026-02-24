import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || 20);
  const category = searchParams.get("category");

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category
          ? {
              category: {
                slug: category,
              },
            }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API error", error);
    return NextResponse.json(
      { error: "تعذر جلب المنتجات" },
      { status: 500 }
    );
  }
}

