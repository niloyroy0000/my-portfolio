"use client";

import React, { useState } from "react";
import { CompactSectionHeader } from "./SharedUI";

export interface ProjectSkillsProps {
  /**
   * Array of highlighted skills
   */
  skills: string[];

  /**
   * Display mode - expandable or all visible
   * @default "expandable"
   */
  displayMode?: "expandable" | "all";

  /**
   * Number of skills to show initially (when expandable)
   * @default 2
   */
  initialVisibleCount?: number;

  /**
   * Currently selected skill for filtering
   */
  selectedSkill?: string | null;

  /**
   * Callback when a skill is clicked
   */
  onSkillClick?: (skill: string) => void;

  /**
   * Show section header with title
   * @default true
   */
  showHeader?: boolean;

  /**
   * Custom title for the skills section
   * @default "Key Skills"
   */
  title?: string;

  /**
   * Additional className for the container
   */
  className?: string;
}

/**
 * Project Skills Component
 *
 * Displays highlighted skills with smart display logic.
 * Context-aware: expandable for cards, all visible for timeline/modal.
 *
 * @example
 * ```tsx
 * // ProjectCard usage (expandable)
 * <ProjectSkills
 *   skills={project.skillsHighlighted}
 *   displayMode="expandable"
 *   onSkillClick={handleSkillClick}
 *   selectedSkill={selectedSkill}
 * />
 *
 * // Timeline/Modal usage (all visible)
 * <ProjectSkills
 *   skills={project.skillsHighlighted}
 *   displayMode="all"
 * />
 * ```
 */
export function ProjectSkills({
  skills,
  displayMode = "expandable",
  initialVisibleCount = 2,
  selectedSkill = null,
  onSkillClick,
  showHeader = true,
  title = "Key Skills",
  className = "",
}: ProjectSkillsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!skills || skills.length === 0) return null;

  const shouldExpand = displayMode === "expandable";
  const displaySkills = shouldExpand && !isExpanded
    ? skills.slice(0, initialVisibleCount)
    : skills;

  const hasMore = skills.length > initialVisibleCount;
  const remainingCount = skills.length - initialVisibleCount;

  return (
    <div className={className}>
      {/* Compact Header with Gradient Lines */}
      {showHeader && <CompactSectionHeader title={title} />}

      {/* Skills Display */}
      <div className={`flex ${isExpanded ? 'flex-wrap' : ''} gap-1 items-center ${isExpanded ? '' : 'overflow-hidden'}`}>
        {displaySkills.map((skill, idx) => (
          <SkillChip
            key={idx}
            skill={skill}
            isSelected={selectedSkill?.toLowerCase() === skill.toLowerCase()}
            onClick={onSkillClick}
          />
        ))}

        {/* Expand/Collapse Button */}
        {shouldExpand && hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[9px] px-1.5 py-0.5 text-secondary-default/80 hover:text-secondary-default transition-colors font-medium whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            {isExpanded ? 'Show less' : `+${remainingCount} more`}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Individual Skill Chip
 */
function SkillChip({
  skill,
  isSelected,
  onClick,
}: {
  skill: string;
  isSelected: boolean;
  onClick?: (skill: string) => void;
}) {
  const isClickable = onClick !== undefined;

  return (
    <button
      type="button"
      onClick={() => onClick?.(skill)}
      disabled={!isClickable}
      className={`text-[9px] px-1.5 py-0.5 rounded bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF]/90 hover:bg-[#00BFFF]/20 transition-colors whitespace-nowrap ${
        isClickable
          ? "cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00BFFF]/50"
          : "cursor-default"
      } ${
        isSelected
          ? "bg-[#00BFFF]/30 border-[#00BFFF]/60 font-semibold"
          : ""
      }`}
      aria-label={isClickable ? `Filter projects by skill: ${skill}` : undefined}
      aria-pressed={isClickable ? isSelected : undefined}
    >
      {skill}
    </button>
  );
}

/**
 * Compact Skills List (No header, for inline use)
 */
export function SkillsList({
  skills,
  selectedSkill,
  onSkillClick,
}: Pick<ProjectSkillsProps, "skills" | "selectedSkill" | "onSkillClick">) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {skills.map((skill, idx) => (
        <SkillChip
          key={idx}
          skill={skill}
          isSelected={selectedSkill?.toLowerCase() === skill.toLowerCase()}
          onClick={onSkillClick}
        />
      ))}
    </div>
  );
}
