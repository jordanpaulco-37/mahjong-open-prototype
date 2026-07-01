"use client";

import { useEffect, useState } from "react";

const STATUS_BADGE: Record<string, string> = { active: "badge-lime", pending: "badge-butter", canceled: "badge-mute" };
const PAID_BADGE: Record<string, string> = { paid: "badge-lime", unpaid: "badge-butter", refunded: "badge-mute" };

type PlayerRow = {
  id: string;
  status: string;
  paid_status: string;
  skill_level: string;
  created_at: string;
  profiles: { id?: string; full_name: string | null; email: string; role?: string | null };
  cities: { name: string };
  seasons: { name: string };
};

export default function AdminPlayersPage() {
  const [rows, setRows] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function loadRows() {
    setLoading(true);
    const response = await fetch("/api/admin/players", { credentials: "include" });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) {
      setRows(Array.isArray(payload.players) ? payload.players : []);
      setMessage(null);
    } else {
      setMessage(payload.error ?? "Unable to load players.");
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadRows();
  }, []);

  async function handleDesignationChange(player: PlayerRow, designation: string) {
    if (designation === (player.profiles.role ?? "player")) return;

    const confirmed = window.confirm(`Switch ${player.profiles.full_name ?? "this player"} to ${designation === "commissioner" ? "Commissioner" : "Player"}?`);
    if (!confirmed) return;

    setMessage("Updating designation…");
    const response = await fetch("/api/admin/players", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: player.id, profileId: player.profiles.id, designation, cityName: player.cities.name }),
    });
    const payload = await response.json().catch(() => ({}));

    if (response.ok) {
      setMessage(payload.success ? "Designation updated." : payload.error ?? "Designation updated.");
      await loadRows();
    } else {
      setMessage(payload.error ?? "Unable to update designation.");
    }
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-900)", marginBottom: 8 }}>Players</h1>
      <p style={{ fontSize: 15, color: "var(--ink-500)", marginBottom: 24 }}>{rows.length} registration{rows.length !== 1 ? "s" : ""} total</p>
      {message ? <p style={{ fontSize: 13, color: "var(--ink-700)", marginBottom: 16 }}>{message}</p> : null}

      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr 0.8fr 0.8fr 0.8fr", padding: "10px 16px", borderBottom: "1px solid var(--hair-200)", background: "var(--paper-50)" }}>
          {["Player", "City · Season", "Designation", "Status", "Payment", "Joined"].map((h) => (
            <p key={h} style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</p>
          ))}
        </div>
        {loading ? (
          <div style={{ padding: 20, color: "var(--ink-500)" }}>Loading players…</div>
        ) : (
          rows.map((m, i) => (
            <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr 0.8fr 0.8fr 0.8fr", padding: "12px 16px", borderBottom: i < rows.length - 1 ? "1px solid var(--hair-200)" : "none", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)" }}>{m.profiles.full_name ?? "—"}</p>
                <p style={{ fontSize: 12, color: "var(--ink-500)" }}>{m.profiles.email}</p>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-700)" }}>{m.cities.name} · {m.seasons.name}</p>
              <select
                value={m.profiles.role ?? "player"}
                onChange={(event) => handleDesignationChange(m, event.target.value)}
                style={{ fontSize: 13, border: "1px solid var(--hair-200)", borderRadius: 6, padding: "6px 8px", background: "#fff" }}
              >
                <option value="player">Player</option>
                <option value="commissioner">Commissioner</option>
              </select>
              <span className={`badge ${STATUS_BADGE[m.status] ?? "badge-mute"}`} style={{ alignSelf: "center" }}>{m.status}</span>
              <span className={`badge ${PAID_BADGE[m.paid_status] ?? "badge-mute"}`} style={{ alignSelf: "center" }}>{m.paid_status}</span>
              <p style={{ fontSize: 12, color: "var(--ink-500)" }}>{new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
