"use client";

import React from "react";
import Link from "next/link";
import { FaExternalLinkAlt } from "@/lib/icons";
import {
  CategoryBadge,
  StatusBadge,
  CurrentBadge,
} from "@/components/project";
import type { Project } from "@/types/api";

interface ProjectModalBadgesProps {
  project: Project;
  variant: "desktop" | "mobile";
}

/**
 * ProjectModalBadges - Displays project badges (category, status, current, live link)
 * Extracted from ProjectModal.tsx to reduce duplication
 *
 * Variants:
 * - desktop: Hidden on mobile (sm:flex), inline with separator
 * - mobile: Shown only on mobile (flex sm:hidden), wrapped layout
 */
const ProjectModalBadges: React.FC<ProjectModalBadgesProps> = ({ project, variant }) => {
  const containerClasses = variant === "desktop"
    ? "hidden sm:flex items-center gap-2"
    : "flex sm:hidden flex-wrap items-center gap-2 mt-2";

  const liveButtonClasses = variant === "desktop"
    ? "h-5 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-secondary-default to-blue-500 text-white px-3 rounded-md text-xs font-bold hover:shadow-lg transition-all duration-200"
    : "h-5 inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-gradient-to-r from-secondary-default to-blue-500 text-white px-2 sm:px-3 rounded-md text-xs font-bold hover:shadow-lg transition-all duration-200";

  return (
    <div className={containerClasses}>
      <CategoryBadge category={project.category} />
      <StatusBadge
        isActive={project.isActive}
        inactivationReason={project.inactivationReason ?? undefined}
      />
      {project.isCurrent && <CurrentBadge variant="text" />}

      {project.url && project.url.trim() !== "" && (
        <>
          {variant === "desktop" && <span className="text-white/30 mx-1">|</span>}
          <Link
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={liveButtonClasses}
            aria-label="View live project"
          >
            <FaExternalLinkAlt className="text-[10px]" aria-hidden="true" />
            <span>Live</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ProjectModalBadges;
