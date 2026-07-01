import { NextResponse } from "next/server";
import { MOCK_PLAYERS } from "@/lib/data/mock";
import { createAdminClient } from "@/lib/supabase/server";
import { isValidAdminCookie } from "@/lib/admin/passcode";

type MockPlayer = (typeof MOCK_PLAYERS)[number];

let mockPlayersState: MockPlayer[] = [...MOCK_PLAYERS];

function toSafePlayer(player: MockPlayer): MockPlayer {
  return {
    ...player,
    profiles: {
      ...(player.profiles ?? {}),
      role: (player.profiles?.role ?? "player") as MockPlayer["profiles"]["role"],
    },
  };
}

function getMockPlayers(): MockPlayer[] {
  return mockPlayersState.map(toSafePlayer);
}

function setMockPlayers(nextPlayers: MockPlayer[]) {
  mockPlayersState = nextPlayers.map(toSafePlayer);
}

function isAuthorized(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const adminCookie = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith("admin-passcode="));
  if (!adminCookie) return false;
  const value = adminCookie.split("=")[1];
  return isValidAdminCookie(value, process.env.ADMIN_PASSCODE);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (supabase) {
    const { data, error } = await supabase.from("profiles").select("id, full_name, email, role").order("full_name", { ascending: true });
    if (!error && data) {
      const players = data.map((profile) => ({
        id: profile.id,
        status: "active",
        paid_status: "paid",
        skill_level: "intermediate",
        created_at: new Date().toISOString(),
        profiles: { id: profile.id, full_name: profile.full_name, email: profile.email, role: profile.role },
        cities: { name: "Los Angeles" },
        seasons: { name: "Spring 2026" },
      }));
      return NextResponse.json({ players });
    }
  }

  return NextResponse.json({ players: getMockPlayers() });
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const designation = String(body?.designation ?? "player").toLowerCase();
  const nextRole: "player" | "admin" | "commissioner" = designation === "commissioner" ? "commissioner" : "player";
  const profileId = body?.profileId ?? body?.id;
  const cityName = String(body?.cityName ?? "");

  const supabase = createAdminClient();
  if (supabase && profileId) {
    await supabase.from("profiles").update({ role: nextRole }).eq("id", profileId);
    if (designation === "commissioner") {
      await supabase.from("profiles").update({ role: "player" }).neq("id", profileId).eq("role", "commissioner");
    }
    return NextResponse.json({ success: true, designation });
  }

  const players = getMockPlayers();
  const targetIndex = players.findIndex((player) => player.id === body?.id || player.profiles.id === profileId);
  if (targetIndex === -1) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  const nextPlayers: MockPlayer[] = players.map((player, index) => {
    if (index === targetIndex) {
      return {
        ...player,
        profiles: {
          ...player.profiles,
          role: nextRole as MockPlayer["profiles"]["role"],
        },
      } as MockPlayer;
    }

    if (designation === "commissioner" && player.profiles.role === "commissioner" && player.cities.name === cityName) {
      return {
        ...player,
        profiles: {
          ...player.profiles,
          role: "player" as MockPlayer["profiles"]["role"],
        },
      } as MockPlayer;
    }

    return player;
  });

  setMockPlayers(nextPlayers);
  return NextResponse.json({ success: true, designation, players: getMockPlayers() });
}
