"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ColumnDef, FilterFn, Table as TanstackTable } from "@tanstack/react-table";
import { Copy, Eye, MoreHorizontal } from "lucide-react";
import DataTable, { SortHeader } from "@/components/dashboard/DataTable";
import Badge from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/ToastContext";
import { statusColor, statusLabel } from "@/lib/orderStatus";
import type { Transaction } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const paymentLabels: Record<string, string> = {
  QRIS_GATEWAY: "QRIS",
  QRIS: "QRIS",
  BANK_TRANSFER: "Transfer Bank",
  BALANCE: "Saldo",
  REFERRAL_BALANCE: "Saldo Referensi",
  COUPON: "Kupon",
};

const searchFilter: FilterFn<Transaction> = (row, _columnId, value: string) => {
  const q = value.trim().toLowerCase();
  if (!q) return true;
  const tx = row.original;
  return [tx.productName, tx.variantName, tx.order_id].some((field) => field?.toLowerCase().includes(q));
};

const columnLabels: Record<string, string> = {
  date: "Tanggal",
  product: "Produk",
  status: "Status",
  method: "Metode",
  quantity: "Jumlah",
  total: "Total",
};

function StatusFilter({ table }: { table: TanstackTable<Transaction> }) {
  const column = table.getColumn("status");
  const current = (column?.getFilterValue() as string | undefined) ?? "ALL";
  // The column value is the display label, so statuses sharing a label (e.g. PROCESSING and
  // AWAITING_RETRY are both "Diproses") collapse into one option. Only labels present in the data are offered.
  const statuses = Array.from(new Set(table.getCoreRowModel().rows.map((row) => row.getValue<string>("status"))));

  return (
    <div role="group" aria-label="Filter status" className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
      {["ALL", ...statuses].map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={current === value}
          onClick={() => column?.setFilterValue(value === "ALL" ? undefined : value)}
          className="kr-chip kr-press"
        >
          {value === "ALL" ? "Semua" : value}
        </button>
      ))}
    </div>
  );
}

function RowActions({ tx }: { tx: Transaction }) {
  const { addToast } = useToast();

  async function copyOrderId() {
    try {
      await navigator.clipboard.writeText(tx.order_id);
      addToast("Order ID disalin.", "success");
    } catch {
      addToast("Gagal menyalin Order ID.", "error");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* z-10 keeps the trigger above the row's stretched link */}
        <button
          type="button"
          aria-label={`Aksi untuk ${tx.productName}`}
          className="kr-press relative z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-pill hover:text-ink"
        >
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/transactions/${tx.order_id}`}>
            <Eye size={14} />
            Lihat detail
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={copyOrderId}>
          <Copy size={14} />
          Salin Order ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: "date",
        accessorFn: (tx) => (tx.created_at ? new Date(tx.created_at).getTime() : 0),
        header: ({ column }) => <SortHeader column={column} label="Tanggal" />,
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {row.original.created_at ? formatDate(row.original.created_at) : "—"}
          </span>
        ),
      },
      {
        id: "product",
        accessorFn: (tx) => tx.productName,
        header: ({ column }) => <SortHeader column={column} label="Produk" />,
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="min-w-[180px]">
              {/* after:inset-0 stretches this link over the whole (relative) row */}
              <Link
                href={`/dashboard/transactions/${tx.order_id}`}
                className="font-semibold text-ink after:absolute after:inset-0 hover:underline"
              >
                {tx.productName}
              </Link>
              <div className="mt-0.5 text-xs font-normal text-muted">
                {tx.variantName} · {tx.duration} · {tx.type}
              </div>
            </div>
          );
        },
      },
      {
        id: "status",
        accessorFn: (tx) => statusLabel[tx.db_status] ?? tx.db_status,
        header: ({ column }) => <SortHeader column={column} label="Status" />,
        filterFn: "equalsString",
        cell: ({ row }) => (
          <Badge color={statusColor[row.original.db_status] ?? "default"}>
            {statusLabel[row.original.db_status] ?? row.original.db_status}
          </Badge>
        ),
      },
      {
        id: "method",
        accessorFn: (tx) => paymentLabels[tx.paymentMethod] ?? tx.paymentMethod,
        header: "Metode",
        cell: ({ getValue }) => <span className="whitespace-nowrap">{getValue<string>()}</span>,
      },
      {
        id: "quantity",
        accessorFn: (tx) => tx.quantity,
        header: () => <div className="text-right">Jumlah</div>,
        cell: ({ row }) => <div className="text-right">{row.original.quantity}x</div>,
      },
      {
        id: "total",
        accessorFn: (tx) => tx.total_amount,
        header: ({ column }) => <SortHeader column={column} label="Total" align="right" />,
        cell: ({ row }) => (
          <div className="whitespace-nowrap text-right font-bold text-ink">{formatPrice(row.original.total_amount)}</div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <RowActions tx={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={transactions}
      searchPlaceholder="Cari produk atau Order ID..."
      globalFilterFn={searchFilter}
      toolbar={(table) => <StatusFilter table={table} />}
      columnLabels={columnLabels}
      initialSorting={[{ id: "date", desc: true }]}
      rowNoun="transaksi"
      emptyMessage="Tidak ada transaksi yang cocok."
      rowClassName="relative"
      mobileRow={(tx) => (
        <div className="kr-press relative flex items-center justify-between gap-3 rounded-[22px] bg-surface p-4 shadow-card">
          <div className="min-w-0">
            <Link
              href={`/dashboard/transactions/${tx.order_id}`}
              className="block truncate text-sm font-semibold text-ink after:absolute after:inset-0 after:rounded-[22px]"
            >
              {tx.productName}
            </Link>
            <div className="mt-0.5 truncate text-xs text-muted">
              {tx.created_at ? formatDate(tx.created_at) : "—"} · {formatPrice(tx.total_amount)}
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap"><Badge color={statusColor[tx.db_status] ?? "default"}>{statusLabel[tx.db_status] ?? tx.db_status}</Badge></span>
        </div>
      )}
    />
  );
}
