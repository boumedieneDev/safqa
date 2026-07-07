import { DealsTable } from "@/components/tables/deals-table";
import { FilterBar } from "@/components/layout/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { deals } from "@/lib/demo-data";

export default function InstitutionDealsPage() {
  return (
    <div>
      <PageHeader
        title="إدارة الصفقات"
        description="بحث وتصفية الصفقات حسب السنة، الحالة، المجال، الجهة، مستوى الخطر، والمتعامل الفائز."
        actionHref="/institution/deals/create"
        actionLabel="إنشاء صفقة جديدة"
      />
      <FilterBar
        searchPlaceholder="بحث برقم الصفقة أو العنوان"
        filters={[
          { label: "السنة", options: ["2025", "2024"] },
          { label: "الحالة", options: ["استقبال العروض", "تقييم تقني", "منح مؤقت", "متأخرة"] },
          { label: "مستوى الخطر", options: ["منخفض", "متوسط", "مرتفع", "حرج"] },
        ]}
      />
      <DealsTable deals={deals} />
    </div>
  );
}
