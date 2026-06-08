import { getAdminPlayers } from "@/lib/data";

const STATUS_BADGE: Record<string, string> = { active: "badge-lime", pending: "badge-butter", canceled: "badge-mute" };
const PAID_BADGE:   Record<string, string> = { paid: "badge-lime",   unpaid: "badge-butter",  refunded: "badge-mute" };

export default async function AdminPlayersPage() {
  const rows = await getAdminPlayers();

  return (
    <div style={{ maxWidth: 1000 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-900)", marginBottom: 8 }}>Players</h1>
      <p style={{ fontSize: 15, color: "var(--ink-500)", marginBottom: 32 }}>{rows.length} registration{rows.length !== 1 ? "s" : ""} total</p>

      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid var(--hair-200)", background: "var(--paper-50)" }}>
          {["Player", "City · Season", "Status", "Payment", "Joined"].map((h) => (
            <p key={h} style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</p>
          ))}
        </div>
        {rows.map((m, i) => (
          <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", padding: "12px 16px", borderBottom: i < rows.length - 1 ? "1px solid var(--hair-200)" : "none", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)" }}>{m.profiles.full_name ?? "—"}</p>
              <p style={{ fontSize: 12, color: "var(--ink-500)" }}>{m.profiles.email}</p>
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-700)" }}>{m.cities.name} · {m.seasons.name}</p>
            <span className={`badge ${STATUS_BADGE[m.status] ?? "badge-mute"}`} style={{ alignSelf: "center" }}>{m.status}</span>
            <span className={`badge ${PAID_BADGE[m.paid_status] ?? "badge-mute"}`} style={{ alignSelf: "center" }}>{m.paid_status}</span>
            <p style={{ fontSize: 12, color: "var(--ink-500)" }}>{new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
