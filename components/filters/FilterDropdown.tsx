"use client";

import { motion } from "framer-motion";

interface FilterDropdownProps {
  isOpen: boolean;
  children: React.ReactNode;
  panelId?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * FilterDropdown Component
 *
 * Reusable animated dropdown container for filter panels.
 * Extracted from ProjectsFilter.tsx (lines 228-343) and CertificationFilter.tsx
 * for consistent filter panel styling and animations across the app.
 *
 * Features:
 * - Smooth fade and scale animation
 * - Glassmorphism backdrop blur effect
 * - Gradient border with shadow
 * - Absolute positioning below parent
 * - High z-index for proper layering
 *
 * @param isOpen - Controls dropdown visibility
 * @param children - Filter content to display
 * @param panelId - Optional ID for accessibility
 * @param className - Additional CSS classes to merge
 * @param ariaLabel - Accessibility label for the panel
 */
const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  children,
  panelId,
  className = "",
  ariaLabel = "Filter options",
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      id={panelId}
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`absolute left-0 right-0 top-full mt-2 bg-gradient-to-br from-[#27272c] via-[#2a2a30] to-[#27272c] backdrop-blur-xl border border-secondary-default/40 rounded-xl shadow-2xl shadow-secondary-default/20 z-[120] p-5 ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
};

export default FilterDropdown;
