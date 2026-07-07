import { PageHeader } from "@/components/layout/page-header";
import { ApplicationsTable } from "@/components/tables/applications-table";
import { getApplicationsByOperatorId, operators } from "@/lib/demo-data";

export default function MyApplicationsPage() {
  const operator = operators[0];

  return (
    <div>
      <PageHeader title="مشاركاتي" description="تتبع حالة كل ملف، مرحلة الصفقة، النتيجة عند نشرها، وآخر تحديث." />
      <ApplicationsTable applications={getApplicationsByOperatorId(operator.id)} />
    </div>
  );
}
