"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  Table as TanstackTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Columns3, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const toolbarButtonClass =
  "inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-foreground/20 bg-surface px-3.5 text-[13px] font-semibold text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground";

interface SortHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  label: string;
  align?: "left" | "right";
}

// Column header that toggles sorting; shows the current direction.
export function SortHeader<TData, TValue>({ column, label, align = "left" }: SortHeaderProps<TData, TValue>) {
  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <div className={align === "right" ? "flex justify-end" : ""}>
      <button
        type="button"
        onClick={() => column.toggleSorting(sorted === "asc")}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] font-semibold transition-colors hover:bg-foreground/5 hover:text-foreground ${
          align === "right" ? "-mr-2" : "-ml-2"
        } ${sorted ? "text-foreground" : "text-foreground/50"}`}
      >
        {label}
        <Icon size={13} className={sorted ? "text-primary" : "text-foreground/30"} />
      </button>
    </div>
  );
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  /** Shows a search box that filters through globalFilterFn. */
  searchPlaceholder?: string;
  globalFilterFn?: FilterFn<TData>;
  /** Extra toolbar controls (e.g. a status filter), rendered next to the search box. */
  toolbar?: (table: TanstackTable<TData>) => ReactNode;
  /** Lets the user show/hide columns. Column headers use columnLabels, falling back to the column id. */
  columnToggle?: boolean;
  columnLabels?: Record<string, string>;
  initialSorting?: SortingState;
  pageSize?: number;
  /** Singular/plural noun used in the row counter, e.g. "transaksi". */
  rowNoun?: string;
  emptyMessage?: string;
  /** Applied to every body row; use "relative" with a stretched link to make rows clickable. */
  rowClassName?: string;
}

export default function DataTable<TData>({
  columns,
  data,
  searchPlaceholder,
  globalFilterFn,
  toolbar,
  columnToggle = true,
  columnLabels = {},
  initialSorting = [],
  pageSize = 10,
  rowNoun = "data",
  emptyMessage = "Tidak ada data.",
  rowClassName = "",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const hideableColumns = table.getAllColumns().filter((column) => column.getCanHide());
  const showToolbar = searchPlaceholder || toolbar || (columnToggle && hideableColumns.length > 0);
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <div className="w-full">
      {showToolbar && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {searchPlaceholder && (
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="search"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-10 w-full rounded-xl border border-foreground/20 bg-surface pl-10 pr-3 text-[13px] font-medium text-foreground transition-colors placeholder:text-foreground/30 focus:border-foreground/40 focus:outline-none"
              />
            </div>
          )}
          {toolbar?.(table)}
          {columnToggle && hideableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className={`${toolbarButtonClass} sm:ml-auto`}>
                  <Columns3 size={15} />
                  Kolom
                  <ChevronDown size={14} className="text-foreground/40" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tampilkan kolom</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hideableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {columnLabels[column.id] ?? column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-foreground/20 bg-surface">
        <Table className="min-w-[720px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} className={rowClassName}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-32 text-center font-medium text-foreground/40">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 px-4 py-3">
          <div className="text-[12px] font-medium text-foreground/50">
            {filteredCount} {rowNoun}
            {filteredCount !== data.length && ` (dari ${data.length})`}
          </div>
          {pageCount > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-foreground/50">
                Halaman {pageIndex + 1} dari {pageCount}
              </span>
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Halaman sebelumnya"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-foreground/20 text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Halaman berikutnya"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-foreground/20 text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
