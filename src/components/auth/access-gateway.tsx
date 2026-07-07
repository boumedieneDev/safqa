import Link from "next/link";
import { Building2, LockKeyhole, UserRound, Users } from "lucide-react";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AccessGateway() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="grid min-h-screen lg:grid-cols-[1.04fr_0.96fr]">
        <section className="relative hidden overflow-hidden bg-sidebar lg:block">
          <Image
            src="/images/auth-hero-governance.png"
            alt="حوكمة الصفقات وحماية الوثائق"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-sidebar/15 via-sidebar/35 to-sidebar/85" />
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between p-10 text-white">
            <div className="max-w-xl">
              <Badge tone="teal" className="border-white/20 bg-white/10 text-white">
                بوابة آمنة
              </Badge>
              <h1 className="mt-8 text-5xl font-bold leading-[1.35] tracking-normal">
                حوكمة أكثر شفافية
                <br />
                لصفقات أكثر كفاءة
              </h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-white/82">
                تمكّنك من مراقبة الصفقات، تحليل المخاطر، واتخاذ قرارات مبنية على البيانات لتعزيز النزاهة والكفاءة.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-white/80">
              <div className="h-px w-24 bg-teal-300/70" />
              <p>Procure Smart · Manage Risk · Build Trust</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 lg:px-12">
          <div className="w-full max-w-[560px]">
            <Card className="border-slate-200 shadow-[0_24px_80px_rgba(15,47,86,0.14)]">
              <CardHeader className="items-center border-b-0 px-8 pb-3 pt-10 text-center">
                <Image
                  src="/brand/safqa-logo-full.png"
                  alt="Safqa - صفقة"
                  width={1050}
                  height={520}
                  priority
                  className="h-28 w-auto object-contain"
                />
                <CardTitle className="mt-3 text-xl">منصة الشفافية وتحليل المخاطر في الصفقات</CardTitle>
                <CardDescription>حوكمة رشيدة، شفافية مستدامة، وقرارات آمنة.</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <LoginForm />
                <div className="mt-5 grid gap-2 border-t border-border pt-5 sm:grid-cols-3">
                  <Link
                    href="/register/institution"
                    className="flex items-center justify-center gap-2 rounded-md border border-border bg-white px-3 py-2.5 text-sm font-semibold transition hover:border-primary hover:bg-blue-50"
                  >
                    <Building2 className="h-4 w-4" />
                    جهة عمومية
                  </Link>
                  <Link
                    href="/register/operator"
                    className="flex items-center justify-center gap-2 rounded-md border border-border bg-white px-3 py-2.5 text-sm font-semibold transition hover:border-primary hover:bg-blue-50"
                  >
                    <Users className="h-4 w-4" />
                    متعامل اقتصادي
                  </Link>
                  <Link
                    href="/register/individual"
                    className="flex items-center justify-center gap-2 rounded-md border border-border bg-white px-3 py-2.5 text-sm font-semibold transition hover:border-primary hover:bg-blue-50"
                  >
                    <UserRound className="h-4 w-4" />
                    فرد
                  </Link>
                </div>
                <div className="mt-5 flex items-center justify-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
                  <LockKeyhole className="h-4 w-4" />
                  بياناتك محمية وفقاً لأعلى معايير الأمن والخصوصية
                </div>
              </CardContent>
            </Card>

            <section className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span>دخول مخصص للمستخدمين المصرح لهم فقط</span>
              <Link
                href="/forgot-password"
                className="font-semibold text-primary hover:underline"
              >
                استرجاع كلمة المرور
              </Link>
            </section>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Powered by{" "}
              <a
                href="https://boumedienedev.netlify.app/contact"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Boumediene.dev
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
