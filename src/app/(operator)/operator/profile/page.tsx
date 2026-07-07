import { Building2, FileCheck2, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { operators } from "@/lib/demo-data";
import { formatMoney } from "@/lib/utils";

export default function ProfilePage() {
  const operator = operators[0];

  return (
    <div>
      <PageHeader title="الملف الشخصي" description="بيانات المتعامل الاقتصادي ومعلومات الاتصال والملف الإداري." />
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>بطاقة الشركة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary text-white">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{operator.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{operator.specialization}</p>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {operator.address}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {operator.phone}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {operator.email}
            </p>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">اكتمال الوثائق</span>
                <span>{operator.validDocumentsPercent}%</span>
              </div>
              <Progress value={operator.validDocumentsPercent} indicatorClassName="bg-teal-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>تحديث البيانات</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input defaultValue={operator.name} />
            <Input defaultValue={operator.registrationNumber} />
            <Input defaultValue={operator.taxNumber} />
            <Input defaultValue={operator.sector} />
            <Input defaultValue={operator.region} />
            <Input defaultValue={operator.phone} />
            <Input defaultValue={operator.email} />
            <Input defaultValue={formatMoney(operator.capital)} />
            <div className="md:col-span-2 flex justify-end">
              <Button>
                <FileCheck2 className="h-4 w-4" />
                حفظ التغييرات
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
