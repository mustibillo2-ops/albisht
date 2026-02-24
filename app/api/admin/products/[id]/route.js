import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function resolveParams(context) {
  const resolved = await context;
  return resolved?.params ?? {};
}

export async function GET(_request, context) {
  const params = await resolveParams(context);
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { message: "معرّف منتج غير صالح." },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "المنتج غير موجود." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "تم جلب المنتج بنجاح.",
      product,
    });
  } catch (err) {
    console.error("GET /admin/products/[id] error:", err);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب المنتج." },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  const params = await resolveParams(context);
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { message: "معرّف منتج غير صالح." },
      { status: 400 }
    );
  }

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

    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json({
      message: "تم تحديث المنتج بنجاح.",
      product,
    });
  } catch (err) {
    console.error("PUT /admin/products/[id] error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ message: "المنتج غير موجود." }, { status: 404 });
    }
    if (err?.code === "P2002") {
      return NextResponse.json(
        { message: "المعرّف المختصر (Slug) مستخدم مسبقاً." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "حدث خطأ أثناء تحديث المنتج." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, context) {
  const params = await resolveParams(context);
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { message: "معرّف منتج غير صالح." },
      { status: 400 }
    );
  }

  try {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json(
      { message: "تم حذف المنتج بنجاح (تعطيل)." },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /admin/products/[id] error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ message: "المنتج غير موجود." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "تعذر حذف المنتج." },
      { status: 500 }
    );
  }
}

