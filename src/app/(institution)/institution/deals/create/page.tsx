import { DealFormStepper } from "@/components/deals/deal-form-stepper";
import { PageHeader } from "@/components/layout/page-header";

export default function CreateDealPage() {
  return (
    <div>
      <PageHeader title="إنشاء صفقة جديدة" description="Stepper كامل لإنشاء الصفقة، رفع الوثائق، ضبط التحليل، ثم الحفظ أو النشر." />
      <DealFormStepper />
    </div>
  );
}
