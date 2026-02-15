"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from "@/lib/icons";
import DynamicIcon from '@/components/DynamicIcon';
// Skills data will be passed as props from parent component

// Skill interface matching skillsData structure
interface SkillNode {
  name: string;
  metadata?: {
    icon: string;
    level?: "Expert" | "Advanced" | "Intermediate" | "Familiar";
    yearsOfExperience?: number;
    lastUsed?: string;
  };
  children?: SkillNode[];
}

// Updated level to color mapping with glassmorphism theme
const levelToColor = {
  'Expert': 'bg-gradient-to-br from-purple-500/20 to-pink-500/30 border-fuchsia-500/50 backdrop-blur-sm',
  'Advanced': 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 border-emerald-500/50 backdrop-blur-sm',
  'Intermediate': 'bg-gradient-to-br from-blue-500/20 to-blue-600/30 border-blue-500/50 backdrop-blur-sm',
  'Familiar': 'bg-gradient-to-br from-slate-500/20 to-slate-600/30 border-slate-500/50 backdrop-blur-sm',
};

const levelToTextColor = {
  'Expert': 'text-fuchsia-400',
  'Advanced': 'text-emerald-400',
  'Intermediate': 'text-blue-400',
  'Familiar': 'text-slate-400',
};

const levelOrder = {
  'Expert': 4,
  'Advanced': 3,
  'Intermediate': 2,
  'Familiar': 1,
};

// Note: All icons (categories and skills) are now read directly from metadata
// This ensures consistency with the tree view and eliminates hardcoded mappings

interface SkillsHeatMapModalProps {
  onClose: () => void;
  skills1: SkillNode;
  skills2: SkillNode;
}

export default function SkillsHeatMapModal({ onClose, skills1, skills2 }: SkillsHeatMapModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);

  // Proficiency level filter state (none selected by default = show all)
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());

  // Toggle level selection
  const toggleLevel = (level: string) => {
    const newLevels = new Set(selectedLevels);
    if (newLevels.has(level)) {
      newLevels.delete(level);
    } else {
      newLevels.add(level);
    }
    setSelectedLevels(newLevels);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Recursively extract all skills from a subtree
  const extractAllSkills = (node: SkillNode): SkillNode[] => {
    let allSkills: SkillNode[] = [];

    // If this node has level metadata, it's a skill
    if (node.metadata?.level || node.metadata?.yearsOfExperience) {
      allSkills.push(node);
    }

    // Recursively process children
    if (node.children) {
      node.children.forEach(childNode => {
        allSkills = [...allSkills, ...extractAllSkills(childNode)];
      });
    }

    return allSkills;
  };

  // Extract skills grouped by top-level category with category metadata
  const extractSkills = (node: SkillNode): { category: string; categoryIcon: string; skills: SkillNode[] }[] => {
    const categories: { category: string; categoryIcon: string; skills: SkillNode[] }[] = [];

    if (node.children) {
      node.children.forEach(categoryNode => {
        // Recursively extract all skills from this category (handles nested structures)
        const skillsInCategory = extractAllSkills(categoryNode);

        if (skillsInCategory.length > 0) {
          categories.push({
            category: categoryNode.name,
            categoryIcon: categoryNode.metadata?.icon || 'FaCode', // Use category's own icon from metadata
            skills: skillsInCategory
          });
        }
      });
    }

    return categories;
  };

  // Merge categories from both skill trees
  const skillCategories = [...extractSkills(skills1), ...extractSkills(skills2)];

  // Filter categories and skills by proficiency level
  // When no levels selected, show all (same behavior as Skills Page)
  const displayedCategories = (selectedCategory
    ? skillCategories.filter(c => c.category === selectedCategory)
    : skillCategories
  ).map(({ category, categoryIcon, skills }) => ({
    category,
    categoryIcon,
    skills: skills.filter(skill => {
      const level = skill.metadata?.level || 'Familiar';
      // If no levels selected, show all; otherwise show only selected
      return selectedLevels.size === 0 || selectedLevels.has(level);
    })
  })).filter(({ skills }) => skills.length > 0); // Remove empty categories

  // Calculate total filtered skills count
  const totalFilteredSkills = displayedCategories.reduce((sum, { skills }) => sum + skills.length, 0);

  // Calculate counts for each proficiency level (from all skills, not filtered)
  const allSkills = skillCategories.flatMap(c => c.skills);
  const expertCount = allSkills.filter(s => s.metadata?.level === 'Expert').length;
  const advancedCount = allSkills.filter(s => s.metadata?.level === 'Advanced').length;
  const intermediateCount = allSkills.filter(s => s.metadata?.level === 'Intermediate').length;
  const familiarCount = allSkills.filter(s => s.metadata?.level === 'Familiar').length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal - Matching ProjectModal structure */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border border-secondary-default/30 rounded-xl sm:rounded-2xl w-full max-w-6xl max-h-[calc(100vh-80px)] sm:max-h-[calc(100vh-160px)] overflow-hidden shadow-2xl shadow-secondary-default/20 flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - flex-shrink-0 prevents header from scrolling, mobile optimized */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-secondary-default/20 bg-gradient-to-r from-secondary-default/10 via-transparent to-secondary-default/10 flex-shrink-0">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-secondary-default bg-clip-text text-transparent">
              Skills Heat Map
            </h2>
            <button
              onClick={onClose}
              className="p-2.5 text-white/60 hover:text-white bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-all duration-200 rounded-full"
              aria-label="Close modal"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Scrollable Content Area - Mobile optimized spacing */}
          <div className="overflow-y-auto custom-scrollbar px-3 sm:px-6 py-4 sm:py-6 flex-1">
            {/* Compact Filter Section - Single Line, mobile optimized */}
            <div className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-2 sm:p-3 mb-4 sm:mb-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Dropdown */}
                <select
                  value={selectedCategory || 'All Categories'}
                  onChange={(e) => setSelectedCategory(e.target.value === 'All Categories' ? null : e.target.value)}
                  className="h-9 bg-gradient-to-br from-[#27272c] to-[#2a2a30] border border-secondary-default/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-secondary-default/50 focus:border-secondary-default/60 transition-all duration-300 [&>option]:bg-gray-900 [&>option]:text-white"
                >
                  <option value="All Categories">🎨 All Categories</option>
                  {skillCategories.map(({ category }) => {
                    // Use emoji as prefix since we can't render React icons in option tags
                    const iconMap: Record<string, string> = {
                      'Frameworks': '⚛️',
                      'Backend Runtime & Platforms': '🖥️',
                      'Architectures/Patterns': '🏗️',
                      'Programming Languages': '💻',
                      'Databases': '💾',
                      'Agile Methodologies': '📋',
                      'Other Skills': '🛠️',
                    };
                    return (
                      <option key={category} value={category}>
                        {iconMap[category] || '•'} {category}
                      </option>
                    );
                  })}
                </select>

                {/* Separator */}
                <div className="hidden sm:block w-px h-8 bg-white/10"></div>

                {/* Proficiency Level Filters - Same style as Skills page */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Expert Filter */}
                  <button
                    onClick={() => toggleLevel('Expert')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 border ${
                      selectedLevels.has('Expert')
                        ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-fuchsia-500/60 text-fuchsia-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-fuchsia-500/10 hover:border-fuchsia-500/30 hover:text-fuchsia-400"
                    }`}
                  >
                    <span>🟣</span>
                    <span className="hidden sm:inline">Expert</span>
                    <span className="text-[10px] opacity-70">({expertCount})</span>
                  </button>

                  {/* Advanced Filter */}
                  <button
                    onClick={() => toggleLevel('Advanced')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 border ${
                      selectedLevels.has('Advanced')
                        ? "bg-emerald-500/30 border-emerald-500/60 text-emerald-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
                    }`}
                  >
                    <span>🟢</span>
                    <span className="hidden sm:inline">Advanced</span>
                    <span className="text-[10px] opacity-70">({advancedCount})</span>
                  </button>

                  {/* Intermediate Filter */}
                  <button
                    onClick={() => toggleLevel('Intermediate')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 border ${
                      selectedLevels.has('Intermediate')
                        ? "bg-blue-500/30 border-blue-500/60 text-blue-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400"
                    }`}
                  >
                    <span>🔵</span>
                    <span className="hidden sm:inline">Interm.</span>
                    <span className="text-[10px] opacity-70">({intermediateCount})</span>
                  </button>

                  {/* Familiar Filter */}
                  <button
                    onClick={() => toggleLevel('Familiar')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 border ${
                      selectedLevels.has('Familiar')
                        ? "bg-slate-500/30 border-slate-500/60 text-slate-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-slate-500/10 hover:border-slate-500/30 hover:text-slate-400"
                    }`}
                  >
                    <span>⚪</span>
                    <span className="hidden sm:inline">Familiar</span>
                    <span className="text-[10px] opacity-70">({familiarCount})</span>
                  </button>

                  {/* Clear Filters */}
                  {selectedLevels.size > 0 && (
                    <button
                      onClick={() => setSelectedLevels(new Set())}
                      className="flex items-center gap-0.5 px-2 py-1 rounded text-[11px] font-medium transition-all duration-200 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                    >
                      <span>✕</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Heat Map Grid - Mobile optimized spacing */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {displayedCategories.map(({ category, categoryIcon, skills }) => {
                return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <DynamicIcon iconName={categoryIcon} className="text-secondary-default text-base flex-shrink-0" />
                    <h3 className="text-base font-semibold text-white/90">{category}</h3>
                    <span className="text-xs text-white/40">({skills.length})</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
                    {skills.map((skill, skillIndex) => {
                      const level = skill.metadata?.level || 'Familiar';
                      const colorClass = levelToColor[level];
                      const experience = skill.metadata?.yearsOfExperience;
                      const lastUsed = skill.metadata?.lastUsed;
                      const iconName = skill.metadata?.icon || 'FaCode';

                      // Determine if skill is in first row for smart tooltip positioning
                      const isInFirstRow = skillIndex < 4; // 4 columns in lg breakpoint

                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: skillIndex * 0.015 }}
                          className="relative group"
                        >
                          <div
                            className={`p-2 rounded-lg border ${colorClass} cursor-pointer transition-all`}
                          >
                            {/* Skill Name with Icon and Experience */}
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <DynamicIcon iconName={iconName} className="text-sm flex-shrink-0" />
                                <div className="text-white font-semibold text-xs truncate">{skill.name}</div>
                              </div>
                              {experience && (
                                <span className="text-[10px] text-white/60 flex-shrink-0">{experience}y</span>
                              )}
                            </div>

                            {/* Compact Info Row - Level and Last Used */}
                            <div className="flex items-center justify-between text-[10px] text-white/70 mb-1">
                              <span>{level}</span>
                              {lastUsed && (
                                <span className="text-white/60">
                                  {lastUsed === 'Current' ? '🟢' : `${lastUsed}`}
                                </span>
                              )}
                            </div>

                            {/* Proficiency Bar - Thinner */}
                            <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${(levelOrder[level] / 4) * 100}%`,
                                }}
                                transition={{ delay: skillIndex * 0.015 + 0.2, duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-secondary-default to-blue-500"
                              />
                            </div>
                          </div>

                          {/* Enhanced Tooltip - Smart Positioning */}
                          <div className={`absolute ${isInFirstRow ? 'top-full mt-3' : 'bottom-full mb-3'} left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[9999]`}>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-950 backdrop-blur-md border-2 border-secondary-default/50 rounded-lg px-3 py-2.5 shadow-2xl shadow-secondary-default/30 w-max max-w-[200px]">
                              {/* Technology Name with Icon */}
                              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                                <DynamicIcon iconName={iconName} className="text-base text-secondary-default flex-shrink-0" />
                                <div className="text-sm font-bold text-white">{skill.name}</div>
                              </div>

                              {/* Info Grid */}
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] gap-2">
                                  <span className="text-white/60">Level:</span>
                                  <span className={`font-semibold ${levelToTextColor[level]}`}>{level}</span>
                                </div>
                                {experience && (
                                  <div className="flex items-center justify-between text-[11px] gap-2">
                                    <span className="text-white/60">Experience:</span>
                                    <span className="font-semibold text-white">{experience} {experience === 1 ? 'year' : 'years'}</span>
                                  </div>
                                )}
                                {lastUsed && (
                                  <div className="flex items-center justify-between text-[11px] gap-2">
                                    <span className="text-white/60">Last Used:</span>
                                    <span className="font-semibold text-emerald-400">
                                      {lastUsed === 'Current' ? '🟢 Current' : lastUsed}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Tooltip Arrow - Dynamic Direction */}
                              <div className={`absolute ${isInFirstRow ? 'bottom-full mb-px' : 'top-full mt-px'} left-1/2 transform -translate-x-1/2`}>
                                <div className={`border-[6px] border-transparent ${isInFirstRow ? 'border-b-secondary-default/50' : 'border-t-secondary-default/50'}`}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Footer - flex-shrink-0 prevents footer from scrolling, mobile optimized */}
          <div className="px-4 sm:px-6 py-2 sm:py-3 border-t border-secondary-default/20 bg-white/5 flex-shrink-0">
            <p className="text-[10px] sm:text-xs text-white/40 text-center">
              Press ESC or click outside to close
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
