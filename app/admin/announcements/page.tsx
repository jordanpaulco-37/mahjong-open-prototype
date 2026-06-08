"use client";

import { useState } from "react";
import { Pin, Trash2 } from "lucide-react";
import { MOCK_ANNOUNCEMENTS, MOCK_CITIES } from "@/lib/data/mock";

interface Announcement { id: string; title: string; body: string; pinned: boolean; created_at: string; city_id: string | null; }

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>(
    [...MOCK_ANNOUNCEMENTS].sort((a, b) => b.created_at.localeCompare(a.created_at))
  );
  const [form, setForm] = useState({ title: "", body: "", pinned: false, city_id: "" });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [{
        id: `ann-${Date.now()}`,
        title: form.title,
        body: form.body,
        pinned: form.pinned,
        city_id: form.city_id || null,
        created_at: new Date().toISOString(),
      }, ...prev]);
      setForm({ title: "", body: "", pinned: false, city_id: "" });
      setLoading(false);
    }, 400);
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-900)", marginBottom: 32 }}>Announcements</h1>

      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-900)", marginBottom: 20 }}>New announcement</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-800)" }}>Title</label>
            <input className="input-mo" placeholder="Announcement title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-800)" }}>Body</label>
            <textarea className="input-mo" rows={4} placeholder="Message body…" value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} required style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-800)" }}>City (optional — leave blank for all)</label>
              <select className="input-mo" value={form.city_id} onChange={(e) => setForm((f) => ({ ...f, city_id: e.target.value }))}>
                <option value="">All cities</option>
                {MOCK_CITIES.filter((c) => c.is_active).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: "var(--ink-800)", cursor: "pointer", paddingBottom: 10 }}>
              <input type="checkbox" checked={form.pinned} onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))} />
              Pin to top
            </label>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ alignSelf: "flex-start" }}>
            {loading ? "Posting…" : "Post announcement"}
          </button>
        </form>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} style={{ background: "#fff", border: item.pinned ? "2px solid var(--lime-300)" : "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start", boxShadow: "var(--shadow-xs)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{item.title}</p>
                {item.pinned && <Pin size={13} color="var(--lime-600)" />}
                {item.city_id && <span className="badge badge-peri" style={{ fontSize: 11 }}>City-specific</span>}
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.5 }}>{item.body}</p>
              <p style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 6 }}>{new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            </div>
            <button onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-500)", padding: 4 }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
