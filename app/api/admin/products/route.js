import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        nameAr: true,
        slug: true,
        description: true,
        fabric: true,
        color: true,
        price: true,
        stock: true,
        mainImage: true,
        isActive: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, nameAr: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      message: "تم جلب المنتجات بنجاح",
      products,
    });
  } catch (err) {
    console.error("GET /admin/products error:", err);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب المنتجات." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nameAr,
      slug,
      description,
      fabric,
      color,
      price,
      stock,
      categoryId,
      isActive = true,
      mainImage,
    } = body;

    if (!nameAr || !slug || !description || !fabric || !color) {
      return NextResponse.json(
        { message: "الرجاء تعبئة جميع الحقول المطلوبة." },
        { status: 400 }
      );
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock || 0);
    const parsedCategoryId = Number(categoryId);

    if (
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0 ||
      Number.isNaN(parsedStock) ||
      parsedStock < 0 ||
      Number.isNaN(parsedCategoryId)
    ) {
      return NextResponse.json(
        { message: "قيم السعر أو المخزون أو الفئة غير صالحة." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        nameAr,
        slug,
        description,
        fabric,
        color,
        price: parsedPrice,
        stock: parsedStock,
        categoryId: parsedCategoryId,
        isActive: Boolean(isActive),
        mainImage: mainImage || null,
      },
    });

    return NextResponse.json(
      { message: "تم حفظ المنتج بنجاح.", product },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /admin/products error:", err);
    if (err?.code === "P2002") {
      return NextResponse.json(
        { message: "المعرّف المختصر (Slug) مستخدم مسبقاً." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "حدث خطأ أثناء حفظ المنتج." },
      { status: 500 }
    );
  }
}

