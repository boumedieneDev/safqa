import { AdminRegistrationReview, type RegistrationRequestRow } from "@/components/admin/admin-registration-review";
import { PageHeader } from "@/components/layout/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function AdminRegistrationsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registration_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="طلبات التسجيل"
        description="مراجعة تسجيل الجهات العمومية والمتعاملين الاقتصاديين والأفراد قبل إنشاء الدعوات."
      />
      <AdminRegistrationReview
        initialRequests={(data ?? []) as RegistrationRequestRow[]}
        initialError={error ? "تعذر تحميل طلبات التسجيل. تأكد من رفع سكربت registration-workflows.sql." : null}
      />
    </div>
  );
}
