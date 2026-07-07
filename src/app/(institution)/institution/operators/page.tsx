import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/layout/filter-bar";
import { OperatorsTable } from "@/components/tables/operators-table";
import { operators } from "@/lib/demo-data";

export default function OperatorsPage() {
  return (
    <div>
      <PageHeader title="إدارة المتعاملين" description="متابعة الأداء، المخاطر، الوثائق، وتاريخ المشاركة لكل متعامل اقتصادي." />
      <FilterBar
        searchPlaceholder="بحث باسم المتعامل أو رقم السجل"
        filters={[
          { label: "المجال", options: ["البناء والأشغال العمومية", "التجهيزات الطبية", "الخدمات والصيانة"] },
          { label: "المنطقة", options: ["الجزائر", "وهران", "قسنطينة", "بومرداس"] },
          { label: "مستوى الخطر", options: ["منخفض", "متوسط", "مرتفع"] },
        ]}
      />
      <OperatorsTable operators={operators} />
    </div>
  );
}
