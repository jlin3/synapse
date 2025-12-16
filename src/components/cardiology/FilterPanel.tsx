"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export type SortOption = "hot" | "new" | "top_all" | "top_week" | "top_month";

interface FilterState {
  sortBy: SortOption;
  minCitations: number | null;
  dateRange: string | null;
  studyType: string | null;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "hot", label: "Hot" },
  { value: "new", label: "New" },
  { value: "top_all", label: "Top (All Time)" },
  { value: "top_week", label: "Top (This Week)" },
  { value: "top_month", label: "Top (This Month)" },
];

const studyTypes = [
  "All Types",
  "RCT",
  "Meta-Analysis",
  "Systematic Review",
  "Cohort Study",
  "Case Report",
];

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const currentSortLabel = sortOptions.find((o) => o.value === filters.sortBy)?.label || "Hot";

  const handleSortChange = (sortBy: SortOption) => {
    onFilterChange({ ...filters, sortBy });
    setShowDropdown(false);
  };

  const hasActiveFilters =
    filters.minCitations !== null || filters.dateRange !== null || filters.studyType !== null;

  return (
    <div className="flex items-center gap-2">
      {/* Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--chip-surface)] border border-[color:var(--chip-border)] rounded-lg text-sm text-[color:var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
        >
          {currentSortLabel}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 bg-[var(--surface-2)] border border-[color:var(--chip-border)] rounded-xl shadow-xl overflow-hidden z-20"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      filters.sortBy === option.value
                        ? "bg-purple-500/20 text-purple-400"
                        : "text-[color:var(--foreground)] hover:bg-[var(--surface-2-hover)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Button */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
          hasActiveFilters
            ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
            : "bg-[var(--chip-surface)] border-[color:var(--chip-border)] text-[color:var(--foreground)] hover:bg-[var(--surface-2)]"
        }`}
      >
        <Filter className="w-4 h-4" />
        Filters
        {hasActiveFilters && <span className="w-2 h-2 bg-purple-500 rounded-full" />}
      </button>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-2)] border border-[color:var(--panel-border)] rounded-xl p-4 z-20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[color:var(--foreground)]">Advanced Filters</h3>
              <button
                onClick={() => setShowAdvanced(false)}
                className="p-1 text-[color:var(--foreground-subtle)] hover:text-[color:var(--foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Min Citations */}
              <div>
                <label className="block text-xs text-[color:var(--foreground-subtle)] mb-2">Min Citations</label>
                <input
                  type="number"
                  value={filters.minCitations || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      minCitations: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 bg-[var(--input-surface)] border border-[color:var(--chip-border)] rounded-lg text-[color:var(--foreground)] text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-xs text-[color:var(--foreground-subtle)] mb-2">From Date</label>
                <input
                  type="date"
                  value={filters.dateRange || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      dateRange: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 bg-[var(--input-surface)] border border-[color:var(--chip-border)] rounded-lg text-[color:var(--foreground)] text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Study Type */}
              <div>
                <label className="block text-xs text-[color:var(--foreground-subtle)] mb-2">Study Type</label>
                <select
                  value={filters.studyType || "All Types"}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      studyType: e.target.value === "All Types" ? null : e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[var(--input-surface)] border border-[color:var(--chip-border)] rounded-lg text-[color:var(--foreground)] text-sm focus:outline-none focus:border-purple-500/50"
                >
                  {studyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    minCitations: null,
                    dateRange: null,
                    studyType: null,
                  })
                }
                className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
