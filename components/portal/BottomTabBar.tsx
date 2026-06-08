"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, CalendarDays, ClipboardList, Bell } from "lucide-react";

const TABS = [
  { label: "Home", href: "/portal", icon: Home },
  { label: "Standings", href: "/portal/standings", icon: Trophy },
  { label: "Schedule", href: "/portal/tables", icon: CalendarDays },
  { label: "Scores", href: "/portal/scores", icon: ClipboardList },
  { label: "Alerts", href: "/portal/announcements", icon: Bell },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="portal-bottom-bar" aria-label="Portal navigation">
      {TABS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || (href !== "/portal" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              textDecoration: "none",
              color: active ? "var(--pink-600)" : "var(--ink-500)",
              borderTop: active ? "2px solid var(--pink-400)" : "2px solid transparent",
              transition: "color 0.15s",
              paddingTop: 2,
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.7} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, letterSpacing: "0.02em" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
