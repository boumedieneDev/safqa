import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, ReceiptText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Timeline } from "@/components/ui/timeline";
import {
  getApplicationById,
  getApplicationDocuments,
  getDealById,
  getOperatorById,
  getStagesByDealId,
} from "@/lib/demo-data";
import { formatDate, formatMoney } from "@/lib/utils";

export default async function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = getApplicationById(id);
  if (!application) notFound();

  const deal = getDealById(application.dealId);
  const operator = getOperatorById(application.operatorId);
  const documents = getApplicationDocuments(application.id);
  const missing = documents.filter((document) => document.status === "missing");

  return (
    <div>
      <PageHeader title="تفاصيل المشاركة" description={`${deal?.reference} - ${deal?.title}`} />
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>حالة الملف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusBadge type="application" status={application.status} />
            <Info label="المتعامل" value={operator?.name ?? "غير محدد"} />
            <Info label="تاريخ التقديم" value={formatDate(application.submittedAt)} />
            <Info label="المبلغ المقترح" value={application.proposedAmount ? formatMoney(application.proposedAmount) : "غير محدد"} />
            <Info label="المدة المقترحة" value={application.proposedDurationDays ? `${application.proposedDurationDays} يوم` : "غير محدد"} />
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href={`/operator/apply/${application.dealId}`}>متابعة المسودة</Link>
              </Button>
              <Button>
                <Download className="h-4 w-4" />
                تحميل الوصل
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>الوثائق المرسلة</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {documents.map((document) => (
              <div key={document.id} className="rounded-lg border border-border p-3">
                <p className="font-bold">{document.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{document.fileName}</p>
                <div className="mt-3">
                  <StatusBadge status={document.status === "missing" ? "ناقصة" : "مرفوعة"} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      {missing.length ? (
        <section className="mt-6">
          <Card>
            <CardContent>
              <p className="font-bold text-orange-700">وثائق ناقصة</p>
              <p className="mt-2 text-sm text-muted-foreground">يمكن رفع الوثائق الناقصة فقط إذا سمحت المؤسسة بذلك.</p>
            </CardContent>
          </Card>
        </section>
      ) : null}
      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline stages={getStagesByDealId(application.dealId).slice(0, 6)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>وصل الإيداع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ReceiptText className="h-10 w-10 text-primary" />
            <p className="text-sm leading-6 text-muted-foreground">وصل الإيداع يصدر عند الإرسال ويحتوي على رقم الملف وتاريخ التقديم.</p>
            <Button variant="outline" className="w-full">تحميل الوصل</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
