"use client";

import Link from "next/link";
import { CheckCircle2, KeyRound } from "lucide-react";
import { useMemo, useState } from "react";
import { SafqaLogo } from "@/components/brand/safqa-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { roleLabels } from "@/lib/registration/options";
import type { UserRole } from "@/types/domain";

export interface InvitationDetails {
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  organization_name: string | null;
  operator_name: string | null;
  status: string;
  expires_at: string;
}

interface InviteAcceptanceFormProps {
  token: string | null;
  invitation: InvitationDetails | null;
  initialError?: string | null;
}

export function InviteAcceptanceForm({ token, invitation, initialError = null }: InviteAcceptanceFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const targetName = useMemo(() => {
    if (!invitation) {
      return "";
    }

    return invitation.organization_name ?? invitation.operator_name ?? "منصة Safqa";
  }, [invitation]);

  async function acceptInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!token || !invitation) {
      setError("رابط الدعوة غير صالح.");
      return;
    }

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.");
      return;
    }

    if (password !== confirmPassword) {
      setError("تأكيد كلمة المرور غير مطابق.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          invitation_token: token,
          full_name: invitation.full_name,
        },
      },
    });

    if (signUpError) {
      setError("تعذر إنشاء الحساب. قد يكون البريد مستخدمًا سابقًا أو الدعوة غير صالحة.");
      setSubmitting(false);
      return;
    }

    setCompleted(true);
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl items-center">
        <Card className="w-full shadow-[0_24px_80px_rgba(15,47,86,0.12)]">
          <CardHeader className="items-center text-center">
            <SafqaLogo markOnly className="h-16 w-16" />
            <CardTitle className="mt-3 text-2xl">قبول دعوة Safqa</CardTitle>
            <CardDescription>إنشاء حساب دخول مرتبط بالدعوة المعتمدة.</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="space-y-4 text-center">
                <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">العودة إلى تسجيل الدخول</Link>
                </Button>
              </div>
            ) : null}

            {invitation && !completed ? (
              <form className="space-y-4" onSubmit={acceptInvitation}>
                <div className="rounded-md border border-border bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">{invitation.full_name}</p>
                    <Badge tone="teal">{roleLabels[invitation.role]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{invitation.email}</p>
                  <p className="mt-2 text-sm font-semibold">{targetName}</p>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">كلمة المرور</span>
                  <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">تأكيد كلمة المرور</span>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </label>
                {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
                <Button className="w-full" type="submit" disabled={submitting}>
                  <KeyRound className="h-4 w-4" />
                  {submitting ? "جار إنشاء الحساب..." : "إنشاء الحساب"}
                </Button>
              </form>
            ) : null}

            {completed ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-teal-600" />
                <p className="text-sm leading-7 text-muted-foreground">
                  تم إنشاء الحساب. إذا كانت مصادقة البريد مفعلة في Supabase، افتح رسالة التأكيد أولًا ثم سجّل الدخول.
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
