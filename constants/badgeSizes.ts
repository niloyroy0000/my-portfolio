/**
 * Standardized badge size classes for consistent styling
 * across ProjectCard, ProjectTimeline, and ProjectModal
 *
 * BADGE STYLING PHILOSOPHY (Phase 8 - Updated 2025-11-21):
 * - Solid backgrounds (no gradients) for cleaner appearance
 * - Category-specific colors defined in projectConstants.ts
 * - Consistent h-7 (28px) height for perfect vertical alignment
 * - Flexbox centering for reliable cross-browser rendering
 *
 * BADGE SIZE HIERARCHY:
 * - text-xs (12px): Standard badges - Status, Primary Metric
 * - text-[11px]: Compact badges - Category, Open Source, Key Skills
 * - text-[10px]: Minimal badges - Recognition
 *
 * REMOVED IN PHASE 8:
 * - COMPANY_BADGE_CLASSES (replaced with inline text @ CompanyName)
 */

/**
 * Status badge (Active/Completed)
 * Size: Standard (text-xs) with strict h-7 (28px) height
 * Updated: Using flexbox centering instead of padding-y for perfect vertical alignment
 */
export const STATUS_BADGE_CLASSES = "h-5 text-xs px-3 rounded-full font-medium";

/**
 * Featured badge
 * Size: Standard (text-xs) with strict h-7 (28px) height
 * Updated: Using flexbox centering instead of padding-y for perfect vertical alignment
 */
export const FEATURED_BADGE_CLASSES = "h-5 text-xs px-2.5 rounded-sm font-semibold";

/**
 * Open Source badge
 * Size: Small (text-[11px]) with strict h-7 (28px) height
 * Updated: Using flexbox centering instead of padding-y for perfect vertical alignment
 */
export const OPEN_SOURCE_BADGE_CLASSES = "h-5 text-[11px] px-2.5 rounded-sm font-semibold";

/**
 * Recognition/Awards badge
 * Size: Compact (text-[10px]) with strict h-7 (28px) height - Reduced for Phase 8 refinement
 * Updated: Using flexbox centering instead of padding-y for perfect vertical alignment
 */
export const RECOGNITION_BADGE_CLASSES = "h-5 text-[11px] px-2 rounded-sm font-semibold";

/**
 * Primary Metric badge (on image)
 * Size: Standard (text-xs) with strict h-7 (28px) height
 * Updated: Using flexbox centering instead of padding-y for perfect vertical alignment
 * Responsive: Smaller text on mobile to prevent wrapping
 */
export const PRIMARY_METRIC_BADGE_CLASSES = "h-5 text-[10px] sm:text-xs px-2 sm:px-3 rounded-full font-semibold";

/**
 * Primary Metric badge for Modal (slightly larger on hero image)
 * Size: Slightly larger (text-sm) with h-8 (32px) for prominence
 * Updated: Using flexbox centering instead of padding-y for perfect vertical alignment
 * Responsive: Smaller text on mobile to prevent wrapping
 */
export const PRIMARY_METRIC_BADGE_MODAL_CLASSES = "h-6 sm:h-7 text-xs sm:text-sm px-2 sm:px-4 rounded-full font-semibold";

/**
 * Category badge
 * Size: Compact (text-[11px]) with strict h-7 (28px) height - Reduced for Phase 8 refinement
 * Updated: Using flexbox centering instead of padding-y for perfect vertical alignment
 */
export const CATEGORY_BADGE_CLASSES = "h-5 text-[11px] px-2.5 rounded-sm font-light uppercase tracking-wide";

/**
 * Key Skills badge
 * Size: Compact (text-[11px]) with strict h-7 (28px) height - Reduced for Phase 8 refinement to fit more in one line
 * Updated: Using flexbox centering instead of padding-y for perfect vertical alignment
 */
export const KEY_SKILLS_BADGE_CLASSES = "h-7 text-[11px] px-2 rounded-md font-medium";

/**
 * Key Skills badge for Modal (slightly larger)
 * Size: Standard (text-sm) with h-7 (28px) height
 * Updated: Using flexbox centering instead of padding-y for perfect vertical alignment
 */
export const KEY_SKILLS_BADGE_MODAL_CLASSES = "h-7 text-sm px-3 rounded-md font-medium";
