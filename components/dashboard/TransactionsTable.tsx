"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ColumnDef, FilterFn, Table as TanstackTable } from "@tanstack/react-table";
import { ChevronDown, Copy, Eye, ListFilter, MoreHorizontal } from "lucide-react";
import DataTable, { SortHeader, toolbarButtonClass } from "@/components/dashboard/DataTable";
import Badge from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={toolbarButtonClass}>
          <ListFilter size={15} />
          {current === "ALL" ? "Semua status" : current}
          <ChevronDown size={14} className="text-foreground/40" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Filter status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(value) => column?.setFilterValue(value === "ALL" ? undefined : value)}
        >
          <DropdownMenuRadioItem value="ALL">Semua status</DropdownMenuRadioItem>
          {statuses.map((label) => (
            <DropdownMenuRadioItem key={label} value={label}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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
          className="relative z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground"
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
          <span className="whitespace-nowrap text-foreground/60">
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
                className="font-semibold text-foreground after:absolute after:inset-0 hover:underline"
              >
                {tx.productName}
              </Link>
              <div className="mt-0.5 text-[12px] text-foreground/50">
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
        cell: ({ getValue }) => <span className="whitespace-nowrap text-foreground/70">{getValue<string>()}</span>,
      },
      {
        id: "quantity",
        accessorFn: (tx) => tx.quantity,
        header: () => <div className="text-right">Jumlah</div>,
        cell: ({ row }) => <div className="text-right text-foreground/70">{row.original.quantity}x</div>,
      },
      {
        id: "total",
        accessorFn: (tx) => tx.total_amount,
        header: ({ column }) => <SortHeader column={column} label="Total" align="right" />,
        cell: ({ row }) => (
          <div className="whitespace-nowrap text-right font-bold text-foreground">{formatPrice(row.original.total_amount)}</div>
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
    />
  );
}
