"use client";

import { institutionNav } from "@/components/layout/navigation";
import { PortalShell } from "@/components/layout/portal-shell";

export function InstitutionPortalShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      title="Safqa"
      subtitle="واجهة المؤسسة العمومية"
      portalLabel="بوابة المؤسسة"
      navItems={institutionNav}
    >
      {children}
    </PortalShell>
  );
}
