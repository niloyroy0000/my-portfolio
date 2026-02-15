"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes, FaExternalLinkAlt, FaCode, FaBriefcase, FaAward } from "@/lib/icons";
import EmptyState from "@/components/ui/EmptyState";
import type { Project, Certification } from "@/types/api";
import Link from "next/link";

/**
 * GlobalSearch - Accessible global search modal
 * WCAG 2.1 AA compliant with focus management, keyboard navigation, and live regions
 */

interface SkillHierarchyNode {
  name: string;
  metadata?: {
    icon?: string;
    level?: string;
    yearsOfExperience?: number;
    lastUsed?: string;
  };
  children?: SkillHierarchyNode[];
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "project" | "skill" | "page" | "certification";
  url: string;
  category?: string;
  icon: React.ReactNode;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  certifications: Certification[];
  skillsHierarchy: SkillHierarchyNode[];
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  projects,
  certifications,
  skillsHierarchy
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Prepare searchable data from props
  const prepareSearchableData = (): SearchResult[] => {
    const results: SearchResult[] = [];

    // Add projects
    projects.forEach(project => {
      results.push({
        id: `project-${project._id}`,
        title: project.title,
        description: project.shortDescription,
        type: "project",
        url: `/projects#${project.title.toLowerCase().replace(/\s+/g, '-')}`,
        category: project.category,
        icon: <FaCode className="text-emerald-400" />
      });
    });

    // Add certifications
    certifications.forEach(cert => {
      results.push({
        id: `cert-${cert._id}`,
        title: cert.name,
        description: `${cert.issuer} - ${cert.category}`,
        type: "certification",
        url: `/certifications#${cert.name.toLowerCase().replace(/\s+/g, '-')}`,
        category: cert.category,
        icon: <FaAward className="text-purple-400" />
      });
    });

    // Add skills (extract leaf nodes from hierarchy)
    const extractSkills = (node: SkillHierarchyNode, parentCategory?: string): void => {
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => extractSkills(child, node.name));
      } else if (node.metadata?.level) {
        // This is a skill with proficiency level
        results.push({
          id: `skill-${node.name}`,
          title: node.name,
          description: `${node.metadata.level}${node.metadata.yearsOfExperience ? ` • ${node.metadata.yearsOfExperience} years` : ''}`,
          type: "skill",
          url: `/skills#${node.name.toLowerCase().replace(/\s+/g, '-')}`,
          category: parentCategory,
          icon: <FaBriefcase className="text-blue-400" />
        });
      }
    };

    skillsHierarchy.forEach(category => extractSkills(category));

    // Add static pages
    const pages = [
      { title: "Projects", description: "View all my projects", url: "/projects" },
      { title: "Skills", description: "Explore my technical skills", url: "/skills" },
      { title: "Certifications", description: "Professional certifications", url: "/certifications" },
      { title: "Career", description: "My career timeline", url: "/career" },
      { title: "Activity", description: "GitHub activity", url: "/activity" },
      { title: "Contact", description: "Get in touch", url: "/contact" },
    ];

    pages.forEach(page => {
      results.push({
        id: `page-${page.url}`,
        title: page.title,
        description: page.description,
        type: "page",
        url: page.url,
        icon: <FaExternalLinkAlt className="text-cyan-400" />
      });
    });

    return results;
  };

  // Memoize searchable data to prevent recreation on every render
  const searchableData = useMemo(() => prepareSearchableData(), [projects, certifications, skillsHierarchy]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    if (!debouncedSearch.trim()) return [];

    const searchLower = debouncedSearch.toLowerCase();
    
    // Score-based relevance sorting
    return searchableData
      .map(item => {
        // Calculate relevance score
        let score = 0;
        
        // Exact title match gets highest score
        if (item.title.toLowerCase() === searchLower) {
          score += 100;
        }
        // Title starts with search term
        else if (item.title.toLowerCase().startsWith(searchLower)) {
          score += 80;
        }
        // Title contains search term
        else if (item.title.toLowerCase().includes(searchLower)) {
          score += 60;
        }
        
        // Description contains search term
        if (item.description.toLowerCase().includes(searchLower)) {
          score += 40;
        }
        
        // Category matches
        if (item.category?.toLowerCase().includes(searchLower)) {
          score += 30;
        }
        
        // Return item with score if it matches
        return score > 0 ? { ...item, score } : null;
      })
      .filter((item): item is SearchResult & { score: number } => item !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Limit to 10 results
  }, [debouncedSearch, searchableData]);

  const handleResultClick = () => {
    onClose();
    // Navigation will be handled by Link component
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Group results by type
  const groupedResults = useMemo(() => {
    const grouped = {
      page: [] as typeof filteredResults,
      project: [] as typeof filteredResults,
      certification: [] as typeof filteredResults,
      skill: [] as typeof filteredResults,
    };
    
    filteredResults.forEach(result => {
      grouped[result.type as keyof typeof grouped].push(result);
    });
    
    return grouped;
  }, [filteredResults]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[var(--z-search)] flex items-start justify-center pt-20"
          style={{ zIndex: 'var(--z-search)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-dialog-title"
        >
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-secondary-default/20 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden shadow-lg shadow-secondary-default/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visually hidden title for screen readers */}
            <h2 id="search-dialog-title" className="sr-only">
              Search portfolio
            </h2>
            {/* Search Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <label htmlFor="global-search-input" className="sr-only">
                  Search projects, skills, certifications, and pages
                </label>
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-default" aria-hidden="true" />
                <input
                  ref={inputRef}
                  id="global-search-input"
                  type="search"
                  role="searchbox"
                  placeholder="Search projects, skills, certifications, pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-800/50 border border-secondary-default/20 text-white placeholder:text-white/40 pl-10 pr-4 py-3 rounded focus:border-secondary-default/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 transition-all duration-300"
                  aria-describedby="search-results-status"
                />
              </div>
              <button
                onClick={onClose}
                className="p-3 text-white/40 hover:text-secondary-default transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
                aria-label="Close search"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>

            {/* Live region for screen reader announcements */}
            <div id="search-results-status" className="sr-only" aria-live="polite" aria-atomic="true">
              {debouncedSearch && filteredResults.length === 0 && `No results found for ${debouncedSearch}`}
              {filteredResults.length > 0 && `Found ${filteredResults.length} results for ${debouncedSearch}`}
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar" role="region" aria-label="Search results">
              {debouncedSearch && filteredResults.length === 0 && (
                <EmptyState
                  icon={FaSearch}
                  title="No results found"
                  description={`We couldn't find anything matching "${debouncedSearch}". Try different keywords or browse the suggestions below.`}
                  action={{
                    label: "Clear Search",
                    onClick: () => setSearchQuery(""),
                  }}
                  size="sm"
                  className="py-4"
                />
              )}

              {filteredResults.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-secondary-default mb-4">
                    Found {filteredResults.length} results for &ldquo;{debouncedSearch}&rdquo;
                  </p>
                  
                  {/* Pages */}
                  {groupedResults.page.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs text-secondary-default/80 uppercase font-semibold mb-2 px-1">Pages</h3>
                      <div className="space-y-2">
                        {groupedResults.page.map(renderSearchResult)}
                      </div>
                    </div>
                  )}
                  
                  {/* Projects */}
                  {groupedResults.project.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs text-secondary-default/80 uppercase font-semibold mb-2 px-1">Projects</h3>
                      <div className="space-y-2">
                        {groupedResults.project.map(renderSearchResult)}
                      </div>
                    </div>
                  )}
                  
                  {/* Certifications */}
                  {groupedResults.certification.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs text-secondary-default/80 uppercase font-semibold mb-2 px-1">Certifications</h3>
                      <div className="space-y-2">
                        {groupedResults.certification.map(renderSearchResult)}
                      </div>
                    </div>
                  )}
                  
                  {/* Skills */}
                  {groupedResults.skill.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs text-secondary-default/80 uppercase font-semibold mb-2 px-1">Skills</h3>
                      <div className="space-y-2">
                        {groupedResults.skill.map(renderSearchResult)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!debouncedSearch && (
                <div className="text-center py-8">
                  <FaSearch className="text-4xl text-secondary-default/40 mx-auto mb-4" aria-hidden="true" />
                  <p className="text-white/60 mb-4">
                    Start typing to search across projects, skills, certifications, and pages
                  </p>
                  <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Quick search suggestions">
                    <button
                      onClick={() => setSearchQuery("react")}
                      className="px-3 py-1 text-sm bg-secondary-default/10 hover:bg-secondary-default/20 border border-secondary-default/30 text-secondary-default rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      React
                    </button>
                    <button
                      onClick={() => setSearchQuery("azure")}
                      className="px-3 py-1 text-sm bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      Azure
                    </button>
                    <button
                      onClick={() => setSearchQuery("certification")}
                      className="px-3 py-1 text-sm bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      Certifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Tips */}
            <div className="mt-6 pt-4 border-t border-secondary-default/20">
              <p className="text-xs text-white/40 text-center">
                Press <kbd className="bg-gray-800/70 px-2 py-1 rounded text-secondary-default border border-secondary-default/20">Esc</kbd> to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  // Helper function to render a search result
  function renderSearchResult(result: SearchResult & { score?: number }) {
    return (
      <Link
        key={result.id}
        href={result.url}
        onClick={() => handleResultClick()}
        className="block p-4 bg-gray-800/50 hover:bg-gray-800/80 border border-secondary-default/20 hover:border-secondary-default/50 rounded transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
        aria-label={`${result.title} - ${result.type}${result.category ? ` in ${result.category}` : ''}`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1" aria-hidden="true">{result.icon}</div>
          <div className="flex-1">
            <h3 className="text-white font-medium group-hover:text-secondary-default transition-colors">
              {result.title}
            </h3>
            <p className="text-sm text-white/60 mt-1">
              {result.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-secondary-default/20 text-secondary-default px-2 py-1 rounded border border-secondary-default/30">
                {result.type}
              </span>
              {result.category && (
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                  {result.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }
};

export default GlobalSearch; 