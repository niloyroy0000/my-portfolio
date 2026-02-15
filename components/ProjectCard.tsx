"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CSS_ANIMATIONS } from "@/constants";
import { FaGithub, FaEye, FaBuilding } from "@/lib/icons";
import type { Project } from "@/types/api";
import { getPrimaryMetric } from "@/utils/projectHelpers";
import {
  CategoryBadge,
  OpenSourceBadge,
  RecognitionBadge,
  StatusBadgeIcon,
  FeaturedBadge,
  PrimaryMetricBadge,
  CurrentBadge,
  BadgeSeparator,
  BadgeRow,
  TechStack,
  ProjectSkills,
  ProjectTimeline,
} from "@/components/project";

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenModal: (project: Project) => void;
  className?: string;
  onSkillClick?: (skill: string) => void;
  selectedSkill?: string | null;
}


const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onOpenModal,
  className = ""}) => {
  const hasGithubLink = project.github && project.github.trim() !== "";
  const displayImage = project.thumbImage || project.image;
  const staggerClass = index < 5 ? `animate-stagger-${index + 1}` : '';
  const isFeatured = project.isFeatured === true;
  const primaryMetric = getPrimaryMetric(project);

  return (
    <article
      key={project.num}
      data-testid={`project-card-${project.num}`}
      aria-label={`${project.title} - ${project.category} project${isFeatured ? ' (Featured)' : ''}${project.isActive ? ' - Active' : ' - Completed'}`}
      className={`group relative p-5 rounded-xl border transition-all duration-500 flex flex-col justify-between ${className} ${CSS_ANIMATIONS.FADE_IN_UP} ${staggerClass} hover:scale-[1.02] hover:shadow-2xl ${isFeatured
        ? 'bg-gradient-to-br from-purple-500/5 via-gray-800 to-gray-900 border-purple-500/30 shadow-md shadow-purple-500/10 hover:border-purple-500/50 hover:shadow-purple-500/20'
        : 'bg-gradient-to-br from-gray-800 to-gray-900 border-secondary-default/20 hover:border-secondary-default/60 hover:shadow-secondary-default/20'
        }`}
    >
      {/* Project Image */}
      <div
        data-testid={`project-image-${project.num}`}
        className="relative overflow-hidden rounded-lg mb-4 group-hover:shadow-xl transition-all duration-500"
      >
        {project.isActive ? (
          <Link
            href={project.url || project.github}
            target="_blank"
            data-testid={`project-image-link-${project.num}`}
          >
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={displayImage}
                alt={`${project.title} project screenshot`}
                width={500}
                height={300}
                className="rounded-lg transition-all duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
        ) : (
          <Image
            src={displayImage}
            alt={`${project.title} project screenshot`}
            width={500}
            height={300}
            className="rounded-lg opacity-80"
          />
        )}

        {/* Primary Metric Badge - Bottom Left */}
        {primaryMetric && (
          <div className="absolute bottom-2 left-2">
            <PrimaryMetricBadge metric={primaryMetric} />
          </div>
        )}

        {/* Badge Overlay - Top Right Corner - Icons with Tooltips */}
        <div className="absolute top-2 right-2 flex flex-row gap-2 items-center">
          {isFeatured && <FeaturedBadge variant="icon" />}
          {project.isCurrent && <CurrentBadge variant="icon" />}
          <div data-testid={`project-status-${project.isActive ? 'active' : 'inactive'}-${project.num}`}>
            <StatusBadgeIcon
              isActive={project.isActive}
              inactivationReason={project.inactivationReason}
            />
          </div>
        </div>
      </div>

      {/* Project Title */}
      <div className="mb-3">
        <h3
          data-testid={`project-title-${project.num}`}
          className={`font-bold transition-colors duration-300 leading-tight ${isFeatured
            ? 'text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
            : 'text-lg bg-gradient-to-r from-[#00BFFF] to-white bg-clip-text text-transparent'
            }`}
        >
          {project.title}
        </h3>

        {project.subtitle && (
          <p className="text-xs font-light text-[#00BFFF]/80 leading-relaxed mt-2 line-clamp-2">
            {project.subtitle}
          </p>
        )}
      </div>

      {/* Bottom Section - Compact layout */}
      <div className="mt-auto space-y-3">
        {/* Project Metadata - Single Consolidated Badge Row */}
        <div data-testid={`project-badges-${project.num}`}>
          <BadgeRow>
            <span data-testid={`project-category-badge-${project.num}`} className="inline-flex">
              <CategoryBadge category={project.category} />
            </span>

            {(project.isOpenSource || (project.recognition && project.recognition.length > 0)) && (
              <BadgeSeparator />
            )}

            {project.isOpenSource && (
              <span data-testid={`project-opensource-badge-${project.num}`}>
                <OpenSourceBadge variant="icon"  />
              </span>
            )}

            {project.isOpenSource && project.recognition && project.recognition.length > 0 && (
              <BadgeSeparator />
            )}

            {project.recognition && project.recognition.length > 0 && (
              <RecognitionBadge recognitions={project.recognition} />
            )}
          </BadgeRow>
        </div>

        {/* Consolidated Metadata: Company, Role, Timeline */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
          {project.associatedWithCompany && (
            <>
              <span className="flex items-center gap-1">
                <FaBuilding className="text-blue-400" aria-hidden="true" />
                {project.associatedWithCompany}
              </span>
              <span className="text-white/30">•</span>
            </>
          )}
          {project.jobRole && (
            <>
              <span>{project.jobRole}</span>
            </>
          )}
          <ProjectTimeline startDate={project.startDate} endDate={project.endDate} />
        </div>

        {/* Skills Highlighted - Expandable Display */}
        {project.skillsHighlighted && project.skillsHighlighted.length > 0 && (
          <ProjectSkills
            skills={project.skillsHighlighted}
            displayMode="expandable"
          />
        )}

        {/* Tech Stacks - Compact 2-Column List */}
        <div data-testid={`project-tech-stack-${project.num}`}>
          <TechStack
            stacks={project.stacks}
            columns={2}
            expandable
          />
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div
        data-testid={`project-actions-${project.num}`}
        className="flex gap-3 mt-3"
        role="group"
        aria-label={`Actions for ${project.title}`}
      >
        {/* View Details Button */}
        <button
          data-testid={`project-details-button-${project.num}`}
          onClick={() => onOpenModal(project)}
          aria-label={`View details for ${project.title}`}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-secondary-default/10 to-blue-500/10 hover:from-secondary-default/20 hover:to-blue-500/20 border border-secondary-default/30 hover:border-secondary-default/50 text-secondary-default px-4 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary-default/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary-default/50 focus:ring-offset-2 focus:ring-offset-[#27272c]"
        >
          <FaEye className="text-sm" aria-hidden="true" />
          <span>View Details</span>
        </button>

        {/* GitHub Button */}
        {hasGithubLink && (
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`project-github-button-${project.num}`}
            aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 px-4 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#27272c]"
          >
            <FaGithub className="text-base" aria-hidden="true" />
            <span>Source</span>
          </Link>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
