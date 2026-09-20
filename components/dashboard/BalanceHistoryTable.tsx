"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpCircle, Settings2, ShoppingBag, Undo2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import DataTable, { SortHeader } from "@/components/dashboard/DataTable";

export interface BalanceTransaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  note: string | null;
  createdAt: string;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const typeInfo: Record<string, { label: string; icon: LucideIcon }> = {
  TOPUP: { label: "Top Up", icon: ArrowUpCircle },
  PURCHASE: { label: "Pembelian", icon: ShoppingBag },
  REFUND: { label: "Refund", icon: Undo2 },
  ADJUSTMENT: { label: "Penyesuaian", icon: Settings2 },
};

export default function BalanceHistoryTable({ transactions }: { transactions: BalanceTransaction[] }) {
  const columns = useMemo<ColumnDef<BalanceTransaction>[]>(
    () => [
      {
        id: "date",
        accessorFn: (txn) => new Date(txn.createdAt).getTime(),
        header: ({ column }) => <SortHeader column={column} label="Tanggal" />,
        cell: ({ row }) => <span className="whitespace-nowrap text-foreground/60">{formatDate(row.original.createdAt)}</span>,
      },
      {
        id: "type",
        accessorFn: (txn) => typeInfo[txn.type]?.label ?? txn.type,
        header: ({ column }) => <SortHeader column={column} label="Jenis" />,
        cell: ({ row }) => {
          const txn = row.original;
          const info = typeInfo[txn.type];
          const Icon = info?.icon ?? Settings2;
          const isCredit = txn.amount >= 0;
          return (
            <span className="inline-flex items-center gap-2.5 font-semibold text-foreground">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isCredit ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"
                }`}
              >
                <Icon size={15} />
              </span>
              {info?.label ?? txn.type}
            </span>
          );
        },
      },
      {
        id: "note",
        accessorFn: (txn) => txn.note ?? "",
        header: "Keterangan",
        cell: ({ row }) => (
          <span className="block max-w-[280px] truncate text-foreground/60">{row.original.note || "—"}</span>
        ),
      },
      {
        id: "amount",
        accessorFn: (txn) => txn.amount,
        header: ({ column }) => <SortHeader column={column} label="Jumlah" align="right" />,
        cell: ({ row }) => {
          const { amount } = row.original;
          return (
            <div className={`whitespace-nowrap text-right font-bold ${amount >= 0 ? "text-secondary" : "text-primary"}`}>
              {amount >= 0 ? "+" : ""}
              {formatPrice(amount)}
            </div>
          );
        },
      },
      {
        id: "balanceAfter",
        accessorFn: (txn) => txn.balanceAfter,
        header: () => <div className="text-right">Saldo Akhir</div>,
        cell: ({ row }) => (
          <div className="whitespace-nowrap text-right font-medium text-foreground/70">{formatPrice(row.original.balanceAfter)}</div>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={transactions}
      columnLabels={{ date: "Tanggal", type: "Jenis", note: "Keterangan", amount: "Jumlah", balanceAfter: "Saldo Akhir" }}
      initialSorting={[{ id: "date", desc: true }]}
      rowNoun="mutasi"
      emptyMessage="Belum ada mutasi saldo."
    />
  );
}
