"use client";

import React from "react";
import type { IconType } from "@/lib/icons";

/**
 * Gradient Divider - Reusable horizontal gradient line
 *
 * Used for section separators with consistent styling
 */
export function GradientDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-secondary-default/40 to-transparent ${className}`} />
  );
}

/**
 * Section Header with Icon - Large section headers
 *
 * Used in modals and detail views
 */
export function SectionHeader({
  icon: Icon,
  title,
  className = "",
}: {
  icon: IconType;
  title: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 mb-3 ${className}`}>
      <Icon className="text-secondary-default text-sm" />
      <h3 className="text-lg font-bold bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">{title}</h3>
    </div>
  );
}

/**
 * Compact Section Header - Smaller header with gradient lines
 *
 * Used for subsections in cards
 */
export function CompactSectionHeader({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 mb-1.5 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary-default/40 to-secondary-default/20"></div>
      <h4 className="text-[10px] font-semibold text-secondary-default/80 uppercase tracking-wide whitespace-nowrap">
        {title}
      </h4>
      <div className="flex-1 h-px bg-gradient-to-r from-secondary-default/20 via-secondary-default/40 to-transparent"></div>
    </div>
  );
}

/**
 * Card Container - Consistent gradient background for tech stacks
 */
export function CardContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-gradient-to-br from-secondary-default/5 via-purple-500/5 to-blue-500/5 rounded-lg p-3 border border-white/10 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Subsection Header with Icon - Small header for card subsections
 */
export function SubsectionHeader({
  title,
  icon,
  action,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between mb-2 ${className}`}>
      <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wide flex items-center gap-1.5">
        {icon}
        {title}
      </h4>
      {action}
    </div>
  );
}
