import { NextResponse } from "next/server";
// Demo stub — returns success without writing to a database.
// Replace with real Supabase logic when connecting the backend.
export async function POST() {
  return NextResponse.json({ ok: true });
}
export async function GET() {
  return NextResponse.json({ ok: true });
}
export async function PATCH() {
  return NextResponse.json({ ok: true });
}
