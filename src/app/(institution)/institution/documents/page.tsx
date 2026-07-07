import { FileArchive } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { dealDocuments, deals } from "@/lib/demo-data";

export default function DocumentsPage() {
  return (
    <div>
      <PageHeader title="الوثائق" description="وثائق الصفقة العامة والداخلية والمرتبطة بالمراحل، مع مسار التخزين والظهور." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dealDocuments.map((document) => {
          const deal = deals.find((item) => item.id === document.dealId);
          return (
            <Card key={document.id}>
              <CardContent className="space-y-3">
                <FileArchive className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-bold">{document.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{deal?.reference} - {deal?.title}</p>
                </div>
                <p className="break-all rounded-md bg-slate-50 p-2 text-xs text-muted-foreground">{document.filePath}</p>
                <div className="flex items-center justify-between">
                  <StatusBadge status={document.visibility} />
                  <Button size="sm" variant="outline">تغيير الظهور</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
