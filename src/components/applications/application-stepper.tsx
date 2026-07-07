import { FileCheck2, FileText, Landmark, ReceiptText, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { UploadBox } from "@/components/ui/upload-box";
import type { DealRequirement, Operator } from "@/types/domain";

const steps = [
  { title: "معلومات المتعامل", description: "بيانات الشركة والاتصال." },
  { title: "الوثائق الإدارية", description: "الوثائق المطلوبة للملف." },
  { title: "العرض التقني", description: "منهجية وملفات الدعم." },
  { title: "العرض المالي", description: "السعر والمدة والتفصيل." },
  { title: "مراجعة وإرسال", description: "وصل الإيداع بعد الإرسال." },
];

interface ApplicationStepperProps {
  operator: Operator;
  requirements: DealRequirement[];
}

export function ApplicationStepper({ operator, requirements }: ApplicationStepperProps) {
  return (
    <div className="space-y-6">
      <Stepper steps={steps} currentStep={1} />
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>معلومات المتعامل</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input defaultValue={operator.name} />
            <Input defaultValue={operator.registrationNumber} />
            <Input defaultValue={operator.sector} />
            <Input defaultValue={operator.address} />
            <Input defaultValue={operator.email} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>الوثائق المطلوبة</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {requirements.map((requirement) => (
              <div key={requirement.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold">{requirement.title}</p>
                  <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">إلزامية</span>
                </div>
                <UploadBox title="رفع الوثيقة" description="PDF فقط، حتى 20MB." />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold">
              <FileText className="h-4 w-4 text-primary" />
              العرض التقني
            </div>
            <UploadBox title="رفع العرض التقني" />
            <Textarea placeholder="ملاحظات تقنية" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold">
              <WalletCards className="h-4 w-4 text-primary" />
              العرض المالي
            </div>
            <Input placeholder="المبلغ المقترح" />
            <Input placeholder="مدة الإنجاز بالأيام" />
            <UploadBox title="رفع العرض المالي" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm font-bold">
              <ReceiptText className="h-4 w-4 text-primary" />
              مراجعة الملف
            </p>
            <p className="text-sm leading-6 text-muted-foreground">لا يمكن إرسال الملف بعد آخر أجل. المسودة تبقى قابلة للتعديل.</p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
              سيتم إصدار وصل إيداع بعد الإرسال.
            </p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Landmark className="h-4 w-4 text-primary" />
              التحديثات بعد الإرسال تحتاج ترخيص المؤسسة.
            </p>
            <div className="flex gap-2">
              <Button variant="outline">حفظ مسودة</Button>
              <Button>إرسال الملف</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
