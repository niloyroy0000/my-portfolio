import { useState, useCallback, useEffect, useMemo } from 'react';

export type ProficiencyLevel = "Expert" | "Advanced" | "Intermediate" | "Familiar";

interface SkillNode {
  name: string;
  metadata?: {
    icon: string;
    level?: ProficiencyLevel;
    yearsOfExperience?: number;
    lastUsed?: string;
  };
  children?: SkillNode[];
}

/**
 * Custom hook for managing skills filtering state and logic
 * Handles search query, proficiency level filters, and debouncing
 */
export function useSkillsFilter(isSearchEnabled: boolean = true) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<Set<ProficiencyLevel>>(new Set());

  // Debounce search query - only if search is enabled
  useEffect(() => {
    if (!isSearchEnabled) return;

    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isSearchEnabled]);

  // Toggle a proficiency level filter
  const toggleLevel = useCallback((level: ProficiencyLevel) => {
    setSelectedLevels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(level)) {
        newSet.delete(level);
      } else {
        newSet.add(level);
      }
      return newSet;
    });
  }, []);

  // Clear all level filters
  const clearLevelFilters = useCallback(() => {
    setSelectedLevels(new Set());
  }, []);

  // Clear all filters (search + levels)
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedLevels(new Set());
  }, []);

  // Filter tree data based on search query and proficiency levels
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterTreeData = useCallback((data: any[], searchTerm: string, levels: Set<string>): any[] => {
    const hasSearchFilter = searchTerm.trim().length > 0;
    const hasLevelFilter = levels.size > 0;

    // If no filters, return original data
    if (!hasSearchFilter && !hasLevelFilter) return data;

    const searchLower = searchTerm.toLowerCase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterNode = (node: any): any | null => {
      const nameMatches = !hasSearchFilter || node.name.toLowerCase().includes(searchLower);
      const levelMatches = !hasLevelFilter || (node.metadata?.level && levels.has(node.metadata.level));

      if (node.children && node.children.length > 0) {
        const filteredChildren = node.children
          .map(filterNode)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((child: any) => child !== null);

        // For parent nodes: show if name matches search (when searching) OR if has matching children
        if ((hasSearchFilter && nameMatches) || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
      } else {
        // For leaf nodes: must match both search (if active) AND level (if active)
        if (nameMatches && levelMatches) {
          return node;
        }
      }

      return null;
    };

    return data.map(filterNode).filter(node => node !== null);
  }, []);

  // Apply filters to skills data
  const applyFilters = useCallback((skillsData: SkillNode) => {
    const searchTerm = isSearchEnabled ? debouncedSearch : "";
    const filtered = filterTreeData([skillsData], searchTerm, selectedLevels);
    return filtered.length > 0 ? filtered[0] : { name: "Skills", children: [] };
  }, [isSearchEnabled, debouncedSearch, selectedLevels, filterTreeData]);

  return {
    // State
    searchQuery,
    debouncedSearch,
    selectedLevels,

    // Actions
    setSearchQuery,
    toggleLevel,
    clearLevelFilters,
    clearAllFilters,

    // Computed
    applyFilters,
    hasActiveFilters: debouncedSearch.length > 0 || selectedLevels.size > 0,
  };
}
