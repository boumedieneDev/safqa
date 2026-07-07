import { AlertTriangle, ClipboardList, Clock, Gauge, Hourglass, ShieldAlert, Users } from "lucide-react";
import {
  GaugeChart,
  LineTrendChart,
  QualityRadar,
  RiskDonut,
  StatusBarChart,
} from "@/components/charts/dashboard-charts";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { applications, deals, operators, riskAlerts, transparencyScores } from "@/lib/demo-data";
import { formatMoney } from "@/lib/utils";

export default function InstitutionDashboardPage() {
  const openDeals = deals.filter((deal) => !["closed", "completed", "cancelled"].includes(deal.status));
  const highRiskAlerts = riskAlerts.filter((alert) => ["high", "critical"].includes(alert.severity));
  const averageTransparency = Math.round(
    transparencyScores.reduce((sum, score) => sum + score.totalScore, 0) / transparencyScores.length,
  );
  const evaluationDeals = deals.filter((deal) => deal.status.includes("evaluation"));
  const delayedDeals = deals.filter((deal) => deal.status === "delayed");
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.estimatedValue, 0);

  const riskData = [
    { name: "منخفض", value: 2 },
    { name: "متوسط", value: 1 },
    { name: "مرتفع", value: 1 },
    { name: "حرج", value: 1 },
  ];
  const qualityData = [
    { name: "الوثائق", value: 82 },
    { name: "الآجال", value: 72 },
    { name: "المنافسة", value: 59 },
    { name: "التقييم", value: 77 },
    { name: "التبرير", value: 66 },
    { name: "النشر", value: 89 },
  ];
  const trendData = [
    { name: "يناير", value: 42 },
    { name: "فبراير", value: 48 },
    { name: "مارس", value: 51 },
    { name: "أبريل", value: 56 },
    { name: "ماي", value: 61 },
    { name: "يونيو", value: 58 },
  ];
  const statusData = [
    { name: "استقبال", value: deals.filter((deal) => deal.status === "receiving_offers").length },
    { name: "تقييم", value: evaluationDeals.length },
    { name: "منح", value: deals.filter((deal) => deal.status.includes("award")).length },
    { name: "تنفيذ", value: deals.filter((deal) => deal.status === "execution").length },
    { name: "متأخرة", value: delayedDeals.length },
  ];

  return (
    <div>
      <PageHeader
        title="لوحة قيادة المؤسسة"
        description="نظرة تحليلية على الصفقات، المخاطر، الشفافية، العروض، والتنبيهات الداخلية."
        actionHref="/institution/deals/create"
        actionLabel="إنشاء صفقة"
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="الصفقات المفتوحة" value={openDeals.length} hint={formatMoney(totalPipelineValue)} icon={ClipboardList} />
        <MetricCard title="صفقات عالية المخاطر" value={highRiskAlerts.length} hint="تحتاج مراجعة داخلية" icon={ShieldAlert} tone="red" />
        <MetricCard title="متوسط الشفافية" value={`${averageTransparency}%`} hint="حسب آخر احتساب" icon={Gauge} tone="teal" />
        <MetricCard title="المتعاملون" value={operators.length} hint={`${applications.length} ملفات مشاركة`} icon={Users} tone="green" />
        <MetricCard title="قيد التقييم" value={evaluationDeals.length} icon={Hourglass} tone="orange" />
        <MetricCard title="صفقات متأخرة" value={delayedDeals.length} icon={Clock} tone="red" />
        <MetricCard title="تنبيهات ذكية" value={riskAlerts.length} hint="Rule-Based حالياً" icon={AlertTriangle} tone="orange" />
        <MetricCard title="متوسط العروض" value="2.4" hint="لكل صفقة منشورة" icon={ClipboardList} tone="gray" />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>مؤشر الشفافية</CardTitle>
          </CardHeader>
          <CardContent>
            <GaugeChart value={averageTransparency} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>توزيع المخاطر</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDonut data={riskData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>جودة الإجراءات</CardTitle>
          </CardHeader>
          <CardContent>
            <QualityRadar data={qualityData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>اتجاه المخاطر</CardTitle>
          </CardHeader>
          <CardContent>
            <LineTrendChart data={trendData} />
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>الصفقات حسب الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBarChart data={statusData} />
          </CardContent>
        </Card>
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>أعلى التنبيهات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold">{alert.riskType}</p>
                  <StatusBadge type="risk" status={alert.severity} />
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{alert.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>أكثر المتعاملين تكراراً</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {operators
              .slice()
              .sort((a, b) => b.previousParticipations - a.previousParticipations)
              .slice(0, 4)
              .map((operator) => (
                <div key={operator.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-b-0">
                  <div>
                    <p className="text-sm font-bold">{operator.name}</p>
                    <p className="text-xs text-muted-foreground">{operator.previousParticipations} مشاركة</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{operator.winRate}%</span>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>الصفقات ذات المخاطر العالية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {highRiskAlerts.map((alert) => {
              const deal = deals.find((item) => item.id === alert.dealId);
              return (
                <div key={alert.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-bold">{deal?.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{deal?.reference}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
