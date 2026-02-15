"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiFilter, FiChevronDown, FiSearch, FiX } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/api";

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
  placeholder = "Search projects by name, technology, description...",
  resultsInfo
}) => {
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
  
  // Extract unique values for filter options
  const categories = Array.from(new Set(projects.map(p => p.category))).sort();
  const companies = Array.from(new Set(projects.map(p => p.associatedWithCompany).filter(company => company && company.trim() !== ""))).sort();
  const technologies = Array.from(new Set(projects.flatMap(p => p.stacks).filter(tech => tech && tech.trim() !== ""))).sort();
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
  
  // Don't render if neither search nor filter is enabled
  if (!isSearchEnabled && !isFilterEnabled) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-900/70 to-gray-950/70 backdrop-blur-sm border border-secondary-default/20 rounded-xl overflow-hidden mb-8 shadow-lg shadow-secondary-default/10"
      data-test-selector="projectFilter"
    >
      {/* Search and Filter Bar */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Input */}
        {isSearchEnabled && (
          <div className="relative flex-1 w-full" data-test-selector="projectFilter-search">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-default">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-800/50 border border-secondary-default/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-secondary-default/50 focus:border-secondary-default/50"
              data-test-selector="projectFilter-searchInput"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-secondary-default"
                data-test-selector="projectFilter-clearSearch"
              >
                <FiX />
              </button>
            )}
          </div>
        )}
        
        {/* Filter Toggle Button */}
        {isFilterEnabled && (
          <Button
            variant="outline"
            onClick={toggleFilterPanel}
            className={`shrink-0 flex items-center gap-2 ${isExpanded ? 'bg-secondary-default/10 border-secondary-default/50 text-secondary-default' : 'hover:text-secondary-default'}`}
            data-test-selector="projectFilter-toggleButton"
          >
            <FiFilter className={isExpanded ? 'text-secondary-default' : 'text-white/70'} />
            <span>Filters</span>
            <FiChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        )}
        
        {/* Reset Button (only shown when filters are active) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="shrink-0 text-white/70 hover:text-secondary-default"
            data-test-selector="projectFilter-resetButton"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Results info */}
      {resultsInfo && (
        <div className="px-4 pb-2">
          <p className="text-sm text-secondary-default">
            Showing <span className="font-bold">{resultsInfo.filtered}</span> of{" "}
            <span className="font-bold">{resultsInfo.total}</span>{" "}
            {resultsInfo.description || "results"}
          </p>
        </div>
      )}
      
      {/* Expanded Filter Panel */}
      {isFilterEnabled && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-4 border-t border-secondary-default/20"
          data-test-selector="projectFilter-panel"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {/* Categories Filter */}
            <div>
              <h4 className="text-secondary-default text-sm font-semibold mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer ${selectedCategory === category ? 'bg-secondary-default text-primary shadow-md' : 'text-white/70 hover:text-white hover:border-secondary-default/50'}`}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Companies Filter */}
            <div>
              <h4 className="text-secondary-default text-sm font-semibold mb-2">Companies</h4>
              <div className="flex flex-wrap gap-2">
                {companies.map(company => (
                  <Badge
                    key={company}
                    variant={selectedCompany === company ? "default" : "outline"}
                    className={`cursor-pointer ${selectedCompany === company ? 'bg-secondary-default text-primary shadow-md' : 'text-white/70 hover:text-white hover:border-secondary-default/50'}`}
                    onClick={() => setSelectedCompany(selectedCompany === company ? null : company)}
                  >
                    {company}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <h4 className="text-secondary-default text-sm font-semibold mb-2">Status</h4>
              <div className="flex flex-wrap gap-2">
                {statuses.map(status => (
                  <Badge
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    className={`cursor-pointer ${selectedStatus === status ? 'bg-secondary-default text-primary shadow-md' : 'text-white/70 hover:text-white hover:border-secondary-default/50'}`}
                    onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Technologies Filter */}
            <div>
              <h4 className="text-secondary-default text-sm font-semibold mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                {technologies.map(tech => (
                  <Badge
                    key={tech}
                    variant={selectedTech === tech ? "default" : "outline"}
                    className={`cursor-pointer ${selectedTech === tech ? 'bg-secondary-default text-primary shadow-md' : 'text-white/70 hover:text-white hover:border-secondary-default/50'}`}
                    onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="px-4 pb-4 flex flex-wrap gap-2 items-center">
          <span className="text-white/50 text-xs">Active filters:</span>
          {selectedCategory && (
            <Badge 
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Category: {selectedCategory}
              <FiX 
                className="cursor-pointer hover:text-secondary-default" 
                onClick={() => setSelectedCategory(null)}
                size={12}
              />
            </Badge>
          )}
          {selectedCompany && (
            <Badge 
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Company: {selectedCompany}
              <FiX 
                className="cursor-pointer hover:text-secondary-default" 
                onClick={() => setSelectedCompany(null)}
                size={12}
              />
            </Badge>
          )}
          {selectedStatus && (
            <Badge 
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Status: {selectedStatus}
              <FiX 
                className="cursor-pointer hover:text-secondary-default" 
                onClick={() => setSelectedStatus(null)}
                size={12}
              />
            </Badge>
          )}
          {selectedTech && (
            <Badge 
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Technology: {selectedTech}
              <FiX 
                className="cursor-pointer hover:text-secondary-default" 
                onClick={() => setSelectedTech(null)}
                size={12}
              />
            </Badge>
          )}
          {searchQuery && (
            <Badge 
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Search: {searchQuery}
              <FiX 
                className="cursor-pointer hover:text-secondary-default" 
                onClick={() => onSearchChange("")}
                size={12}
              />
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectsFilter;
 