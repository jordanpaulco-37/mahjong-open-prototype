import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/admin/passcode";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const isLoginRoute = pathname === "/api/admin/login";

  if (isLoginPage || isLoginRoute) {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith("/api/admin/");
  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthorized = isValidAdminCookie(cookieValue, process.env.ADMIN_PASSCODE);

  if (isAuthorized) {
    return NextResponse.next();
  }

  if (isApiRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (pathname.startsWith("/admin")) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|images).*)",
  ],
};
