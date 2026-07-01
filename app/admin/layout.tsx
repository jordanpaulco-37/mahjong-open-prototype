"use client";

import { usePathname } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getDemoUser } from "@/lib/data/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = getDemoUser();

  if (pathname === "/admin/login") {
    return <div className="admin-login-shell">{children}</div>;
  }

  return <AdminShell adminName={user.full_name}>{children}</AdminShell>;
}
