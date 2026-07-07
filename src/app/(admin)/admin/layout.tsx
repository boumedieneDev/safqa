import { AdminPortalShell } from "@/components/layout/admin-portal-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminPortalShell>{children}</AdminPortalShell>;
}
