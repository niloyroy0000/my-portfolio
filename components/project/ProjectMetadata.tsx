"use client";

import React from "react";
import { FaCode, FaCalendar, FaClock } from "@/lib/icons";

/**
 * Format date for display (e.g., "Jan 2024")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Format duration in months to readable string
 * Smart format: shows years + months for 12+ months, otherwise just months
 */
export function formatDuration(months: number): string {
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${years}y`;
    }
    return `${years}y ${remainingMonths}m`;
  }
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

/**
 * Calculate duration in months between two dates
 */
export function calculateDurationMonths(startDate: Date, endDate: Date): number {
  return Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
}

/**
 * Project Timeline Component
 * Displays start date, end date, and duration
 * If endDate is null/undefined, shows "Present" for ongoing projects
 */
export function ProjectTimeline({
  startDate,
  endDate,
  className = "",
}: {
  startDate: string | Date;
  endDate?: string | Date | null;
  className?: string;
}) {
  // Convert string dates to Date objects if needed
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;

  // If endDate is null/undefined, use current date for duration calculation
  const isOngoing = !endDate;
  const end = endDate
    ? (typeof endDate === 'string' ? new Date(endDate) : endDate)
    : new Date();

  const durationMonths = calculateDurationMonths(start, end);

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs ${className}`}>
      {/* Date Range */}
      <div className="flex items-center gap-1.5 text-white/60">
        <FaCalendar className="text-blue-400" />
        <span>
          {formatDate(start)} - {isOngoing ? 'Present' : formatDate(end)}
        </span>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-1.5 text-white/60">
        <FaClock className="text-emerald-400" />
        <span>{formatDuration(durationMonths)}</span>
      </div>
    </div>
  );
}

/**
 * Project Role Component
 * Displays the job role/position for the project
 */
export function ProjectRole({
  role,
  className = "",
}: {
  role: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 text-xs text-white/60 ${className}`}>
      <FaCode className="text-secondary-default" />
      <span>{role}</span>
    </div>
  );
}

/**
 * Metadata Row - Container for multiple metadata items
 */
export function MetadataRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Metadata Item - Generic metadata display with icon
 */
export function MetadataItem({
  icon: Icon,
  label,
  iconColor = "text-secondary-default",
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  iconColor?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 text-xs text-white/60 ${className}`}>
      <Icon className={iconColor} />
      <span>{label}</span>
    </div>
  );
}
