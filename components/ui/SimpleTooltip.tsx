"use client";

import React from "react";
import { Z_INDEX_CLASSES } from "@/constants/zIndex";

export interface SimpleTooltipProps {
  /**
   * Content to display in the tooltip
   */
  content: string | React.ReactNode;

  /**
   * Position of the tooltip relative to the trigger element
   * @default "top"
   */
  position?: "top" | "bottom" | "left" | "right";

  /**
   * The element that triggers the tooltip
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes for the tooltip content
   */
  className?: string;

  /**
   * Additional CSS classes for the trigger wrapper
   */
  wrapperClassName?: string;

  /**
   * Border color scheme for the tooltip
   * @default "default"
   */
  colorScheme?: "default" | "green" | "purple" | "amber" | "red" | "blue" | "cyan" | "emerald";

  /**
   * Maximum width preset (optional - auto by default)
   * @default undefined (auto-sizing based on content)
   */
  maxWidth?: "narrow" | "normal" | "wide" | "auto";

  /**
   * Show arrow pointing to trigger element
   * @default true
   */
  showArrow?: boolean;
}

const maxWidthClasses = {
  auto: "max-w-xs", // Auto-sizing with reasonable max width (320px)
  narrow: "max-w-[200px]",
  normal: "max-w-[256px]",
  wide: "max-w-[320px]",
};

const borderColorClasses = {
  default: "border-secondary-default/50",
  green: "border-green-400/50",
  purple: "border-purple-400/50",
  amber: "border-amber-400/50",
  red: "border-red-400/50",
  blue: "border-blue-400/50",
  cyan: "border-secondary-default/50",
  emerald: "border-emerald-400/50",
};

const arrowColorClasses = {
  default: "border-secondary-default/50",
  green: "border-green-400/50",
  purple: "border-purple-400/50",
  amber: "border-amber-400/50",
  red: "border-red-400/50",
  blue: "border-blue-400/50",
  cyan: "border-secondary-default/50",
  emerald: "border-emerald-400/50",
};

/**
 * Lightweight CSS-based Tooltip Component
 *
 * Styled to match the Skills Heatmap modal tooltip design:
 * - Gradient background (gray-900 to gray-950)
 * - Backdrop blur
 * - Colored border (default: cyan/secondary)
 * - Shadow with color accent
 * - Optional arrow
 *
 * @example
 * ```tsx
 * <SimpleTooltip content="This is a tooltip" position="top">
 *   <button>Hover me</button>
 * </SimpleTooltip>
 * ```
 */
export function SimpleTooltip({
  content,
  position = "top",
  children,
  className = "",
  wrapperClassName = "",
  colorScheme = "default",
  maxWidth = "auto",
  showArrow = true,
}: SimpleTooltipProps) {
  // Position classes for different tooltip positions
  const positionClasses = {
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2",
  };

  // Arrow position classes
  const arrowPositionClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-[6px] border-x-[6px] border-x-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[6px] border-x-[6px] border-x-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-[6px] border-y-[6px] border-y-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-[6px] border-y-[6px] border-y-transparent",
  };

  const positionClass = positionClasses[position];
  const maxWidthClass = maxWidthClasses[maxWidth];
  const borderColorClass = borderColorClasses[colorScheme];
  const arrowColorClass = arrowColorClasses[colorScheme];
  const arrowPositionClass = arrowPositionClasses[position];

  return (
    <div className={`relative group/tooltip inline-block ${wrapperClassName}`}>
      {children}

      {/* Tooltip - Heatmap modal style */}
      <div
        className={`
          absolute ${positionClass}
          px-3 py-2
          bg-gradient-to-br from-gray-900 to-gray-950 backdrop-blur-md
          text-white text-xs
          rounded-lg shadow-2xl shadow-secondary-default/20
          border-2 ${borderColorClass}
          transition-all duration-200
          opacity-0 invisible scale-95
          group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:scale-100
          pointer-events-none
          ${maxWidthClass}
          ${Z_INDEX_CLASSES.TOOLTIP}
          ${className}
        `}
        role="tooltip"
      >
        {content}

        {/* Arrow */}
        {showArrow && (
          <div
            className={`absolute ${arrowPositionClass} ${arrowColorClass}`}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

/**
 * Tooltip with wider max-width for longer content
 */
export function WideTooltip(props: Omit<SimpleTooltipProps, "maxWidth">) {
  return <SimpleTooltip {...props} maxWidth="wide" />;
}

/**
 * Compact tooltip for short content (icon-only badges)
 */
export function IconTooltip(props: Omit<SimpleTooltipProps, "maxWidth">) {
  return <SimpleTooltip {...props} maxWidth="narrow" />;
}
