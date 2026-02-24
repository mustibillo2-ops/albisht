import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "الرجاء تعبئة جميع الحقول" },
      { status: 400 }
    );
  }

  try {
    const saved = await prisma.contactMessage.create({
      data: { name, email, message },
    });
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json(
      { error: "تعذر حفظ الرسالة" },
      { status: 500 }
    );
  }
}

