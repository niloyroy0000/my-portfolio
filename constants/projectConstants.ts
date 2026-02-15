/**
 * Category color mapping for project badges
 * Used across ProjectCard, ProjectTimeline, and ProjectModal
 *
 * Each category has a consistent solid background with border and text colors
 */
export const CATEGORY_COLORS: Record<string, string> = {
  "Full-Stack": "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
  "Frontend": "bg-blue-500/15 border-blue-500/40 text-blue-300",
  "Backend": "bg-purple-500/15 border-purple-500/40 text-purple-300",
  "Mobile": "bg-orange-500/15 border-orange-500/40 text-orange-300",
  "Desktop Application": "bg-indigo-500/15 border-indigo-500/40 text-indigo-300",
};

/**
 * Helper function to get category color classes
 * Provides fallback for unknown categories
 *
 * @param category - Project category
 * @returns Tailwind CSS class string
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || "bg-gray-500/15 border-gray-500/40 text-gray-300";
}

/**
 * Company logo path mapping
 * Used for displaying company logos in project badges
 */
export const COMPANY_LOGOS: Record<string, string> = {
  "Brain Station-23": "/assets/company-icon/webp/brain-station-23.webp",
  "Chorki Limited": "/assets/company-icon/webp/chorki.webp",
  "Kaz Software": "/assets/company-icon/webp/kaz.webp",
  "Optimizely": "/assets/company-icon/webp/opti.webp",
};

/**
 * Helper function to get company logo path
 * Returns null if company has no logo
 *
 * @param company - Company name
 * @returns Logo path or null
 */
export function getCompanyLogo(company: string): string | null {
  return COMPANY_LOGOS[company] || null;
}
