import PortalShellClient from "@/components/portal/PortalShellClient";
import { getDemoUser } from "@/lib/data/auth";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = getDemoUser();
  return (
    <PortalShellClient
      userName={user.full_name}
      isAdminRole={user.role === "admin"}
    >
      {children}
    </PortalShellClient>
  );
}
