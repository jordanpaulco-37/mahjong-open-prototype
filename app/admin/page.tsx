import Link from "next/link";
import AdminApprovalCard, { type Submission } from "@/components/admin/AdminApprovalCard";
import { getAdminDashboardData } from "@/lib/data";

const SHORTCUTS = [
  { label: "Manage cities",    href: "/admin/cities" },
  { label: "Manage seasons",   href: "/admin/seasons" },
  { label: "View players",     href: "/admin/players" },
  { label: "All tables",       href: "/admin/tables" },
  { label: "Post announcement",href: "/admin/announcements" },
];

export default async function AdminDashboard() {
  const { totalPlayers, totalTables, pending } = await getAdminDashboardData();

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ background: "var(--ink-900)", color: "var(--crimson-400)", borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(234,242,242,0.5)", marginBottom: 4 }}>Admin view</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, color: "#fff" }}>Season at a glance</h1>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { label: "Paid players",   value: totalPlayers },
            { label: "Total tables",   value: totalTables },
            { label: "Pending scores", value: pending.length },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--crimson-400)", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "rgba(234,242,242,0.5)", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 24, alignItems: "start" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-900)", marginBottom: 16 }}>Pending score approvals</h2>
          {pending.length === 0 ? (
            <div style={{ background: "var(--success-bg)", border: "1px solid var(--lime-200)", borderRadius: "var(--radius-lg)", padding: 24, textAlign: "center", color: "var(--lime-700)", fontSize: 15 }}>
              All caught up — no pending scores.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(pending as unknown as Submission[]).map((s) => (
                <AdminApprovalCard key={s.id} submission={s} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-900)", marginBottom: 16 }}>Quick links</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SHORTCUTS.map((s) => (
              <Link key={s.href} href={s.href} style={{ display: "block", padding: "12px 16px", background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-md)", textDecoration: "none", fontSize: 14, color: "var(--ink-800)", fontWeight: 500, boxShadow: "var(--shadow-xs)" }}>
                {s.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
