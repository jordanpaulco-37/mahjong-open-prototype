"use client";

import { useState } from "react";
import { MOCK_CITIES, MOCK_SEASONS } from "@/lib/data/mock";

interface Season {
  id: string; city_id: string; name: string; year: number | null; quarter: number | null;
  starts_at: string | null; ends_at: string | null; is_active: boolean; total_weeks: number;
}

const cityName = (id: string) => MOCK_CITIES.find((c) => c.id === id)?.name ?? id;

export default function AdminSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>(MOCK_SEASONS);
  const [form, setForm] = useState({ city_id: "", name: "", year: new Date().getFullYear().toString(), quarter: "2", starts_at: "", ends_at: "" });
  const [loading, setLoading] = useState(false);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSeasons((prev) => [
        ...prev,
        {
          id: `season-${Date.now()}`,
          city_id: form.city_id,
          name: form.name,
          year: parseInt(form.year),
          quarter: parseInt(form.quarter),
          starts_at: form.starts_at || null,
          ends_at: form.ends_at || null,
          total_weeks: 9,
          is_active: false,
        },
      ]);
      setForm({ city_id: "", name: "", year: new Date().getFullYear().toString(), quarter: "2", starts_at: "", ends_at: "" });
      setLoading(false);
    }, 400);
  }

  function setActive(season: Season) {
    setSeasons((prev) => prev.map((s) =>
      s.city_id === season.city_id ? { ...s, is_active: s.id === season.id } : s
    ));
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-900)", marginBottom: 32 }}>Seasons</h1>

      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 32, boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-900)", marginBottom: 20 }}>Create season</h2>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 80px", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-800)" }}>City</label>
              <select className="input-mo" value={form.city_id} onChange={(e) => setForm((f) => ({ ...f, city_id: e.target.value }))} required>
                <option value="">Select…</option>
                {MOCK_CITIES.filter((c) => c.is_active).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-800)" }}>Season name</label>
              <input className="input-mo" placeholder="Spring 2026" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-800)" }}>Year</label>
              <input className="input-mo" type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-800)" }}>Quarter</label>
              <select className="input-mo" value={form.quarter} onChange={(e) => setForm((f) => ({ ...f, quarter: e.target.value }))}>
                {[1,2,3,4].map((q) => <option key={q} value={q}>Q{q}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-800)" }}>Starts (Week 1)</label>
              <input className="input-mo" type="date" value={form.starts_at} onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-800)" }}>Ends (Week 9)</label>
              <input className="input-mo" type="date" value={form.ends_at} onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ alignSelf: "flex-start" }}>{loading ? "Creating…" : "Create season"}</button>
        </form>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
        {seasons.map((s, i) => (
          <div key={s.id} style={{ padding: "14px 18px", borderBottom: i < seasons.length - 1 ? "1px solid var(--hair-200)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{s.name}</p>
              <p style={{ fontSize: 12, color: "var(--ink-500)" }}>{cityName(s.city_id)} · Q{s.quarter} {s.year} · {s.total_weeks} weeks</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className={`badge ${s.is_active ? "badge-lime" : "badge-mute"}`}>{s.is_active ? "Active" : "Inactive"}</span>
              {!s.is_active && (
                <button onClick={() => setActive(s)} className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }}>Set active</button>
              )}
            </div>
          </div>
        ))}
        {seasons.length === 0 && <p style={{ padding: 20, color: "var(--ink-500)", fontSize: 14 }}>No seasons yet.</p>}
      </div>
    </div>
  );
}
