"use client";
import React, { useState, useId } from "react";
import { motion } from "framer-motion";
import { FiFilter, FiChevronDown, FiSearch, FiX } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * SkillsFilter - Accessible skills filter component
 * WCAG 2.1 AA compliant with keyboard navigation and ARIA labels
 */

// Define a type for the skill node structure
interface SkillNode {
  name: string;
  metadata?: { icon: string };
  children?: SkillNode[];
}

interface SkillsFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  placeholder?: string;
  showResults?: boolean;
  resultsText?: string;
  skillsData?: SkillNode[];
}

// Helper function to extract skills from the skills tree data
const extractSkillsFromTree = (node: SkillNode, skillsList: string[] = []): string[] => {
  if (node.name && node.name !== "Skills") {
    skillsList.push(node.name);
  }
  
  if (node.children && node.children.length > 0) {
    node.children.forEach((child: SkillNode) => {
      extractSkillsFromTree(child, skillsList);
    });
  }
  
  return skillsList;
};

const SkillsFilter: React.FC<SkillsFilterProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  placeholder = "Search technologies, frameworks, tools...",
  showResults = false,
  resultsText = "",
  skillsData = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const searchInputId = useId();
  const filterPanelId = useId();

  // Extract categories and technologies
  const categories = skillsData
    .flatMap(skill => skill.children?.map((c: SkillNode) => c.name) || [])
    .filter((name, index, self) => self.indexOf(name) === index)
    .sort();

  // Extract all individual skills/technologies
  const allSkills = skillsData
    .flatMap(skill => extractSkillsFromTree(skill))
    .filter((skill, index, self) => self.indexOf(skill) === index) // Remove duplicates
    .filter(skill => !categories.includes(skill)) // Remove categories from technologies list
    .sort();
  
  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Check if any filter is active
  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedTechnology);
  
  // Reset all filters
  const resetFilters = () => {
    onClearSearch();
    setSelectedCategory(null);
    setSelectedTechnology(null);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    
    // Reset specific filters when using the search box
    if (e.target.value) {
      setSelectedCategory(null);
      setSelectedTechnology(null);
    }
  };
  
  // When a category is selected, clear other filters
  const handleCategorySelect = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    setSelectedTechnology(null);
    onSearchChange(newCategory || "");
  };
  
  // When a technology is selected, clear other filters
  const handleTechnologySelect = (technology: string) => {
    const newTechnology = selectedTechnology === technology ? null : technology;
    setSelectedTechnology(newTechnology);
    setSelectedCategory(null);
    onSearchChange(newTechnology || "");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-900/70 to-gray-950/70 backdrop-blur-sm border border-secondary-default/20 rounded-lg overflow-hidden mb-6 shadow-md"
      role="search"
      aria-label="Skills filter"
    >
      {/* Compact Search and Filter Bar */}
      <div className="p-3 flex flex-col sm:flex-row gap-2 items-center">
        {/* Compact Search Input */}
        <div className="relative flex-1 w-full">
          <label htmlFor={searchInputId} className="sr-only">
            Search skills
          </label>
          <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-secondary-default text-sm" aria-hidden="true">
            <FiSearch />
          </div>
          <input
            id={searchInputId}
            type="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-9 bg-gray-800/50 border border-secondary-default/20 rounded-lg pl-9 pr-9 text-sm text-white placeholder:text-white/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 focus:border-secondary-default/50"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-secondary-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
              aria-label="Clear search"
            >
              <FiX className="text-sm" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Compact Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={toggleFilterPanel}
          size="sm"
          className={`shrink-0 flex items-center gap-1.5 text-xs focus-visible:ring-2 focus-visible:ring-cyan-400 ${isExpanded ? 'bg-secondary-default/10 border-secondary-default/50 text-secondary-default' : 'hover:text-secondary-default'}`}
          aria-expanded={isExpanded}
          aria-controls={filterPanelId}
        >
          <FiFilter className={`text-sm ${isExpanded ? 'text-secondary-default' : 'text-white/70'}`} aria-hidden="true" />
          <span>Filters</span>
          <FiChevronDown className={`text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </Button>

        {/* Compact Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="shrink-0 text-white/70 hover:text-secondary-default px-3 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Reset all filters"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Compact Results text */}
      {showResults && resultsText && (
        <div className="px-3 pb-2">
          <p className="text-xs text-secondary-default">{resultsText}</p>
        </div>
      )}
      
      {/* Compact Expanded Filter Panel */}
      {isExpanded && (
        <motion.div
          id={filterPanelId}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="px-3 pb-3 border-t border-secondary-default/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
            {/* Categories Filter */}
            <div role="group" aria-labelledby="categories-label">
              <h4 id="categories-label" className="text-secondary-default text-sm font-semibold mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${selectedCategory === category ? 'bg-secondary-default text-primary shadow-md' : 'text-white/70 hover:text-white hover:border-secondary-default/50'}`}
                    onClick={() => handleCategorySelect(category)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedCategory === category}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCategorySelect(category);
                      }
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Technologies Filter */}
            <div role="group" aria-labelledby="technologies-label">
              <h4 id="technologies-label" className="text-secondary-default text-sm font-semibold mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                {allSkills.map(technology => (
                  <Badge
                    key={technology}
                    variant={selectedTechnology === technology ? "default" : "outline"}
                    className={`cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${selectedTechnology === technology ? 'bg-secondary-default text-primary shadow-md' : 'text-white/70 hover:text-white hover:border-secondary-default/50'}`}
                    onClick={() => handleTechnologySelect(technology)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedTechnology === technology}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTechnologySelect(technology);
                      }
                    }}
                  >
                    {technology}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Compact Active Filters */}
      {hasActiveFilters && (
        <div className="px-3 pb-3 flex flex-wrap gap-1.5 items-center" role="status" aria-live="polite">
          <span className="text-white/50 text-[10px]">Active filters:</span>
          {selectedCategory && (
            <Badge
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Category: {selectedCategory}
              <button
                className="cursor-pointer hover:text-secondary-default focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                onClick={() => {
                  setSelectedCategory(null);
                  onSearchChange("");
                }}
                aria-label={`Remove ${selectedCategory} category filter`}
              >
                <FiX size={12} aria-hidden="true" />
              </button>
            </Badge>
          )}
          {selectedTechnology && (
            <Badge
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Technology: {selectedTechnology}
              <button
                className="cursor-pointer hover:text-secondary-default focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                onClick={() => {
                  setSelectedTechnology(null);
                  onSearchChange("");
                }}
                aria-label={`Remove ${selectedTechnology} technology filter`}
              >
                <FiX size={12} aria-hidden="true" />
              </button>
            </Badge>
          )}
          {searchQuery && !selectedCategory && !selectedTechnology && (
            <Badge
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Search: {searchQuery}
              <button
                className="cursor-pointer hover:text-secondary-default focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                onClick={onClearSearch}
                aria-label="Clear search filter"
              >
                <FiX size={12} aria-hidden="true" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SkillsFilter;