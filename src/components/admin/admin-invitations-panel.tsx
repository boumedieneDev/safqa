"use client";

import { useState } from "react";
import { ClipboardCopy, RefreshCw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { roleLabels } from "@/lib/registration/options";
import type { InvitationStatus, UserRole } from "@/types/domain";

export interface AdminInvitationRow {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  token: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
  organizations: { name: string } | null;
  operators: { name: string } | null;
}

const statusLabels: Record<InvitationStatus, string> = {
  pending: "معلقة",
  accepted: "مقبولة",
  revoked: "ملغاة",
  expired: "منتهية",
};

interface AdminInvitationsPanelProps {
  initialInvitations: AdminInvitationRow[];
  initialError?: string | null;
}

export function AdminInvitationsPanel({ initialInvitations, initialError = null }: AdminInvitationsPanelProps) {
  const [invitations, setInvitations] = useState<AdminInvitationRow[]>(initialInvitations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadInvitations() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: loadError } = await supabase
      .from("invitations")
      .select("*, organizations(name), operators(name)")
      .order("created_at", { ascending: false });

    if (loadError) {
      setError("تعذر تحميل الدعوات. تأكد من رفع سكربت registration-workflows.sql.");
      setLoading(false);
      return;
    }

    setInvitations((data ?? []) as AdminInvitationRow[]);
    setLoading(false);
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

    await loadInvitations();
    setBusyId(null);
  }

  async function copyInvite(token: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/register/invite?token=${token}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">كل الدعوات</h2>
        <Button variant="outline" onClick={() => void loadInvitations()} disabled={loading}>
          <RefreshCw className="h-4 w-4" />
          تحديث
        </Button>
      </div>

      {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">جار تحميل الدعوات...</p> : null}

      {!loading && invitations.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">لا توجد دعوات حتى الآن.</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4">
        {invitations.map((invitation) => {
          const targetName = invitation.organizations?.name ?? invitation.operators?.name ?? "إدارة المنصة";
          const displayStatus = invitation.status;

          return (
            <Card key={invitation.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle>{invitation.full_name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{invitation.email}</p>
                </div>
                <Badge
                  tone={displayStatus === "accepted" ? "success" : displayStatus === "pending" ? "info" : "warning"}
                >
                  {statusLabels[displayStatus]}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm">
                  <p className="font-semibold">{targetName}</p>
                  <p className="mt-1 text-muted-foreground">{roleLabels[invitation.role]}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={() => void copyInvite(invitation.token)}>
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
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
