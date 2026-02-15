import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from "@/lib/icons";

interface SkillsNoResultsProps {
  hasSearch: boolean;
  hasLevelFilter: boolean;
  onClearAllFilters: () => void;
}

/**
 * No results state for Skills page
 * Shows when search/filters return empty results
 */
export const SkillsNoResults = React.memo<SkillsNoResultsProps>(({
  hasSearch,
  hasLevelFilter,
  onClearAllFilters
}) => {
  const getMessage = () => {
    if (hasSearch && hasLevelFilter) {
      return "Try adjusting your search or level filters.";
    }
    if (hasSearch) {
      return "Try searching for different keywords.";
    }
    return "Try selecting different proficiency levels.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 mb-8"
    >
      <div className="bg-white/5 border border-white/10 rounded-lg p-8 max-w-md mx-auto">
        <FaSearch className="text-4xl text-white/40 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Technologies Found</h3>
        <p className="text-white/60 mb-4">{getMessage()}</p>
        <button
          onClick={onClearAllFilters}
          className="bg-secondary-default hover:bg-secondary-default/80 text-primary px-4 py-2 rounded transition-all duration-300"
        >
          Clear All Filters
        </button>
      </div>
    </motion.div>
  );
});

SkillsNoResults.displayName = 'SkillsNoResults';
