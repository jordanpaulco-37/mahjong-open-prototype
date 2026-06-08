import AdminShell from "@/components/admin/AdminShell";
import { getDemoUser } from "@/lib/data/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = getDemoUser();
  return <AdminShell adminName={user.full_name}>{children}</AdminShell>;
}
