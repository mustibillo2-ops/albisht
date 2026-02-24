import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
      !adminPassword ||
      typeof password !== "string" ||
      password.trim() !== adminPassword
    ) {
      return NextResponse.json(
        { message: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, "true", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Admin login error", error);
    return NextResponse.json(
      { message: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}

