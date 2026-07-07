import { AdminEntityDirectory, type AdminOrganizationRow } from "@/components/admin/admin-entity-directory";
import { PageHeader } from "@/components/layout/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOrganizationsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("id,name,organization_kind,sector,email,phone,status")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="الجهات العمومية" description="دليل المؤسسات والهيئات المعتمدة داخل المنصة." />
      <AdminEntityDirectory
        kind="organizations"
        rows={(data ?? []) as AdminOrganizationRow[]}
        error={error ? "تعذر تحميل الجهات العمومية." : null}
      />
    </div>
  );
}
