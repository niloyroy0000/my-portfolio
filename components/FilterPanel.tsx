"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { FaFilter, FaTimes } from "@/lib/icons";
import { PERFORMANCE_VARIANTS } from "@/constants";

export interface FilterOption {
  label: string;
  value: string;
  selected: string;
  options: string[];
  onChange: (value: string) => void;
}

interface FilterPanelProps {
  filters: FilterOption[];
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
  className?: string;
  resultsInfo?: {
    filtered: number;
    total: number;
    description?: string;
  };
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  showFilters,
  onToggleFilters,
  hasActiveFilters,
  onClearAllFilters,
  className = "",
  resultsInfo,
}) => {
  const filterId = useId();
  const filterPanelId = `${filterId}-panel`;

  // Check if filters are enabled via environment variable
  const isFilterEnabled = process.env.NEXT_PUBLIC_ENABLE_FILTER !== 'false';

  // Don't render if filters are disabled
  if (!isFilterEnabled) {
    return null;
  }

  return (
    <motion.div
      variants={PERFORMANCE_VARIANTS.containerSync}
      initial="hidden"
      animate="visible"
      className={`mb-6 ${className}`}
    >
      {/* Filter Toggle Button */}
      <motion.div
        variants={PERFORMANCE_VARIANTS.cardSync}
        className="flex items-center justify-between mb-4"
      >
        <button
          onClick={onToggleFilters}
          aria-expanded={showFilters}
          aria-controls={filterPanelId}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f] ${
            showFilters || hasActiveFilters
              ? 'bg-secondary-default/20 border-secondary-default/50 text-secondary-default'
              : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30'
          }`}
        >
          <FaFilter aria-hidden="true" />
          <span className="font-medium">
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </span>
          {hasActiveFilters && (
            <span className="bg-secondary-default/30 text-secondary-default text-xs px-2 py-0.5 rounded-full" aria-label="Filters are active">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearAllFilters}
            aria-label="Clear all filters"
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 rounded transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <FaTimes aria-hidden="true" />
            <span>Clear All</span>
          </button>
        )}
      </motion.div>

      {/* Filter Options - Conditionally Shown */}
      {showFilters && (
        <motion.div
          id={filterPanelId}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-[#27272c] to-[#2a2a30] border border-secondary-default/20 rounded-lg"
          role="group"
          aria-label="Filter options"
        >
          {filters.map((filter, index) => {
            const selectId = `${filterId}-${filter.label.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <div key={`${filter.label}-${index}`}>
                <label
                  htmlFor={selectId}
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  {filter.label}
                </label>
                <select
                  id={selectId}
                  value={filter.selected}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full bg-gradient-to-r from-[#1a1a1e] to-[#1d1d22] border border-secondary-default/20 hover:border-secondary-default/40 text-white px-3 py-2 rounded focus:border-secondary-default focus:ring-2 focus:ring-secondary-default/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all duration-300 cursor-pointer"
                  aria-label={`Filter by ${filter.label}`}
                >
                  {filter.options
                    .filter(option => option && option.trim() !== "") // Filter out empty/null values
                    .map(option => (
                      <option
                        key={option}
                        value={option}
                        className="bg-secondary-default/20 border border-secondary-default/30 text-primary py-2"
                      >
                        {option}
                      </option>
                    ))
                  }
                </select>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Results Info */}
      {hasActiveFilters && resultsInfo && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-secondary-default/10 border border-secondary-default/30 rounded-lg"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-secondary-default">
            Showing <span className="font-bold">{resultsInfo.filtered}</span> of{" "}
            <span className="font-bold">{resultsInfo.total}</span>{" "}
            {resultsInfo.description || "results"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilterPanel; 