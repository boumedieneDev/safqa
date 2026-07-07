"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCopy, RefreshCw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  operatorEntityTypeLabels,
  organizationKindLabels,
  registrationRequestTypeLabels,
} from "@/lib/registration/options";
import type {
  OperatorEntityType,
  OrganizationKind,
  RegistrationRequestStatus,
  RegistrationRequestType,
} from "@/types/domain";

export interface RegistrationRequestRow {
  id: string;
  request_type: RegistrationRequestType;
  entity_name: string;
  organization_kind: OrganizationKind | null;
  operator_entity_type: OperatorEntityType | null;
  sector: string | null;
  specialization: string | null;
  address: string | null;
  region: string | null;
  phone: string | null;
  email: string;
  contact_name: string;
  registration_number: string | null;
  tax_number: string | null;
  national_id: string | null;
  status: RegistrationRequestStatus;
  review_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

interface ApprovalResult {
  requestId: string;
  link: string;
}

const statusLabels: Record<RegistrationRequestStatus, string> = {
  pending: "قيد المراجعة",
  approved: "معتمد",
  rejected: "مرفوض",
};

interface AdminRegistrationReviewProps {
  initialRequests: RegistrationRequestRow[];
  initialError?: string | null;
}

export function AdminRegistrationReview({ initialRequests, initialError = null }: AdminRegistrationReviewProps) {
  const [requests, setRequests] = useState<RegistrationRequestRow[]>(initialRequests);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [approvalResult, setApprovalResult] = useState<ApprovalResult | null>(null);
  const [error, setError] = useState<string | null>(initialError);

  const stats = useMemo(
    () => ({
      pending: requests.filter((request) => request.status === "pending").length,
      approved: requests.filter((request) => request.status === "approved").length,
      rejected: requests.filter((request) => request.status === "rejected").length,
    }),
    [requests],
  );

  async function loadRequests() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: loadError } = await supabase
      .from("registration_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (loadError) {
      setError("تعذر تحميل طلبات التسجيل. تأكد من رفع سكربت registration-workflows.sql.");
      setLoading(false);
      return;
    }

    setRequests((data ?? []) as RegistrationRequestRow[]);
    setLoading(false);
  }

  async function reviewRequest(requestId: string, decision: "approved" | "rejected") {
    setBusyId(requestId);
    setError(null);
    setApprovalResult(null);

    const supabase = createClient();
    const { data, error: reviewError } = await supabase.rpc("approve_registration_request", {
      request_id: requestId,
      review_decision: decision,
      notes: notesById[requestId] ?? null,
    });

    if (reviewError) {
      setError("تعذرت مراجعة الطلب. تحقق من الصلاحيات أو من عدم مراجعة الطلب سابقًا.");
      setBusyId(null);
      return;
    }

    const result = data?.[0] as { invitation_token: string | null } | undefined;
    if (decision === "approved" && result?.invitation_token) {
      setApprovalResult({
        requestId,
        link: `${window.location.origin}/register/invite?token=${result.invitation_token}`,
      });
    }

    await loadRequests();
    setBusyId(null);
  }

  async function copyInvitationLink(link: string) {
    await navigator.clipboard.writeText(link);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>قيد المراجعة</CardTitle>
            <CardDescription>{stats.pending} طلبات تنتظر قرارًا</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>المعتمدة</CardTitle>
            <CardDescription>{stats.approved} طلبات تحولت إلى دعوات</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>المرفوضة</CardTitle>
            <CardDescription>{stats.rejected} طلبات مغلقة</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">قائمة الطلبات</h2>
        <Button variant="outline" onClick={() => void loadRequests()} disabled={loading}>
          <RefreshCw className="h-4 w-4" />
          تحديث
        </Button>
      </div>

      {approvalResult ? (
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-bold text-teal-900">تم إنشاء الدعوة</p>
              <p className="mt-1 break-all text-sm text-teal-800">{approvalResult.link}</p>
            </div>
            <Button variant="outline" onClick={() => void copyInvitationLink(approvalResult.link)}>
              <ClipboardCopy className="h-4 w-4" />
              نسخ الرابط
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

      {loading ? <p className="text-sm text-muted-foreground">جار تحميل الطلبات...</p> : null}

      {!loading && requests.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">لا توجد طلبات تسجيل حاليًا.</CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4">
        {requests.map((request) => {
          const typeLabel = registrationRequestTypeLabels[request.request_type];
          const entityTypeLabel = request.organization_kind
            ? organizationKindLabels[request.organization_kind]
            : request.operator_entity_type
              ? operatorEntityTypeLabels[request.operator_entity_type]
              : request.request_type === "individual_operator"
                ? operatorEntityTypeLabels.individual
                : "غير محدد";

          return (
            <Card key={request.id}>
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{request.entity_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {typeLabel} · {entityTypeLabel}
                    </CardDescription>
                  </div>
                  <Badge tone={request.status === "approved" ? "teal" : request.status === "rejected" ? "danger" : "info"}>
                    {statusLabels[request.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm md:grid-cols-3">
                  <Info label="المسؤول" value={request.contact_name} />
                  <Info label="البريد" value={request.email} />
                  <Info label="الهاتف" value={request.phone} />
                  <Info label="القطاع" value={request.sector} />
                  <Info label="التخصص" value={request.specialization} />
                  <Info label="المنطقة" value={request.region} />
                  <Info label="السجل التجاري" value={request.registration_number} />
                  <Info label="الرقم الجبائي" value={request.tax_number} />
                  <Info label="رقم التعريف" value={request.national_id} />
                </div>

                {request.status === "pending" ? (
                  <div className="grid gap-3 border-t border-border pt-4 lg:grid-cols-[1fr_auto]">
                    <Textarea
                      value={notesById[request.id] ?? ""}
                      onChange={(event) =>
                        setNotesById((current) => ({
                          ...current,
                          [request.id]: event.target.value,
                        }))
                      }
                      placeholder="ملاحظات المراجعة..."
                    />
                    <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
                      <Button onClick={() => void reviewRequest(request.id, "approved")} disabled={busyId === request.id}>
                        <CheckCircle2 className="h-4 w-4" />
                        اعتماد
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => void reviewRequest(request.id, "rejected")}
                        disabled={busyId === request.id}
                      >
                        <XCircle className="h-4 w-4" />
                        رفض
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                    {request.review_notes || "تمت مراجعة الطلب بدون ملاحظات إضافية."}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
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
