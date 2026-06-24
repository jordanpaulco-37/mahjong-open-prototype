"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Building2, CalendarRange, Users, Table2, ClipboardCheck, Megaphone, LogOut, ExternalLink } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Cities", href: "/admin/cities", icon: Building2 },
  { label: "Seasons", href: "/admin/seasons", icon: CalendarRange },
  { label: "Players", href: "/admin/players", icon: Users },
  { label: "Tables", href: "/admin/tables", icon: Table2 },
  { label: "Scores", href: "/admin/scores", icon: ClipboardCheck },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
];

export default function AdminShell({ children, adminName }: { children: React.ReactNode; adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: "var(--ink-900)",
          color: "var(--fg-on-dark)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          overflowY: "auto",
        }}
        className="admin-sidebar"
      >
        {/* Brand */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(234,242,242,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Image src="/assets/mark-mono.svg" alt="" width={24} height={24} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--fg-on-dark)" }}>Mahjong Open</span>
          </div>
          <p style={{ fontSize: 11, color: "rgba(234,242,242,0.4)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 10px",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: 2,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(234,242,242,0.6)",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(234,242,242,0.1)" }}>
          <Link
            href="/portal"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 10px",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              fontSize: 13,
              color: "rgba(234,242,242,0.5)",
              marginBottom: 4,
            }}
          >
            <ExternalLink size={14} />
            Player portal
          </Link>
          <button
            onClick={signOut}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 10px",
              borderRadius: "var(--radius-sm)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "rgba(234,242,242,0.5)",
              textAlign: "left",
            }}
          >
            <LogOut size={14} />
            Sign out
          </button>
          <div style={{ padding: "10px 10px 0" }}>
            <p style={{ fontSize: 12, color: "rgba(234,242,242,0.35)" }}>{adminName}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 220, padding: "32px", background: "var(--paper-50)", minHeight: "100dvh" }} className="admin-main">
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
          .admin-main { margin-left: 0 !important; padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}
