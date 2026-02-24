import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const USER_SESSION_COOKIE = "user_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // أسبوع

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body || {};

    const sanitize = (value) => String(value ?? "").trim();
    const nameValue = sanitize(name);
    const emailValue = sanitize(email).toLowerCase();
    const phoneValue = sanitize(phone);
    const passwordValue = String(password ?? "");

    if (!nameValue || !emailValue || !phoneValue || !passwordValue) {
      return NextResponse.json(
        { message: "يرجى تعبئة جميع الحقول المطلوبة" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: emailValue },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "هذا البريد الإلكتروني مستخدم مسبقاً" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(passwordValue, 10);

    const user = await prisma.user.create({
      data: {
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        role: "customer",
        passwordHash,
      },
    });

    const response = NextResponse.json({
      message: "تم إنشاء الحساب بنجاح",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

    response.cookies.set(USER_SESSION_COOKIE, String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Signup error", error);
    return NextResponse.json(
      { message: "تعذر إنشاء الحساب، حاول مجدداً" },
      { status: 500 }
    );
  }
}
