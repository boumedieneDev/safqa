import type { Application, Deal, DealDocument, DealStage, TransparencyScore } from "@/types/domain";
import { clamp } from "@/lib/utils";

export function calculateTransparencyScore(
  deal: Deal,
  documents: DealDocument[],
  stages: DealStage[],
  applications: Application[],
): TransparencyScore {
  const publicDocumentRatio = documents.length
    ? documents.filter((document) => document.visibility === "public").length / documents.length
    : 0;
  const documentsScore = clamp(55 + publicDocumentRatio * 45);
  const delayedStages = stages.filter((stage) => stage.status === "delayed").length;
  const deadlinesScore = clamp(100 - delayedStages * 20);
  const competitionScore = clamp((applications.length / deal.minimumRequiredOffers) * 100);
  const evaluationScore = deal.status === "draft" || deal.status === "published" ? 60 : 78;
  const justificationScore = delayedStages > 0 ? 52 : 76;
  const publicationScore = deal.isPublic ? 90 : 35;

  const totalScore = Math.round(
    documentsScore * 0.2 +
      deadlinesScore * 0.2 +
      competitionScore * 0.2 +
      evaluationScore * 0.15 +
      justificationScore * 0.15 +
      publicationScore * 0.1,
  );

  return {
    dealId: deal.id,
    documentsScore: Math.round(documentsScore),
    deadlinesScore: Math.round(deadlinesScore),
    competitionScore: Math.round(competitionScore),
    evaluationScore,
    justificationScore,
    publicationScore,
    totalScore,
    calculatedAt: new Date().toISOString(),
  };
}

export function getTransparencyLabel(score: number) {
  if (score >= 75) return "مرتفع";
  if (score >= 50) return "متوسط";
  return "منخفض";
}

export function getTransparencyTone(score: number) {
  if (score >= 75) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

export function transparencyBreakdown(score: TransparencyScore) {
  return [
    { name: "اكتمال الوثائق", value: score.documentsScore },
    { name: "احترام الآجال", value: score.deadlinesScore },
    { name: "المنافسة", value: score.competitionScore },
    { name: "شفافية التقييم", value: score.evaluationScore },
    { name: "التبريرات", value: score.justificationScore },
    { name: "إتاحة المعلومات", value: score.publicationScore },
  ];
}
