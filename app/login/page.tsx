import Link from "next/link";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--pink-wash)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", width: "100%", maxWidth: 420, padding: "44px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--pink-600)", marginBottom: 8 }}>
          The Mahjong Open
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, color: "var(--ink-900)", marginBottom: 16 }}>
          Demo mode
        </h1>
        <div style={{ background: "var(--butter-50)", border: "1px solid var(--butter-300)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 28, fontSize: 14, color: "var(--ink-700)", lineHeight: 1.6, textAlign: "left" }}>
          This is a front-end prototype with mock data. Authentication is not yet connected — pick a view to explore.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/portal" className="btn btn-primary" style={{ justifyContent: "center" }}>
            Enter player portal →
          </Link>
          <Link href="/admin" className="btn btn-ghost" style={{ justifyContent: "center" }}>
            Enter admin dashboard →
          </Link>
          <Link href="/" className="btn btn-ghost" style={{ justifyContent: "center", fontSize: 13, marginTop: 4 }}>
            ← Back to marketing site
          </Link>
        </div>
      </div>
    </div>
  );
}
