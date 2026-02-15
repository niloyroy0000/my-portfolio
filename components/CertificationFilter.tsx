"use client";
import React, { useState, useCallback, useId } from "react";
import { motion } from "framer-motion";
import { FiFilter, FiChevronDown, FiSearch, FiX } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Certification } from "@/types/api";
import { Badge } from "@/components/ui/badge";

interface CertificationFilterProps {
  certifications: Certification[];
  onFilterChange: (filtered: Certification[]) => void;
  className?: string;
}

const CertificationFilter: React.FC<CertificationFilterProps> = ({
  certifications,
  onFilterChange,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const searchInputId = useId();
  const filterPanelId = useId();
  
  // Extract unique values for filter options
  const uniqueIssuers = Array.from(new Set(certifications.map(cert => cert.issuer)));
  
  const uniqueSkills = Array.from(new Set(
    certifications.flatMap(cert => cert.skills || [])
  )).sort();
  
  const uniqueYears = Array.from(new Set(
    certifications.map(cert => new Date(cert.date).getFullYear().toString())
  )).sort((a, b) => parseInt(b) - parseInt(a)); // Sort years in descending order
  
  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...certifications];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.name.toLowerCase().includes(query) ||
        cert.description?.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        (cert.skills && cert.skills.some(skill => skill.toLowerCase().includes(query)))
      );
    }

    // Apply issuer filter
    if (selectedIssuer) {
      filtered = filtered.filter(cert => cert.issuer === selectedIssuer);
    }

    // Apply skill filter
    if (selectedSkill) {
      filtered = filtered.filter(cert =>
        cert.skills && cert.skills.includes(selectedSkill)
      );
    }

    // Apply year filter
    if (selectedYear) {
      filtered = filtered.filter(cert =>
        new Date(cert.date).getFullYear().toString() === selectedYear
      );
    }

    // Pass filtered results to parent
    onFilterChange(filtered);
  }, [certifications, searchQuery, selectedIssuer, selectedSkill, selectedYear, onFilterChange]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedIssuer(null);
    setSelectedSkill(null);
    setSelectedYear(null);
    onFilterChange(certifications);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Check if any filter is active
  const hasActiveFilters = Boolean(searchQuery || selectedIssuer || selectedSkill || selectedYear);
  
  // Apply filters when any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br from-gray-900/70 to-gray-950/70 backdrop-blur-sm border border-secondary-default/20 rounded-xl overflow-hidden mb-8 shadow-lg shadow-secondary-default/10 ${className}`}
    >
      {/* Search and Filter Bar */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-center" role="search" aria-label="Certification filters">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <label htmlFor={searchInputId} className="sr-only">Search certifications</label>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-default" aria-hidden="true">
            <FiSearch />
          </div>
          <input
            id={searchInputId}
            type="search"
            placeholder="Search certifications..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-gray-800/50 border border-secondary-default/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 focus:border-secondary-default/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-secondary-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
              aria-label="Clear search"
            >
              <FiX aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={toggleFilterPanel}
          aria-expanded={isExpanded}
          aria-controls={filterPanelId}
          className={`shrink-0 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-400 ${isExpanded ? 'bg-secondary-default/10 border-secondary-default/50 text-secondary-default' : 'hover:text-secondary-default'}`}
        >
          <FiFilter className={isExpanded ? 'text-secondary-default' : 'text-white/70'} aria-hidden="true" />
          <span>Filters</span>
          <FiChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </Button>

        {/* Reset Button (only shown when filters are active) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            aria-label="Reset all filters"
            className="shrink-0 text-white/70 hover:text-secondary-default focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Reset
          </Button>
        )}
      </div>
      
      {/* Expanded Filter Panel */}
      {isExpanded && (
        <motion.div
          id={filterPanelId}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-4 border-t border-secondary-default/20"
          role="group"
          aria-label="Filter options"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Issuer Filter */}
            <div>
              <h4 className="text-secondary-default text-sm font-semibold mb-2">Issuer</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueIssuers.map(issuer => (
                  <Badge
                    key={issuer}
                    variant={selectedIssuer === issuer ? "default" : "outline"}
                    className={`cursor-pointer ${selectedIssuer === issuer ? 'bg-secondary-default text-primary shadow-md' : 'text-white/70 hover:text-white hover:border-secondary-default/50'}`}
                    onClick={() => setSelectedIssuer(selectedIssuer === issuer ? null : issuer)}
                  >
                    {issuer}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Skills Filter */}
            <div>
              <h4 className="text-secondary-default text-sm font-semibold mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto custom-scrollbar">
                {uniqueSkills.map(skill => (
                  <Badge
                    key={skill}
                    variant={selectedSkill === skill ? "default" : "outline"}
                    className={`cursor-pointer ${selectedSkill === skill ? 'bg-secondary-default text-primary shadow-md' : 'text-white/70 hover:text-white hover:border-secondary-default/50'}`}
                    onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Year Filter */}
            <div>
              <h4 className="text-secondary-default text-sm font-semibold mb-2">Year</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueYears.map(year => (
                  <Badge
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    className={`cursor-pointer ${selectedYear === year ? 'bg-secondary-default text-primary shadow-md' : 'text-white/70 hover:text-white hover:border-secondary-default/50'}`}
                    onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  >
                    {year}
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
          {selectedIssuer && (
            <Badge 
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Issuer: {selectedIssuer}
              <FiX 
                className="cursor-pointer hover:text-secondary-default" 
                onClick={() => setSelectedIssuer(null)} 
                size={12}
              />
            </Badge>
          )}
          {selectedSkill && (
            <Badge 
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Skill: {selectedSkill}
              <FiX 
                className="cursor-pointer hover:text-secondary-default" 
                onClick={() => setSelectedSkill(null)} 
                size={12}
              />
            </Badge>
          )}
          {selectedYear && (
            <Badge 
              className="bg-secondary-default/20 text-white border border-secondary-default/30 flex items-center gap-1"
            >
              Year: {selectedYear}
              <FiX 
                className="cursor-pointer hover:text-secondary-default" 
                onClick={() => setSelectedYear(null)} 
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
                onClick={() => setSearchQuery("")} 
                size={12}
              />
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CertificationFilter; 