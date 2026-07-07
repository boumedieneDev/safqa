"use client";

import { useMemo, useState } from "react";
import { ClipboardCopy, RefreshCw, Send, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { institutionInviteRoles, roleLabels } from "@/lib/registration/options";
import type { InvitationStatus, UserRole } from "@/types/domain";

export interface InstitutionProfileRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: string;
}

export interface InstitutionInvitationRow {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  token: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
}

interface InstitutionUserManagementProps {
  initialOrganizationId: string | null;
  initialRole: UserRole | null;
  initialProfiles: InstitutionProfileRow[];
  initialInvitations: InstitutionInvitationRow[];
  initialError?: string | null;
}

export function InstitutionUserManagement({
  initialOrganizationId,
  initialRole,
  initialProfiles,
  initialInvitations,
  initialError = null,
}: InstitutionUserManagementProps) {
  const [organizationId, setOrganizationId] = useState<string | null>(initialOrganizationId);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(initialRole);
  const [profiles, setProfiles] = useState<InstitutionProfileRow[]>(initialProfiles);
  const [invitations, setInvitations] = useState<InstitutionInvitationRow[]>(initialInvitations);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("procurement_officer");
  const [createdInviteLink, setCreatedInviteLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError);

  const canInvite = currentRole === "institution_admin";
  const activeInvitations = useMemo(() => invitations.filter((invite) => invite.status === "pending"), [invitations]);

  async function loadData() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("يجب تسجيل الدخول أولًا.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("organization_id,role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.organization_id) {
      setError("هذا الحساب غير مرتبط بمؤسسة.");
      setLoading(false);
      return;
    }

    setOrganizationId(profile.organization_id);
    setCurrentRole(profile.role as UserRole);

    const { data: profileRows, error: profilesError } = await supabase
      .from("profiles")
      .select("id,full_name,email,phone,role,status")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (profilesError) {
      setError("تعذر تحميل مستخدمي المؤسسة.");
      setLoading(false);
      return;
    }

    setProfiles((profileRows ?? []) as InstitutionProfileRow[]);

    if (profile.role === "institution_admin") {
      const { data: invitationRows } = await supabase
        .from("invitations")
        .select("id,email,full_name,phone,role,token,status,expires_at,created_at")
        .eq("organization_id", profile.organization_id)
        .order("created_at", { ascending: false });

      setInvitations((invitationRows ?? []) as InstitutionInvitationRow[]);
    }

    setLoading(false);
  }

  async function createInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCreatedInviteLink(null);

    if (!organizationId) {
      setError("لا توجد مؤسسة مرتبطة بالحساب.");
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setError("أدخل الاسم والبريد الإلكتروني.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from("invitations")
      .insert({
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        role,
        organization_id: organizationId,
        operator_id: null,
        invited_by: user?.id ?? null,
      })
      .select("token")
      .single();

    if (insertError || !data?.token) {
      setError("تعذر إنشاء الدعوة. تأكد أن البريد لا يملك دعوة معلقة مسبقًا.");
      setSubmitting(false);
      return;
    }

    setCreatedInviteLink(`${window.location.origin}/register/invite?token=${data.token}`);
    setFullName("");
    setEmail("");
    setPhone("");
    setRole("procurement_officer");
    await loadData();
    setSubmitting(false);
  }

  async function revokeInvitation(id: string) {
    setBusyId(id);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.from("invitations").update({ status: "revoked" }).eq("id", id);

    if (updateError) {
      setError("تعذر إلغاء الدعوة.");
      setBusyId(null);
      return;
    }

    await loadData();
    setBusyId(null);
  }

  async function copyLink(link: string) {
    await navigator.clipboard.writeText(link);
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">جار تحميل المستخدمين...</p>;
  }

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

      {canInvite ? (
        <Card>
          <CardHeader>
            <CardTitle>دعوة مستخدم جديد</CardTitle>
            <CardDescription>الدعوة تنشئ رابطًا آمنًا، والمستخدم يكمل إنشاء حساب Auth بنفسه.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_220px_auto]" onSubmit={createInvitation}>
              <Input placeholder="الاسم الكامل" value={fullName} onChange={(event) => setFullName(event.target.value)} />
              <Input placeholder="البريد الإلكتروني" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <Input placeholder="الهاتف" value={phone} onChange={(event) => setPhone(event.target.value)} />
              <Select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
                {institutionInviteRoles.map((roleValue) => (
                  <option key={roleValue} value={roleValue}>
                    {roleLabels[roleValue]}
                  </option>
                ))}
              </Select>
              <Button type="submit" disabled={submitting}>
                <Send className="h-4 w-4" />
                دعوة
              </Button>
            </form>
            {createdInviteLink ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-teal-200 bg-teal-50 p-3">
                <p className="break-all text-sm font-semibold text-teal-900">{createdInviteLink}</p>
                <Button variant="outline" onClick={() => void copyLink(createdInviteLink)}>
                  <ClipboardCopy className="h-4 w-4" />
                  نسخ
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            يمكنك رؤية مستخدمي المؤسسة. إنشاء الدعوات متاح لمدير المؤسسة فقط.
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <div>
              <CardTitle>الحسابات النشطة</CardTitle>
              <CardDescription>{profiles.length} حسابات مرتبطة بالمؤسسة</CardDescription>
            </div>
            <Button variant="outline" onClick={() => void loadData()}>
              <RefreshCw className="h-4 w-4" />
              تحديث
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-3">
                <div>
                  <p className="font-bold">{profile.full_name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={profile.status === "active" ? "success" : "warning"}>{profile.status}</Badge>
                  <Badge tone="info">{roleLabels[profile.role]}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الدعوات المعلقة</CardTitle>
            <CardDescription>{activeInvitations.length} دعوات تنتظر القبول</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {canInvite && invitations.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">لا توجد دعوات بعد.</p>
            ) : null}
            {invitations.map((invitation) => {
              const link = `${window.location.origin}/register/invite?token=${invitation.token}`;

              return (
                <div key={invitation.id} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{invitation.full_name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{invitation.email}</p>
                    </div>
                    <Badge tone={invitation.status === "pending" ? "info" : "neutral"}>{invitation.status}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button variant="outline" onClick={() => void copyLink(link)}>
                      <ClipboardCopy className="h-4 w-4" />
                      نسخ الرابط
                    </Button>
                    {invitation.status === "pending" ? (
                      <Button
                        variant="destructive"
                        onClick={() => void revokeInvitation(invitation.id)}
                        disabled={busyId === invitation.id}
                      >
                        <XCircle className="h-4 w-4" />
                        إلغاء
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
