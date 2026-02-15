"use client";

import React from "react";
import Image from "next/image";
import {
  FaStar,
  FaCodeBranch,
  FaTrophy,
  FaBuilding,
  FaUser,
  FaPlay,
} from "@/lib/icons";
import { SimpleTooltip, WideTooltip } from "@/components/ui/SimpleTooltip";
import { getCategoryColor, getCompanyLogo } from "@/constants/projectConstants";
import { getMetricBadgeClasses, getMetricBadgeClassesLight } from "@/utils/projectHelpers";
import type { PrimaryMetric } from "@/utils/projectHelpers";
import type { Recognition } from "@/types/api";
import {
  STATUS_BADGE_CLASSES,
  FEATURED_BADGE_CLASSES,
  OPEN_SOURCE_BADGE_CLASSES,
  RECOGNITION_BADGE_CLASSES,
  PRIMARY_METRIC_BADGE_CLASSES,
  PRIMARY_METRIC_BADGE_MODAL_CLASSES,
  CATEGORY_BADGE_CLASSES,
} from "@/constants/badgeSizes";

/**
 * Category Badge - Shows project category with color coding
 */
export function CategoryBadge({ category }: { category: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center gap-1.5 shadow-sm border ${CATEGORY_BADGE_CLASSES} ${getCategoryColor(
        category
      )}`}
      role="status"
      aria-label={`Category: ${category}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" aria-hidden="true"></span>
      <span className="leading-none">{category}</span>
    </div>
  );
}

/**
 * Open Source Badge - Icon-only with tooltip
 */
export function OpenSourceBadge({ variant = "icon" }: { variant?: "icon" | "text" }) {
  if (variant === "icon") {
    return (
      <SimpleTooltip content="Open Source" position="top" colorScheme="green">
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-green-500/20 border border-green-500/40 hover:bg-green-500/30 transition-colors cursor-help flex-shrink-0"
          role="img"
          aria-label="Open Source"
        >
          <FaCodeBranch className="text-xs text-green-300" aria-hidden="true" />
          <span className="sr-only">Open Source</span>
        </span>
      </SimpleTooltip>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 bg-green-500/20 border border-green-500/40 text-green-300 ${OPEN_SOURCE_BADGE_CLASSES}`}
      role="status"
      aria-label="Open Source"
    >
      <FaCodeBranch className="text-xs flex-shrink-0" aria-hidden="true" />
      <span className="leading-none">Open Source</span>
    </span>
  );
}

/**
 * Recognition/Accolades Badge - Shows accolade count with tooltip
 */
export function RecognitionBadge({
  recognitions
}: {
  recognitions: Recognition[]
}) {
  const approvedRecognitions = recognitions.filter(r => r.approved !== false);
  const count = approvedRecognitions.length;

  if (count === 0) return null;

  const accoladesList = approvedRecognitions.map(r => r.title).join(', ');

  return (
    <div
      className="relative inline-flex group/awards flex-shrink-0"
      role="status"
      aria-label={`${count} ${count === 1 ? 'Accolade' : 'Accolades'}: ${accoladesList}`}
    >
      <span className={`inline-flex items-center justify-center gap-1.5 bg-amber-500/10 border border-amber-400/30 text-amber-200 shadow-sm cursor-help ${RECOGNITION_BADGE_CLASSES}`}>
        <FaTrophy className="text-[10px] text-amber-300 flex-shrink-0" aria-hidden="true" />
        <span className="leading-none">{count} {count === 1 ? 'Accolade' : 'Accolades'}</span>
      </span>

      {/* Tooltip on hover */}
      <div
        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-amber-400/30 opacity-0 invisible group-hover/awards:opacity-100 group-hover/awards:visible transition-all duration-200 z-[999] shadow-xl pointer-events-none"
        role="tooltip"
        aria-hidden="true"
      >
        <div className="space-y-2">
          {approvedRecognitions.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <FaTrophy className="text-amber-300 text-xs mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <div className="text-white text-xs font-semibold">{rec.title}</div>
                {rec.description && (
                  <div className="text-white/70 text-xs mt-0.5">{rec.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Status Badge - Active or Completed
 */
export function StatusBadge({
  isActive,
  inactivationReason
}: {
  isActive: boolean;
  inactivationReason?: string | null;
}) {
  if (isActive) {
    return (
      <span
        className={`inline-flex items-center justify-center gap-1 bg-green-500/90 text-white flex-shrink-0 ${STATUS_BADGE_CLASSES}`}
        role="status"
        aria-label="Project Status: Active"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse flex-shrink-0" aria-hidden="true" />
        <span className="leading-none">Active</span>
      </span>
    );
  }

  if (inactivationReason) {
    return (
      <WideTooltip content={inactivationReason} position="top" colorScheme="red">
        <span
          className={`inline-flex items-center justify-center gap-1 bg-red-500/90 text-white cursor-help flex-shrink-0 ${STATUS_BADGE_CLASSES}`}
          role="status"
          aria-label={`Project Status: Completed. ${inactivationReason}`}
        >
          <span className="leading-none">Completed</span>
        </span>
      </WideTooltip>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 bg-red-500/90 text-white flex-shrink-0 ${STATUS_BADGE_CLASSES}`}
      role="status"
      aria-label="Project Status: Completed"
    >
      <span className="leading-none">Completed</span>
    </span>
  );
}

/**
 * Status Badge for Image Overlay - Icon-only version with tooltip
 */
export function StatusBadgeIcon({
  isActive,
  inactivationReason,
}: {
  isActive: boolean;
  inactivationReason?: string | null;
}) {
  if (isActive) {
    return (
      <SimpleTooltip content="Active Project" position="bottom" colorScheme="green">
        <div
          className="bg-green-500/95 text-white backdrop-blur-sm shadow-lg w-7 h-7 rounded-md flex items-center justify-center cursor-help flex-shrink-0"
          role="img"
          aria-label="Active Project"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Active Project</span>
        </div>
      </SimpleTooltip>
    );
  }

  return (
    <WideTooltip
      content={inactivationReason || "This project is no longer active"}
      position="bottom"
      colorScheme="red"
    >
      <div
        className="bg-red-500/95 text-white backdrop-blur-sm shadow-lg w-7 h-7 rounded-md flex items-center justify-center cursor-help flex-shrink-0"
        role="img"
        aria-label={`Completed Project${inactivationReason ? `: ${inactivationReason}` : ''}`}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-white flex-shrink-0" aria-hidden="true" />
        <span className="sr-only">Completed Project</span>
      </div>
    </WideTooltip>
  );
}

/**
 * Featured Badge - Can be icon-only or with text
 */
export function FeaturedBadge({ variant = "icon" }: { variant?: "icon" | "text" }) {
  if (variant === "icon") {
    return (
      <SimpleTooltip content="Featured Project" position="bottom" colorScheme="purple">
        <div
          className="bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm text-white w-7 h-7 rounded-md shadow-lg shadow-purple-500/30 flex items-center justify-center cursor-help flex-shrink-0"
          role="img"
          aria-label="Featured Project"
        >
          <FaStar className="text-white text-sm" aria-hidden="true" />
          <span className="sr-only">Featured Project</span>
        </div>
      </SimpleTooltip>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-500/25 to-pink-500/25 border border-purple-500/50 text-purple-200 shadow-sm shadow-purple-500/20 flex-shrink-0 ${FEATURED_BADGE_CLASSES}`}
      role="status"
      aria-label="Featured Project"
    >
      <FaStar className="text-[10px] flex-shrink-0" aria-hidden="true" />
      <span className="leading-none">Featured</span>
    </span>
  );
}

/**
 * Primary Metric Badge - Shows key performance metric
 */
export function PrimaryMetricBadge({
  metric,
  variant = "default",
  lightMode = false,
}: {
  metric: PrimaryMetric;
  variant?: "default" | "modal";
  lightMode?: boolean;
}) {
  const badgeClasses = variant === "modal"
    ? PRIMARY_METRIC_BADGE_MODAL_CLASSES
    : PRIMARY_METRIC_BADGE_CLASSES;

  const colorClasses = lightMode
    ? getMetricBadgeClassesLight(metric.label)
    : getMetricBadgeClasses(metric.label);

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 sm:gap-2 bg-black/70 backdrop-blur-md shadow-lg border flex-shrink-0 ${badgeClasses} ${colorClasses} max-w-[280px] sm:max-w-none`}
      role="status"
      aria-label={`Key Metric: ${metric.text}`}
      title={metric.text}
    >
      <metric.icon className={`flex-shrink-0 ${variant === "modal" ? "text-sm sm:text-base" : "text-[10px] sm:text-xs"}`} aria-hidden="true" />
      <span className="leading-none whitespace-nowrap overflow-hidden text-ellipsis">{metric.text}</span>
    </span>
  );
}

/**
 * Current Project Badge - Indicates ongoing project work
 */
export function CurrentBadge({ variant = "text" }: { variant?: "icon" | "text" }) {
  if (variant === "icon") {
    return (
      <SimpleTooltip content="Currently Working On This" position="bottom" colorScheme="amber">
        <div
          className="bg-gradient-to-br from-amber-500/95 to-orange-500/95 text-white backdrop-blur-sm shadow-lg shadow-amber-500/30 w-7 h-7 rounded-md flex items-center justify-center cursor-help flex-shrink-0"
          role="img"
          aria-label="Currently Working On This Project"
        >
          <FaPlay className="text-xs flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Currently Working On This Project</span>
        </div>
      </SimpleTooltip>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 text-amber-300 px-2 py-1 rounded-md text-xs font-semibold shadow-sm shadow-amber-500/10 flex-shrink-0"
      role="status"
      aria-label="Currently Working On This Project"
    >
      <FaPlay className="text-[10px] flex-shrink-0" aria-hidden="true" />
      <span className="leading-none">Current</span>
    </span>
  );
}

/**
 * Company Logo/Icon - Shows company association
 */
export function CompanyIcon({ company }: { company: string }) {
  const logo = getCompanyLogo(company);

  return (
    <SimpleTooltip content={`@ ${company}`} position="bottom">
      {logo ? (
        <Image
          src={logo}
          alt={`${company} logo`}
          width={20}
          height={20}
          className="rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-help flex-shrink-0"
        />
      ) : (
        <div className="w-5 h-5 rounded-sm bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center cursor-help flex-shrink-0">
          {company.toLowerCase().includes('individual') ||
           company.toLowerCase().includes('freelance') ||
           company.toLowerCase().includes('personal') ? (
            <FaUser className="text-[10px] text-blue-300" />
          ) : (
            <FaBuilding className="text-[10px] text-blue-300" />
          )}
        </div>
      )}
    </SimpleTooltip>
  );
}

/**
 * Badge Separator - Consistent divider between badges
 * Height matches badge height (h-7) for perfect alignment
 */
export function BadgeSeparator({ className = "" }: { className?: string }) {
  return (
    <span className={`h-7 text-white/30 text-xs inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <span className="leading-7">|</span>
    </span>
  );
}

/**
 * Badge Row - Consistent container for badge groups
 * Uses flex with items-center to vertically align all badges consistently
 */
export function BadgeRow({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 min-h-[28px] ${className}`}>
      {children}
    </div>
  );
}
