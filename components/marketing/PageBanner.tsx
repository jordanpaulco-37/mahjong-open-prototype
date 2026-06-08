interface PageBannerProps {
  eyebrow?: string;
  headline: React.ReactNode;
  lead?: string;
}

export default function PageBanner({ eyebrow, headline, lead }: PageBannerProps) {
  return (
    <section className="pbanner">
      <div className="container-mo" style={{ position: "relative", zIndex: 1 }}>
        {eyebrow && (
          <p className="eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</p>
        )}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(30px, 4.5vw, 58px)",
            fontWeight: 400,
            lineHeight: 1.06,
            letterSpacing: "-0.01em",
            color: "var(--ink-900)",
            marginBottom: lead ? 20 : 0,
            whiteSpace: "nowrap",
          }}
          className="pbanner-h1"
        >
          {headline}
        </h1>
        {lead && (
          <p
            className="body-lg"
            style={{
              maxWidth: 560,
              marginInline: "auto",
              color: "var(--ink-700)",
            }}
          >
            {lead}
          </p>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .pbanner-h1 { white-space: normal !important; }
        }
        @media (max-width: 620px) {
          .pbanner-h1 { font-size: 34px !important; }
        }
      `}</style>
    </section>
  );
}
