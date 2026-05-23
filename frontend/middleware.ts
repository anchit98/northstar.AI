import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/workbench/auth" || pathname.startsWith("/workbench/auth/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/workbench";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  if (pathname.startsWith("/workbench")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
