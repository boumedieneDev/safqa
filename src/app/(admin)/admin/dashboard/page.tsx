import { AdminDashboardOverview, type AdminDashboardCounts } from "@/components/admin/admin-dashboard-overview";
import { PageHeader } from "@/components/layout/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [requests, pendingRequests, invitations, organizations, operators] = await Promise.all([
    supabase.from("registration_requests").select("id", { count: "exact", head: true }),
    supabase.from("registration_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("invitations").select("id", { count: "exact", head: true }),
    supabase.from("organizations").select("id", { count: "exact", head: true }),
    supabase.from("operators").select("id", { count: "exact", head: true }),
  ]);

  const counts: AdminDashboardCounts = {
    registrationRequests: requests.count ?? 0,
    pendingRequests: pendingRequests.count ?? 0,
    invitations: invitations.count ?? 0,
    organizations: organizations.count ?? 0,
    operators: operators.count ?? 0,
  };

  return (
    <div>
      <PageHeader
        title="لوحة إدارة المنصة"
        description="مركز إدارة طلبات التسجيل، الجهات العمومية، المتعاملين الاقتصاديين، والدعوات."
        actionHref="/admin/registrations"
        actionLabel="مراجعة الطلبات"
      />
      <AdminDashboardOverview counts={counts} />
    </div>
  );
}
