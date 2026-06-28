import AdminApprovalCard, { type Submission } from "@/components/admin/AdminApprovalCard";
import { getAdminScores } from "@/lib/data";

export default async function AdminScoresPage() {
  const { pending, approved } = await getAdminScores();

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-900)", marginBottom: 8 }}>Score Approvals</h1>
      <p style={{ fontSize: 15, color: "var(--ink-500)", marginBottom: 32 }}>Review submitted scores. Approve or edit before they affect standings.</p>

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-900)", marginBottom: 16 }}>
        Pending ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <div style={{ background: "var(--success-bg)", border: "1px solid var(--lime-200)", borderRadius: "var(--radius-lg)", padding: 24, textAlign: "center", color: "var(--lime-700)", marginBottom: 32 }}>
          All caught up — no pending scores.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {(pending as unknown as Submission[]).map((s) => (
            <AdminApprovalCard key={s.id} submission={s} />
          ))}
        </div>
      )}

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-900)", marginBottom: 16 }}>
        Recently approved
      </h2>
      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
        {approved.length === 0 ? (
          <p style={{ padding: 20, color: "var(--ink-500)", fontSize: 14 }}>No approved scores yet.</p>
        ) : (
          approved.map((s, i) => (
            <div key={s.id} style={{ padding: "12px 18px", borderBottom: i < approved.length - 1 ? "1px solid var(--hair-200)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)" }}>
                  Round {s.scramble_tables?.week_number} · {s.scramble_tables?.location_name}
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-500)" }}>
                  {s.scramble_tables && new Date(s.scramble_tables.table_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
              <span className="badge badge-lime">Approved</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
