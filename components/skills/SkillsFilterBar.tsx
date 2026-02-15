import React from 'react';
import UnifiedToolbar from '@/components/UnifiedToolbar';
import { ProficiencyLevel } from '@/hooks/useSkillsFilter';

interface SkillsFilterBarProps {
  isSearchEnabled: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLevels: Set<ProficiencyLevel>;
  onToggleLevel: (level: ProficiencyLevel) => void;
  onClearFilters: () => void;
  levelCounts: {
    expert: number;
    advanced: number;
    intermediate: number;
    familiar: number;
  };
}

/**
 * Search and proficiency level filter bar for Skills page
 * Matches main branch styling and behavior
 */
export const SkillsFilterBar = React.memo<SkillsFilterBarProps>(({
  isSearchEnabled,
  searchQuery,
  onSearchChange,
  selectedLevels,
  onToggleLevel,
  onClearFilters,
  levelCounts
}) => {
  return (
    <UnifiedToolbar
      showSearch={isSearchEnabled}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search technologies, frameworks, tools..."
    >
      {/* Proficiency Level Filters - Right side of search */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Expert Filter */}
        <button
          onClick={() => onToggleLevel("Expert")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 border ${
            selectedLevels.has("Expert")
              ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-fuchsia-500/60 text-fuchsia-300"
              : "bg-white/5 border-white/10 text-white/50 hover:bg-fuchsia-500/10 hover:border-fuchsia-500/30 hover:text-fuchsia-400"
          }`}
        >
          <span>🟣</span>
          <span className="hidden sm:inline">Expert</span>
          <span className="text-[10px] opacity-70">({levelCounts.expert})</span>
        </button>

        {/* Advanced Filter */}
        <button
          onClick={() => onToggleLevel("Advanced")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 border ${
            selectedLevels.has("Advanced")
              ? "bg-emerald-500/30 border-emerald-500/60 text-emerald-300"
              : "bg-white/5 border-white/10 text-white/50 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
          }`}
        >
          <span>🟢</span>
          <span className="hidden sm:inline">Advanced</span>
          <span className="text-[10px] opacity-70">({levelCounts.advanced})</span>
        </button>

        {/* Intermediate Filter */}
        <button
          onClick={() => onToggleLevel("Intermediate")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 border ${
            selectedLevels.has("Intermediate")
              ? "bg-blue-500/30 border-blue-500/60 text-blue-300"
              : "bg-white/5 border-white/10 text-white/50 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400"
          }`}
        >
          <span>🔵</span>
          <span className="hidden sm:inline">Interm.</span>
          <span className="text-[10px] opacity-70">({levelCounts.intermediate})</span>
        </button>

        {/* Familiar Filter */}
        <button
          onClick={() => onToggleLevel("Familiar")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 border ${
            selectedLevels.has("Familiar")
              ? "bg-slate-500/30 border-slate-500/60 text-slate-300"
              : "bg-white/5 border-white/10 text-white/50 hover:bg-slate-500/10 hover:border-slate-500/30 hover:text-slate-400"
          }`}
        >
          <span>⚪</span>
          <span className="hidden sm:inline">Familiar</span>
          <span className="text-[10px] opacity-70">({levelCounts.familiar})</span>
        </button>

        {/* Clear Filters */}
        {selectedLevels.size > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-0.5 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
          >
            <span>✕</span>
          </button>
        )}
      </div>
    </UnifiedToolbar>
  );
});

SkillsFilterBar.displayName = 'SkillsFilterBar';
