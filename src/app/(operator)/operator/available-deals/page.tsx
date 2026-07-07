import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { FilterBar } from "@/components/layout/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { deals, getOrganizationById } from "@/lib/demo-data";
import { formatDate, formatMoney } from "@/lib/utils";

export default function AvailableDealsPage() {
  const publicDeals = deals.filter((deal) => deal.isPublic);

  return (
    <div>
      <PageHeader title="الصفقات المتاحة" description="كل الصفقات المنشورة التي يمكن للمتعامل الاطلاع عليها أو التقديم لها." />
      <FilterBar
        searchPlaceholder="بحث بالعنوان أو رقم الصفقة"
        filters={[
          { label: "المجال", options: ["البناء والأشغال العمومية", "التجهيزات الطبية", "الخدمات والصيانة"] },
          { label: "الجهة", options: ["وزارة الصحة", "مديرية المشاريع الصحية"] },
          { label: "الحالة", options: ["مفتوحة", "آخر أجل قريب", "مغلقة", "تم التقديم"] },
        ]}
      />
      <section className="grid gap-4 xl:grid-cols-2">
        {publicDeals.map((deal) => (
          <Card key={deal.id}>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-primary">{deal.reference}</p>
                  <h2 className="mt-1 text-lg font-bold">{deal.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{getOrganizationById(deal.organizationId)?.name}</p>
                </div>
                <StatusBadge type="deal" status={deal.status} />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{deal.description}</p>
              <div className="grid gap-3 text-sm md:grid-cols-3">
                <span className="flex items-center gap-2 rounded-md bg-slate-50 p-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {deal.region}
                </span>
                <span className="rounded-md bg-slate-50 p-2">{deal.sector}</span>
                <span className="rounded-md bg-slate-50 p-2">{formatMoney(deal.estimatedValue)}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  آخر أجل: {formatDate(deal.submissionDeadline)}
                </span>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/operator/available-deals/${deal.id}`}>عرض التفاصيل</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/operator/apply/${deal.id}`}>تقديم ملف</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
