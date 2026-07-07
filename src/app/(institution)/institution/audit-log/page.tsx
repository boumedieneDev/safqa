import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { auditLogs } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default function AuditLogPage() {
  return (
    <div>
      <PageHeader title="سجل التدقيق" description="سجل داخلي لتتبع المستخدم، الإجراء، الكيان، والتاريخ. يظهر للمؤسسة فقط عبر RLS." />
      <section className="space-y-3">
        {auditLogs.map((log) => (
          <Card key={log.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-bold">{log.summary}</p>
                <p className="mt-1 text-sm text-muted-foreground">{log.userName} - {log.entityType} - {log.action}</p>
              </div>
              <span className="text-sm text-muted-foreground">{formatDate(log.createdAt)}</span>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
