import PageBanner from "@/components/marketing/PageBanner";
import Link from "next/link";

const SEASON_EVENTS = [
  {
    date: "Mar 14, 2026",
    title: "Spring Kickoff Tea",
    type: "Opening event",
    body: "The season opener. Meet your fellow players, tour the league format, and play your first table of the quarter over tea and snacks.",
    color: "var(--peri-100)",
  },
  {
    date: "Apr 18, 2026",
    title: "The Blossom Bracket",
    type: "Mid-season mixer",
    body: "A city-wide afternoon of play. Players from all tables come together for a special mid-season session with rotating pairings.",
    color: "var(--lime-wash)",
  },
  {
    date: "May 23, 2026",
    title: "The Spring Soirée",
    type: "Season finale",
    body: "The closing celebration. Final standings are revealed, season awards are given, and the city's top player takes the title.",
    color: "var(--pink-wash)",
  },
];

const WEEKLY_INFO = [
  { label: "Season length", value: "8 weeks" },
  { label: "Frequency", value: "One game per week" },
  { label: "Table size", value: "4 players" },
  { label: "Format", value: "American mahjong" },
  { label: "Location", value: "Player's choice" },
  { label: "Booking", value: "First-come, first-served" },
];

export default function EventsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Spring 2026 season"
        headline={<>A calendar worth <em className="serif-italic">dressing up</em> for</>}
        lead="Three signature events frame every 8-week season. Here's what to look forward to."
      />

      {/* Year at a glance */}
      <section style={{ padding: "72px 0" }}>
        <div className="container-mo">
          <p className="eyebrow" style={{ marginBottom: 16 }}>Year at a glance</p>
          <h2 className="h2" style={{ marginBottom: 40 }}>Four seasons, <em className="serif-italic">one league</em></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="quarters-grid">
            {[
              { q: "Q1", label: "Winter", months: "Jan–Mar", active: false },
              { q: "Q2", label: "Spring", months: "Apr–Jun", active: true },
              { q: "Q3", label: "Summer", months: "Jul–Sep", active: false },
              { q: "Q4", label: "Autumn", months: "Oct–Dec", active: false },
            ].map((quarter) => (
              <div
                key={quarter.q}
                style={{
                  border: quarter.active ? "2px solid var(--pink-400)" : "1px solid var(--hair-200)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px 20px",
                  background: quarter.active ? "var(--pink-50)" : "#fff",
                  textAlign: "center",
                }}
              >
                <p style={{ fontFamily: "var(--font-display)", fontSize: 28, color: quarter.active ? "var(--pink-700)" : "var(--ink-900)", marginBottom: 4 }}>{quarter.q}</p>
                <p style={{ fontWeight: 600, color: "var(--ink-800)", marginBottom: 4 }}>{quarter.label}</p>
                <p style={{ fontSize: 13, color: "var(--ink-500)" }}>{quarter.months}</p>
                {quarter.active && <p className="badge badge-pink" style={{ marginTop: 10, display: "inline-flex" }}>Open now</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Season events */}
      <section style={{ padding: "72px 0", background: "var(--pink-wash)" }}>
        <div className="container-mo">
          <p className="eyebrow" style={{ marginBottom: 16 }}>This season&rsquo;s gatherings</p>
          <h2 className="h2" style={{ marginBottom: 48 }}>Spring 2026 <em className="serif-italic">event calendar</em></h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {SEASON_EVENTS.map((ev) => (
              <div
                key={ev.title}
                className="card-lift ev-row"
                style={{
                  background: "#fff",
                  border: "1px solid var(--hair-200)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  cursor: "pointer",
                }}
              >
                <div style={{ background: ev.color, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 120 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--ink-700)", textAlign: "center", padding: 16 }}>
                    {ev.date}
                  </p>
                </div>
                <div style={{ padding: "24px 28px" }}>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>{ev.type}</p>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--ink-900)", marginBottom: 10 }}>{ev.title}</h3>
                  <p style={{ fontSize: 15, color: "var(--ink-700)", lineHeight: 1.6 }}>{ev.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly tables */}
      <section style={{ padding: "72px 0" }}>
        <div className="container-mo">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="weekly-grid">
            <div>
              <p className="eyebrow" style={{ marginBottom: 16 }}>Weekly tables</p>
              <h2 className="h2" style={{ marginBottom: 20 }}>Play every week, <em className="serif-italic">your way</em></h2>
              <p className="body-lg" style={{ marginBottom: 24 }}>
                Between the three signature events, every week has open tables. You create or join — wherever, whenever works for you.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {["Any location you choose", "Any day of the week", "Open to all skill levels", "4-player foursomes only"].map((item) => (
                  <li key={item} style={{ fontSize: 15, color: "var(--ink-700)", display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pink-400)", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {WEEKLY_INFO.map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--hair-200)" }}>
                  <span style={{ fontSize: 14, color: "var(--ink-500)" }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New cities CTA */}
      <section style={{ padding: "64px 0", background: "var(--lime-wash)" }}>
        <div className="container-mo" style={{ textAlign: "center" }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Expanding in 2026</p>
          <h2 className="h2" style={{ marginBottom: 16 }}>Don&rsquo;t see <em className="serif-italic">your city?</em></h2>
          <p style={{ fontSize: 16, color: "var(--ink-700)", marginBottom: 28, maxWidth: 480, marginInline: "auto" }}>
            We&rsquo;re growing to new cities every quarter. Get on the waitlist and we&rsquo;ll let you know when the league launches near you.
          </p>
          <Link href="/contact" className="btn btn-primary" style={{ fontSize: 15 }}>
            Join the waitlist →
          </Link>
        </div>
      </section>

      <style>{`
        .quarters-grid { grid-template-columns: repeat(4, 1fr) !important; }
        .weekly-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 900px) {
          .quarters-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .weekly-grid { grid-template-columns: 1fr !important; }
          .ev-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .quarters-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
