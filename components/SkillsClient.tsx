"use client";
import { motion } from "framer-motion";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { countAllTechnologies } from "@/lib/skillsDataTransformer";
import React, { useCallback, useMemo } from "react";
import BackgroundElements from "@/components/BackgroundElements";
import SkillProficiencySummary from "@/components/SkillProficiencySummary";
import { useSkillsFilter } from "@/hooks/useSkillsFilter";
import { useSkillsStats } from "@/hooks/useSkillsStats";
import { SkillsTreeNode } from "@/components/skills/SkillsTreeNode";
import { SkillsFilterBar } from "@/components/skills/SkillsFilterBar";
import { SkillsStatsCards } from "@/components/skills/SkillsStatsCards";
import { SkillsNoResults } from "@/components/skills/SkillsNoResults";
import { PERFORMANCE_VARIANTS } from "@/constants";

// SkillNode interface matching main branch
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

// Props interface
interface SkillsClientProps {
  skills1: SkillNode;
  skills2: SkillNode;
}

// Memoized animation variants using PERFORMANCE_VARIANTS for consistency
const TREE_ANIMATIONS = {
  container: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1, duration: 0.2 }
  },
  leftCard: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.1, duration: 0.2 }
  },
  rightCard: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.1, duration: 0.2 }
  }
} as const;

// Memoized style generator
const getNodeStyle = (level: number) => ({
  paddingLeft: 40 * (level - 1),
  display: "flex" as const,
  alignItems: "center" as const,
});

const SkillsClient = ({ skills1, skills2 }: SkillsClientProps) => {
  // Environment flags
  const isSearchEnabled = process.env.NEXT_PUBLIC_ENABLE_SEARCH !== 'false';

  // Use custom hooks for filtering and stats
  const {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    selectedLevels,
    toggleLevel,
    clearLevelFilters,
    clearAllFilters,
    applyFilters,
    hasActiveFilters
  } = useSkillsFilter(isSearchEnabled);

  const skillStats = useSkillsStats(skills1, skills2);

  // Apply filters to both skill trees
  const filteredSkills1 = useMemo(() => applyFilters(skills1), [applyFilters, skills1]);
  const filteredSkills2 = useMemo(() => applyFilters(skills2), [applyFilters, skills2]);

  // Flatten for TreeView
  const data1 = flattenTree(filteredSkills1);
  const data2 = flattenTree(filteredSkills2);

  // Calculate totals
  const totalTechnologies = countAllTechnologies(skills1, skills2);
  const totalCategories = (skills1.children?.length || 0) + (skills2.children?.length || 0);
  const filteredCount = data1.length + data2.length - 2; // Subtract root nodes

  // Expand all tree view items by default
  const getDefaultExpandedIds = useCallback((data: typeof data1) => {
    return data.map((node) => node.id);
  }, []);

  // Memoized style objects to prevent recreation
  const nodeStyles = useMemo(() => {
    const styles: Record<number, React.CSSProperties> = {};
    for (let i = 0; i <= 5; i++) { // Assuming max 5 levels
      styles[i] = getNodeStyle(i);
    }
    return styles;
  }, []);

  // Memoized node renderer using extracted component
  // @ts-expect-error - TreeView library has complex type interface, suppressing for performance optimization
  const nodeRenderer = useCallback(({ element, getNodeProps, level }) => {
    const isHighlighted = debouncedSearch &&
      element.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    const style = nodeStyles[level] || getNodeStyle(level);

    return (
      <SkillsTreeNode
        element={element}
        getNodeProps={getNodeProps}
        level={level}
        style={style}
        isHighlighted={isHighlighted}
      />
    );
  }, [nodeStyles, debouncedSearch]);

  return (
    <section className="min-h-[calc(100vh-136px)] flex flex-col relative overflow-hidden py-6">
      <BackgroundElements />

      <div className="container mx-auto px-4 relative z-10">
        {/* Skills Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex-1 mb-4">
            <h1 className="text-3xl xl:text-4xl font-bold mb-2 leading-tight bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
              Technical Expertise
            </h1>
            <p className="text-sm font-medium leading-relaxed">
              <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                A comprehensive overview of{" "}
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                {totalTechnologies}
              </span>
              <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}technologies mastered through hands-on experience
              </span>
            </p>
          </div>
        </motion.div>

        {/* Skills Stats Cards */}
        <SkillsStatsCards
          totalTechnologies={totalTechnologies}
          totalCategories={totalCategories}
          expertCount={skillStats.expert}
          advancedCount={skillStats.advanced}
        />

        {/* Skills Proficiency Summary */}
        <SkillProficiencySummary skillsHierarchy={[skills1, skills2]} />

        {/* Search & Filter Toolbar */}
        <SkillsFilterBar
          isSearchEnabled={isSearchEnabled}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLevels={selectedLevels}
          onToggleLevel={toggleLevel}
          onClearFilters={clearLevelFilters}
          levelCounts={{
            expert: skillStats.expert,
            advanced: skillStats.advanced,
            intermediate: skillStats.intermediate,
            familiar: skillStats.familiar
          }}
        />

        {/* No Results */}
        {hasActiveFilters && filteredCount === 0 && (
          <SkillsNoResults
            hasSearch={debouncedSearch.length > 0}
            hasLevelFilter={selectedLevels.size > 0}
            onClearAllFilters={clearAllFilters}
          />
        )}

        {/* Skills Trees */}
        {(!hasActiveFilters || filteredCount > 0) && (
          <motion.div
            initial={TREE_ANIMATIONS.container.initial}
            animate={TREE_ANIMATIONS.container.animate}
            transition={TREE_ANIMATIONS.container.transition}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* First Skills Tree */}
            {data1.length > 1 && (
              <motion.div
                initial={TREE_ANIMATIONS.leftCard.initial}
                animate={TREE_ANIMATIONS.leftCard.animate}
                transition={TREE_ANIMATIONS.leftCard.transition}
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl border border-secondary-default/20 hover:border-secondary-default/40 transition-all duration-300 hover:shadow-lg hover:shadow-secondary-default/10"
              >
                <TreeView
                  data={data1}
                  defaultExpandedIds={getDefaultExpandedIds(data1)}
                  aria-label="Core Technologies Skills Tree"
                  nodeRenderer={nodeRenderer}
                />
              </motion.div>
            )}

            {/* Second Skills Tree */}
            {data2.length > 1 && (
              <motion.div
                initial={TREE_ANIMATIONS.rightCard.initial}
                animate={TREE_ANIMATIONS.rightCard.animate}
                transition={TREE_ANIMATIONS.rightCard.transition}
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl border border-secondary-default/20 hover:border-secondary-default/40 transition-all duration-300 hover:shadow-lg hover:shadow-secondary-default/10"
              >
                <TreeView
                  data={data2}
                  defaultExpandedIds={getDefaultExpandedIds(data2)}
                  aria-label="Tools & Methodologies Skills Tree"
                  nodeRenderer={nodeRenderer}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SkillsClient;
