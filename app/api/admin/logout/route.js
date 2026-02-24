import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";

export async function POST() {
  const response = NextResponse.json({ message: "تم تسجيل الخروج" });

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

