/**
 * Filter Constants
 *
 * Centralized filter configuration for consistent filtering across all pages.
 * Extracted from various filter components (Priority 2.5) for maintainability.
 */

/**
 * Common filter field names
 */
export const FILTER_FIELDS = {
  SEARCH: 'search',
  CATEGORY: 'category',
  COMPANY: 'company',
  TECHNOLOGY: 'technology',
  STATUS: 'status',
  ISSUER: 'issuer',
  YEAR: 'year',
} as const;

/**
 * Default filter values
 */
export const DEFAULT_FILTER_VALUE = 'all';

/**
 * Filter panel animation duration (ms)
 */
export const FILTER_ANIMATION_DURATION = 300;

/**
 * Search debounce delay (ms)
 * Used in search inputs to avoid excessive filtering on each keystroke
 */
export const SEARCH_DEBOUNCE_DELAY = 300;

/**
 * Project status filter options
 */
export const PROJECT_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Completed', label: 'Completed' },
  { value: 'On Hold', label: 'On Hold' },
] as const;

/**
 * Certification status filter options
 */
export const CERTIFICATION_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Expired', label: 'Expired' },
  { value: 'Verified', label: 'Verified' },
] as const;

/**
 * Certification category filter options
 */
export const CERTIFICATION_CATEGORIES = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Course', label: 'Course' },
  { value: 'Training', label: 'Training' },
] as const;

/**
 * Filter badge color schemes by category
 * Maps filter types to their gradient colors
 */
export const FILTER_BADGE_COLORS = {
  CATEGORY: {
    from: 'emerald-400',
    to: 'blue-400',
    active: 'from-secondary-default to-blue-500',
  },
  COMPANY: {
    from: 'purple-400',
    to: 'pink-400',
    active: 'from-purple-500 to-pink-500',
  },
  STATUS_ACTIVE: {
    from: 'emerald-500',
    to: 'green-500',
    active: 'from-emerald-500 to-green-500',
  },
  STATUS_INACTIVE: {
    from: 'orange-500',
    to: 'amber-500',
    active: 'from-orange-500 to-amber-500',
  },
  TECHNOLOGY: {
    from: 'blue-400',
    to: 'cyan-400',
    active: 'from-blue-500 to-cyan-500',
  },
} as const;

/**
 * Filter panel z-index
 * Ensures dropdowns appear above other content
 */
export const FILTER_PANEL_Z_INDEX = 120;

/**
 * Maximum number of filter badges to show before adding "Show More" in active filters
 */
export const MAX_ACTIVE_FILTER_BADGES = 5;
