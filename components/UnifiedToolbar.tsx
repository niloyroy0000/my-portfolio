"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { IconType } from "@/lib/icons";
import { FiSearch, FiX } from "@/lib/icons";

// View mode option interface
export interface ViewModeOption {
  id: string;
  label: string;
  icon: IconType;
}

interface UnifiedToolbarProps {
  // View Mode Toggle
  viewModes?: ViewModeOption[];
  activeViewMode?: string;
  onViewModeChange?: (mode: string) => void;

  // Search
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Custom content (filters, etc.)
  children?: ReactNode;

  // Styling
  className?: string;
}

const UnifiedToolbar: React.FC<UnifiedToolbarProps> = ({
  viewModes,
  activeViewMode,
  onViewModeChange,
  showSearch = false,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
  className = "",
}) => {
  const hasViewModes = viewModes && viewModes.length > 0;
  const hasSearch = showSearch && onSearchChange;
  const hasContent = hasViewModes || hasSearch || children;

  if (!hasContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`relative bg-gradient-to-br from-gray-900/70 to-gray-950/70 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-3 mb-6 shadow-md z-[110] ${className}`}
    >
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        {/* View Mode Toggle */}
        {hasViewModes && (
          <div className="flex gap-2 shrink-0">
            {viewModes.map((mode) => {
              const IconComponent = mode.icon;
              const isActive = activeViewMode === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => onViewModeChange?.(mode.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-secondary-default to-blue-500 text-white shadow-md"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <IconComponent className="text-xs" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Divider between view modes and search/filter */}
        {hasViewModes && (hasSearch || children) && (
          <div className="hidden lg:block w-px h-8 bg-white/10" />
        )}

        {/* Search Input */}
        {hasSearch && (
          <div className="relative flex-1 group">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-default/70 group-focus-within:text-secondary-default transition-colors text-sm">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9 bg-gradient-to-br from-[#27272c] to-[#2a2a30] border border-secondary-default/30 rounded-lg pl-9 pr-9 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-secondary-default/50 focus:border-secondary-default/60 transition-all duration-300 shadow-sm focus:shadow-md focus:shadow-secondary-default/20"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-red-400 transition-colors duration-200"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>
        )}

        {/* Custom Content (filters, etc.) */}
        {children && (
          <div className={hasSearch ? "" : "flex-1"}>
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UnifiedToolbar;
