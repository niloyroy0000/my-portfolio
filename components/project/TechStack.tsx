"use client";

import React, { useState } from "react";
import { CardContainer, SubsectionHeader, GradientDivider } from "./SharedUI";

export interface TechStackProps {
  /**
   * Array of technology names
   */
  stacks: string[];

  /**
   * Number of columns for the grid
   * @default 2
   */
  columns?: 2 | 3;

  /**
   * Whether the list should be expandable
   * @default false
   */
  expandable?: boolean;

  /**
   * Number of items to show initially (when expandable)
   * @default 6 for 2-column, 9 for 3-column
   */
  initialVisibleCount?: number;

  /**
   * Callback when a tech is clicked
   */
  onTechClick?: (tech: string) => void;

  /**
   * Currently selected technology for filtering
   */
  selectedTech?: string | null;

  /**
   * Custom title for the tech stack section
   * @default "Tech Stacks"
   */
  title?: string;

  /**
   * Additional className for the container
   */
  className?: string;
}

/**
 * Unified TechStack Component
 *
 * Displays project technologies in a grid layout with optional expansion.
 * Supports 2-column (ProjectCard) and 3-column (Timeline/Modal) layouts.
 *
 * @example
 * ```tsx
 * // ProjectCard usage (2-column, expandable)
 * <TechStack
 *   stacks={project.stacks}
 *   columns={2}
 *   expandable
 *   onTechClick={handleTechClick}
 * />
 *
 * // Timeline usage (3-column, expandable)
 * <TechStack
 *   stacks={project.stacks}
 *   columns={3}
 *   expandable
 * />
 *
 * // Modal usage (3-column, all visible)
 * <TechStack
 *   stacks={project.stacks}
 *   columns={3}
 *   expandable={false}
 * />
 * ```
 */
export function TechStack({
  stacks,
  columns = 2,
  expandable = false,
  initialVisibleCount,
  onTechClick,
  selectedTech = null,
  title = "Tech Stacks",
  className = "",
}: TechStackProps) {
  // Default initial visible count based on column count
  const defaultInitialCount = columns === 2 ? 6 : 9;
  const visibleCount = initialVisibleCount ?? defaultInitialCount;

  const [isExpanded, setIsExpanded] = useState(false);

  const displayStacks = expandable && !isExpanded
    ? stacks.slice(0, visibleCount)
    : stacks;

  const hasMore = stacks.length > visibleCount;
  const remainingCount = stacks.length - visibleCount;

  // Grid column classes
  const gridClass = columns === 2
    ? "grid-cols-2"
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  // If title is empty, render without CardContainer (for modal use)
  if (!title || title === "") {
    return (
      <div className={`border border-white/10 rounded-xl p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 ${className}`}>
        <div className={`grid ${gridClass} gap-x-8 gap-y-2`}>
          {stacks.map((stack, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-white/90 group transition-colors duration-200">
              <span className="text-secondary-default text-xs group-hover:scale-110 transition-transform duration-200">•</span>
              <span className="group-hover:text-secondary-default transition-colors duration-200">{stack}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <CardContainer className={className}>
      {/* Header with optional expand button */}
      <SubsectionHeader
        title={title}
        icon={<span className="w-1 h-1 rounded-full bg-secondary-default"></span>}
        action={
          expandable && hasMore ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-secondary-default hover:text-secondary-default/80 transition-colors font-medium"
            >
              {isExpanded ? "Show less" : `+${remainingCount} more`}
            </button>
          ) : null
        }
      />

      {/* Gradient Divider */}
      <GradientDivider className="mb-2" />

      {/* Tech Stack Grid */}
      <div className={`grid ${gridClass} gap-x-3 gap-y-1`}>
        {displayStacks.map((stack, index) => (
          <TechStackItem
            key={index}
            tech={stack}
            isSelected={selectedTech?.toLowerCase() === stack.toLowerCase()}
            onClick={onTechClick}
          />
        ))}
      </div>
    </CardContainer>
  );
}

/**
 * Individual Tech Stack Item
 */
function TechStackItem({
  tech,
  isSelected,
  onClick,
}: {
  tech: string;
  isSelected: boolean;
  onClick?: (tech: string) => void;
}) {
  const isClickable = onClick !== undefined;

  return (
    <button
      type="button"
      onClick={() => onClick?.(tech)}
      disabled={!isClickable}
      className={`flex items-center gap-1.5 text-xs transition-all duration-200 text-left ${
        isClickable ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary-default/50 focus:ring-offset-2 focus:ring-offset-[#27272c] rounded-sm" : "cursor-default"
      } ${
        isSelected
          ? "text-secondary-default font-bold scale-105"
          : "text-white/80 hover:text-secondary-default/80"
      }`}
      aria-label={isClickable ? `Filter projects by ${tech}` : undefined}
      aria-pressed={isClickable ? isSelected : undefined}
    >
      <span
        className={`w-1 h-1 rounded-full flex-shrink-0 ${
          isSelected ? "bg-secondary-default" : "bg-secondary-default/60"
        }`}
      ></span>
      <span className="truncate">{tech}</span>
    </button>
  );
}

/**
 * Compact Tech Stack List (No container, for inline use)
 */
export function TechStackList({
  stacks,
  columns = 2,
  selectedTech,
  onTechClick,
}: Pick<TechStackProps, "stacks" | "columns" | "selectedTech" | "onTechClick">) {
  const gridClass = columns === 2
    ? "grid-cols-2"
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  return (
    <div className={`grid ${gridClass} gap-x-3 gap-y-1`}>
      {stacks.map((stack, index) => (
        <TechStackItem
          key={index}
          tech={stack}
          isSelected={selectedTech?.toLowerCase() === stack.toLowerCase()}
          onClick={onTechClick}
        />
      ))}
    </div>
  );
}
