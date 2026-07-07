import { Building2, UserRound, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { roleDefinitions } from "@/lib/auth/roles";

const accountFlows = [
  {
    title: "المؤسسة العمومية",
    icon: Building2,
    description: "تمثل الجهة المالكة للصفقات. كل صفقاتها ووثائقها وسجلاتها ترتبط بـ organization_id.",
    examples: ["وزارة", "مديرية", "مؤسسة عمومية", "هيئة رقابية"],
  },
  {
    title: "الأفراد داخل المؤسسة",
    icon: UserRound,
    description: "كل موظف هو auth user + profile. الدور يحدد الصلاحيات، والانتماء يحدد نطاق البيانات.",
    examples: ["مدير مؤسسة", "مسؤول صفقات", "لجنة تقييم", "مدقق", "صاحب قرار"],
  },
  {
    title: "المتعامل الاقتصادي",
    icon: UsersRound,
    description: "كيان مستقل يمكن أن يكون شركة، فرداً، أو تجمعاً. مستخدموه يرتبطون بـ operator_id فقط.",
    examples: ["شركة", "مقاول فرد", "تجمع مؤقت"],
  },
];

export function AccountModelPanel() {
  const roles = Object.values(roleDefinitions);

  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 xl:grid-cols-3">
        {accountFlows.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5 text-primary" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.examples.map((example) => (
                    <Badge key={example} tone="teal">
                      {example}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الأدوار والصلاحيات</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <div key={role.role} className="rounded-lg border border-border bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold">{role.label}</p>
                <Badge tone={role.accountKind === "operator" ? "success" : "info"}>{role.accountKind}</Badge>
              </div>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{role.description}</p>
              <p className="mt-3 text-xs font-semibold text-primary">{role.homePath}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
