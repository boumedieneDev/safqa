import { Settings2 } from "lucide-react";
import { AccountModelPanel } from "@/components/accounts/account-model-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="الإعدادات" description="إعدادات المؤسسة، قواعد التحليل، وحدود التنبيه الأولية." />
      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>إعدادات المؤسسة</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input defaultValue="مديرية المشاريع الصحية" />
            <Input defaultValue="projects@sante.gov.dz" />
            <Input defaultValue="+213 21 11 11 11" />
            <Select defaultValue="active">
              <option value="active">نشطة</option>
              <option value="inactive">غير نشطة</option>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>حدود المخاطر والشفافية</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input defaultValue="3" placeholder="الحد الأدنى لعدد العروض" />
            <Input defaultValue="0.70" placeholder="نسبة السعر المنخفض غير الطبيعي" />
            <Input defaultValue="30" placeholder="حد التأخر بالأيام" />
            <Input defaultValue="60" placeholder="حد الخطر المقبول" />
            <Button>
              <Settings2 className="h-4 w-4" />
              حفظ الإعدادات
            </Button>
          </CardContent>
        </Card>
      </section>
      <AccountModelPanel />
    </div>
  );
}
