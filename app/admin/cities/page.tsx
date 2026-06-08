"use client";

import { useState } from "react";
import { MOCK_CITIES } from "@/lib/data/mock";

interface City { id: string; name: string; state: string | null; slug: string; is_active: boolean; }

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<City[]>(MOCK_CITIES);
  const [form, setForm] = useState({ name: "", state: "", slug: "" });
  const [loading, setLoading] = useState(false);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
      setCities((prev) => [...prev, { id: `city-${Date.now()}`, name: form.name, state: form.state || null, slug, is_active: true }]);
      setForm({ name: "", state: "", slug: "" });
      setLoading(false);
    }, 400);
  }

  function toggleActive(city: City) {
    setCities((prev) => prev.map((c) => c.id === city.id ? { ...c, is_active: !c.is_active } : c));
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-900)", marginBottom: 32 }}>Cities</h1>

      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 32, boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-900)", marginBottom: 20 }}>Add city</h2>
        <form onSubmit={handleCreate} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input className="input-mo" placeholder="City name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required style={{ flex: 2, minWidth: 160 }} />
          <input className="input-mo" placeholder="State (e.g. CA)" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} style={{ flex: 1, minWidth: 80 }} />
          <input className="input-mo" placeholder="Slug (auto)" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} style={{ flex: 1, minWidth: 120 }} />
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ whiteSpace: "nowrap" }}>{loading ? "Adding…" : "Add city"}</button>
        </form>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
        {cities.map((city, i) => (
          <div key={city.id} style={{ padding: "14px 18px", borderBottom: i < cities.length - 1 ? "1px solid var(--hair-200)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{city.name}{city.state && `, ${city.state}`}</p>
              <p style={{ fontSize: 12, color: "var(--ink-500)" }}>/{city.slug}</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className={`badge ${city.is_active ? "badge-lime" : "badge-mute"}`}>{city.is_active ? "Active" : "Inactive"}</span>
              <button onClick={() => toggleActive(city)} className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }}>
                {city.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
        {cities.length === 0 && <p style={{ padding: 20, color: "var(--ink-500)", fontSize: 14 }}>No cities yet.</p>}
      </div>
    </div>
  );
}
