import { AdminEntityDirectory, type AdminOperatorRow } from "@/components/admin/admin-entity-directory";
import { PageHeader } from "@/components/layout/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOperatorsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("operators")
    .select("id,name,entity_type,sector,specialization,email,phone,status")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="المتعاملون الاقتصاديون" description="دليل الشركات والأفراد والتجمعات المعتمدة داخل المنصة." />
      <AdminEntityDirectory
        kind="operators"
        rows={(data ?? []) as AdminOperatorRow[]}
        error={error ? "تعذر تحميل المتعاملين الاقتصاديين." : null}
      />
    </div>
  );
}
