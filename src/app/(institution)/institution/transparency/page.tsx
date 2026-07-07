import { GaugeChart, QualityRadar } from "@/components/charts/dashboard-charts";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { deals, getTransparencyByDealId, transparencyScores } from "@/lib/demo-data";
import { getTransparencyLabel, transparencyBreakdown } from "@/lib/transparency/transparency-engine";

export default function TransparencyPage() {
  const average = Math.round(transparencyScores.reduce((sum, score) => sum + score.totalScore, 0) / transparencyScores.length);
  const first = transparencyScores[0];

  return (
    <div>
      <PageHeader title="مؤشر الشفافية" description="احتساب الشفافية حسب الوثائق، الآجال، المنافسة، التقييم، التبريرات، وإتاحة المعلومات." />
      <section className="grid gap-6 lg:grid-cols-[0.7fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>متوسط الشفافية</CardTitle>
          </CardHeader>
          <CardContent>
            <GaugeChart value={average} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>أبعاد نموذجية</CardTitle>
          </CardHeader>
          <CardContent>
            <QualityRadar data={transparencyBreakdown(first)} />
          </CardContent>
        </Card>
      </section>
      <section className="mt-6 grid gap-4">
        {deals.map((deal) => {
          const score = getTransparencyByDealId(deal.id);
          return (
            <Card key={deal.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-bold">{deal.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{deal.reference}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-teal-700">{score?.totalScore ?? 0}%</span>
                  <StatusBadge status={getTransparencyLabel(score?.totalScore ?? 0)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
