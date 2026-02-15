"use client";

import { motion } from "framer-motion";
import {
  FaRocket,
  FaCode,
  FaCogs,
  FaTh,
  FaClock,
  FaGithub,
  FaChevronDown,
  FaChevronUp,
  FaHistory
} from "@/lib/icons";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProjectModal from "@/components/ProjectModal";
import BackgroundElements from "@/components/BackgroundElements";
import ProjectCard from "@/components/ProjectCard";
import ProjectsFilter from "@/components/ProjectsFilter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PERFORMANCE_VARIANTS } from "@/constants";
import { useCountUp } from "@/hooks/useCountUp";
import ProjectTimeline from "@/components/ProjectTimeline";
import TimelineFilter from "@/components/TimelineFilter";
import EmptyState from "@/components/ui/EmptyState";
import { FaSearch } from "@/lib/icons";
import type { Project } from "@/types/api";
import StatsCards, { type StatCard } from "@/components/StatsCards";

interface ProjectsClientProps {
  projects: Project[];
}

const ProjectsClient = ({ projects }: ProjectsClientProps) => {
  // Environment flags
  const isFilterEnabled = process.env.NEXT_PUBLIC_ENABLE_FILTER !== 'false';

  // Get URL search params and router
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ref to track if we've already processed the ?open parameter
  const hasProcessedOpenParam = useRef(false);

  // Sort projects by num for consistent display order (memoized to prevent infinite re-renders)
  const sortedProjects = useMemo(() => [...projects].sort((a, b) => a.num - b.num), [projects]);

  // Split projects into main and legacy (using isLegacy flag)
  const { mainProjects, legacyProjects } = useMemo(() => {
    const main = sortedProjects.filter(p => !p.isLegacy);
    const legacy = sortedProjects.filter(p => p.isLegacy === true);
    return { mainProjects: main, legacyProjects: legacy };
  }, [sortedProjects]);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(sortedProjects);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [showEarlierProjects, setShowEarlierProjects] = useState(false);

  // Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wasOpenedViaUrlParam, setWasOpenedViaUrlParam] = useState(false);

  // Calculate stats for Grid view (memoized for performance)
  const activeProjects = useMemo(() =>
    projects.filter(p => p.isActive).length,
    [projects]
  );

  const featuredProjects = useMemo(() =>
    projects.filter(p => p.isFeatured),
    [projects]
  );

  const openSourceProjects = useMemo(() =>
    projects.filter(p => p.isOpenSource).length,
    [projects]
  );

  // Animated counters for stats dashboard (Grid view)
  const totalCount = useCountUp({ end: projects.length, duration: 2000 });
  const activeCount = useCountUp({ end: activeProjects, duration: 1900 });
  const featuredCount = useCountUp({ end: featuredProjects.length, duration: 1800, start: 0 });
  const openSourceCount = useCountUp({ end: openSourceProjects, duration: 1900 });

  // Calculate stats for Timeline view (memoized for performance)
  const timelineStats = useMemo(() => {
    const filtered = selectedSkill
      ? filteredProjects.filter(p => p.stacks.includes(selectedSkill))
      : filteredProjects;

    const activeCount = filtered.filter(p => p.isActive).length;
    const featuredCount = filtered.filter(p => p.isFeatured).length;
    const openSourceCount = filtered.filter(p => p.isOpenSource).length;

    return {
      total: filtered.length,
      activeCount,
      featuredCount,
      openSourceCount,
    };
  }, [filteredProjects, selectedSkill]);


  // Modal handlers
  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    // Find the 1-based index in the full sorted list (not filtered)
    const globalIndex = sortedProjects.findIndex(p => p.num === project.num);
    setSelectedProjectIndex(globalIndex !== -1 ? globalIndex + 1 : undefined);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setSelectedProjectIndex(undefined);
    setIsModalOpen(false);

    // If modal was opened via ?open URL parameter, navigate to clean /projects/ URL
    if (wasOpenedViaUrlParam) {
      setWasOpenedViaUrlParam(false);
      router.replace('/projects', { scroll: false });
    }
  };

  // Auto-open modal for hash-based links (e.g., /projects#spirewiz)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Find project by title match (case-insensitive)
        const project = sortedProjects.find(p =>
          p.title.toLowerCase().includes(hash.toLowerCase())
        );
        if (project) {
          openProjectModal(project);
          // Clear hash from URL after opening modal
          window.history.replaceState(null, '', '/projects');
        }
      }
    }
  }, [sortedProjects]);

  // Auto-open modal from URL query parameter (e.g., /projects?open=project_id)
  useEffect(() => {
    const openParam = searchParams?.get('open');

    // Reset the flag if there's no open parameter (allows future uses to work)
    if (!openParam) {
      hasProcessedOpenParam.current = false;
      return;
    }

    // Only process if we haven't already processed this parameter
    if (openParam && sortedProjects.length > 0 && !hasProcessedOpenParam.current) {
      // Find project by _id (exact match)
      const projectToOpen = sortedProjects.find(p => p._id === openParam);

      if (projectToOpen) {
        // Mark as processed BEFORE opening modal to prevent re-triggers
        hasProcessedOpenParam.current = true;

        // Small delay to ensure page is loaded
        const timer = setTimeout(() => {
          // Mark that this modal was opened via URL parameter
          setWasOpenedViaUrlParam(true);
          openProjectModal(projectToOpen);

          // Clear the 'open' parameter from URL to prevent modal from reopening
          const newParams = new URLSearchParams(searchParams?.toString());
          newParams.delete('open');
          const newUrl = newParams.toString() ? `/projects?${newParams.toString()}` : '/projects';
          router.replace(newUrl, { scroll: false });
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, sortedProjects, router]);

  // Handle skill filter
  const handleSkillFilter = (skill: string) => {
    if (selectedSkill === skill) {
      // Clear filter
      setSelectedSkill(null);
      setFilteredProjects(sortedProjects);
    } else {
      // Apply filter
      setSelectedSkill(skill);
      const filtered = sortedProjects.filter(project =>
        project.stacks.some(stack => stack.toLowerCase() === skill.toLowerCase()) ||
        project.skillsHighlighted?.some(s => s.toLowerCase() === skill.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
    // Clear search when filtering by skill
    setSearchQuery("");
  };

  // Split filtered projects into main and legacy
  const filteredMainProjects = useMemo(() => {
    return filteredProjects.filter(p => !p.isLegacy);
  }, [filteredProjects]);

  const filteredLegacyProjects = useMemo(() => {
    return filteredProjects.filter(p => p.isLegacy === true);
  }, [filteredProjects]);

  return (
    <section
      data-testid="projects-page"
      className="min-h-screen relative overflow-hidden py-6"
    >
      {/* Enhanced Background Elements */}
      <BackgroundElements
        floatingDots={[
          {
            size: "md",
            color: "secondary",
            animation: "ping",
            position: { top: "25%", right: "10%" },
            opacity: 60
          },
          {
            size: "sm",
            color: "blue",
            animation: "pulse",
            position: { bottom: "20%", right: "30%" },
            opacity: 40
          }
        ]}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Compact Projects Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
          data-testid="projects-header"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-3xl xl:text-4xl font-bold mb-2 leading-tight bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
                My Projects
              </h1>
              <p className="text-sm font-medium leading-relaxed">
                <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  A showcase of my technical expertise through{" "}
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                  {projects.length}
                </span>
                <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}completed and ongoing projects
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Compact Impact Metrics - Show for Grid View */}
        {viewMode === "grid" && (
          <motion.div
            variants={PERFORMANCE_VARIANTS.containerSync}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <StatsCards
              stats={[
                {
                  icon: FaCode,
                  value: totalCount.count,
                  label: "Total Projects",
                  iconColor: "text-[#00BFFF]",
                  iconBgColor: "bg-[#00BFFF]/20",
                  valueGradient: "from-[#00BFFF] to-[#0080FF]",
                  ref: totalCount.ref
                },
                {
                  icon: FaClock,
                  value: activeCount.count,
                  label: "Active",
                  iconColor: "text-emerald-400",
                  iconBgColor: "bg-emerald-500/20",
                  valueGradient: "from-emerald-400 to-cyan-500",
                  ref: activeCount.ref
                },
                {
                  icon: FaRocket,
                  value: featuredCount.count,
                  label: "Featured",
                  iconColor: "text-purple-400",
                  iconBgColor: "bg-purple-500/20",
                  valueGradient: "from-purple-400 to-pink-500",
                  ref: featuredCount.ref
                },
                {
                  icon: FaGithub,
                  value: openSourceCount.count,
                  label: "Open Source",
                  iconColor: "text-blue-400",
                  iconBgColor: "bg-blue-500/20",
                  valueGradient: "from-blue-400 to-secondary-default",
                  ref: openSourceCount.ref
                }
              ]}
              showDividers={true}
            />
          </motion.div>
        )}

        {/* Compact Impact Metrics - Show for Timeline View */}
        {viewMode === "timeline" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <StatsCards
              stats={[
                {
                  icon: FaCode,
                  value: timelineStats.total,
                  label: "Total Projects",
                  iconColor: "text-[#00BFFF]",
                  iconBgColor: "bg-[#00BFFF]/20",
                  valueGradient: "from-[#00BFFF] to-[#0080FF]"
                },
                {
                  icon: FaClock,
                  value: timelineStats.activeCount,
                  label: "Active",
                  iconColor: "text-emerald-400",
                  iconBgColor: "bg-emerald-500/20",
                  valueGradient: "from-emerald-400 to-cyan-500"
                },
                {
                  icon: FaRocket,
                  value: timelineStats.featuredCount,
                  label: "Featured",
                  iconColor: "text-purple-400",
                  iconBgColor: "bg-purple-500/20",
                  valueGradient: "from-purple-400 to-pink-500"
                },
                {
                  icon: FaGithub,
                  value: timelineStats.openSourceCount,
                  label: "Open Source",
                  iconColor: "text-blue-400",
                  iconBgColor: "bg-blue-500/20",
                  valueGradient: "from-blue-400 to-secondary-default"
                }
              ]}
              showDividers={true}
            />
          </motion.div>
        )}

        {/* Unified Toolbar: View Toggle + Search/Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-gradient-to-br from-gray-900/70 to-gray-950/70 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-3 mb-6 shadow-md z-[110]"
          data-testid="projects-toolbar"
        >
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            {/* View Mode Toggle - Compact */}
            <div className="grid grid-cols-2 sm:flex gap-2 shrink-0">
              <button
                data-testid="view-mode-grid"
                onClick={() => setViewMode("grid")}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-secondary-default to-blue-500 text-white shadow-md"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <FaTh className="text-xs" />
                Grid
              </button>
              <button
                data-testid="view-mode-timeline"
                onClick={() => setViewMode("timeline")}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  viewMode === "timeline"
                    ? "bg-gradient-to-r from-secondary-default to-blue-500 text-white shadow-md"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <FaClock className="text-xs" />
                Timeline
              </button>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-white/10"></div>

            {/* Search and Filter - Integrated for Grid View */}
            {isFilterEnabled && viewMode === "grid" && (
              <div className="flex-1">
                <ProjectsFilter
                  projects={sortedProjects}
                  onFilterChange={setFilteredProjects}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  resultsInfo={{
                    filtered: filteredProjects.length,
                    total: sortedProjects.length,
                    description: "projects"
                  }}
                />
              </div>
            )}

            {/* Timeline Filters - Integrated for Timeline View */}
            {viewMode === "timeline" && (
              <TimelineFilter
                selectedSkill={selectedSkill}
                onSkillChange={setSelectedSkill}
                projects={sortedProjects}
              />
            )}
          </div>
        </motion.div>

        {/* Timeline View */}
        {viewMode === "timeline" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            data-testid="timeline-view"
          >
            <ProjectTimeline
              projects={sortedProjects}
              selectedTech={selectedSkill}
              onOpenModal={openProjectModal}
            />
          </motion.div>
        )}

        {/* Grid View Content */}
        {viewMode === "grid" && (
          <>
        {/* Active Filter Indicator */}
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-blue-500/10 border border-emerald-500/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 flex-1">
              <FaCogs className="text-emerald-400 text-lg" />
              <span className="text-white font-medium">
                Filtered by skill:
              </span>
              <span className="bg-gradient-to-r from-emerald-500/30 to-purple-500/30 text-white px-3 py-1 rounded-md font-bold border border-emerald-400/50">
                {selectedSkill}
              </span>
              <span className="text-white/60 text-sm">
                ({filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'})
              </span>
            </div>
            <button
              onClick={() => handleSkillFilter(selectedSkill)}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all duration-200 border border-red-500/40 hover:border-red-500/60"
            >
              <span className="text-sm font-medium">Clear Filter</span>
            </button>
          </motion.div>
        )}

        {/* Main Projects Grid */}
        <ErrorBoundary section="projects">
          <div
            data-testid="projects-grid"
            className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredMainProjects.map((project, index) => (
              <ProjectCard
                key={project.num}
                project={project}
                index={index}
                onOpenModal={openProjectModal}
                onSkillClick={handleSkillFilter}
                selectedSkill={selectedSkill}
              />
            ))}
          </div>
        </ErrorBoundary>

        {/* Other Projects Section - Collapsible */}
        {filteredLegacyProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <button
              onClick={() => setShowEarlierProjects(!showEarlierProjects)}
              className="w-full flex items-center justify-between bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-white/10 hover:border-white/20 rounded-lg p-4 transition-all duration-300 group"
              aria-expanded={showEarlierProjects}
              aria-controls="other-projects-section"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  <FaHistory className="text-white/60 text-lg" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-white/80">
                    Other Projects
                  </h2>
                  <p className="text-sm text-white/50">
                    {filteredLegacyProjects.length} additional project{filteredLegacyProjects.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-sm hidden sm:inline">
                  {showEarlierProjects ? 'Hide' : 'Show'}
                </span>
                {showEarlierProjects ? (
                  <FaChevronUp className="text-sm" aria-hidden="true" />
                ) : (
                  <FaChevronDown className="text-sm" aria-hidden="true" />
                )}
              </div>
            </button>

            {/* Other Projects Grid */}
            {showEarlierProjects && (
              <motion.div
                id="other-projects-section"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredLegacyProjects.map((project, index) => (
                    <ProjectCard
                      key={project.num}
                      project={project}
                      index={index}
                      onOpenModal={openProjectModal}
                      onSkillClick={handleSkillFilter}
                      selectedSkill={selectedSkill}
                      className="opacity-90 hover:opacity-100"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Show when no projects match the filter */}
        {filteredProjects.length === 0 && (
          <div data-testid="projects-no-results">
            <EmptyState
              icon={FaSearch}
              title="No projects found"
              description="Try adjusting your search or filter criteria to find what you're looking for."
              action={{
                label: "Clear Filters",
                onClick: () => {
                  setSearchQuery("");
                  setSelectedSkill(null);
                  setFilteredProjects(projects);
                },
              }}
            />
          </div>
        )}
          </>
        )}

        {/* Project Details Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={closeProjectModal}
          displayIndex={selectedProjectIndex}
          wasOpenedViaUrlParam={wasOpenedViaUrlParam}
        />
      </div>
    </section>
  );
};

export default ProjectsClient;
