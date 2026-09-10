"use client";

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
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-10">
      <div className="relative flex-1">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cari produk..."
          className="w-full glass rounded-[2px] px-4 py-3 text-[14px] text-foreground placeholder-white/30 border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors duration-150 bg-transparent"
        />
      </div>

      <select
        value={category}
        onChange={(e) => onCategory(e.target.value)}
        className="glass rounded-[2px] px-4 py-3 text-[14px] text-foreground border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors duration-150 bg-background cursor-pointer"
      >
        <option value="">Semua Kategori</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
