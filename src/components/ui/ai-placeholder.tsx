import { Bot, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AiPlaceholderProps {
  title: string;
  description?: string;
}

export function AiPlaceholder({ title, description }: AiPlaceholderProps) {
  return (
    <div className="rounded-lg border border-dashed border-teal-200 bg-teal-50/60 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-teal-700">
          <Bot className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-teal-900">{title}</h3>
            <Badge tone="teal">
              <Lock className="ml-1 h-3.5 w-3.5" />
              غير مفعّل حالياً
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-teal-900/80">
            {description ?? "هذه الخاصية غير مفعّلة حالياً. سيتم تفعيل التحليل الذكي لاحقاً."}
          </p>
        </div>
      </div>
    </div>
  );
}
