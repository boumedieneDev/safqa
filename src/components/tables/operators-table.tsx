"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronLeft } from "lucide-react";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Operator } from "@/types/domain";

const columns: ColumnDef<Operator>[] = [
  {
    accessorKey: "name",
    header: "المتعامل",
    cell: ({ row }) => <span className="font-semibold">{row.original.name}</span>,
  },
  {
    accessorKey: "registrationNumber",
    header: "السجل التجاري",
  },
  {
    accessorKey: "sector",
    header: "المجال",
  },
  {
    accessorKey: "region",
    header: "المنطقة",
  },
  {
    header: "الأداء",
    cell: ({ row }) => (
      <div className="w-28">
        <Progress value={row.original.performanceScore} indicatorClassName="bg-teal-600" />
      </div>
    ),
  },
  {
    header: "الخطر",
    cell: ({ row }) => <StatusBadge type="risk" status={row.original.riskScore >= 55 ? "high" : "low"} />,
  },
  {
    accessorKey: "winRate",
    header: "نسبة الفوز",
    cell: ({ row }) => `${row.original.winRate}%`,
  },
  {
    header: "إجراءات",
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/institution/operators/${row.original.id}`}>
          عرض
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
    ),
  },
];

export function OperatorsTable({ operators }: { operators: Operator[] }) {
  return <DataTable columns={columns} data={operators} />;
}
