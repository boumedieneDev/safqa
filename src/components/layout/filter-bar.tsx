import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: { label: string; options: string[] }[];
}

export function FilterBar({ searchPlaceholder = "بحث...", filters = [] }: FilterBarProps) {
  return (
    <div className="mb-4 grid gap-3 rounded-lg border border-border bg-white p-4 shadow-card md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div className="flex items-center gap-2 rounded-md border border-input bg-white px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input className="border-0 px-0 focus:ring-0" placeholder={searchPlaceholder} />
      </div>
      {filters.slice(0, 3).map((filter) => (
        <Select key={filter.label} defaultValue="">
          <option value="">{filter.label}</option>
          {filter.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ))}
    </div>
  );
}
