export const runtime = "nodejs";

import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "لم يتم العثور على ملف" },
        { status: 400 }
      );
    }

    const originalName = file.name || "product-image";
    const ext = path.extname(originalName) || ".jpg";
    const fileName = `${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/products/${fileName}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Product upload error:", error);
    return NextResponse.json(
      { error: "تعذر رفع الصورة" },
      { status: 500 }
    );
  }
}

