import { AdminInvitationsPanel, type AdminInvitationRow } from "@/components/admin/admin-invitations-panel";
import { PageHeader } from "@/components/layout/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function AdminInvitationsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("*, organizations(name), operators(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="الدعوات"
        description="متابعة دعوات إنشاء الحساب الصادرة من المنصة أو من مديري المؤسسات."
      />
      <AdminInvitationsPanel
        initialInvitations={(data ?? []) as AdminInvitationRow[]}
        initialError={error ? "تعذر تحميل الدعوات. تأكد من رفع سكربت registration-workflows.sql." : null}
      />
    </div>
  );
}
