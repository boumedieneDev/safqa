"use client";

import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { SafqaLogo } from "@/components/brand/safqa-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  operatorEntityTypeLabels,
  organizationKindLabels,
  registrationRequestTypeLabels,
} from "@/lib/registration/options";
import type { OperatorEntityType, OrganizationKind, RegistrationRequestType } from "@/types/domain";

interface RegistrationRequestFormProps {
  requestType: RegistrationRequestType;
}

type FormState = {
  entityName: string;
  organizationKind: OrganizationKind;
  operatorEntityType: OperatorEntityType;
  sector: string;
  specialization: string;
  address: string;
  region: string;
  phone: string;
  email: string;
  contactName: string;
  registrationNumber: string;
  taxNumber: string;
  nationalId: string;
  notes: string;
};

const initialFormState: FormState = {
  entityName: "",
  organizationKind: "public_institution",
  operatorEntityType: "company",
  sector: "",
  specialization: "",
  address: "",
  region: "",
  phone: "",
  email: "",
  contactName: "",
  registrationNumber: "",
  taxNumber: "",
  nationalId: "",
  notes: "",
};

export function RegistrationRequestForm({ requestType }: RegistrationRequestFormProps) {
  const [form, setForm] = useState<FormState>({
    ...initialFormState,
    operatorEntityType: requestType === "individual_operator" ? "individual" : "company",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [error, setError] = useState<string | null>(null);
  const isInstitution = requestType === "public_institution";
  const isIndividual = requestType === "individual_operator";

  const pageCopy = useMemo(() => {
    if (isInstitution) {
      return {
        title: "تسجيل جهة عمومية",
        description: "يتم اعتماد الجهة أولًا، ثم ترسل دعوة آمنة لمديرها لإنشاء حساب الدخول.",
        entityLabel: "اسم المؤسسة أو الجهة",
        contactLabel: "اسم المسؤول الإداري",
      };
    }

    if (isIndividual) {
      return {
        title: "تسجيل فرد كمتعامل اقتصادي",
        description: "يسجل الفرد كمتعامل اقتصادي مستقل ثم يحصل على دعوة لإنشاء حسابه بعد المراجعة.",
        entityLabel: "اسم المتعامل الفرد",
        contactLabel: "الاسم الكامل",
      };
    }

    return {
      title: "تسجيل متعامل اقتصادي",
      description: "الشركات والتجمعات تسجل طلب اعتماد، وبعد الموافقة تصل دعوة إنشاء الحساب.",
      entityLabel: "اسم الشركة أو التجمع",
      contactLabel: "اسم الممثل القانوني",
    };
  }, [isIndividual, isInstitution]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const requiredFields = [form.entityName, form.email, form.contactName, form.phone, form.sector];
    if (requiredFields.some((value) => value.trim().length < 2)) {
      setError("أكمل الحقول الأساسية قبل إرسال الطلب.");
      setStatus("idle");
      return;
    }

    const supabase = createClient();
    const { error: insertError } = await supabase.from("registration_requests").insert({
      request_type: requestType,
      entity_name: form.entityName.trim(),
      organization_kind: isInstitution ? form.organizationKind : null,
      operator_entity_type: isInstitution ? null : form.operatorEntityType,
      sector: form.sector.trim(),
      specialization: form.specialization.trim() || null,
      address: form.address.trim() || null,
      region: form.region.trim() || null,
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
      contact_name: form.contactName.trim(),
      registration_number: isIndividual ? null : form.registrationNumber.trim() || null,
      tax_number: isIndividual ? null : form.taxNumber.trim() || null,
      national_id: isIndividual ? form.nationalId.trim() || null : null,
      payload: {
        notes: form.notes.trim() || null,
      },
    });

    if (insertError) {
      setError("تعذر إرسال الطلب. تأكد أن سكربت التسجيل مرفوع في Supabase ثم حاول مجددًا.");
      setStatus("idle");
      return;
    }

    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl items-center">
          <Card className="w-full text-center shadow-[0_24px_80px_rgba(15,47,86,0.12)]">
            <CardHeader className="items-center">
              <SafqaLogo markOnly className="h-16 w-16" />
              <CheckCircle2 className="mt-5 h-12 w-12 text-teal-600" />
              <CardTitle className="text-2xl">تم إرسال الطلب</CardTitle>
              <CardDescription className="leading-7">
                سيظهر الطلب في لوحة مشرف المنصة. بعد الموافقة سيتم إنشاء الجهة أو المتعامل وإصدار دعوة آمنة للبريد المسجل.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">العودة إلى تسجيل الدخول</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <SafqaLogo />
          <Button asChild variant="outline">
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
        </div>

        <Card className="shadow-[0_24px_80px_rgba(15,47,86,0.10)]">
          <CardHeader>
            <CardTitle className="text-2xl">{pageCopy.title}</CardTitle>
            <CardDescription>{pageCopy.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5" onSubmit={submitRequest}>
              <section className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">{pageCopy.entityLabel}</span>
                  <Input value={form.entityName} onChange={(event) => updateField("entityName", event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">{pageCopy.contactLabel}</span>
                  <Input value={form.contactName} onChange={(event) => updateField("contactName", event.target.value)} />
                </label>
                {isInstitution ? (
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">نوع الجهة</span>
                    <Select
                      value={form.organizationKind}
                      onChange={(event) => updateField("organizationKind", event.target.value)}
                    >
                      {Object.entries(organizationKindLabels)
                        .filter(([value]) => value !== "platform_admin")
                        .map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                    </Select>
                  </label>
                ) : (
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">نوع المتعامل</span>
                    <Select
                      value={form.operatorEntityType}
                      disabled={isIndividual}
                      onChange={(event) => updateField("operatorEntityType", event.target.value)}
                    >
                      {Object.entries(operatorEntityTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                  </label>
                )}
                <label className="space-y-2">
                  <span className="text-sm font-semibold">القطاع</span>
                  <Input value={form.sector} onChange={(event) => updateField("sector", event.target.value)} />
                </label>
                {!isInstitution ? (
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">التخصص</span>
                    <Input value={form.specialization} onChange={(event) => updateField("specialization", event.target.value)} />
                  </label>
                ) : null}
                <label className="space-y-2">
                  <span className="text-sm font-semibold">البريد الإلكتروني</span>
                  <Input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">الهاتف</span>
                  <Input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">الولاية/المنطقة</span>
                  <Input value={form.region} onChange={(event) => updateField("region", event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">العنوان</span>
                  <Input value={form.address} onChange={(event) => updateField("address", event.target.value)} />
                </label>
                {!isInstitution && !isIndividual ? (
                  <>
                    <label className="space-y-2">
                      <span className="text-sm font-semibold">رقم السجل التجاري</span>
                      <Input
                        value={form.registrationNumber}
                        onChange={(event) => updateField("registrationNumber", event.target.value)}
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-semibold">الرقم الجبائي</span>
                      <Input value={form.taxNumber} onChange={(event) => updateField("taxNumber", event.target.value)} />
                    </label>
                  </>
                ) : null}
                {isIndividual ? (
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">رقم التعريف الوطني</span>
                    <Input value={form.nationalId} onChange={(event) => updateField("nationalId", event.target.value)} />
                  </label>
                ) : null}
              </section>

              <label className="space-y-2">
                <span className="text-sm font-semibold">ملاحظات إضافية</span>
                <Textarea
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="أي معلومات تساعد في مراجعة الطلب..."
                />
              </label>

              {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                <p className="text-xs text-muted-foreground">{registrationRequestTypeLabels[requestType]}</p>
                <Button type="submit" disabled={status === "submitting"} className="min-w-44">
                  <Send className="h-4 w-4" />
                  {status === "submitting" ? "جار الإرسال..." : "إرسال الطلب"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
