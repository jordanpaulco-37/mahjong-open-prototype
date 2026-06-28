import { getAdminPlayers, getMembership } from "@/lib/data";
import { getDemoUser } from "@/lib/data/auth";
import { Users, Star } from "lucide-react";

export default async function DirectoryPage() {
  const user = getDemoUser();
  const membership = await getMembership(user.id);
  const members = await getAdminPlayers();
  const cityName = membership?.cities?.name ?? "Hattiesburg";

  return (
    <div style={{ padding: "20px 16px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 4 }}>{cityName}</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-900)" }}>Member Directory</h2>
        <p style={{ fontSize: 15, color: "var(--ink-500)", marginTop: 8 }}>
          View your city roster, connect with players, and see who&rsquo;s active in this series.
        </p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {members.map((member) => (
          <div
            key={member.id}
            style={{
              background: "#fff",
              border: "1px solid var(--hair-200)",
              borderRadius: "var(--radius-lg)",
              padding: "18px",
              boxShadow: "var(--shadow-xs)",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", marginBottom: 6 }}>{member.profiles.full_name}</p>
              <p style={{ fontSize: 13, color: "var(--ink-500)", marginBottom: 4 }}>{member.profiles.email}</p>
              <p style={{ fontSize: 13, color: "var(--ink-500)" }}>
                {member.skill_level ? `${member.skill_level.charAt(0).toUpperCase()}${member.skill_level.slice(1)} player` : "Member"}
              </p>
            </div>
            <span className="badge badge-peri" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
