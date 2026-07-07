import { Bot, FileText, ListChecks, Settings2, UploadCloud } from "lucide-react";
import { AiPlaceholder } from "@/components/ui/ai-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { UploadBox } from "@/components/ui/upload-box";

const steps = [
  { title: "معلومات عامة", description: "تعريف الصفقة والآجال والقيمة." },
  { title: "الشروط والمعايير", description: "وثائق المشاركة والتقييم." },
  { title: "الوثائق", description: "دفتر الشروط والملفات الداخلية." },
  { title: "إعدادات التحليل", description: "الشفافية والمخاطر." },
  { title: "مراجعة ونشر", description: "تحقق ثم حفظ أو نشر." },
];

export function DealFormStepper() {
  return (
    <div className="space-y-6">
      <Stepper steps={steps} currentStep={0} />
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>معلومات الصفقة</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input placeholder="عنوان الصفقة" />
            <Input placeholder="رقم الصفقة" />
            <Select defaultValue="">
              <option value="">نوع الصفقة</option>
              <option>أشغال</option>
              <option>توريد</option>
              <option>خدمات</option>
            </Select>
            <Input placeholder="المجال" />
            <Input placeholder="الجهة المالكة" />
            <Input placeholder="المسؤول الداخلي" />
            <Input placeholder="القيمة التقديرية" />
            <Select defaultValue="DZD">
              <option value="DZD">DZD</option>
            </Select>
            <Input placeholder="المنطقة" />
            <Input type="date" />
            <Input type="date" />
            <Textarea className="md:col-span-2" placeholder="وصف الصفقة" />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>المراحل التالية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                تعريف شروط المشاركة ومعايير التقييم.
              </p>
              <p className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-primary" />
                رفع دفتر الشروط والوثائق العامة والداخلية.
              </p>
              <p className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                ضبط حد العروض والسعر غير الطبيعي.
              </p>
            </CardContent>
          </Card>
          <UploadBox title="دفتر الشروط" />
          <AiPlaceholder
            title="AI Risk Engine"
            description="هذه الخاصية غير مفعّلة حالياً. سيتم لاحقاً تحليل الأنماط والوثائق وربط البيانات آلياً."
          />
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Save draft / حفظ مسودة</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-teal-700" />
            <span className="text-sm font-semibold">Smart Matching Placeholder</span>
          </CardContent>
        </Card>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline">حفظ كمسودة</Button>
          <Button>نشر الصفقة</Button>
        </div>
      </section>
    </div>
  );
}
