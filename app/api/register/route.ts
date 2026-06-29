import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, city_id, series_id, skill_level } = body;

    if (!full_name || !email || !phone || !city_id || !series_id || !skill_level) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    const supabase: any = createAdminClient();

    const { error } = await supabase.from("registrations").insert({
      full_name,
      email,
      phone,
      city_id,
      series_id,
      skill_level,
      paid_status: "pending",
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "You are already registered for this series." }, { status: 409 });
      }

      return NextResponse.json({ error: "Registration could not be saved. Please try again." }, { status: 500 });
    }

    // TODO: send a welcome email via Resend once the email integration is wired in.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid registration payload." }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function PATCH() {
  return NextResponse.json({ ok: true });
}
