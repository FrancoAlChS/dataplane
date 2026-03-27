import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.includes("_next") ||
    pathname.includes("api/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const dbCredentials = request.cookies.get("db_credentials");

  if (!dbCredentials && pathname !== "/login") {
    const setupUrl = new URL("/login", request.url);
    return NextResponse.redirect(setupUrl);
  }

  if((pathname === "/" || pathname === "/login") && dbCredentials) {
    const setupUrl = new URL("/tables", request.url);
    return NextResponse.redirect(setupUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
