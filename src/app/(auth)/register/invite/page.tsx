import { InviteAcceptanceForm, type InvitationDetails } from "@/components/registration/invite-acceptance-form";
import { createClient } from "@/lib/supabase/server";

interface InviteRegistrationPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function InviteRegistrationPage({ searchParams }: InviteRegistrationPageProps) {
  const params = await searchParams;
  const token = params.token ?? null;
  let invitation: InvitationDetails | null = null;
  let initialError: string | null = null;

  if (!token) {
    initialError = "رابط الدعوة غير مكتمل.";
  } else {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_invitation_by_token", {
      invite_token: token,
    });

    if (error || !data?.[0]) {
      initialError = "تعذر قراءة الدعوة. تأكد أن سكربت الدعوات مرفوع في Supabase.";
    } else {
      const invite = data[0] as InvitationDetails;
      if (invite.status !== "pending") {
        initialError = invite.status === "expired" ? "انتهت صلاحية هذه الدعوة." : "هذه الدعوة لم تعد متاحة.";
      } else {
        invitation = invite;
      }
    }
  }

  return <InviteAcceptanceForm token={token} invitation={invitation} initialError={initialError} />;
}
