import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const USER_SESSION_COOKIE = "user_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // أسبوع

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    const sanitizeText = (value) => String(value ?? "").trim();

    const emailValue = sanitizeText(email).toLowerCase();
    const passwordValue = String(password ?? "");

    if (!emailValue || !passwordValue) {
      return NextResponse.json(
        { message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: emailValue },
    });

    if (!user) {
      return NextResponse.json(
        { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(
      passwordValue,
      user.passwordHash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
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
    console.error("Customer login error", error);
    return NextResponse.json(
      { message: "تعذر تسجيل الدخول، حاول مجدداً" },
      { status: 500 }
    );
  }
}

