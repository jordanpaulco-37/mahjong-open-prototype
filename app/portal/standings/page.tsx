import { getStandings, getMembership } from "@/lib/data";
import { getDemoUser } from "@/lib/data/auth";

export default async function StandingsPage() {
  const user = getDemoUser();
  const [standingRows, membership] = await Promise.all([
    getStandings(),
    getMembership(user.id),
  ]);
  const totalWeeks = membership?.seasons?.total_weeks ?? 9;
  const cityName = membership?.cities?.name ?? "Los Angeles";
  const seasonName = membership?.seasons?.name ?? "Spring 2026";

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 4 }}>{cityName}</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-900)" }}>{seasonName} Standings</h2>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 60px 50px 64px", padding: "10px 16px", borderBottom: "1px solid var(--hair-200)", gap: 8 }}>
          {["#", "Player", "Pts", "Wins", "Wks"].map((h) => (
            <p key={h} style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</p>
          ))}
        </div>

        {standingRows.map((row, i) => {
          const isMe = row.user_id === user.id;
          const name = row.profiles?.full_name ?? "Player";
          return (
            <div
              key={row.user_id}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr 60px 50px 64px",
                padding: "12px 16px",
                borderBottom: i < standingRows.length - 1 ? "1px solid var(--hair-200)" : "none",
                alignItems: "center",
                gap: 8,
                background: isMe ? "var(--pink-50)" : "#fff",
              }}
            >
              <p style={{ fontSize: 15, fontFamily: "var(--font-display)", color: row.rank === 1 ? "var(--butter-500)" : "var(--ink-700)" }}>
                {row.rank}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: isMe ? "var(--pink-400)" : "var(--paper-100)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  color: isMe ? "#fff" : "var(--ink-700)",
                  flexShrink: 0,
                }}>
                  {name[0]}
                </div>
                <p style={{ fontSize: 14, fontWeight: isMe ? 600 : 400, color: "var(--ink-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {isMe ? "You" : name.split(" ")[0]}
                </p>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{row.total_points}</p>
              <p style={{ fontSize: 14, color: "var(--ink-700)" }}>{row.total_wins}</p>
              <p style={{ fontSize: 13, color: "var(--ink-500)" }}>{row.tables_played}/{totalWeeks}</p>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 16, textAlign: "center" }}>
        Updated when admin approves scores · {cityName} · {seasonName}
      </p>
    </div>
  );
}
