"use client";

import { adminNav } from "@/components/layout/navigation";
import { PortalShell } from "@/components/layout/portal-shell";

export function AdminPortalShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      title="إدارة منصة Safqa"
      subtitle="إدارة الجهات، الحسابات، والتسجيلات"
      portalLabel="لوحة مشرف المنصة"
      navItems={adminNav}
    >
      {children}
    </PortalShell>
  );
}
