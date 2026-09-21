"use client";

import { ListFilter, Search } from "lucide-react";
import AnimatedDropdown from "@/components/ui/animated-dropdown";

interface SearchFilterProps {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  categories: string[];
}

export default function SearchFilter({
  search,
  onSearch,
  category,
  onCategory,
  categories,
}: SearchFilterProps) {
  const options = [
    { value: "", label: "Semua Kategori" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-10">
      <div className="relative flex-1">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cari produk..."
          aria-label="Cari produk"
          className="w-full rounded-xl border border-foreground/20 bg-surface py-3 pl-11 pr-4 text-[14px] font-medium text-foreground placeholder:text-foreground/30 transition-colors duration-150 hover:border-foreground/40 focus:border-foreground/40 focus:outline-none"
        />
      </div>

      <AnimatedDropdown
        ariaLabel="Filter kategori"
        icon={<ListFilter size={16} className="text-foreground/40" />}
        options={options}
        value={category}
        onChange={onCategory}
        align="right"
        className="w-full sm:w-auto sm:min-w-[220px]"
      />
    </div>
  );
}
