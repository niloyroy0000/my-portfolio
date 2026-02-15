"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaLightbulb,
  FaChartLine,
  FaCode,
  FaBriefcase,
  FaTrophy,
  FaQuoteLeft,
  FaCogs,
  FaArrowUp,
  FaUsers,
  FaChartBar,
  FaClipboardList,
  FaClock,
  FaCodeBranch,
  FaBook,
  FaBuilding,
  FaDownload,
  FaStar,
  FaTachometerAlt,
  FaRocket,
} from "@/lib/icons";
import { FiLayers } from "@/lib/icons";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Project } from "@/types/api";
import { useEffect, useRef, useId, useState } from "react";

// Lazy load MermaidDiagram - large dependency (~500KB)
const MermaidDiagram = dynamic(() => import("@/components/MermaidDiagram"), {
  loading: () => (
    <div className="flex items-center justify-center h-48 bg-white/5 rounded-lg">
      <div className="text-white/40 text-sm">Loading diagram...</div>
    </div>
  ),
  ssr: false,
});
import { getPrimaryMetric } from "@/utils/projectHelpers";
import {
  CategoryBadge,
  StatusBadge,
  PrimaryMetricBadge,
  TechStack,
  ProjectTimeline,
  CompanyIcon,
  CurrentBadge,
} from "@/components/project";
import ProjectModalBadges from "@/components/project/ProjectModalBadges";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  /** Display index (1-based position in the list). If not provided, uses project.num */
  displayIndex?: number;
  /** Track if modal was opened via ?open URL parameter */
  wasOpenedViaUrlParam?: boolean;
}


const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalTitleId = useId();
  const [showAdditionalMetrics, setShowAdditionalMetrics] = useState(false);

  // Focus management - focus close button when modal opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Focus trap - prevent tabbing outside modal
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const handleTabKey = (e: KeyboardEvent) => {
      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Get primary metric using centralized utility - only if project exists
  const primaryMetric = project ? getPrimaryMetric(project) : null;

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-2 pt-16 pb-4 sm:p-4 md:pt-20 md:pb-8"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          aria-hidden="true"
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
            className={`backdrop-blur-xl rounded-lg sm:rounded-2xl w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-160px)] overflow-hidden shadow-2xl flex flex-col ${project.isFeatured
                ? "bg-gradient-to-br from-purple-900/30 via-gray-900/95 to-blue-900/30 border border-purple-500/30 shadow-purple-500/20"
                : "bg-gradient-to-br from-gray-900/95 to-gray-950/95 border border-secondary-default/30 shadow-secondary-default/20"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Simplified Modal Header */}
            <div className="relative px-3 py-2 sm:px-4 sm:py-3 border-b border-secondary-default/20 bg-gradient-to-r from-secondary-default/5 via-transparent to-secondary-default/5 flex-shrink-0">
              {/* Row 1: Company Icon + Title | Badges (Desktop) | Close Button */}
              <div className="flex items-center justify-between gap-2 sm:gap-4 mb-0">
                {/* Left: Company Icon + Title */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {project.associatedWithCompany && (
                    <div className="flex-shrink-0">
                      <CompanyIcon company={project.associatedWithCompany} />
                    </div>
                  )}
                  <h2 id={modalTitleId} className={`text-base sm:text-lg md:text-xl font-bold truncate ${project.isFeatured
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-[#00BFFF] to-emerald-400 bg-clip-text text-transparent'
                    }`}>
                    {project.title}
                  </h2>
                </div>

                {/* Right: Badges (Desktop Only) + Close Button */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {/* Desktop Badges - Hidden on Mobile */}
                  <ProjectModalBadges project={project} variant="desktop" />

                  {/* Close Button - Always Visible */}
                  <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white/60 hover:text-white bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-all duration-200 rounded-lg flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                    aria-label="Close project details (Press Escape)"
                  >
                    <FaTimes className="text-sm" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Row 2: Subtitle */}
              {project.subtitle && (
                <p className="text-xs sm:text-sm text-[#00BFFF]/80 leading-relaxed mt-1">
                  {project.subtitle}
                </p>
              )}

              {/* Row 3: Badge Row - Mobile Only (Below Subtitle) */}
              <ProjectModalBadges project={project} variant="mobile" />
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                {/* Project Image - Enhanced with Decorative Elements */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-secondary-default/20 shadow-lg shadow-secondary-default/20">
                  {/* Decorative Background Pattern */}
                  <div className="absolute inset-0 opacity-5" aria-hidden="true">
                    <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-secondary-default rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-secondary-default rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-secondary-default rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-secondary-default rounded-br-xl"></div>
                  </div>

                  {/* Colored Shadow Glow on Sides */}
                  <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-secondary-default/20 via-secondary-default/10 to-transparent blur-2xl pointer-events-none" aria-hidden="true"></div>
                  <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blue-500/20 via-purple-500/10 to-transparent blur-2xl pointer-events-none" aria-hidden="true"></div>

                  {/* Gradient Overlays on Sides */}
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-900/40 to-transparent pointer-events-none" aria-hidden="true"></div>
                  <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-900/40 to-transparent pointer-events-none" aria-hidden="true"></div>

                  {/* Image Container */}
                  <div className="relative w-full h-48 sm:h-56 md:h-72 lg:h-80 xl:h-96">
                    <Image
                      src={project.image}
                      alt={`${project.title} project screenshot`}
                      fill
                      className="object-contain rounded-xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    />
                  </div>

                  {/* Decorative Dots Pattern */}
                  <div className="absolute top-4 left-4 grid grid-cols-2 gap-1 opacity-20" aria-hidden="true">
                    <div className="w-1 h-1 rounded-full bg-secondary-default"></div>
                    <div className="w-1 h-1 rounded-full bg-secondary-default"></div>
                    <div className="w-1 h-1 rounded-full bg-secondary-default"></div>
                    <div className="w-1 h-1 rounded-full bg-secondary-default"></div>
                  </div>
                  <div className="absolute top-4 right-4 grid grid-cols-2 gap-1 opacity-20" aria-hidden="true">
                    <div className="w-1 h-1 rounded-full bg-secondary-default"></div>
                    <div className="w-1 h-1 rounded-full bg-secondary-default"></div>
                    <div className="w-1 h-1 rounded-full bg-secondary-default"></div>
                    <div className="w-1 h-1 rounded-full bg-secondary-default"></div>
                  </div>

                  {/* Primary Metric Badge */}
                  {primaryMetric && (
                    <div className="absolute bottom-3 left-3 z-10">
                      <PrimaryMetricBadge metric={primaryMetric} variant="modal" />
                    </div>
                  )}
                </div>

                {/* Project Metadata - Enhanced Card Layout with Watermarks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {/* Company */}
                  {project.associatedWithCompany && (
                    <div className="relative bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3 overflow-hidden">
                      {/* Watermark */}
                      <FaBuilding className="absolute -right-2 -bottom-2 text-blue-500/10 text-5xl sm:text-6xl pointer-events-none" aria-hidden="true" />
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 relative z-10">
                        <FaBuilding className="text-blue-400 text-sm sm:text-lg" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1 relative z-10">
                        <p className="text-[10px] sm:text-xs text-white/50 mb-0.5">Company</p>
                        <p className="text-xs sm:text-sm font-semibold text-white truncate">{project.associatedWithCompany}</p>
                      </div>
                    </div>
                  )}

                  {/* Role */}
                  {project.jobRole && (
                    <div className="relative bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3 overflow-hidden">
                      {/* Watermark */}
                      <FaBriefcase className="absolute -right-2 -bottom-2 text-purple-500/10 text-5xl sm:text-6xl pointer-events-none" aria-hidden="true" />
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 relative z-10">
                        <FaBriefcase className="text-purple-400 text-sm sm:text-lg" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1 relative z-10">
                        <p className="text-[10px] sm:text-xs text-white/50 mb-0.5">Role</p>
                        <p className="text-xs sm:text-sm font-semibold text-white truncate">{project.jobRole}</p>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="relative bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-500/20 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3 overflow-hidden">
                    {/* Watermark */}
                    <FaClock className="absolute -right-2 -bottom-2 text-cyan-500/10 text-5xl sm:text-6xl pointer-events-none" aria-hidden="true" />
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 relative z-10">
                      <FaClock className="text-cyan-400 text-sm sm:text-lg" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 relative z-10">
                      <p className="text-[10px] sm:text-xs text-white/50 mb-0.5">Duration</p>
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        <ProjectTimeline startDate={project.startDate} endDate={project.endDate} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-secondary-default/30 to-transparent" />

                {/* Project Overview */}
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-secondary-default text-sm sm:text-base md:text-lg" />
                    Project Overview
                  </h3>
                  <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
                    <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                      {project.longDescription || project.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Key Skills */}
                {project.skillsHighlighted && project.skillsHighlighted.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                      <FaCode className="text-blue-400 text-sm sm:text-base md:text-lg" />
                      Key Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.skillsHighlighted.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF]/90"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Responsibilities & Achievements */}
                {project.responsibilities && project.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                      <FaBriefcase className="text-emerald-400 text-sm sm:text-base md:text-lg" />
                      Key Responsibilities & Achievements
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
                      <ul className="space-y-1.5 sm:space-y-2">
                        {project.responsibilities.map((responsibility, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-white/80 text-sm sm:text-base"
                          >
                            <span className="text-emerald-400 mt-0.5 sm:mt-1">▸</span>
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Impact & Metrics - Original Style with Integrated Achievements */}
                {(project.metrics && Object.keys(project.metrics).length > 0 && Object.values(project.metrics).some(v => v && v.toString().trim() !== '')) ||
                  (project.recognition && project.recognition.filter(r => r.approved !== false).length > 0) ? (
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-5 flex items-center gap-2">
                      <FaChartLine className="text-secondary-default text-sm sm:text-base md:text-lg" />
                      Impact & Metrics
                    </h3>

                    {/* Main Metrics Cards */}
                    {project.metrics && Object.keys(project.metrics).length > 0 && (
                      <>
                        {(() => {
                          // Separate "other" array from regular metrics
                          const metricsObj = project.metrics;
                          const otherArray = Array.isArray(metricsObj.other) ? metricsObj.other : [];

                          // Get main metrics (excluding "other" key and empty values)
                          const mainMetrics: Array<[string, string]> = [];
                          Object.entries(project.metrics)
                            .filter(([key, value]) =>
                              key !== 'other' &&
                              value &&
                              typeof value === 'string' &&
                              value.toString().trim() !== ''
                            )
                            .forEach(([key, value]) => {
                              mainMetrics.push([key, value.toString()]);
                            });

                          return (
                            <>
                              {/* Main Metrics Grid */}
                              {mainMetrics.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                                  {mainMetrics.map(([key, value]) => {
                                    const valueStr = value.toString();
                                    // Match percentage ranges like "70-80%" or single percentages
                                    const percentRangeMatch = valueStr.match(/(\d+)-(\d+)%/);
                                    const singlePercentMatch = valueStr.match(/(\d+)%/);
                                    const hasPercentage = percentRangeMatch !== null || singlePercentMatch !== null;
                                    // Use the higher value in a range, or the single value
                                    const percentValue = percentRangeMatch
                                      ? parseInt(percentRangeMatch[2])
                                      : singlePercentMatch
                                        ? parseInt(singlePercentMatch[1])
                                        : 0;

                                    // Extract numeric values for non-percentage metrics
                                    const extractNumericValue = (str: string): number => {
                                      const rangeMatch = str.match(/(\d+)-(\d+)/);
                                      const plusMatch = str.match(/(\d+)\+/);
                                      const singleMatch = str.match(/(\d+)/);

                                      if (rangeMatch) return parseInt(rangeMatch[2]); // Use higher value
                                      if (plusMatch) return parseInt(plusMatch[1]);
                                      if (singleMatch) return parseInt(singleMatch[1]);
                                      return 0;
                                    };

                                    const numericValue = extractNumericValue(valueStr);
                                    const hasNumericValue = numericValue > 0 && !hasPercentage;

                                    const keyLower = key.toLowerCase();
                                    const isRevenue = keyLower.includes('revenue') || keyLower.includes('cost') || keyLower.includes('sales') || keyLower.includes('gain');
                                    const isDownload = keyLower.includes('download');
                                    const isStar = keyLower.includes('star') || keyLower.includes('rating');
                                    const isEfficiency = keyLower.includes('efficiency') || keyLower.includes('optimization');
                                    const isPerformance = keyLower.includes('performance') || keyLower.includes('speed');
                                    const isTime = keyLower.includes('time') || keyLower.includes('hour') || keyLower.includes('duration');
                                    const isUser = keyLower.includes('user') || keyLower.includes('customer') || keyLower.includes('client');

                                    let gradientClass = 'from-gray-900/40 via-gray-800/30 to-gray-900/40';
                                    let borderClass = 'border-gray-500/30';
                                    let iconColorClass = 'text-gray-500/10';
                                    let Icon = FaChartBar;

                                    if (isRevenue) {
                                      gradientClass = 'from-emerald-900/40 via-emerald-800/30 to-emerald-900/40';
                                      borderClass = 'border-emerald-500/30';
                                      iconColorClass = 'text-emerald-500/10';
                                      Icon = FaChartLine;
                                    } else if (isDownload) {
                                      gradientClass = 'from-purple-900/40 via-purple-800/30 to-purple-900/40';
                                      borderClass = 'border-purple-500/30';
                                      iconColorClass = 'text-purple-500/10';
                                      Icon = FaDownload;
                                    } else if (isStar) {
                                      gradientClass = 'from-amber-900/40 via-amber-800/30 to-amber-900/40';
                                      borderClass = 'border-amber-500/30';
                                      iconColorClass = 'text-amber-500/10';
                                      Icon = FaStar;
                                    } else if (isEfficiency) {
                                      gradientClass = 'from-blue-900/40 via-blue-800/30 to-blue-900/40';
                                      borderClass = 'border-blue-500/30';
                                      iconColorClass = 'text-blue-500/10';
                                      Icon = FaTachometerAlt;
                                    } else if (isPerformance) {
                                      gradientClass = 'from-indigo-900/40 via-indigo-800/30 to-indigo-900/40';
                                      borderClass = 'border-indigo-500/30';
                                      iconColorClass = 'text-indigo-500/10';
                                      Icon = FaRocket;
                                    } else if (isTime) {
                                      gradientClass = 'from-blue-900/40 via-blue-800/30 to-blue-900/40';
                                      borderClass = 'border-blue-500/30';
                                      iconColorClass = 'text-blue-500/10';
                                      Icon = FaClock;
                                    } else if (isUser) {
                                      gradientClass = 'from-cyan-900/40 via-cyan-800/30 to-cyan-900/40';
                                      borderClass = 'border-cyan-500/30';
                                      iconColorClass = 'text-cyan-500/10';
                                      Icon = FaUsers;
                                    }

                                    return (
                                      <div
                                        key={key}
                                        className={`relative bg-gradient-to-br ${gradientClass} border ${borderClass} rounded-lg sm:rounded-xl p-3 sm:p-4 overflow-hidden`}
                                      >
                                        {/* Watermark Icon */}
                                        <Icon className={`absolute -right-2 -bottom-2 text-5xl sm:text-6xl pointer-events-none ${iconColorClass}`} aria-hidden="true" />

                                        {/* Icon & Label */}
                                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 relative z-10">
                                          <Icon className="text-secondary-default text-xs sm:text-sm" />
                                          <span className="text-[10px] sm:text-xs text-white/70">
                                            {key.replace(/_/g, ' ')}
                                          </span>
                                        </div>

                                        {/* Value */}
                                        <div className="text-xs sm:text-sm font-bold text-white mb-1.5 sm:mb-2 relative z-10">
                                          {valueStr}
                                        </div>

                                        {/* Visual Indicators - Different for each metric type */}

                                        {/* Percentage-based: Simple Improvement Bar */}
                                        {hasPercentage && (
                                          <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-1">
                                              <FaArrowUp className="text-emerald-400 text-[10px]" />
                                              <span className="text-emerald-400 text-xs font-semibold">{percentValue}% improvement</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                              <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-lg shadow-emerald-500/50"
                                                style={{ width: `${percentValue}%` }}
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {/* Downloads: Download Count Indicator */}
                                        {isDownload && hasNumericValue && (
                                          <div className="mt-2 relative z-10">
                                            <div className="flex items-center gap-2">
                                              <FaDownload className="text-purple-400 text-xs flex-shrink-0" aria-hidden="true" />
                                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
                                                  style={{ width: `${Math.min((numericValue / 1000) * 100, 100)}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] text-purple-400 font-semibold">{numericValue}+</span>
                                            </div>
                                          </div>
                                        )}

                                        {/* Stars: Star Rating Indicator */}
                                        {isStar && hasNumericValue && (
                                          <div className="mt-2 relative z-10">
                                            <div className="flex items-center gap-2">
                                              <FaStar className="text-amber-400 text-xs flex-shrink-0" aria-hidden="true" />
                                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/50"
                                                  style={{ width: `${Math.min((numericValue / 100) * 100, 100)}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] text-amber-400 font-semibold">{numericValue}</span>
                                            </div>
                                          </div>
                                        )}

                                        {/* Efficiency: Optimization Indicator */}
                                        {isEfficiency && hasNumericValue && (
                                          <div className="mt-2 relative z-10">
                                            <div className="flex items-center gap-2">
                                              <FaTachometerAlt className="text-blue-400 text-xs flex-shrink-0" aria-hidden="true" />
                                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50"
                                                  style={{ width: `${Math.min((numericValue / 100) * 100, 100)}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] text-blue-400 font-semibold">{numericValue}%</span>
                                            </div>
                                          </div>
                                        )}

                                        {/* Users/Clients: User Count Progress Bar */}
                                        {isUser && hasNumericValue && (
                                          <div className="mt-2 relative z-10">
                                            <div className="flex items-center gap-2">
                                              <FaUsers className="text-cyan-400 text-xs flex-shrink-0" aria-hidden="true" />
                                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50"
                                                  style={{ width: `${Math.min((numericValue / 50) * 100, 100)}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] text-cyan-400 font-semibold">{numericValue}+</span>
                                            </div>
                                          </div>
                                        )}

                                        {/* Performance: Speed Indicator */}
                                        {isPerformance && hasNumericValue && (
                                          <div className="mt-2 relative z-10">
                                            <div className="flex items-center gap-2">
                                              <FaRocket className="text-indigo-400 text-xs flex-shrink-0" aria-hidden="true" />
                                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50"
                                                  style={{ width: `${Math.min((numericValue / 100) * 100, 100)}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] text-indigo-400 font-semibold">{numericValue}</span>
                                            </div>
                                          </div>
                                        )}

                                        {/* Time: Time-Saving Indicator */}
                                        {isTime && hasNumericValue && (
                                          <div className="mt-2 relative z-10">
                                            <div className="flex items-center gap-2">
                                              <FaClock className="text-blue-400 text-xs flex-shrink-0" aria-hidden="true" />
                                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50"
                                                  style={{ width: `${Math.min((numericValue / 40) * 100, 100)}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] text-blue-400 font-semibold">{numericValue}h</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Supporting Metrics - Integrated Subset */}
                              {otherArray.length > 0 && (
                                <div className="border border-white/10 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => setShowAdditionalMetrics(!showAdditionalMetrics)}
                                    className="w-full flex items-center justify-between bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:from-gray-800/50 hover:to-gray-900/50 p-3 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FaChartBar className="text-secondary-default text-sm" />
                                      <span className="text-sm font-semibold text-white">Supporting Metrics</span>
                                      <span className="text-xs text-white/50">({otherArray.length} items)</span>
                                    </div>
                                    <motion.div
                                      animate={{ rotate: showAdditionalMetrics ? 180 : 0 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </motion.div>
                                  </button>

                                  {showAdditionalMetrics && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="border-t border-white/10 p-4 bg-gradient-to-br from-gray-800/30 to-gray-900/30"
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {otherArray.map((achievement: string, idx: number) => (
                                          <div
                                            key={idx}
                                            className="flex items-start gap-2 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/40 rounded-lg p-3"
                                          >
                                            <FaClipboardList className="text-secondary-default text-xs mt-0.5 flex-shrink-0" />
                                            <p className="text-white/80 text-xs leading-relaxed">
                                              {achievement}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </>
                    )}

                    {/* Recognition & Accolades - Separate Section */}
                    {project.recognition && project.recognition.filter(r => r.approved !== false).length > 0 && (
                      <>
                        {/* Separator */}
                        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent my-3 sm:my-4 md:my-6" />

                        <div>
                          <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                            <FaTrophy className="text-secondary-default text-sm sm:text-base" />
                            Accolades
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                            {project.recognition.filter(r => r.approved !== false).map((rec, idx) => (
                              <div
                                key={idx}
                                className="bg-gradient-to-br from-cyan-900/30 via-teal-900/20 to-cyan-900/30 border border-cyan-500/40 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3"
                              >
                                <FaTrophy className="text-purple-400 text-sm sm:text-base md:text-lg mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="text-white font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{rec.title}</h4>
                                  {rec.description && (
                                    <p className="text-white/80 text-[10px] sm:text-xs leading-relaxed">
                                      {rec.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : null}

                {/* Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-secondary-default/30 to-transparent" />

                {/* Technology Stack */}
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                    <FaCogs className="text-orange-400 text-sm sm:text-base md:text-lg" />
                    Technology Stack
                  </h3>
                  <TechStack
                    stacks={project.stacks}
                    columns={3}
                    expandable={false}
                    title=""
                  />
                </div>

                {/* Testimonials */}
                {project.testimonials && project.testimonials.filter(t => t.approved !== false).length > 0 && (
                  <>
                    {/* Separator */}
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                    <div>
                      <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-2">
                        <FaQuoteLeft className="text-purple-400 text-sm sm:text-base" />
                        Testimonials
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {project.testimonials.filter(t => t.approved !== false).map((testimonial, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 relative"
                          >
                            <FaQuoteLeft className="text-purple-400/20 text-2xl sm:text-3xl absolute top-2 sm:top-3 right-2 sm:right-3" aria-hidden="true" />
                            <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-2 sm:mb-3 italic relative z-10">
                              &ldquo;{testimonial.quote}&rdquo;
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                                {testimonial.author.charAt(0)}
                              </div>
                              <div>
                                <p className="text-white font-semibold text-xs sm:text-sm">{testimonial.author}</p>
                                <p className="text-white/60 text-[10px] sm:text-xs">
                                  {testimonial.role}{testimonial.company ? ` at ${testimonial.company}` : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Case Study */}
                {project.caseStudy && (project.caseStudy.problem || project.caseStudy.solution || (project.caseStudy.results && project.caseStudy.results.length > 0)) && (
                  <>
                    {/* Separator before Case Study */}
                    <div className="h-px bg-gradient-to-r from-transparent via-secondary-default/30 to-transparent" />

                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                        <FaBook className="text-purple-400 text-sm sm:text-base md:text-lg" />
                        Case Study
                      </h3>

                      {/* Tree Structure Container */}
                      <div className="relative">
                        {/* Vertical Tree Line - Hidden on mobile, visible on md+ */}
                        <div className="hidden md:block absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-blue-500 to-green-500 opacity-30" aria-hidden="true" />

                        <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                        {/* Problem */}
                        {project.caseStudy.problem && project.caseStudy.problem.trim() !== "" && (
                          <div className="relative md:pl-12">
                            {/* Tree Node & Branch - Hidden on mobile */}
                            <div className="hidden md:block absolute left-5 top-6 -translate-x-1/2" aria-hidden="true">
                              {/* Node Circle */}
                              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-[#1a1a1f] shadow-lg shadow-red-500/50" />
                              {/* Horizontal Branch */}
                              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-0.5 bg-gradient-to-r from-red-500/50 to-red-500/20" />
                            </div>

                            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-2">
                              <FaInfoCircle className="text-red-400 text-sm sm:text-base" />
                              The Problem
                            </h4>
                            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:border-red-500/50 transition-colors duration-300">
                              <p className="text-white/80 leading-relaxed text-xs sm:text-sm">{project.caseStudy.problem}</p>
                            </div>
                          </div>
                        )}

                        {/* Solution */}
                        {project.caseStudy.solution && project.caseStudy.solution.trim() !== "" && (
                          <div className="relative md:pl-12">
                            {/* Tree Node & Branch - Hidden on mobile */}
                            <div className="hidden md:block absolute left-5 top-6 -translate-x-1/2" aria-hidden="true">
                              {/* Node Circle */}
                              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-[#1a1a1f] shadow-lg shadow-blue-500/50" />
                              {/* Horizontal Branch */}
                              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-0.5 bg-gradient-to-r from-blue-500/50 to-blue-500/20" />
                            </div>

                            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-2">
                              <FaLightbulb className="text-blue-400 text-sm sm:text-base" />
                              The Solution
                            </h4>
                            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:border-blue-500/50 transition-colors duration-300">
                              <p className="text-white/80 leading-relaxed text-xs sm:text-sm mb-2 sm:mb-3">{project.caseStudy.solution}</p>

                              {/* Technical Highlights - Nested Subset */}
                              {project.caseStudy.technicalHighlights && project.caseStudy.technicalHighlights.length > 0 && (
                                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-500/20">
                                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                    <FaCodeBranch className="text-cyan-400 text-xs sm:text-sm" />
                                    <p className="text-white font-semibold text-xs sm:text-sm">Technical Highlights</p>
                                  </div>
                                  <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                                    {project.caseStudy.technicalHighlights.map((highlight, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-start gap-2 bg-blue-500/5 border border-blue-500/20 rounded-lg p-2 sm:p-3 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-200"
                                      >
                                        <FaCheckCircle className="text-cyan-400 text-[10px] sm:text-xs mt-0.5 flex-shrink-0" />
                                        <p className="text-white/80 text-[10px] sm:text-xs leading-relaxed">
                                          {highlight}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Results */}
                        {project.caseStudy.results && project.caseStudy.results.length > 0 && (
                          <div className="relative md:pl-12">
                            {/* Tree Node & Branch - Hidden on mobile */}
                            <div className="hidden md:block absolute left-5 top-6 -translate-x-1/2" aria-hidden="true">
                              {/* Node Circle */}
                              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-[#1a1a1f] shadow-lg shadow-green-500/50" />
                              {/* Horizontal Branch */}
                              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-0.5 bg-gradient-to-r from-green-500/50 to-green-500/20" />
                            </div>

                            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-2">
                              <FaCheckCircle className="text-green-400 text-sm sm:text-base" />
                              The Results
                            </h4>
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:border-green-500/50 transition-colors duration-300">
                              <ul className="space-y-1.5 sm:space-y-2">
                                {project.caseStudy.results.map((result, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-white/80 text-xs sm:text-sm">
                                    <span className="text-green-400 mt-0.5 sm:mt-1 text-base sm:text-lg">✓</span>
                                    {result}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Architecture Diagram */}
                        {project.caseStudy.architectureDiagram && project.caseStudy.architectureDiagram.trim() !== "" && (
                          <div className="relative md:pl-12">
                            {/* Tree Node & Branch - Hidden on mobile */}
                            <div className="hidden md:block absolute left-5 top-6 -translate-x-1/2" aria-hidden="true">
                              {/* Node Circle */}
                              <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-[#1a1a1f] shadow-lg shadow-purple-500/50" />
                              {/* Horizontal Branch */}
                              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-0.5 bg-gradient-to-r from-purple-500/50 to-purple-500/20" />
                            </div>

                            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-2">
                              <FiLayers className="text-purple-400 text-sm sm:text-base" />
                              System Architecture
                            </h4>
                            <MermaidDiagram chart={project.caseStudy.architectureDiagram} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  </>
                )}

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
