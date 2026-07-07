import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { AiPlaceholder } from "@/components/ui/ai-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { deals, operators } from "@/lib/demo-data";
import { rankOperatorsForDeal } from "@/lib/matching/matching-engine";

export default function SmartMatchingPage() {
  const deal = deals[0];
  const matches = rankOperatorsForDeal(deal, operators);

  return (
    <div>
      <PageHeader title="المطابقة الذكية" description="مطابقة أولية Rule-Based بين الصفقات والمتعاملين، مع إبقاء الذكاء الاصطناعي كخاصية مستقبلية." />
      <AiPlaceholder title="Smart Matching AI" description="هذه الخاصية غير مفعّلة حالياً. سيتم تفعيل التوصيات الذكية لاحقاً." />
      <section className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader>
            <CardTitle>مدخلات المطابقة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select defaultValue={deal.sector}>
              <option>{deal.sector}</option>
              <option>التجهيزات الطبية</option>
              <option>الخدمات والصيانة</option>
            </Select>
            <Input defaultValue={deal.estimatedValue} />
            <Input defaultValue={deal.region} />
            <Input placeholder="الخبرة المطلوبة" defaultValue="منشآت صحية وتجهيزات تقنية" />
            <Input placeholder="مدة الإنجاز" defaultValue="330 يوم" />
            <Button className="w-full">
              <Sparkles className="h-4 w-4" />
              حساب الملاءمة
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.operator.id}>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{match.operator.name}</p>
                    <p className="text-sm text-muted-foreground">{match.operator.specialization}</p>
                  </div>
                  <StatusBadge status={match.decision === "recommended" ? "موصى به" : match.decision === "review" ? "مراجعة" : "تجنب"} />
                </div>
                <Progress value={match.score} indicatorClassName="bg-teal-600" />
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {match.reasons.map((reason) => (
                    <span key={reason} className="rounded-full bg-slate-50 px-2 py-1">
                      {reason}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
