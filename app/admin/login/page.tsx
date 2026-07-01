"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const nextPath = searchParams.get("next") || "/admin";

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode, next: nextPath }),
    });

    if (response.ok) {
      router.push(nextPath);
      return;
    }

    const payload = await response.json().catch(() => ({}));
    setError(payload.error || "Incorrect passcode.");
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", paddingTop: 64 }}>
      <div style={{ background: "#fff", border: "1px solid var(--hair-200)", borderRadius: "var(--radius-lg)", padding: 32, boxShadow: "var(--shadow-sm)" }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Admin access</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--ink-900)", marginBottom: 12 }}>Enter the admin passcode</h1>
        <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.6, marginBottom: 24 }}>
          This stopgap gate protects the admin area until full authentication is ready.
        </p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            className="input-mo"
            type="password"
            placeholder="Enter passcode"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            autoComplete="current-password"
          />
          {error ? <p style={{ fontSize: 13, color: "var(--pink-700)", margin: 0 }}>{error}</p> : null}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Checking…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 420, margin: "0 auto", paddingTop: 64 }}>Loading…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
