import type { LucideIcon } from "lucide-react";
import { FileSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function EmptyState({ title, description, icon: Icon = FileSearch }: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white p-8 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p> : null}
    </div>
  );
}
