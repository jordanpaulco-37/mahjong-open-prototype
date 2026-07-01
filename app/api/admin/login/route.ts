import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminCookieValue } from "@/lib/admin/passcode";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const submittedPasscode = body?.passcode?.toString();
  const nextPath = body?.next?.toString() || "/admin";

  if (!submittedPasscode || submittedPasscode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, next: nextPath });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: createAdminCookieValue(process.env.ADMIN_PASSCODE),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
