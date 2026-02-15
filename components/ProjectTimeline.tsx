"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaEye, FaBuilding } from "@/lib/icons";
import type { Project } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { getPrimaryMetric } from "@/utils/projectHelpers";
import {
  CategoryBadge,
  OpenSourceBadge,
  RecognitionBadge,
  StatusBadge,
  FeaturedBadge,
  PrimaryMetricBadge,
  CurrentBadge,
  BadgeSeparator,
  BadgeRow,
  TechStack,
  ProjectSkills,
  ProjectTimeline as Timeline,
} from "@/components/project";


interface ProjectTimelineProps {
  projects: Project[];
  selectedTech?: string | null;
  onOpenModal?: (project: Project) => void;
}

export default function ProjectTimeline({ projects, selectedTech, onOpenModal }: ProjectTimelineProps) {
  // Process projects for timeline
  const timelineProjects = useMemo(() => {
    return projects.map((project) => {
      const startDate = typeof project.startDate === 'string' ? new Date(project.startDate) : project.startDate;
      const endDate = project.endDate
        ? (typeof project.endDate === 'string' ? new Date(project.endDate) : project.endDate)
        : new Date(); // Use current date for ongoing projects

      const durationMonths = Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const yearRange = startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;

      return {
        ...project,
        durationMonths,
        yearRange,
      };
    }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); // Most recent first
  }, [projects]);

  // Filter projects based on selected technology
  const filteredProjects = useMemo(() => {
    if (!selectedTech) return timelineProjects;
    return timelineProjects.filter((p) => p.stacks.includes(selectedTech));
  }, [timelineProjects, selectedTech]);


  return (
    <div className="space-y-6" data-testid="project-timeline">
      {/* Results Summary */}
      {selectedTech && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-white/60">
            Showing {filteredProjects.length} of {timelineProjects.length} projects with <span className="text-secondary-default font-semibold">{selectedTech}</span>
          </p>
        </div>
      )}

      {/* Timeline View */}
      <div className="relative">
        {/* Timeline Line - Hidden on mobile, visible on md+ - Purple at top, fades to transparent at bottom */}
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-transparent" />

        {/* Timeline Items */}
        <div className="space-y-6">
          {filteredProjects.map((project, index) => {
            const isFeatured = project.isFeatured === true;
            const primaryMetric = getPrimaryMetric(project);

            return (
              <motion.div
                key={project.num}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative md:pl-20"
                data-testid={`timeline-project-${project.num}`}
              >
                {/* Timeline Dot - Hidden on mobile */}
                <div className="hidden md:block absolute left-6 top-6 w-5 h-5 rounded-full bg-gradient-to-br from-secondary-default to-blue-500 border-4 border-[#1a1a1f] shadow-lg shadow-secondary-default/30" />

                {/* Project Card - Matching ProjectCard design */}
                <div
                  className={`group relative p-5 rounded-xl border transition-all duration-500 hover:shadow-2xl ${
                    isFeatured
                      ? 'bg-gradient-to-br from-purple-500/5 via-[#27272c] to-[#2a2a30] border-purple-500/30 shadow-md shadow-purple-500/10 hover:border-purple-500/50 hover:shadow-purple-500/20'
                      : 'bg-gradient-to-br from-[#27272c] to-[#2a2a30] border-secondary-default/20 hover:border-secondary-default/60 hover:shadow-secondary-default/20'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Project Image */}
                    <div className="relative w-full md:w-32 h-32 flex-shrink-0 group-hover:shadow-xl transition-all duration-500">
                      <div className="absolute inset-0 rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-secondary-default/10 to-transparent">
                        <Image
                          src={project.thumbImage || project.image}
                          alt={`${project.title} project screenshot`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 128px"
                        />
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      {/* Header: Title + Status in One Row */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-bold transition-colors duration-300 ${
                            isFeatured
                              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                              : 'bg-gradient-to-r from-[#00BFFF] to-white bg-clip-text text-transparent'
                          }`}>
                            {project.title}
                          </h3>
                        </div>

                        {/* Status Badge - Always visible, right side */}
                        <div className="flex-shrink-0">
                          <StatusBadge
                            isActive={project.isActive}
                            inactivationReason={project.inactivationReason}
                          />
                        </div>
                      </div>

                      {/* Subtitle */}
                      {project.subtitle && (
                        <p className="text-xs font-light text-[#00BFFF]/80 leading-relaxed mb-2 line-clamp-2">
                          {project.subtitle}
                        </p>
                      )}

                      {/* Compact Badge Row - Category + Features */}
                      <div className="mb-3">
                        <BadgeRow>
                          <CategoryBadge category={project.category} />

                          {(project.isOpenSource || project.isCurrent || (project.recognition && project.recognition.length > 0) || isFeatured || primaryMetric) && (
                            <BadgeSeparator />
                          )}

                          {project.isOpenSource && (
                            <>
                              <OpenSourceBadge variant="icon" />
                              <BadgeSeparator />
                            </>
                          )}

                          {project.isCurrent && (
                            <>
                              <CurrentBadge variant="text" />
                              <BadgeSeparator />
                            </>
                          )}

                          {project.recognition && project.recognition.length > 0 && (
                            <>
                              <RecognitionBadge recognitions={project.recognition} />
                              <BadgeSeparator />
                            </>
                          )}

                          {isFeatured && (
                            <>
                              <FeaturedBadge variant="text" />
                              <BadgeSeparator />
                            </>
                          )}

                          {primaryMetric && (
                            <PrimaryMetricBadge metric={primaryMetric} lightMode />
                          )}
                        </BadgeRow>
                      </div>

                      {/* Consolidated Metadata: Company, Role, Timeline */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/70 mb-3">
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
                            <span className="text-white/30">•</span>
                          </>
                        )}
                        <Timeline startDate={project.startDate} endDate={project.endDate} />
                      </div>

                      {/* Skills Highlighted - Show All Skills */}
                      {project.skillsHighlighted && project.skillsHighlighted.length > 0 && (
                        <ProjectSkills
                          skills={project.skillsHighlighted}
                          displayMode="all"
                          className="mb-3"
                        />
                      )}

                       {/* Tech Stacks - Expandable with 3 columns */}
                       <TechStack
                         stacks={project.stacks}
                         columns={3}
                         expandable
                         className="mb-3"
                       />

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2 border-t border-white/10">
                        {/* View Details Button */}
                        {onOpenModal && (
                          <button
                            onClick={() => onOpenModal(project)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-secondary-default/10 to-blue-500/10 hover:from-secondary-default/20 hover:to-blue-500/20 border border-secondary-default/30 hover:border-secondary-default/50 text-secondary-default px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary-default/20 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-secondary-default/50 focus:ring-offset-2 focus:ring-offset-[#27272c]"
                          >
                            <FaEye className="text-sm" />
                            <span>View Details</span>
                          </button>
                        )}

                        {/* GitHub Button */}
                        {project.github && project.github.trim() !== "" && (
                          <Link
                            href={project.github}
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#27272c]"
                          >
                            <FaGithub className="text-sm" />
                            <span>Source</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
