import { Badge } from "@/components/ui/badge";
import {
  documentStatusLabels,
  getApplicationStatusLabel,
  getDealStatusLabel,
  getRiskSeverityLabel,
  getStatusColor,
} from "@/lib/utils";
import type { ApplicationStatus, DealStatus, OperatorDocumentStatus, RiskSeverity } from "@/types/domain";

interface StatusBadgeProps {
  status: DealStatus | ApplicationStatus | OperatorDocumentStatus | RiskSeverity | string;
  type?: "deal" | "application" | "document" | "risk" | "raw";
}

export function StatusBadge({ status, type = "raw" }: StatusBadgeProps) {
  let label = status;

  if (type === "deal") label = getDealStatusLabel(status as DealStatus);
  if (type === "application") label = getApplicationStatusLabel(status as ApplicationStatus);
  if (type === "document") label = documentStatusLabels[status as OperatorDocumentStatus] ?? status;
  if (type === "risk") label = getRiskSeverityLabel(status as RiskSeverity);

  return <Badge tone={getStatusColor(status) as "neutral" | "info" | "success" | "warning" | "danger"}>{label}</Badge>;
}
