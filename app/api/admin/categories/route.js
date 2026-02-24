import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { nameAr: "asc" },
    });
    return NextResponse.json({
      message: "تم جلب الفئات بنجاح",
      categories,
    });
  } catch (err) {
    console.error("GET /admin/categories error:", err);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب الفئات." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nameAr, slug, isActive = true, imageUrl, description } = body;

    if (!nameAr || !slug) {
      return NextResponse.json(
        { message: "اسم الفئة والمُعرّف (slug) مطلوبان." },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        nameAr,
        slug,
        isActive: Boolean(isActive),
        imageUrl: imageUrl || null,
        ...(description !== undefined ? { description } : {}),
      },
    });

    return NextResponse.json(
      { message: "تم حفظ الفئة بنجاح.", category },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /admin/categories error:", err);
    if (err?.code === "P2002") {
      return NextResponse.json(
        { message: "المعرّف المختصر (Slug) مستخدم مسبقاً." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "حدث خطأ أثناء حفظ الفئة." },
      { status: 500 }
    );
  }
}

