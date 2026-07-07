import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDealById, getDocumentsByDealId, getOrganizationById, getRequirementsByDealId } from "@/lib/demo-data";
import { formatDate, formatMoney } from "@/lib/utils";

export default async function OperatorDealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = getDealById(id);
  if (!deal || !deal.isPublic) notFound();

  const organization = getOrganizationById(deal.organizationId);
  const requirements = getRequirementsByDealId(deal.id);
  const publicDocuments = getDocumentsByDealId(deal.id).filter((document) => document.visibility === "public");

  return (
    <div>
      <PageHeader title={deal.title} description={`${deal.reference} - ${organization?.name}`} />
      <div className="mb-6 flex flex-wrap gap-2">
        {["نظرة عامة", "الوثائق المطلوبة", "دفتر الشروط", "الأسئلة والتوضيحات", "تقديم الملف"].map((tab) => (
          <a key={tab} href={`#${tab}`} className="rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold hover:bg-muted">
            {tab}
          </a>
        ))}
      </div>
      <section id="نظرة عامة" className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>معلومات عامة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-7 text-muted-foreground">{deal.description}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="الجهة الناشرة" value={organization?.name ?? "غير محدد"} />
              <Info label="المجال" value={deal.sector} />
              <Info label="المنطقة" value={deal.region} />
              <Info label="القيمة التقديرية" value={formatMoney(deal.estimatedValue)} />
              <Info label="تاريخ الإعلان" value={formatDate(deal.publishedAt)} />
              <Info label="آخر أجل" value={formatDate(deal.submissionDeadline)} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>حالة التقديم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusBadge type="deal" status={deal.status} />
            <p className="text-sm leading-6 text-muted-foreground">
              لا تظهر هنا أي درجات داخلية للمخاطر أو التقييم أو بيانات المتعاملين الآخرين.
            </p>
            <Button asChild className="w-full">
              <Link href={`/operator/apply/${deal.id}`}>تقديم ملف المشاركة</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      <section id="الوثائق المطلوبة" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {requirements.map((requirement) => (
          <Card key={requirement.id}>
            <CardContent>
              <p className="font-bold">{requirement.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{requirement.description}</p>
              <StatusBadge status={requirement.isRequired ? "إلزامية" : "اختيارية"} />
            </CardContent>
          </Card>
        ))}
      </section>
      <section id="دفتر الشروط" className="mt-6 grid gap-4 md:grid-cols-2">
        {publicDocuments.map((document) => (
          <Card key={document.id}>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-bold">{document.title}</p>
                  <p className="text-sm text-muted-foreground">{document.fileName}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
                تحميل
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
      <section id="الأسئلة والتوضيحات" className="mt-6">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">لا توجد توضيحات منشورة حالياً.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
