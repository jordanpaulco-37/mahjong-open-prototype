import { getAdminTables } from "@/lib/data";

const STATUS_BADGE: Record<string, string> = { open: "badge-lime", full: "badge-peri", completed: "badge-mute", canceled: "badge-mute" };

export default async function AdminTablesPage() {
  const rows = await getAdminTables();

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-900)", marginBottom: 8 }}>All Tables</h1>
      <p style={{ fontSize: 15, color: "var(--ink-500)", marginBottom: 32 }}>{rows.length} table{rows.length !== 1 ? "s" : ""}</p>

      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 1.5fr 1fr 1fr 80px 60px", padding: "10px 16px", borderBottom: "1px solid var(--hair-200)", background: "var(--paper-50)" }}>
          {["Wk", "Table", "City · Season", "Creator", "Status", "Seats"].map((h) => (
            <p key={h} style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</p>
          ))}
        </div>
        {rows.map((t, i) => {
          const activeSeats = t.table_seats.filter((s) => !s.canceled_at).length;
          return (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "60px 1.5fr 1fr 1fr 80px 60px", padding: "12px 16px", borderBottom: i < rows.length - 1 ? "1px solid var(--hair-200)" : "none", alignItems: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-500)" }}>W{t.week_number}</p>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)" }}>{t.location_name}</p>
                <p style={{ fontSize: 12, color: "var(--ink-500)" }}>{new Date(t.table_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {t.table_time.slice(0,5)}</p>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-700)" }}>{t.cities?.name} · {t.seasons?.name}</p>
              <p style={{ fontSize: 13, color: "var(--ink-700)" }}>{t.profiles?.full_name ?? "—"}</p>
              <span className={`badge ${STATUS_BADGE[t.status] ?? "badge-mute"}`}>{t.status}</span>
              <p style={{ fontSize: 13, color: "var(--ink-700)" }}>{activeSeats}/4</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
