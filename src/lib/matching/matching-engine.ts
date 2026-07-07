import type { Deal, Operator, OperatorMatch } from "@/types/domain";
import { clamp } from "@/lib/utils";

export function rankOperatorsForDeal(deal: Deal, operators: Operator[]): OperatorMatch[] {
  return operators
    .map((operator) => {
      const reasons: string[] = [];
      let score = 0;

      if (operator.sector === deal.sector) {
        score += 28;
        reasons.push("تطابق مباشر في مجال الصفقة");
      }

      if (operator.region === deal.region || deal.region === "وطني") {
        score += 16;
        reasons.push("تغطية جغرافية مناسبة");
      }

      score += operator.performanceScore * 0.25;
      score += (100 - operator.riskScore) * 0.15;
      score += clamp(operator.previousParticipations * 2, 0, 12);
      score += operator.validDocumentsPercent * 0.09;

      if (operator.previousWins > 4) {
        reasons.push("سجل مشاركات وفوز سابق");
      }

      if (operator.validDocumentsPercent >= 90) {
        reasons.push("وثائق دائمة شبه مكتملة");
      }

      const finalScore = Math.round(clamp(score));

      return {
        operator,
        score: finalScore,
        reasons,
        decision: finalScore >= 75 ? "recommended" : finalScore >= 55 ? "review" : "avoid",
      } satisfies OperatorMatch;
    })
    .sort((a, b) => b.score - a.score);
}
