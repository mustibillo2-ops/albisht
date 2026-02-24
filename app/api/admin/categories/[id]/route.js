import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function resolveParams(context) {
  const resolved = await context;
  return resolved?.params ?? {};
}

export async function PUT(request, context) {
  const params = await resolveParams(context);
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json(
      { message: "معرّف فئة غير صالح." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { nameAr, slug, isActive = true, imageUrl, description } = body;

    if (nameAr !== undefined && !String(nameAr).trim()) {
      return NextResponse.json(
        { message: "اسم الفئة مطلوب." },
        { status: 400 }
      );
    }
    if (slug !== undefined && !String(slug).trim()) {
      return NextResponse.json(
        { message: "المعرّف المختصر (Slug) مطلوب." },
        { status: 400 }
      );
    }

    const data = {
      ...(nameAr !== undefined ? { nameAr: String(nameAr).trim() } : {}),
      ...(slug !== undefined ? { slug: String(slug).trim() } : {}),
      ...(description !== undefined ? { description } : {}),
      isActive: Boolean(isActive),
      imageUrl: imageUrl || null,
    };

    const category = await prisma.category.update({
      where: { id },
      data,
    });
    return NextResponse.json({
      message: "تم تحديث الفئة بنجاح.",
      category,
    });
  } catch (err) {
    console.error("PUT /admin/categories/[id] error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ message: "الفئة غير موجودة." }, { status: 404 });
    }
    if (err?.code === "P2002") {
      return NextResponse.json(
        { message: "المعرّف المختصر (Slug) مستخدم مسبقاً." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "حدث خطأ أثناء تحديث الفئة." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, context) {
  const params = await resolveParams(context);
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json(
      { message: "معرّف فئة غير صالح." },
      { status: 400 }
    );
  }

  try {
    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json(
      { message: "تم حذف الفئة بنجاح (تعطيل)." },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /admin/categories/[id] error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ message: "الفئة غير موجودة." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "تعذر حذف الفئة." },
      { status: 500 }
    );
  }
}

