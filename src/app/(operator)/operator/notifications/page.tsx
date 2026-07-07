import { Bell } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { notifications } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const operatorNotifications = notifications.filter((notification) => notification.recipientType === "operator");

  return (
    <div>
      <PageHeader title="الإشعارات" description="تنبيهات الآجال، حالة الوثائق، طلبات التوضيح، ونتائج الملفات عند نشرها." />
      <section className="space-y-3">
        {operatorNotifications.map((notification) => (
          <Card key={notification.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-3">
                <Bell className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-bold">{notification.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={notification.type} />
                <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
