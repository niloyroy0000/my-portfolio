/**
 * Pagination Constants
 *
 * Centralized pagination limits for consistent UX across all pages.
 * Extracted from various components (Priority 2.5) for maintainability.
 */

/**
 * Default number of items to display initially before "Show More" button
 * Used in: CertificationsClient, ProjectsClient, etc.
 */
export const INITIAL_DISPLAY_COUNT = 12;

/**
 * Number of items to display per page in grid layouts
 */
export const ITEMS_PER_PAGE = {
  /** Certification grid (3 cols on large screens) */
  CERTIFICATIONS: 12,
  /** Project grid (3 cols on large screens) */
  PROJECTS: 9,
  /** Blog posts grid (3 cols on large screens) */
  BLOG_POSTS: 6,
  /** Career timeline items */
  TIMELINE: 10,
} as const;

/**
 * Infinite scroll/load more increments
 */
export const LOAD_MORE_INCREMENT = 6;

/**
 * Maximum items to show in preview sections (e.g., homepage featured items)
 */
export const PREVIEW_LIMIT = {
  /** Featured certifications on homepage */
  FEATURED_CERTIFICATIONS: 3,
  /** Featured projects on homepage */
  FEATURED_PROJECTS: 3,
  /** Latest blog posts */
  LATEST_BLOGS: 3,
  /** Recent testimonials */
  RECENT_TESTIMONIALS: 5,
} as const;

/**
 * Search result limits
 */
export const SEARCH_RESULTS_LIMIT = 50;

/**
 * Filter dropdown max visible items before scroll
 */
export const FILTER_DROPDOWN_MAX_ITEMS = 10;
