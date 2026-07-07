import {
  InstitutionUserManagement,
  type InstitutionInvitationRow,
  type InstitutionProfileRow,
} from "@/components/institution/institution-user-management";
import { PageHeader } from "@/components/layout/page-header";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/domain";

export default async function InstitutionUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let organizationId: string | null = null;
  let role: UserRole | null = null;
  let profiles: InstitutionProfileRow[] = [];
  let invitations: InstitutionInvitationRow[] = [];
  let initialError: string | null = null;

  if (!user) {
    initialError = "يجب تسجيل الدخول أولًا.";
  } else {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("organization_id,role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.organization_id) {
      initialError = "هذا الحساب غير مرتبط بمؤسسة.";
    } else {
      organizationId = profile.organization_id;
      role = profile.role as UserRole;

      const { data: profileRows, error: profilesError } = await supabase
        .from("profiles")
        .select("id,full_name,email,phone,role,status")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (profilesError) {
        initialError = "تعذر تحميل مستخدمي المؤسسة.";
      } else {
        profiles = (profileRows ?? []) as InstitutionProfileRow[];
      }

      if (role === "institution_admin") {
        const { data: invitationRows } = await supabase
          .from("invitations")
          .select("id,email,full_name,phone,role,token,status,expires_at,created_at")
          .eq("organization_id", organizationId)
          .order("created_at", { ascending: false });

        invitations = (invitationRows ?? []) as InstitutionInvitationRow[];
      }
    }
  }

  return (
    <div>
      <PageHeader
        title="مستخدمو المؤسسة"
        description="إدارة الحسابات المرتبطة بالمؤسسة وإنشاء دعوات آمنة للموظفين."
      />
      <InstitutionUserManagement
        initialOrganizationId={organizationId}
        initialRole={role}
        initialProfiles={profiles}
        initialInvitations={invitations}
        initialError={initialError}
      />
    </div>
  );
}
