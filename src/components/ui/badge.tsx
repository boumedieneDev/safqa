import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", {
  variants: {
    tone: {
      neutral: "border-slate-200 bg-slate-50 text-slate-700",
      info: "border-blue-200 bg-blue-50 text-blue-700",
      success: "border-emerald-200 bg-emerald-50 text-emerald-700",
      warning: "border-orange-200 bg-orange-50 text-orange-700",
      danger: "border-red-200 bg-red-50 text-red-700",
      teal: "border-teal-200 bg-teal-50 text-teal-700",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
