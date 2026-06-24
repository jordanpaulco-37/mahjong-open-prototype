"use client";

import { useState } from "react";
import PageBanner from "@/components/marketing/PageBanner";
import { ExternalLink } from "lucide-react";

type Category = "All favorites" | "Tiles & sets" | "Cards & accessories" | "Table & decor" | "Gifts & apparel";

const CATEGORIES: Category[] = [
  "All favorites",
  "Tiles & sets",
  "Cards & accessories",
  "Table & decor",
  "Gifts & apparel",
];

const PRODUCTS = [
  { title: "Jade Dynasty Tile Set", category: "Tiles & sets", blurb: "A stunning full-weight bakelite set with a classic ivory finish. Our most-gifted pick.", href: "#", bg: "var(--lime-wash)" },
  { title: "NMJL Official Card 2026", category: "Cards & accessories", blurb: "The current National Mah Jongg League card — updated every year, essential for league play.", href: "#", bg: "var(--pink-wash)" },
  { title: "Bamboo Tile Rack Set (4)", category: "Table & decor", blurb: "Lightweight, stackable bamboo racks that look beautiful on any table.", href: "#", bg: "var(--lime-50)" },
  { title: "The Mahjong Line — Starter Set", category: "Tiles & sets", blurb: "Modern aesthetic, American rules. A favorite among new players and design lovers alike.", href: "#", bg: "var(--peri-50)" },
  { title: "Velvet Tile Pouch", category: "Cards & accessories", blurb: "A plush carrying pouch for your tiles. Protects the set and travels beautifully.", href: "#", bg: "var(--peri-50)" },
  { title: "Linen Tablerunner — Garden Party", category: "Table & decor", blurb: "The perfect surface for your tiles. Soft linen, botanical print, machine washable.", href: "#", bg: "var(--lime-wash)" },
  { title: "Mah Jongg Tote Bag", category: "Gifts & apparel", blurb: "Canvas tote printed with tile motifs. Big enough for a full set, stylish enough for anywhere.", href: "#", bg: "var(--pink-50)" },
  { title: "Wind Tile Enamel Pin Set", category: "Gifts & apparel", blurb: "East, South, West, North — four enamel pins for the player who has everything.", href: "#", bg: "var(--lime-50)" },
  { title: "Table Score Tracker", category: "Cards & accessories", blurb: "A reusable dry-erase pad sized for foursome scoring. Designed for league play.", href: "#", bg: "var(--peri-50)" },
];

export default function ShopPage() {
  const [active, setActive] = useState<Category>("All favorites");

  const filtered = active === "All favorites" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <>
      <PageBanner
        eyebrow="Affiliate picks"
        headline={<>The good stuff, <em className="serif-italic">handpicked</em></>}
        lead="Our favorite gear for playing, hosting, and gifting — curated by players, for players."
      />

      {/* Category filter */}
      <section style={{ padding: "40px 0 0", background: "#fff", borderBottom: "1px solid var(--hair-200)" }}>
        <div className="container-mo">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 20 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "7px 16px",
                  borderRadius: "var(--radius-pill)",
                  border: active === cat ? "2px solid var(--pink-400)" : "1.5px solid var(--hair-200)",
                  background: active === cat ? "var(--pink-50)" : "#fff",
                  color: active === cat ? "var(--pink-700)" : "var(--ink-700)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section style={{ padding: "48px 0 80px" }}>
        <div className="container-mo">
          <div className="products-grid">
            {filtered.map((product) => (
              <div
                key={product.title}
                className="card-lift"
                style={{
                  background: "#fff",
                  border: "1px solid var(--hair-200)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image slot */}
                <div
                  style={{
                    aspectRatio: "4/3",
                    background: product.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p style={{ fontSize: 13, color: "var(--ink-500)", textAlign: "center", padding: 16 }}>
                    {product.title}
                  </p>
                </div>
                <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <span className="badge badge-lime" style={{ alignSelf: "flex-start" }}>{product.category}</span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 400,
                      color: "var(--ink-900)",
                      lineHeight: 1.25,
                    }}
                  >
                    {product.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.6, flex: 1 }}>{product.blurb}</p>
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--pink-600)",
                      textDecoration: "none",
                      marginTop: 4,
                    }}
                  >
                    Shop this pick
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Affiliate disclosure */}
          <p
            style={{
              marginTop: 48,
              fontSize: 12,
              color: "var(--ink-500)",
              lineHeight: 1.6,
              borderTop: "1px solid var(--hair-200)",
              paddingTop: 24,
            }}
          >
            <strong>Affiliate disclosure:</strong> Some links on this page may earn The Mahjong Open a small commission at no extra cost to you. We only recommend products we genuinely use and love.
          </p>
        </div>
      </section>

      <style>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .products-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
