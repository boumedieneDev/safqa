import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { operatorEntityTypeLabels, organizationKindLabels } from "@/lib/registration/options";
import type { OperatorEntityType, OrganizationKind } from "@/types/domain";

type DirectoryKind = "organizations" | "operators";

export interface AdminOrganizationRow {
  id: string;
  name: string;
  organization_kind: OrganizationKind | null;
  sector: string | null;
  email: string | null;
  phone: string | null;
  status: string;
}

export interface AdminOperatorRow {
  id: string;
  name: string;
  entity_type: OperatorEntityType;
  sector: string | null;
  specialization: string | null;
  email: string | null;
  phone: string | null;
  status: string;
}

export function AdminEntityDirectory({
  kind,
  rows,
  error,
}: {
  kind: DirectoryKind;
  rows: Array<AdminOrganizationRow | AdminOperatorRow>;
  error?: string | null;
}) {
  if (error) {
    return <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>;
  }

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">لا توجد بيانات بعد.</CardContent>
      </Card>
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {rows.map((row) => {
        const isOrganization = kind === "organizations";
        const subtitle = isOrganization
          ? organizationKindLabels[(row as AdminOrganizationRow).organization_kind ?? "public_institution"]
          : operatorEntityTypeLabels[(row as AdminOperatorRow).entity_type];

        return (
          <Card key={row.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle>{row.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              </div>
              <Badge tone={row.status === "active" ? "success" : "warning"}>{row.status}</Badge>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="القطاع" value={row.sector} />
              {!isOrganization ? <Info label="التخصص" value={(row as AdminOperatorRow).specialization} /> : null}
              <Info label="البريد" value={row.email} />
              <Info label="الهاتف" value={row.phone} />
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value || "غير مدخل"}</p>
    </div>
  );
}
