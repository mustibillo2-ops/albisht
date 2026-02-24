import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // حماية مسارات /admin (ما عدا /admin/login القديمة)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE);

    if (!session || session.value !== "true") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("mode", "admin");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

