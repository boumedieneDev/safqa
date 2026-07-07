import { CheckCircle2, Clock3 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import type { DealStage } from "@/types/domain";

interface TimelineProps {
  stages: DealStage[];
}

export function Timeline({ stages }: TimelineProps) {
  return (
    <ol className="space-y-3">
      {stages.map((stage) => (
        <li key={stage.id} className="flex gap-3 rounded-lg border border-border bg-white p-4">
          <div className="mt-1">
            {stage.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <Clock3 className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold">{stage.name}</h3>
              <StatusBadge status={stage.status} />
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              المسؤول: {stage.responsibleName}، آخر أجل: {formatDate(stage.dueAt)}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{stage.notes}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
