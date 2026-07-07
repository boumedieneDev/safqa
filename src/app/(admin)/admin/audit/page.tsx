import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAuditPage() {
  return (
    <div>
      <PageHeader title="تدقيق المنصة" description="سجل رقابي عام لعمليات إنشاء الجهات والدعوات ومراجعة الطلبات." />
      <Card>
        <CardHeader>
          <CardTitle>قيد الربط بسجل التدقيق</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-7 text-muted-foreground">
          مسار التدقيق العام جاهز داخل واجهة مشرف المنصة. الخطوة التالية هي تسجيل أحداث الاعتماد والإلغاء في جدول
          audit_logs عند كل عملية حساسة.
        </CardContent>
      </Card>
    </div>
  );
}
