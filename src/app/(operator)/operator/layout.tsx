import { OperatorPortalShell } from "@/components/layout/operator-portal-shell";

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return <OperatorPortalShell>{children}</OperatorPortalShell>;
}
