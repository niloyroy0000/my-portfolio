"use client";
import React, { useState, useEffect, useCallback, useId, useMemo } from "react";
import { motion } from "framer-motion";
import { FiFilter, FiChevronDown, FiX } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchInput from "@/components/ui/SearchInput";
import type { Project } from "@/types/api";

interface ProjectsFilterProps {
  projects: Project[];
  onFilterChange: (filtered: Project[]) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  resultsInfo?: {
    filtered: number;
    total: number;
    description?: string;
  };
}

const ProjectsFilter: React.FC<ProjectsFilterProps> = ({
  projects,
  onFilterChange,
  searchQuery,
  onSearchChange,
  placeholder = "Search projects by name, technology, description..."}) => {
  // Environment flags
  const isSearchEnabled = process.env.NEXT_PUBLIC_ENABLE_SEARCH !== 'false';
  const isFilterEnabled = process.env.NEXT_PUBLIC_ENABLE_FILTER !== 'false';
  
  // Filter states
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Extract unique values for filter options (memoized for performance)
  const categories = useMemo(() =>
    Array.from(new Set(projects.map(p => p.category))).sort(),
    [projects]
  );

  const companies = useMemo(() =>
    Array.from(new Set(
      projects.map(p => p.associatedWithCompany).filter(company => company && company.trim() !== "")
    )).sort(),
    [projects]
  );

  const technologies = useMemo(() =>
    Array.from(new Set(
      projects.flatMap(p => p.stacks).filter(tech => tech && tech.trim() !== "")
    )).sort(),
    [projects]
  );

  const statuses = ["Active", "Inactive"];
  
  // Debounce search query
  useEffect(() => {
    if (!isSearchEnabled) return;
    
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isSearchEnabled]);
  
  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...projects];
    
    // Apply search filter if search is enabled
    if (isSearchEnabled && debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.associatedWithCompany.toLowerCase().includes(query) ||
        project.stacks.some(tech => 
          tech.toLowerCase().includes(query)
        )
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    // Apply company filter
    if (selectedCompany) {
      filtered = filtered.filter(project => project.associatedWithCompany === selectedCompany);
    }
    
    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(project => {
        const isActive = project.isActive;
        return selectedStatus === "Active" ? isActive : !isActive;
      });
    }
    
    // Apply technology filter
    if (selectedTech) {
      filtered = filtered.filter(project => 
        project.stacks.includes(selectedTech)
      );
    }
    
    // Pass filtered results to parent
    onFilterChange(filtered);
  }, [projects, isSearchEnabled, debouncedSearch, selectedCategory, selectedCompany, selectedStatus, selectedTech, onFilterChange]);

  // Apply filters when search or filter values change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if any filter is active
  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedCompany || selectedStatus || selectedTech);
  
  // Reset all filters
  const resetFilters = () => {
    if (isSearchEnabled) {
      onSearchChange("");
    }
    
    setSelectedCategory(null);
    setSelectedCompany(null);
    setSelectedStatus(null);
    setSelectedTech(null);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    
    // Reset specific filters when using the search box
    if (e.target.value) {
      setSelectedCategory(null);
      setSelectedCompany(null);
      setSelectedStatus(null);
      setSelectedTech(null);
    }
  };
  
  const searchInputId = useId();
  const filterPanelId = useId();

  // Don't render if neither search nor filter is enabled
  if (!isSearchEnabled && !isFilterEnabled) {
    return null;
  }

  return (
    <div
      className="flex-1"
      data-test-selector="projectFilter"
      role="search"
      aria-label="Project filters"
    >
      {/* Inline Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        {/* Compact Search Input - Using reusable SearchInput component */}
        {isSearchEnabled && (
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={placeholder}
            aria-label="Search projects"
            testSelector="projectFilter-search"
          />
        )}
        
        {/* Compact Filter Toggle Button - Enhanced */}
        {isFilterEnabled && (
          <Button
            variant="outline"
            onClick={toggleFilterPanel}
            aria-expanded={isExpanded}
            aria-controls={filterPanelId}
            aria-label="Filter projects by category, company, status, and technology"
            className={`shrink-0 flex items-center gap-2 text-xs h-9 px-4 rounded-lg font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isExpanded
                ? 'bg-gradient-to-r from-secondary-default/20 to-blue-500/20 border-secondary-default/60 text-secondary-default shadow-md shadow-secondary-default/20'
                : 'bg-gradient-to-br from-[#27272c] to-[#2a2a30] border-white/20 text-white/70 hover:text-white hover:border-secondary-default/50 hover:shadow-md'
            }`}
            data-test-selector="projectFilter-toggleButton"
          >
            <FiFilter className={`text-sm transition-all duration-300 ${isExpanded ? 'text-secondary-default' : 'text-white/60'}`} aria-hidden="true" />
            <span>Filters</span>
            <FiChevronDown className={`text-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
          </Button>
        )}
        
        {/* Compact Reset Button - Enhanced */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Button
              variant="ghost"
              onClick={resetFilters}
              aria-label="Reset all filters"
              className="shrink-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 text-red-300 hover:text-red-200 hover:bg-red-500/20 hover:border-red-500/50 text-xs h-9 px-4 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-red-500/20 focus-visible:ring-2 focus-visible:ring-red-400"
              data-test-selector="projectFilter-resetButton"
            >
              Reset
            </Button>
          </motion.div>
        )}
      </div>

      {/* Expanded Filter Panel - Positioned Absolutely */}
      {isFilterEnabled && isExpanded && (
        <motion.div
          id={filterPanelId}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute left-0 right-0 top-full mt-2 bg-gradient-to-br from-[#27272c] via-[#2a2a30] to-[#27272c] backdrop-blur-xl border border-secondary-default/40 rounded-xl shadow-2xl shadow-secondary-default/20 z-[120] p-5"
          data-test-selector="projectFilter-panel"
          role="group"
          aria-label="Filter options"
        >
          {/* Two Column Layout: Left (Categories/Companies/Status) | Right (Technologies) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Categories, Companies, Status */}
              <div className="space-y-5">
                {/* Categories Filter */}
                <div>
                  <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-blue-400 rounded-full"></span>
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedCategory === category 
                            ? 'bg-gradient-to-r from-secondary-default to-blue-500 text-white border-secondary-default/50 shadow-lg shadow-secondary-default/30 scale-105' 
                            : 'bg-white/5 text-white/70 border-white/20 hover:text-white hover:bg-white/10 hover:border-secondary-default/50 hover:scale-105 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Companies Filter */}
                <div>
                  <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                    Companies
                  </h4>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar pr-2">
                    {companies.map(company => (
                      <Badge
                        key={company}
                        variant={selectedCompany === company ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedCompany === company 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400/50 shadow-lg shadow-purple-500/30 scale-105' 
                            : 'bg-white/5 text-white/70 border-white/20 hover:text-white hover:bg-white/10 hover:border-purple-400/50 hover:scale-105 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedCompany(selectedCompany === company ? null : company)}
                      >
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-orange-400 to-amber-400 rounded-full"></span>
                    Status
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                      <Badge
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedStatus === status 
                            ? status === "Active"
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/30 scale-105'
                              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400/50 shadow-lg shadow-orange-500/30 scale-105'
                            : 'bg-white/5 text-white/70 border-white/20 hover:text-white hover:bg-white/10 hover:border-orange-400/50 hover:scale-105 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Technologies Only */}
              <div>
                <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></span>
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                  {technologies.map(tech => (
                    <Badge
                      key={tech}
                      variant={selectedTech === tech ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedTech === tech 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/50 shadow-lg shadow-blue-500/30 scale-105' 
                          : 'bg-white/5 text-white/70 border-white/20 hover:text-white hover:bg-white/10 hover:border-blue-400/50 hover:scale-105 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters - Inside Dropdown */}
            {hasActiveFilters && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 pt-4 border-t border-gradient-to-r from-secondary-default/20 via-secondary-default/40 to-secondary-default/20 flex flex-wrap gap-2 items-center"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 to-white/50 text-xs font-semibold">Active filters:</span>
                {selectedCategory && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge 
                      className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-200 border border-emerald-400/40 flex items-center gap-1.5 hover:from-emerald-500/30 hover:to-blue-500/30 transition-all duration-300 shadow-sm"
                    >
                      <span className="text-xs">Category:</span> <span className="font-semibold">{selectedCategory}</span>
                      <FiX 
                        className="cursor-pointer hover:text-red-400 transition-colors ml-1" 
                        onClick={() => setSelectedCategory(null)}
                        size={14}
                      />
                    </Badge>
                  </motion.div>
                )}
                {selectedCompany && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge 
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-400/40 flex items-center gap-1.5 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 shadow-sm"
                    >
                      <span className="text-xs">Company:</span> <span className="font-semibold">{selectedCompany}</span>
                      <FiX 
                        className="cursor-pointer hover:text-red-400 transition-colors ml-1" 
                        onClick={() => setSelectedCompany(null)}
                        size={14}
                      />
                    </Badge>
                  </motion.div>
                )}
                {selectedStatus && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge 
                      className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-200 border border-orange-400/40 flex items-center gap-1.5 hover:from-orange-500/30 hover:to-amber-500/30 transition-all duration-300 shadow-sm"
                    >
                      <span className="text-xs">Status:</span> <span className="font-semibold">{selectedStatus}</span>
                      <FiX 
                        className="cursor-pointer hover:text-red-400 transition-colors ml-1" 
                        onClick={() => setSelectedStatus(null)}
                        size={14}
                      />
                    </Badge>
                  </motion.div>
                )}
                {selectedTech && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge 
                      className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border border-blue-400/40 flex items-center gap-1.5 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 shadow-sm"
                    >
                      <span className="text-xs">Technology:</span> <span className="font-semibold">{selectedTech}</span>
                      <FiX 
                        className="cursor-pointer hover:text-red-400 transition-colors ml-1" 
                        onClick={() => setSelectedTech(null)}
                        size={14}
                      />
                    </Badge>
                  </motion.div>
                )}
                {searchQuery && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge 
                      className="bg-gradient-to-r from-secondary-default/20 to-blue-500/20 text-secondary-default border border-secondary-default/40 flex items-center gap-1.5 hover:from-secondary-default/30 hover:to-blue-500/30 transition-all duration-300 shadow-sm"
                    >
                      <span className="text-xs">Search:</span> <span className="font-semibold">{searchQuery}</span>
                      <FiX 
                        className="cursor-pointer hover:text-red-400 transition-colors ml-1" 
                        onClick={() => onSearchChange("")}
                        size={14}
                      />
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            )}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsFilter;
 