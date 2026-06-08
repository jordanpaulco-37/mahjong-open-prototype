// Data access layer — currently backed by mock data.
// Each function mirrors the shape a real Supabase query would return,
// so swapping to live data means replacing the function body only.

import {
  DEMO_USER_ID,
  MOCK_MEMBERSHIP,
  MOCK_TABLES,
  MOCK_STANDINGS,
  MOCK_ANNOUNCEMENTS,
  MOCK_SCORE_SUBMISSIONS,
  MOCK_PLAYERS,
  MOCK_CITIES,
  MOCK_SEASONS,
} from "./mock";

// ── Portal: dashboard ─────────────────────────────────────────────────────────

export async function getDashboardData(userId: string) {
  const membership = userId === DEMO_USER_ID ? MOCK_MEMBERSHIP : null;

  const nextSeat = MOCK_TABLES
    .filter((t) => t.table_date >= new Date().toISOString().slice(0, 10))
    .flatMap((t) =>
      t.table_seats
        .filter((s) => s.user_id === userId && !s.canceled_at)
        .map((s) => ({ ...s, scramble_tables: t }))
    )
    .sort((a, b) => a.scramble_tables.table_date.localeCompare(b.scramble_tables.table_date))[0] ?? null;

  const standing = MOCK_STANDINGS.find((s) => s.user_id === userId) ?? null;

  const pinned = MOCK_ANNOUNCEMENTS
    .filter((a) => a.pinned && (!a.city_id || a.city_id === membership?.city_id))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null;

  return { membership, nextSeat, standing, pinned };
}

// ── Portal: open tables ───────────────────────────────────────────────────────

export async function getOpenTables(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  return MOCK_TABLES
    .filter((t) => t.status === "open" && t.table_date >= today)
    .sort((a, b) => {
      if (a.week_number !== b.week_number) return a.week_number - b.week_number;
      return a.table_date.localeCompare(b.table_date);
    });
}

// ── Portal: single table ──────────────────────────────────────────────────────

export async function getTableById(id: string) {
  return MOCK_TABLES.find((t) => t.id === id) ?? null;
}

export async function getScoreSubmissionForTable(tableId: string) {
  return MOCK_SCORE_SUBMISSIONS.find((s) => s.table_id === tableId) ?? null;
}

// ── Portal: my tables ─────────────────────────────────────────────────────────

export async function getMyTables(userId: string) {
  return MOCK_TABLES
    .filter((t) => t.table_seats.some((s) => s.user_id === userId && !s.canceled_at))
    .map((t) => {
      const seat = t.table_seats.find((s) => s.user_id === userId && !s.canceled_at)!;
      return { ...seat, scramble_tables: t };
    })
    .sort((a, b) => b.scramble_tables.table_date.localeCompare(a.scramble_tables.table_date));
}

// ── Portal: standings ─────────────────────────────────────────────────────────

export async function getStandings() {
  return MOCK_STANDINGS;
}

export async function getMembership(userId: string) {
  return userId === DEMO_USER_ID ? MOCK_MEMBERSHIP : null;
}

// ── Portal: announcements ─────────────────────────────────────────────────────

export async function getAnnouncements(cityId?: string) {
  return MOCK_ANNOUNCEMENTS
    .filter((a) => !a.city_id || a.city_id === cityId)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.created_at.localeCompare(a.created_at);
    });
}

// ── Portal: score submission ──────────────────────────────────────────────────

const SUBMITTABLE_STATUSES = new Set(["completed", "full"]);

export async function getMyCompletedTables(userId: string) {
  return MOCK_TABLES.filter(
    (t) =>
      t.creator_id === userId &&
      SUBMITTABLE_STATUSES.has(t.status) &&
      !MOCK_SCORE_SUBMISSIONS.some((s) => s.table_id === t.id)
  );
}

export async function getPlayersAtTable(tableId: string) {
  const table = MOCK_TABLES.find((t) => t.id === tableId);
  if (!table) return [];
  return table.table_seats
    .filter((s) => !s.canceled_at)
    .map((s) => ({ user_id: s.user_id, name: s.profiles?.full_name ?? "Player", wins: 0, points: 0 }));
}

// ── Admin: dashboard ──────────────────────────────────────────────────────────

export async function getAdminDashboardData() {
  const totalPlayers = MOCK_PLAYERS.filter((m) => m.paid_status === "paid").length;
  const totalTables = MOCK_TABLES.length;
  const pending = MOCK_SCORE_SUBMISSIONS.filter((s) => s.status === "pending");
  return { totalPlayers, totalTables, pending };
}

// ── Admin: players ────────────────────────────────────────────────────────────

export async function getAdminPlayers() {
  return MOCK_PLAYERS;
}

// ── Admin: tables ─────────────────────────────────────────────────────────────

export async function getAdminTables() {
  return MOCK_TABLES.map((t) => ({
    ...t,
    cities:  { name: "Los Angeles" },
    seasons: { name: "Spring 2026" },
    profiles: t.table_seats.find((s) => s.user_id === t.creator_id)?.profiles ?? { full_name: null },
  })).sort((a, b) => b.table_date.localeCompare(a.table_date));
}

// ── Admin: scores ─────────────────────────────────────────────────────────────

export async function getAdminScores() {
  const pending  = MOCK_SCORE_SUBMISSIONS.filter((s) => s.status === "pending");
  const approved = MOCK_SCORE_SUBMISSIONS.filter((s) => s.status === "approved")
    .sort((a, b) => (b.approved_at ?? "").localeCompare(a.approved_at ?? "")).slice(0, 20);
  return { pending, approved };
}

// ── Admin: cities / seasons / announcements ───────────────────────────────────

export async function getAdminCities() {
  return MOCK_CITIES;
}

export async function getAdminSeasons() {
  return MOCK_SEASONS;
}

export async function getAdminAnnouncements() {
  return MOCK_ANNOUNCEMENTS.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
