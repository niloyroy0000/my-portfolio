"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconType } from "@/lib/icons";

/**
 * EmptyState - Reusable empty state component
 * Provides consistent styling for "no results" and error states
 * WCAG 2.1 AA compliant with proper ARIA attributes
 */

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

interface EmptyStateProps {
  icon: IconType;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
  size = "md",
}) => {
  // Size configurations - compact button padding for cleaner look
  const sizeConfig = {
    sm: {
      padding: "py-6",
      iconSize: "text-2xl",
      iconWrapper: "w-10 h-10",
      titleSize: "text-base",
      descSize: "text-xs",
      buttonPadding: "px-3 py-1 text-xs",
    },
    md: {
      padding: "py-8",
      iconSize: "text-3xl",
      iconWrapper: "w-12 h-12",
      titleSize: "text-lg",
      descSize: "text-sm",
      buttonPadding: "px-4 py-1.5 text-sm",
    },
    lg: {
      padding: "py-10",
      iconSize: "text-4xl",
      iconWrapper: "w-14 h-14",
      titleSize: "text-xl",
      descSize: "text-sm",
      buttonPadding: "px-5 py-2 text-sm",
    },
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`text-center ${config.padding} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md mx-auto">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={`${config.iconWrapper} mx-auto mb-4 bg-secondary-default/10 border border-secondary-default/20 rounded-xl flex items-center justify-center`}
        >
          <Icon className={`${config.iconSize} text-secondary-default/60`} aria-hidden="true" />
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className={`${config.titleSize} font-semibold text-white mb-2`}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`${config.descSize} text-white/60 mb-6 max-w-sm mx-auto`}
        >
          {description}
        </motion.p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {action && (
              <button
                onClick={action.onClick}
                className={`${config.buttonPadding} bg-secondary-default hover:bg-secondary-default/80 text-primary font-medium rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]`}
              >
                {action.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className={`${config.buttonPadding} bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/20 hover:border-white/30 font-medium rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]`}
              >
                {secondaryAction.label}
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
