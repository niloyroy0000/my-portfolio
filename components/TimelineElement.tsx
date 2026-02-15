"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaMapMarkedAlt,
  FaCheckCircle,
  FaCalendar,
  FaClock,
} from "@/lib/icons";
import {
  getDateRange,
  getDuration,
} from "@/helpers/utility";

interface TimelineItem {
  icon?: string; // V2: Optional in API
  company: string;
  position: string;
  location: string;
  address?: string; // V2: Work location address
  startDate: Date | string; // V2: Can be string from API
  endDate?: Date | string; // V2: Optional when isCurrent = true, can be string from API
  isCurrent?: boolean; // V2: Current position flag
  url?: string; // V2: Optional in API
  jobType: string[];
  responsibilities: string[];
}

interface TimelineElementProps {
  item: TimelineItem;
  index: number;
  className?: string;
}

/**
 * TimelineElement - Accessible career timeline entry component
 * WCAG 2.1 AA compliant with proper ARIA labels and semantic HTML
 */
const TimelineElement: React.FC<TimelineElementProps> = ({
  item,
  index,
  className = ""
}) => {
  const isFeatured = index === 0;
  // V2: Convert string dates to Date objects if needed, use current date for "Present" logic
  const startDate = typeof item.startDate === 'string' ? new Date(item.startDate) : item.startDate;
  const endDate = item.endDate
    ? (typeof item.endDate === 'string' ? new Date(item.endDate) : item.endDate)
    : new Date(); // Use current date when endDate is not provided
  const dateRange = getDateRange(startDate, endDate);
  const duration = getDuration(startDate, endDate);

  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative md:pl-20 mb-6 ${className}`}
      data-testid={`timeline-career-${index}`}
      aria-label={`${item.position} at ${item.company}, ${dateRange}, ${duration}`}
    >
      {/* Timeline Dot - Decorative, hidden from screen readers */}
      <div
        className={`hidden md:block absolute left-6 top-6 w-5 h-5 rounded-full border-4 border-[#1a1a1f] shadow-lg ${isFeatured
          ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30'
          : 'bg-gradient-to-br from-secondary-default to-blue-500 shadow-secondary-default/30'
        }`}
        aria-hidden="true"
      />

      {/* Career Card - Matching ProjectCard design */}
      <div
        className={`group relative p-5 rounded-xl border transition-all duration-500 hover:shadow-2xl ${isFeatured
            ? 'bg-gradient-to-br from-purple-500/5 via-gray-800 to-gray-900 border-purple-500/30 shadow-md shadow-purple-500/10 hover:border-purple-500/50 hover:shadow-purple-500/20'
            : 'bg-gradient-to-br from-gray-800 to-gray-900 border-secondary-default/20 hover:border-secondary-default/60 hover:shadow-secondary-default/20'
          }`}
      >
        {/* Header Row: Title (left) + Date Info (right) */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-bold transition-colors duration-300 ${isFeatured
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent'
              }`}>
              {item.position}
            </h3>
          </div>

          {/* Date Info Badges - Right Side (Desktop) - Contextual colors */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* V2: Current Position Badge */}
            {item.isCurrent && (
              <div className="inline-flex items-center justify-center h-7 gap-1.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-3 rounded-full text-xs font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span>Current</span>
              </div>
            )}

            <div className="inline-flex items-center justify-center h-7 bg-secondary-default/10 backdrop-blur-sm border border-secondary-default/30 text-secondary-default px-3 rounded-full text-xs font-medium">
              <FaCalendar className="text-[10px] mr-1.5" />
              <span>{dateRange}</span>
            </div>
            <div className="inline-flex items-center justify-center h-7 bg-secondary-default/10 backdrop-blur-sm border border-secondary-default/30 text-[#00BFFF]/90 px-3 rounded-full text-xs font-medium">
              <FaClock className="text-[10px] mr-1.5" />
              <span>{duration}</span>
            </div>
          </div>
        </div>

        {/* Company Row with Icon + Location */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Company Icon - Simple square like Project Modal */}
            {item.icon && (
              <Image
                src={item.icon}
                alt={`${item.company} logo`}
                width={20}
                height={20}
                className="rounded-sm opacity-80 hover:opacity-100 transition-opacity flex-shrink-0"
              />
            )}

            {/* Company Name - Match Project Card font size */}
            <p className="text-xs text-white/60 font-medium">
              {item.url ? (
                <Link
                  href={item.url}
                  className="hover:text-secondary-default transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f] rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${item.company} website (opens in new tab)`}
                >
                  {item.company}
                </Link>
              ) : (
                <span>{item.company}</span>
              )}
            </p>
          </div>

          {/* Job Type Tags + Location - Desktop */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            {/* Job Type Badges - Match CATEGORY_BADGE_CLASSES with contextual colors */}
            {item.jobType.map((type, typeIndex) => (
              <span
                key={typeIndex}
                className={`inline-flex items-center justify-center h-7 text-[11px] px-2.5 rounded-lg font-bold uppercase tracking-wide backdrop-blur-sm transition-all duration-300 ${isFeatured
                    ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                    : 'bg-secondary-default/10 border border-secondary-default/30 text-secondary-default hover:bg-secondary-default/20'
                  }`}
              >
                {type}
              </span>
            ))}

            {/* Separator */}
            <span className="h-7 text-white/30 text-xs inline-flex items-center justify-center">|</span>

            {/* Location Badge - V2: Shows address if available, fallback to location - Contextual colors */}
            <div className="inline-flex items-center justify-center h-7 gap-1.5 text-white/70 text-xs bg-white/5 backdrop-blur-sm border border-white/10 px-3 rounded-full hover:bg-white/10 transition-all duration-300">
              <FaMapMarkedAlt className={`text-[10px] ${isFeatured ? 'text-purple-400' : 'text-secondary-default'}`} />
              {item.address || item.location}
            </div>
          </div>
        </div>

        {/* Date Info Badges + Job Type + Location - Mobile Only */}
        <div className="sm:hidden space-y-2 mb-3">
          {/* Row 1: Current Badge + Date + Duration */}
          <div className="flex items-center gap-2">
            {/* V2: Current Position Badge - Mobile */}
            {item.isCurrent && (
              <div className="inline-flex items-center justify-center h-7 gap-1.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-2 rounded-full text-xs font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span>Current</span>
              </div>
            )}

            <div className={`inline-flex items-center justify-center h-7 backdrop-blur-sm px-3 rounded-full text-xs font-medium ${isFeatured
                ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                : 'bg-secondary-default/10 border border-secondary-default/30 text-secondary-default'
              }`}>
              <FaCalendar className="text-[10px] mr-1.5" />
              <span>{dateRange}</span>
            </div>
            <div className="inline-flex items-center justify-center h-7 bg-secondary-default/10 backdrop-blur-sm border border-secondary-default/30 text-[#00BFFF]/90 px-3 rounded-full text-xs font-medium">
              <FaClock className="text-[10px] mr-1.5" />
              <span>{duration}</span>
            </div>
          </div>

          {/* Row 2: Job Types + Separator + Location - All in one row */}
          <div className="flex items-center gap-2">
            {/* Job Type Badges */}
            {item.jobType.map((type, typeIndex) => (
              <span
                key={typeIndex}
                className={`inline-flex items-center justify-center h-7 text-[10px] px-2 rounded-lg font-bold uppercase tracking-wide backdrop-blur-sm transition-all duration-300 flex-shrink-0 ${isFeatured
                    ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                    : 'bg-secondary-default/10 border border-secondary-default/30 text-secondary-default hover:bg-secondary-default/20'
                  }`}
              >
                {type}
              </span>
            ))}

            {/* Separator */}
            <span className="h-7 text-white/30 text-xs inline-flex items-center justify-center flex-shrink-0">|</span>

            {/* Location - V2: Shows address if available, fallback to location - Contextual colors */}
            <div className="inline-flex items-center justify-center h-7 gap-1 text-white/70 text-[10px] bg-white/5 backdrop-blur-sm border border-white/10 px-2 rounded-full flex-shrink-0">
              <FaMapMarkedAlt className={`text-[9px] ${isFeatured ? 'text-purple-400' : 'text-secondary-default'}`} />
              {item.address || item.location}
            </div>
          </div>
        </div>

        {/* Responsibilities Section - Semantic list structure for accessibility */}
        <div className="space-y-2 relative z-10 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-1 h-4 rounded-full ${isFeatured ? 'bg-gradient-to-b from-purple-500 to-pink-500' : 'bg-gradient-to-b from-secondary-default to-blue-500'}`}
              aria-hidden="true"
            />
            <h4
              id={`responsibilities-heading-${index}`}
              className={`text-xs font-bold uppercase tracking-wide ${isFeatured ? 'text-purple-300' : 'text-secondary-default'}`}
            >
              Key Achievements & Responsibilities
            </h4>
          </div>
          <ul
            className="space-y-2 list-none"
            aria-labelledby={`responsibilities-heading-${index}`}
          >
            {item.responsibilities.map((responsibility, respIndex) => (
              <motion.li
                key={respIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: respIndex * 0.05 }}
                className="flex items-start gap-3 group/item hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent px-3 py-2 rounded-lg transition-all duration-300 border border-transparent hover:border-white/5"
              >
                <div className="flex-shrink-0 mt-1.5" aria-hidden="true">
                  <div className={`w-1.5 h-1.5 rounded-full group-hover/item:scale-150 transition-all duration-200 ${isFeatured
                      ? 'bg-purple-400 shadow-sm shadow-purple-400/50'
                      : 'bg-secondary-default shadow-sm shadow-secondary-default/50'
                    }`} />
                </div>
                <span className="text-white/80 leading-relaxed text-sm group-hover/item:text-white/95 transition-colors duration-200">
                  {responsibility}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
};

export default TimelineElement;
