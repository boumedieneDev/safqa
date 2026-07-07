"use client";

import { operatorNav } from "@/components/layout/navigation";
import { PortalShell } from "@/components/layout/portal-shell";

export function OperatorPortalShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell title="Safqa" subtitle="واجهة المتعامل الاقتصادي" portalLabel="بوابة المتعامل" navItems={operatorNav}>
      {children}
    </PortalShell>
  );
}
