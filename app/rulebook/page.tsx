import Link from "next/link";

export default function RulebookPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Mahjong Open</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--ink-900)", marginBottom: 12 }}>
        Rulebook preview
      </h1>
      <p style={{ fontSize: 16, color: "var(--ink-700)", lineHeight: 1.65, marginBottom: 20 }}>
        The official handbook is on the way. This placeholder page will be replaced with the real PDF or link when the client shares it.
      </p>
      <Link href="/portal" className="btn btn-primary" style={{ display: "inline-flex" }}>
        Back to portal
      </Link>
    </div>
  );
}
