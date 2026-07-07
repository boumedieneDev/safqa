"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { NavItem } from "@/components/layout/navigation";

interface PortalShellProps {
  title: string;
  subtitle: string;
  portalLabel: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export function PortalShell({ title, subtitle, portalLabel, navItems, children }: PortalShellProps) {
  return (
    <div className="min-h-screen">
      <Sidebar title={title} subtitle={subtitle} navItems={navItems} />
      <div className="lg:mr-72">
        <Topbar portalLabel={portalLabel} />
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
