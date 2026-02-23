import { Search, SlidersHorizontal } from "lucide-react";
import { categories, locations } from "@/data/jobs";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedCategory: string;
  onCategoryChange: (v: string) => void;
  selectedLocation: string;
  onLocationChange: (v: string) => void;
  urgentOnly: boolean;
  onUrgentChange: (v: boolean) => void;
}

const SearchFilter = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  urgentOnly,
  onUrgentChange,
}: SearchFilterProps) => {
  return (
    <section className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container py-4">
        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari pekerjaan, misal: bersih-bersih, pindahan..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />

          {/* Category chips */}
          <div className="flex gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mx-1 h-6 w-px shrink-0 bg-border" />

          {/* Location select */}
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Urgent toggle */}
          <button
            onClick={() => onUrgentChange(!urgentOnly)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              urgentOnly
                ? "bg-urgent text-urgent-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            🔥 Butuh Cepat
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchFilter;
