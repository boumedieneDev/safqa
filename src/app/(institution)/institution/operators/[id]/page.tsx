import { notFound } from "next/navigation";
import { Award, BriefcaseBusiness, FileCheck2, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ApplicationsTable } from "@/components/tables/applications-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { getApplicationsByOperatorId, getOperatorById, operatorDocuments } from "@/lib/demo-data";
import { formatDate, formatMoney } from "@/lib/utils";

export default async function OperatorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const operator = getOperatorById(id);
  if (!operator) notFound();

  const operatorApplications = getApplicationsByOperatorId(operator.id);
  const documents = operatorDocuments.filter((document) => document.operatorId === operator.id);

  return (
    <div>
      <PageHeader title={operator.name} description={`${operator.specialization} - ${operator.region}`} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="تقييم الأداء" value={`${operator.performanceScore}%`} icon={Award} tone="teal" />
        <MetricCard title="مستوى الخطر" value={`${operator.riskScore}%`} icon={ShieldAlert} tone={operator.riskScore > 50 ? "red" : "green"} />
        <MetricCard title="المشاركات" value={operator.previousParticipations} icon={BriefcaseBusiness} />
        <MetricCard title="اكتمال الوثائق" value={`${operator.validDocumentsPercent}%`} icon={FileCheck2} tone="green" />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>بطاقة المتعامل</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Info label="السجل التجاري" value={operator.registrationNumber} />
            <Info label="الرقم الجبائي" value={operator.taxNumber} />
            <Info label="العنوان" value={operator.address} />
            <Info label="الهاتف" value={operator.phone} />
            <Info label="رأس المال" value={formatMoney(operator.capital)} />
            <Info label="تاريخ التأسيس" value={formatDate(operator.foundedAt)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ملف المخاطر والأداء</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Score label="الأداء" value={operator.performanceScore} tone="bg-teal-600" />
            <Score label="الخطر" value={operator.riskScore} tone="bg-red-600" />
            <Score label="الوثائق الصالحة" value={operator.validDocumentsPercent} tone="bg-emerald-600" />
            <p className="text-sm leading-6 text-muted-foreground">
              يتم احتساب ملف المخاطر مبدئياً من تاريخ الفوز، تكرار المشاركة، اكتمال الوثائق، والتنبيهات المسجلة.
            </p>
          </CardContent>
        </Card>
      </section>
      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>تاريخ المشاركات</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsTable applications={operatorApplications} />
          </CardContent>
        </Card>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {documents.map((document) => (
          <Card key={document.id}>
            <CardContent>
              <p className="text-sm font-bold">{document.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{document.fileName}</p>
              <div className="mt-3">
                <StatusBadge type="document" status={document.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Score({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} indicatorClassName={tone} />
    </div>
  );
}
