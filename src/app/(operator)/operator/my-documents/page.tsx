import { FileCheck2, UploadCloud } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { operatorDocuments } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default function MyDocumentsPage() {
  return (
    <div>
      <PageHeader title="وثائقي" description="وثائق دائمة قابلة لإعادة الاستعمال في ملفات المشاركة." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {operatorDocuments.map((document) => (
          <Card key={document.id}>
            <CardContent className="space-y-3">
              <FileCheck2 className="h-8 w-8 text-primary" />
              <div>
                <p className="font-bold">{document.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{document.fileName}</p>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>الإصدار: {formatDate(document.issueDate)}</p>
                <p>الصلاحية: {formatDate(document.expiryDate)}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <StatusBadge type="document" status={document.status} />
                <Button size="sm" variant="outline">استبدال</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="flex h-full min-h-56 flex-col items-center justify-center text-center">
            <UploadCloud className="h-10 w-10 text-primary" />
            <p className="mt-3 font-bold">رفع وثيقة جديدة</p>
            <p className="mt-1 text-sm text-muted-foreground">السجل التجاري، شهادة الضرائب، التأهيل، أو وثائق أخرى.</p>
            <Button className="mt-4">رفع وثيقة</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
