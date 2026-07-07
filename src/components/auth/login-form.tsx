"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHomePathForProfile, getProfileAssignmentIssue } from "@/lib/auth/roles";
import { loginSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setAuthError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword(values);

    if (error || !data.user) {
      setAuthError("تعذر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.");
      setIsSubmitting(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role,status,organization_id,operator_id")
      .eq("id", data.user.id)
      .single();

    const assignmentIssue = getProfileAssignmentIssue(profile);

    if (profileError || assignmentIssue) {
      await supabase.auth.signOut();
      setAuthError(getLoginErrorMessage(assignmentIssue));
      setIsSubmitting(false);
      return;
    }

    router.refresh();
    router.push(getHomePathForProfile(profile));
  }

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">البريد الإلكتروني</span>
          <div className="flex items-center gap-2 rounded-md border border-input bg-white px-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input className="border-0 px-0 focus:ring-0" type="email" {...register("email")} />
          </div>
          {errors.email ? <span className="text-xs text-red-600">{errors.email.message}</span> : null}
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">كلمة المرور</span>
          <div className="flex items-center gap-2 rounded-md border border-input bg-white px-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <Input className="border-0 px-0 focus:ring-0" type="password" {...register("password")} />
          </div>
          {errors.password ? <span className="text-xs text-red-600">{errors.password.message}</span> : null}
        </label>
        {authError ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{authError}</p> : null}
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جار تسجيل الدخول..." : "دخول إلى المنصة"}
        </Button>
      </form>
    </div>
  );
}

function getLoginErrorMessage(issue: string | null) {
  if (issue === "inactive_profile") {
    return "هذا الحساب غير مفعّل حالياً. يرجى التواصل مع مدير الجهة.";
  }

  if (issue === "unknown_role") {
    return "دور هذا الحساب غير معروف داخل المنصة.";
  }

  if (issue && issue !== "missing_profile") {
    return "الحساب موجود، لكن ربطه بالجهة أو المتعامل غير مكتمل.";
  }

  return "تم العثور على حساب Auth، لكن لم يتم ربطه بملف profile داخل المنصة.";
}
