import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { nameAr: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories API error", error);
    return NextResponse.json(
      { error: "تعذر جلب الفئات" },
      { status: 500 }
    );
  }
}

