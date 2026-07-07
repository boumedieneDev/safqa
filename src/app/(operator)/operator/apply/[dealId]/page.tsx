import { notFound } from "next/navigation";
import { ApplicationStepper } from "@/components/applications/application-stepper";
import { PageHeader } from "@/components/layout/page-header";
import { getDealById, getRequirementsByDealId, operators } from "@/lib/demo-data";

export default async function ApplyPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params;
  const deal = getDealById(dealId);
  if (!deal) notFound();

  return (
    <div>
      <PageHeader title={`تقديم ملف: ${deal.title}`} description="ملف المشاركة يتبع خمس خطوات، مع حفظ المسودة وإصدار وصل بعد الإرسال." />
      <ApplicationStepper operator={operators[0]} requirements={getRequirementsByDealId(deal.id)} />
    </div>
  );
}
