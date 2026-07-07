import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { reports } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="التقارير" description="تقارير الشفافية والمخاطر وأداء المتعاملين مع مسارات حفظ مخصصة في Supabase Storage." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="space-y-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-bold">{report.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{formatDate(report.createdAt)}</p>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={report.status === "generated" ? "جاهز" : "مسودة"} />
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                  تحميل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
