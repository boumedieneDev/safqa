import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep?: number;
}

export function Stepper({ steps, currentStep = 0 }: StepperProps) {
  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {steps.map((step, index) => {
        const isDone = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <li
            key={step.title}
            className={cn(
              "rounded-lg border bg-white p-4",
              isCurrent ? "border-primary shadow-card" : "border-border",
            )}
          >
            <div className="flex items-center gap-2">
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <Circle className={cn("h-5 w-5", isCurrent ? "text-primary" : "text-muted-foreground")} />
              )}
              <span className="text-xs font-semibold text-muted-foreground">الخطوة {index + 1}</span>
            </div>
            <h3 className="mt-3 text-sm font-bold">{step.title}</h3>
            {step.description ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.description}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}
