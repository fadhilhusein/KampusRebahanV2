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
import { buttonClass } from "@/components/ui/ButtonPrimary";

export const toolbarButtonClass = `kr-press ${buttonClass("secondary", "sm")}`;

// Stagger masuk baris (kr-fade-up), dibatasi agar halaman panjang tidak menunggu lama.
const rowDelay = (i: number) => ({ animationDelay: `${Math.min(i, 8) * 40}ms` });

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
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold transition-colors hover:text-ink ${
          align === "right" ? "-mr-2" : "-ml-2"
        } ${sorted ? "text-ink" : "text-muted"}`}
      >
        {label}
        <Icon size={13} className={sorted ? "text-accent" : "text-line"} />
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
  /** Renders each row as a list item below 768px; the desktop table is hidden there. */
  mobileRow?: (row: TData) => ReactNode;
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
  mobileRow,
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
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
          {searchPlaceholder && (
            <label className="kr-search">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">{searchPlaceholder}</span>
              <input
                type="search"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
              />
            </label>
          )}
          {toolbar?.(table)}
          {columnToggle && hideableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className={`${toolbarButtonClass} max-md:hidden md:ml-auto`}>
                  <Columns3 size={15} />
                  Kolom
                  <ChevronDown size={14} aria-hidden="true" />
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

      <div>
        <div className={mobileRow ? "hidden md:block" : ""}>
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
              rows.map((row, i) => (
                <TableRow key={row.id} className={`kr-fade-up ${rowClassName}`} style={rowDelay(i)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-32 text-center font-medium text-muted">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>

        {mobileRow && (
          <ul className="flex flex-col gap-3 md:hidden">
            {rows.length ? (
              rows.map((row, i) => (
                <li key={row.id} className="kr-fade-up" style={rowDelay(i)}>
                  {mobileRow(row.original)}
                </li>
              ))
            ) : (
              <li className="kr-fade-in rounded-[22px] bg-surface p-6 text-center text-sm font-medium text-muted shadow-card">{emptyMessage}</li>
            )}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="text-xs font-medium text-muted">
            {filteredCount} {rowNoun}
            {filteredCount !== data.length && ` (dari ${data.length})`}
          </div>
          {pageCount > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted">
                Halaman {pageIndex + 1} dari {pageCount}
              </span>
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Halaman sebelumnya"
                className="kr-press flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-pill text-ink hover:bg-pill-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Halaman berikutnya"
                className="kr-press flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-pill text-ink hover:bg-pill-hover disabled:cursor-not-allowed disabled:opacity-50"
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
