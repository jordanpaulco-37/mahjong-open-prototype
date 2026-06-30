import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, city_id, series_id, skill_level } = body;

    if (!full_name || !email || !phone || !city_id || !series_id || !skill_level) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    const supabase: any = createAdminClient();

    if (!supabase) {
      console.error("Registration failed because Supabase admin credentials are missing.");
      return NextResponse.json({ error: "Registration service is unavailable right now." }, { status: 503 });
    }

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

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: "The Mahjong Open <welcome@themahjongopen.com>",
          to: [email],
          subject: "Welcome to The Mahjong Open — 2026 — Series One",
          html: `
            <p>Hi ${full_name},</p>
            <p>Thank you for registering for <strong>The Mahjong Open — 2026 — Series One</strong> (Aug 17–Oct 11).</p>
            <p>Your registration is in and we’re looking forward to seeing you this series.</p>
            <p>The player portal will open before the series starts, and we’ll send access details by email when it’s ready.</p>
            <p>Thanks again,<br />The Mahjong Open</p>
          `,
        });
      } catch (emailError) {
        console.warn("Welcome email failed to send.", emailError);
      }
    } else {
      console.warn("Skipping welcome email because RESEND_API_KEY is not configured.");
    }

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
