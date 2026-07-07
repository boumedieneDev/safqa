"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronLeft } from "lucide-react";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDealById, getOperatorById } from "@/lib/demo-data";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Application } from "@/types/domain";

const columns: ColumnDef<Application>[] = [
  {
    header: "المتعامل",
    cell: ({ row }) => <span className="font-semibold">{getOperatorById(row.original.operatorId)?.name ?? "غير محدد"}</span>,
  },
  {
    header: "الصفقة",
    cell: ({ row }) => getDealById(row.original.dealId)?.reference ?? "غير محدد",
  },
  {
    header: "السعر المقترح",
    cell: ({ row }) => (row.original.proposedAmount ? formatMoney(row.original.proposedAmount) : "غير محدد"),
  },
  {
    accessorKey: "proposedDurationDays",
    header: "المدة",
    cell: ({ row }) => (row.original.proposedDurationDays ? `${row.original.proposedDurationDays} يوم` : "غير محدد"),
  },
  {
    accessorKey: "technicalScore",
    header: "تقني",
    cell: ({ row }) => row.original.technicalScore ?? "-",
  },
  {
    accessorKey: "financialScore",
    header: "مالي",
    cell: ({ row }) => row.original.financialScore ?? "-",
  },
  {
    accessorKey: "totalScore",
    header: "المجموع",
    cell: ({ row }) => row.original.totalScore ?? "-",
  },
  {
    header: "حالة الملف",
    cell: ({ row }) => <StatusBadge type="application" status={row.original.status} />,
  },
  {
    header: "تاريخ التقديم",
    cell: ({ row }) => formatDate(row.original.submittedAt),
  },
  {
    header: "إجراءات",
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/operator/my-applications/${row.original.id}`}>
          التفاصيل
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
    ),
  },
];

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  return <DataTable columns={columns} data={applications} />;
}
