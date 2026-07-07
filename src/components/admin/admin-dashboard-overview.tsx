import Link from "next/link";
import type { ElementType } from "react";
import { Building2, ClipboardList, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AdminDashboardCounts {
  registrationRequests: number;
  pendingRequests: number;
  invitations: number;
  organizations: number;
  operators: number;
}

export function AdminDashboardOverview({ counts }: { counts: AdminDashboardCounts }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="طلبات التسجيل" value={counts.registrationRequests} hint={`${counts.pendingRequests} قيد المراجعة`} icon={ClipboardList} />
        <Metric title="الدعوات" value={counts.invitations} hint="دعوات إنشاء الحساب" icon={UserPlus} />
        <Metric title="الجهات العمومية" value={counts.organizations} hint="مؤسسات وهيئات" icon={Building2} />
        <Metric title="المتعاملون" value={counts.operators} hint="شركات وأفراد وتجمعات" icon={Users} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard
          title="مراجعة طلبات التسجيل"
          description="اعتماد جهة عمومية أو متعامل اقتصادي وتحويله إلى دعوة إنشاء حساب."
          href="/admin/registrations"
          label="فتح الطلبات"
        />
        <ActionCard
          title="متابعة الدعوات"
          description="نسخ روابط الدعوات، إلغاء الدعوات المعلقة، ومتابعة ما تم قبوله."
          href="/admin/invitations"
          label="فتح الدعوات"
        />
        <ActionCard
          title="دليل الحسابات"
          description="مراجعة الجهات والمتعاملين والحسابات المرتبطة بها من مركز واحد."
          href="/admin/organizations"
          label="فتح الدليل"
        />
      </section>
    </div>
  );
}

function Metric({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: number;
  hint: string;
  icon: ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{hint}</CardContent>
    </Card>
  );
}

function ActionCard({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>{label}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
