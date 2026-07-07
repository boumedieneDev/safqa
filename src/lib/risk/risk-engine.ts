import type { Application, Avenant, Deal, ExecutionTracking, Operator, RiskAlert, RiskSeverity } from "@/types/domain";
import { clamp } from "@/lib/utils";

export interface RiskBreakdown {
  weakCompetition: number;
  abnormalLowOffer: number;
  operatorHistory: number;
  avenants: number;
  delays: number;
}

export interface RiskResult {
  score: number;
  severity: RiskSeverity;
  breakdown: RiskBreakdown;
  alerts: RiskAlert[];
}

export function getRiskSeverityFromScore(score: number): RiskSeverity {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function calculateRiskScore(
  deal: Deal,
  applications: Application[],
  operators: Operator[],
  avenants: Avenant[] = [],
  executionItems: ExecutionTracking[] = [],
): RiskResult {
  const weakCompetition = applications.length < deal.minimumRequiredOffers ? 100 : 0;
  const proposedAmounts = applications.map((application) => application.proposedAmount).filter((amount): amount is number => !!amount);
  const averageAmount = proposedAmounts.length
    ? proposedAmounts.reduce((sum, amount) => sum + amount, 0) / proposedAmounts.length
    : deal.estimatedValue;
  const hasAbnormallyLowOffer = applications.some(
    (application) => application.proposedAmount && application.proposedAmount < averageAmount * deal.abnormalLowOfferRatio,
  );
  const repeatedOperatorRisk = Math.max(
    0,
    ...operators
      .filter((operator) => applications.some((application) => application.operatorId === operator.id))
      .map((operator) => (operator.winRate > 40 || operator.riskScore > 55 ? operator.riskScore : 0)),
  );
  const totalAvenantIncrease = avenants.reduce((sum, avenant) => sum + avenant.increasePercentage, 0);
  const avenantsRisk = avenants.length > 3 || totalAvenantIncrease > 20 ? clamp(totalAvenantIncrease * 3, 60, 100) : 0;
  const maxDelayDays = Math.max(0, ...executionItems.map((item) => item.delayDays));
  const delayRisk = maxDelayDays > 30 ? clamp(maxDelayDays * 2, 55, 100) : 0;

  const breakdown: RiskBreakdown = {
    weakCompetition,
    abnormalLowOffer: hasAbnormallyLowOffer ? 100 : 0,
    operatorHistory: repeatedOperatorRisk,
    avenants: avenantsRisk,
    delays: delayRisk,
  };

  const score = Math.round(
    breakdown.weakCompetition * 0.25 +
      breakdown.abnormalLowOffer * 0.25 +
      breakdown.operatorHistory * 0.2 +
      breakdown.avenants * 0.15 +
      breakdown.delays * 0.15,
  );

  const alerts = buildRiskAlerts(deal, applications, breakdown, averageAmount, totalAvenantIncrease, maxDelayDays);

  return {
    score,
    severity: getRiskSeverityFromScore(score),
    breakdown,
    alerts,
  };
}

function buildRiskAlerts(
  deal: Deal,
  applications: Application[],
  breakdown: RiskBreakdown,
  averageAmount: number,
  totalAvenantIncrease: number,
  maxDelayDays: number,
): RiskAlert[] {
  const alerts: RiskAlert[] = [];

  if (breakdown.weakCompetition > 0) {
    alerts.push({
      id: `${deal.id}-weak-competition`,
      dealId: deal.id,
      riskType: "ضعف المنافسة",
      severity: "high",
      score: breakdown.weakCompetition,
      reason: "عدد العروض المستلمة أقل من الحد الأدنى المطلوب.",
      evidence: {
        applications_count: applications.length,
        minimum_required_offers: deal.minimumRequiredOffers,
      },
      recommendation: "مراجعة نطاق النشر أو تمديد آجال الاستقبال قبل الاستمرار.",
      status: "open",
      generatedBy: "rules",
      createdAt: new Date().toISOString(),
    });
  }

  const lowOffer = applications.find(
    (application) => application.proposedAmount && application.proposedAmount < averageAmount * deal.abnormalLowOfferRatio,
  );

  if (lowOffer) {
    alerts.push({
      id: `${deal.id}-low-offer`,
      dealId: deal.id,
      applicationId: lowOffer.id,
      operatorId: lowOffer.operatorId,
      riskType: "عرض منخفض بشكل غير طبيعي",
      severity: "medium",
      score: 55,
      reason: "قيمة العرض أقل من متوسط العروض وفق الحد المضبوط.",
      evidence: {
        proposed_amount: lowOffer.proposedAmount ?? 0,
        average_amount: Math.round(averageAmount),
        ratio: deal.abnormalLowOfferRatio,
      },
      recommendation: "طلب تبريرات مالية وتقنية قبل اعتماد العرض.",
      status: "reviewing",
      generatedBy: "rules",
      createdAt: new Date().toISOString(),
    });
  }

  if (breakdown.avenants > 0) {
    alerts.push({
      id: `${deal.id}-avenants`,
      dealId: deal.id,
      riskType: "كثرة الملاحق",
      severity: getRiskSeverityFromScore(breakdown.avenants),
      score: breakdown.avenants,
      reason: "عدد أو نسبة الملاحق قد تؤثر على شفافية التنفيذ.",
      evidence: {
        total_increase_percentage: Math.round(totalAvenantIncrease),
      },
      recommendation: "ربط كل ملحق بمبرر موثق ومصادقة داخلية واضحة.",
      status: "open",
      generatedBy: "rules",
      createdAt: new Date().toISOString(),
    });
  }

  if (breakdown.delays > 0) {
    alerts.push({
      id: `${deal.id}-delays`,
      dealId: deal.id,
      riskType: "تأخرات غير مبررة",
      severity: getRiskSeverityFromScore(breakdown.delays),
      score: breakdown.delays,
      reason: "تأخر التنفيذ يتجاوز الحد المقبول دون مبررات كافية.",
      evidence: {
        delay_days: maxDelayDays,
      },
      recommendation: "إلزام المتعامل بمخطط استدراك وربطه بمحاضر متابعة.",
      status: "open",
      generatedBy: "rules",
      createdAt: new Date().toISOString(),
    });
  }

  return alerts;
}
