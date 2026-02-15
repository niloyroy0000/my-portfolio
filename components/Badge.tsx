"use client";

import React from "react";

/**
 * Large decorative badge component for page headers and visual indicators
 *
 * @component Badge
 *
 * @description
 * This is the PRIMARY badge component for display purposes. Use this for:
 * - Role badges on homepage (e.g., "Senior .NET Architect")
 * - Category labels on project/skill cards
 * - Feature highlights and visual indicators
 * - Any badge that needs to be prominent and decorative
 *
 * DO NOT use for:
 * - Filter tags (use @/components/ui/badge instead - smaller, clickable)
 * - Interactive toggles (use @/components/ui/badge with variants)
 *
 * @example
 * ```tsx
 * <Badge
 *   icon={<FiCode />}
 *   text="Senior .NET Developer"
 *   color="default"
 * />
 * ```
 *
 * @features
 * - Icon support (left side only)
 * - 5 color variants: default (cyan), blue, purple, emerald, orange
 * - Gradient backgrounds with backdrop blur
 * - Hover effects
 * - Size: px-4 py-2 (larger, more prominent)
 * - Rounded-full shape
 * - Auto-generated test IDs
 */
interface BadgeProps {
  icon?: React.ReactNode;
  text: React.ReactNode;
  color?: "default" | "blue" | "purple" | "emerald" | "orange" | "featured" | "neutral";
  className?: string;
  testId?: string;
  size?: "default" | "compact";
}

const Badge: React.FC<BadgeProps> = ({
  icon,
  text,
  color = "default",
  className = "",
  testId,
  size = "default",
}) => {
  // Color mappings for consistent styling
  const colorVariants = {
    default: {
      gradient: "from-secondary-default/10 to-transparent",
      border: "border-secondary-default/30",
      text: "text-secondary-default",
      hover: "hover:bg-secondary-default/20",
    },
    blue: {
      gradient: "from-blue-500/10 to-transparent",
      border: "border-blue-500/30",
      text: "text-blue-300",
      hover: "hover:bg-blue-500/20",
    },
    purple: {
      gradient: "from-purple-500/10 to-transparent",
      border: "border-purple-500/30",
      text: "text-purple-300",
      hover: "hover:bg-purple-500/20",
    },
    emerald: {
      gradient: "from-emerald-500/10 to-transparent",
      border: "border-emerald-500/30",
      text: "text-emerald-300",
      hover: "hover:bg-emerald-500/20",
    },
    orange: {
      gradient: "from-orange-500/10 to-transparent",
      border: "border-orange-500/30",
      text: "text-orange-300",
      hover: "hover:bg-orange-500/20",
    },
    // Featured: Purple → Pink gradient (highest priority in color hierarchy)
    featured: {
      gradient: "from-purple-500/20 via-pink-500/15 to-purple-500/10",
      border: "border-purple-500/40",
      text: "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent",
      hover: "hover:bg-purple-500/25",
    },
    // Neutral: Clean, minimal design for tech stacks and general use
    neutral: {
      gradient: "from-white/5 to-transparent",
      border: "border-white/10",
      text: "text-white/80",
      hover: "hover:bg-white/10",
    },
  };

  const selectedColor = colorVariants[color];

  // Size classes
  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    compact: "px-3 py-1 text-xs",
  };

  // Generate test ID based on text content if not provided
  const generateTestId = () => {
    if (testId) return testId;
    if (typeof text === 'string') {
      return `badge-${text.toLowerCase().replace(/\s+/g, '-')}`;
    }
    return `badge-${color}`;
  };

  return (
    <span
      data-testid={generateTestId()}
      className={`inline-flex items-center gap-2 bg-gradient-to-r ${selectedColor.gradient} backdrop-blur-sm border ${selectedColor.border} ${selectedColor.text} ${sizeClasses[size]} rounded-full font-medium ${selectedColor.hover} transition-all duration-300 animate-fade-in-up ${className}`}
    >
      {icon && <span className={size === "compact" ? "text-[10px]" : "text-xs"}>{icon}</span>}
      {text}
    </span>
  );
};

export default Badge; 