import { notFound } from "next/navigation";
import { ApplicationsTable } from "@/components/tables/applications-table";
import { RiskAlertsTable } from "@/components/tables/risk-alerts-table";
import { GaugeChart, QualityRadar } from "@/components/charts/dashboard-charts";
import { PageHeader } from "@/components/layout/page-header";
import { AiPlaceholder } from "@/components/ui/ai-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { Timeline } from "@/components/ui/timeline";
import {
  auditLogs,
  avenants,
  executionTracking,
  getApplicationsByDealId,
  getDealById,
  getDocumentsByDealId,
  getOrganizationById,
  getRiskAlertsByDealId,
  getStagesByDealId,
  getTransparencyByDealId,
} from "@/lib/demo-data";
import { transparencyBreakdown } from "@/lib/transparency/transparency-engine";
import { formatDate, formatMoney } from "@/lib/utils";

export default async function DealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = getDealById(id);
  if (!deal) notFound();

  const organization = getOrganizationById(deal.organizationId);
  const dealApplications = getApplicationsByDealId(deal.id);
  const stages = getStagesByDealId(deal.id);
  const documents = getDocumentsByDealId(deal.id);
  const alerts = getRiskAlertsByDealId(deal.id);
  const transparency = getTransparencyByDealId(deal.id);
  const dealAvenants = avenants.filter((avenant) => avenant.dealId === deal.id);
  const execution = executionTracking.filter((item) => item.dealId === deal.id);
  const logs = auditLogs.filter((log) => log.entityId === deal.id || log.organizationId === deal.organizationId);

  return (
    <div>
      <PageHeader title={deal.title} description={`${deal.reference} - ${organization?.name ?? "جهة غير محددة"}`} />
      <div className="mb-6 flex flex-wrap gap-2">
        {["نظرة عامة", "المراحل", "العروض", "الوثائق", "تحليل المخاطر", "مؤشر الشفافية", "الملاحق", "التنفيذ", "سجل التدقيق"].map(
          (tab) => (
            <a key={tab} href={`#${tab}`} className="rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold hover:bg-muted">
              {tab}
            </a>
          ),
        )}
      </div>
      <section id="نظرة عامة" className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>نظرة عامة</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Info label="رقم الصفقة" value={deal.reference} />
            <Info label="الحالة" value={<StatusBadge type="deal" status={deal.status} />} />
            <Info label="الجهة" value={organization?.name ?? "غير محدد"} />
            <Info label="تاريخ الإعلان" value={formatDate(deal.publishedAt)} />
            <Info label="آخر أجل" value={formatDate(deal.submissionDeadline)} />
            <Info label="القيمة التقديرية" value={formatMoney(deal.estimatedValue)} />
            <Info label="عدد العروض" value={dealApplications.length} />
            <Info label="مؤشر الشفافية" value={`${transparency?.totalScore ?? 0}%`} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>التنبيهات والوثائق الرئيسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length ? (
              alerts.map((alert) => (
                <div key={alert.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold">{alert.riskType}</p>
                    <StatusBadge type="risk" status={alert.severity} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{alert.reason}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">لا توجد تنبيهات مفتوحة.</p>
            )}
            {documents.slice(0, 2).map((document) => (
              <div key={document.id} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
                <span>{document.title}</span>
                <span className="text-muted-foreground">{document.visibility}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section id="المراحل" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>مراحل الصفقة</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline stages={stages} />
          </CardContent>
        </Card>
      </section>
      <section id="العروض" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>العروض والتقييم</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsTable applications={dealApplications} />
          </CardContent>
        </Card>
      </section>
      <section id="الوثائق" className="mt-6 grid gap-4 md:grid-cols-2">
        {documents.map((document) => (
          <Card key={document.id}>
            <CardContent className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold">{document.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{document.filePath}</p>
              </div>
              <StatusBadge status={document.visibility} />
            </CardContent>
          </Card>
        ))}
      </section>
      <section id="تحليل المخاطر" className="mt-6 space-y-4">
        <AiPlaceholder title="AI Risk Engine" description="الحالة: غير مفعّل حالياً. سيتم لاحقاً تحليل الأنماط والوثائق وربط البيانات آلياً." />
        <RiskAlertsTable alerts={alerts} />
      </section>
      {transparency ? (
        <section id="مؤشر الشفافية" className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>المجموع</CardTitle>
            </CardHeader>
            <CardContent>
              <GaugeChart value={transparency.totalScore} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>أبعاد الشفافية</CardTitle>
            </CardHeader>
            <CardContent>
              <QualityRadar data={transparencyBreakdown(transparency)} />
            </CardContent>
          </Card>
        </section>
      ) : null}
      <section id="الملاحق" className="mt-6 grid gap-4 md:grid-cols-2">
        {dealAvenants.map((avenant) => (
          <Card key={avenant.id}>
            <CardContent className="space-y-2">
              <p className="font-bold">{avenant.title}</p>
              <p className="text-sm text-muted-foreground">{avenant.reason}</p>
              <p className="text-sm">نسبة الزيادة: {avenant.increasePercentage}%</p>
              <StatusBadge type="risk" status={avenant.riskImpact} />
            </CardContent>
          </Card>
        ))}
      </section>
      <section id="التنفيذ" className="mt-6 grid gap-4 md:grid-cols-2">
        {execution.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-3">
              <p className="font-bold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <Progress value={item.progressPercentage} />
              <p className="text-sm">التأخر: {item.delayDays} يوم</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section id="سجل التدقيق" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>سجل التدقيق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-b-0">
                <div>
                  <p className="text-sm font-bold">{log.summary}</p>
                  <p className="text-xs text-muted-foreground">{log.userName}</p>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-bold">{value}</div>
    </div>
  );
}
