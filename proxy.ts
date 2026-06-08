// Demo mode: no auth checks. All routes are accessible.
// When connecting Supabase, restore the full auth/payment guard from git history.
import { NextResponse, type NextRequest } from "next/server";

export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|images|api).*)",
  ],
};
