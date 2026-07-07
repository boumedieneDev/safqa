import { UploadCloud } from "lucide-react";

interface UploadBoxProps {
  title: string;
  description?: string;
}

export function UploadBox({ title, description }: UploadBoxProps) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-slate-50 px-5 py-6 text-center">
      <div>
        <UploadCloud className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-3 text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description ?? "اسحب الملف هنا أو اختر ملف PDF من جهازك."}
        </p>
      </div>
    </div>
  );
}
