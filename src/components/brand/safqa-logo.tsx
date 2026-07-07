import Image from "next/image";
import { cn } from "@/lib/utils";

interface SafqaLogoProps {
  className?: string;
  markOnly?: boolean;
  inverted?: boolean;
}

export function SafqaLogo({ className, markOnly = false, inverted = false }: SafqaLogoProps) {
  if (markOnly) {
    return (
      <span className={cn("inline-flex items-center justify-center overflow-hidden rounded-lg bg-white", className)}>
        <Image
          src="/brand/safqa-mark.png"
          alt="Safqa"
          width={390}
          height={390}
          priority
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center overflow-hidden rounded-md",
        inverted ? "bg-white/95 px-2 py-1 shadow-sm" : "bg-transparent",
        className,
      )}
    >
      <Image
        src="/brand/safqa-logo-full.png"
        alt="Safqa - صفقة"
        width={1050}
        height={520}
        priority
        className="h-14 w-auto object-contain"
      />
    </span>
  );
}
