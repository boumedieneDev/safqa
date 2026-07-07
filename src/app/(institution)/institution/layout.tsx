import { InstitutionPortalShell } from "@/components/layout/institution-portal-shell";

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return <InstitutionPortalShell>{children}</InstitutionPortalShell>;
}
