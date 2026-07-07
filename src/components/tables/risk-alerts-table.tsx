"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDealById, getOperatorById } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import type { RiskAlert } from "@/types/domain";

const columns: ColumnDef<RiskAlert>[] = [
  {
    accessorKey: "riskType",
    header: "نوع الخطر",
    cell: ({ row }) => <span className="font-semibold">{row.original.riskType}</span>,
  },
  {
    header: "الصفقة",
    cell: ({ row }) => (row.original.dealId ? getDealById(row.original.dealId)?.reference : "-"),
  },
  {
    header: "المتعامل",
    cell: ({ row }) => (row.original.operatorId ? getOperatorById(row.original.operatorId)?.name : "-"),
  },
  {
    header: "الدرجة",
    cell: ({ row }) => row.original.score,
  },
  {
    header: "الشدة",
    cell: ({ row }) => <StatusBadge type="risk" status={row.original.severity} />,
  },
  {
    accessorKey: "reason",
    header: "السبب",
  },
  {
    accessorKey: "recommendation",
    header: "التوصية",
  },
  {
    header: "التاريخ",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];

export function RiskAlertsTable({ alerts }: { alerts: RiskAlert[] }) {
  return <DataTable columns={columns} data={alerts} />;
}
