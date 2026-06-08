import { Pin } from "lucide-react";
import { getAnnouncements, getMembership } from "@/lib/data";
import { getDemoUser } from "@/lib/data/auth";

export default async function AnnouncementsPage() {
  const user = getDemoUser();
  const membership = await getMembership(user.id);
  const items = await getAnnouncements(membership?.city_id);

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-900)", marginBottom: 20 }}>
        Announcements
      </h2>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--ink-500)" }}>
          <p>No announcements yet.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              border: item.pinned ? "2px solid var(--lime-300)" : "1px solid var(--hair-200)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 18px",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", flex: 1, paddingRight: 8 }}>
                {item.title}
              </p>
              {item.pinned && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--lime-600)", flexShrink: 0 }}>
                  <Pin size={13} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pinned</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.6, marginBottom: 10 }}>{item.body}</p>
            <p style={{ fontSize: 12, color: "var(--ink-500)" }}>
              {item.profiles?.full_name ? `Posted by ${item.profiles.full_name} · ` : ""}
              {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
