import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  ApplicationStatus,
  DealStatus,
  OperatorDocumentStatus,
  RiskSeverity,
  StageStatus,
} from "@/types/domain";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(value: number, currency = "DZD") {
  return new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value?: string) {
  if (!value) {
    return "غير محدد";
  }

  return new Intl.DateTimeFormat("ar-DZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export const dealStatusLabels: Record<DealStatus, string> = {
  draft: "مسودة",
  published: "منشورة",
  receiving_offers: "استقبال العروض",
  opening: "فتح الأظرفة",
  technical_evaluation: "تقييم تقني",
  financial_evaluation: "تقييم مالي",
  temporary_award: "منح مؤقت",
  appeals: "طعون",
  final_award: "منح نهائي",
  execution: "تنفيذ",
  delayed: "متأخرة",
  completed: "مكتملة",
  closed: "مغلقة",
  cancelled: "ملغاة",
};

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  draft: "مسودة",
  submitted: "تم الإرسال",
  under_opening: "قيد الفتح",
  under_evaluation: "قيد التقييم",
  missing_documents: "ملف ناقص",
  needs_clarification: "طلب توضيح",
  technically_qualified: "مؤهل تقنياً",
  technically_rejected: "غير مؤهل تقنياً",
  financially_qualified: "مؤهل مالياً",
  financially_rejected: "غير مؤهل مالياً",
  winner: "فائز",
  not_winner: "غير فائز",
  withdrawn: "مسحوب",
  rejected: "مرفوض",
};

export const riskSeverityLabels: Record<RiskSeverity, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع",
  critical: "حرج",
};

export const documentStatusLabels: Record<OperatorDocumentStatus, string> = {
  valid: "صالحة",
  expiring: "قاربت على الانتهاء",
  expired: "منتهية",
  needs_update: "تحتاج تحديث",
  under_review: "قيد المراجعة",
  rejected: "مرفوضة",
};

export const stageStatusLabels: Record<StageStatus, string> = {
  not_started: "لم تبدأ",
  in_progress: "جارية",
  completed: "مكتملة",
  delayed: "متأخرة",
};

export function getDealStatusLabel(status: DealStatus) {
  return dealStatusLabels[status];
}

export function getApplicationStatusLabel(status: ApplicationStatus) {
  return applicationStatusLabels[status];
}

export function getRiskSeverityLabel(severity: RiskSeverity) {
  return riskSeverityLabels[severity];
}

export function getDocumentStatusLabel(status: OperatorDocumentStatus) {
  return documentStatusLabels[status];
}

export function getStatusColor(status: string) {
  const green = ["completed", "winner", "valid", "technically_qualified", "financially_qualified", "low"];
  const orange = ["medium", "expiring", "needs_clarification", "missing_documents", "delayed", "under_evaluation"];
  const red = ["high", "critical", "expired", "rejected", "technically_rejected", "financially_rejected", "cancelled"];
  const blue = ["published", "receiving_offers", "submitted", "in_progress", "execution"];

  if (green.includes(status)) return "success";
  if (orange.includes(status)) return "warning";
  if (red.includes(status)) return "danger";
  if (blue.includes(status)) return "info";
  return "neutral";
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}
