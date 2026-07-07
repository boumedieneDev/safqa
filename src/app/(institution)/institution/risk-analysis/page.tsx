import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { RiskAlertsTable } from "@/components/tables/risk-alerts-table";
import { AiPlaceholder } from "@/components/ui/ai-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { riskAlerts } from "@/lib/demo-data";

export default function RiskAnalysisPage() {
  return (
    <div>
      <PageHeader title="تحليل المخاطر" description="محرك Rule-Based يراقب ضعف المنافسة، الأسعار غير الطبيعية، تكرار الفوز، الملاحق، والتأخرات." />
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard title="إجمالي التنبيهات" value={riskAlerts.length} icon={ShieldAlert} tone="orange" />
        <MetricCard title="حرجة" value={riskAlerts.filter((alert) => alert.severity === "critical").length} icon={ShieldAlert} tone="red" />
        <MetricCard title="مرتفعة" value={riskAlerts.filter((alert) => alert.severity === "high").length} icon={ShieldAlert} tone="red" />
        <MetricCard title="قيد المعالجة" value={riskAlerts.filter((alert) => alert.status === "reviewing").length} icon={ShieldAlert} />
      </section>
      <div className="mt-6">
        <AiPlaceholder title="AI Risk Engine" description="هذه الخاصية غير مفعّلة حالياً. سيتم تفعيل التحليل الذكي لاحقاً." />
      </div>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RiskAlertsTable alerts={riskAlerts} />
        <Card>
          <CardHeader>
            <CardTitle>قواعد المخاطر الحالية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              "ضعف المنافسة: عدد العروض أقل من الحد الأدنى.",
              "السعر غير الطبيعي: أقل من متوسط العروض بنسبة 70%.",
              "تاريخ المتعامل: تكرار الفوز أو سجل مخاطر مرتفع.",
              "كثرة الملاحق: أكثر من 3 ملاحق أو زيادة تتجاوز 20%.",
              "التأخرات: تجاوز حد 30 يوماً دون تبرير.",
            ].map((rule) => (
              <p key={rule} className="rounded-md bg-slate-50 p-3 leading-6">
                {rule}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
