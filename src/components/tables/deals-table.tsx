"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronLeft } from "lucide-react";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getOrganizationById, getTransparencyByDealId, riskAlerts } from "@/lib/demo-data";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Deal } from "@/types/domain";

const columns: ColumnDef<Deal>[] = [
  {
    accessorKey: "reference",
    header: "رقم الصفقة",
    cell: ({ row }) => <span className="font-semibold">{row.original.reference}</span>,
  },
  {
    accessorKey: "title",
    header: "عنوان الصفقة",
    cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.title}</span>,
  },
  {
    header: "الجهة",
    cell: ({ row }) => getOrganizationById(row.original.organizationId)?.name ?? "غير محدد",
  },
  {
    accessorKey: "type",
    header: "النوع",
  },
  {
    accessorKey: "sector",
    header: "المجال",
  },
  {
    header: "القيمة التقديرية",
    cell: ({ row }) => formatMoney(row.original.estimatedValue),
  },
  {
    header: "الحالة",
    cell: ({ row }) => <StatusBadge type="deal" status={row.original.status} />,
  },
  {
    header: "الشفافية",
    cell: ({ row }) => `${getTransparencyByDealId(row.original.id)?.totalScore ?? 0}%`,
  },
  {
    header: "الخطر",
    cell: ({ row }) => {
      const highAlert = riskAlerts.find((alert) => alert.dealId === row.original.id);
      return highAlert ? <StatusBadge type="risk" status={highAlert.severity} /> : <StatusBadge status="low" type="risk" />;
    },
  },
  {
    header: "آخر تحديث",
    cell: ({ row }) => formatDate(row.original.updatedAt),
  },
  {
    header: "إجراءات",
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/institution/deals/${row.original.id}`}>
          عرض
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
    ),
  },
];

export function DealsTable({ deals }: { deals: Deal[] }) {
  return <DataTable columns={columns} data={deals} />;
}
