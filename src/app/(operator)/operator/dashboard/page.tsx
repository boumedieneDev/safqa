import Link from "next/link";
import { Bell, CalendarClock, ClipboardList, FileWarning, SearchCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  deals,
  getApplicationsByOperatorId,
  notifications,
  operatorDocuments,
  operators,
} from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default function OperatorDashboardPage() {
  const operator = operators[0];
  const publicDeals = deals.filter((deal) => deal.isPublic && deal.status !== "closed");
  const myApplications = getApplicationsByOperatorId(operator.id);
  const incompleteDocuments = operatorDocuments.filter((document) => ["expired", "needs_update", "rejected"].includes(document.status));
  return (
    <div>
      <PageHeader
        title="لوحة قيادة المتعامل"
        description="مختصر عملي يجيب بسرعة: أين الصفقة؟ ما الوثائق؟ كيف أقدم؟ هل ملفي ناقص؟ ما حالة مشاركتي؟"
        actionHref="/operator/available-deals"
        actionLabel="استعراض الصفقات"
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="الصفقات المتاحة" value={publicDeals.length} icon={SearchCheck} />
        <MetricCard title="مشاركاتي" value={myApplications.length} icon={ClipboardList} tone="teal" />
        <MetricCard title="ملفات تحتاج إكمال" value={incompleteDocuments.length} icon={FileWarning} tone="orange" />
        <MetricCard title="بانتظار التقييم" value={myApplications.filter((app) => app.status === "under_evaluation").length} icon={CalendarClock} />
        <MetricCard title="إشعارات جديدة" value={notifications.filter((item) => item.recipientType === "operator" && !item.isRead).length} icon={Bell} tone="red" />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>صفقات مقترحة حسب المجال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {publicDeals.slice(0, 4).map((deal) => (
              <div key={deal.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
                <div>
                  <p className="font-bold">{deal.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{deal.reference} - آخر أجل {formatDate(deal.submissionDeadline)}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/operator/available-deals/${deal.id}`}>التفاصيل</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/operator/apply/${deal.id}`}>تقديم ملف</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>حالة الوثائق</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={operator.validDocumentsPercent} indicatorClassName="bg-teal-600" />
              {operatorDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>{document.title}</span>
                  <StatusBadge type="document" status={document.status} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>آخر الإشعارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications
                .filter((item) => item.recipientType === "operator")
                .map((notification) => (
                  <div key={notification.id} className="rounded-md bg-slate-50 p-3">
                    <p className="text-sm font-bold">{notification.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{notification.body}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>مشاركاتي الأخيرة</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {myApplications.map((application) => {
              const deal = deals.find((item) => item.id === application.dealId);
              return (
                <div key={application.id} className="rounded-lg border border-border p-4">
                  <p className="font-bold">{deal?.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{deal?.reference}</p>
                  <div className="mt-3">
                    <StatusBadge type="application" status={application.status} />
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
