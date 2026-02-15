/**
 * API Client for Portfolio Admin
 *
 * Fetches data from the deployed portfolio-admin API at build time (SSG).
 * All endpoints are public and CORS-enabled for GitHub Pages.
 *
 * V2 Schema Integration:
 * - All custom `id` fields removed (use `_id` only)
 * - Projects: Added `isCurrent`, `longDescription` is now optional
 * - Certifications: Added `order` for custom sorting
 * - Skills: Flat structure (SkillType[] with nested SkillItem[])
 * - Timeline: Added `address` and `isCurrent`
 * - Testimonials/Blog: Added `order` for custom sorting
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://portfolio-admin-blue.vercel.app';

/**
 * V2 Field Helpers - Safe access to optional V2 fields
 */
export const v2Helpers = {
  /** Get project status (current or completed) */
  isCurrentProject: (project: any) => project?.isCurrent ?? false,

  /** Get certification order (fallback to 0) */
  getCertOrder: (cert: any) => cert?.order ?? 0,

  /** Get skill type order (fallback to 0) */
  getSkillOrder: (skill: any) => skill?.order ?? 0,

  /** Get timeline address (fallback to location) */
  getAddress: (timeline: any) => timeline?.address ?? timeline?.location ?? '',

  /** Check if timeline entry is current position */
  isCurrentPosition: (timeline: any) => timeline?.isCurrent ?? false,

  /** Get testimonial order (fallback to 0) */
  getTestimonialOrder: (testimonial: any) => testimonial?.order ?? 0,

  /** Get blog post order (fallback to 0) */
  getBlogOrder: (post: any) => post?.order ?? 0,
};

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Revalidate every 24 hours for SSG
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data as T;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fetch all enums (dropdown values) for filters and forms
 */
export async function fetchEnums() {
  return fetchAPI<{
    projectCategories: string[];
    companies: string[];
    jobRoles: string[];
    certCategories: string[];
    certStatuses: string[];
    skillLevels: string[];
    jobTypes: string[];
    blogCategories: string[];
  }>('/api/public/enums');
}

/**
 * Fetch all projects
 */
export async function fetchProjects(params?: {
  category?: string;
  company?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  limit?: number;
  page?: number;
}) {
  const queryParams = new URLSearchParams();

  if (params?.category) queryParams.append('category', params.category);
  if (params?.company) queryParams.append('company', params.company);
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
  if (params?.isFeatured !== undefined) queryParams.append('isFeatured', String(params.isFeatured));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.page) queryParams.append('page', String(params.page));

  const query = queryParams.toString();
  const endpoint = `/api/public/projects${query ? `?${query}` : ''}`;

  const projects = await fetchAPI<any[]>(endpoint);

  // Convert date strings to Date objects (keep endDate as null for ongoing projects)
  return projects.map(project => ({
    ...project,
    startDate: project.startDate ? new Date(project.startDate) : new Date(),
    endDate: project.endDate ? new Date(project.endDate) : null,
  }));
}

/**
 * Fetch all certifications
 */
export async function fetchCertifications(params?: {
  category?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}) {
  const queryParams = new URLSearchParams();

  if (params?.category) queryParams.append('category', params.category);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.featured !== undefined) queryParams.append('featured', String(params.featured));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.page) queryParams.append('page', String(params.page));

  const query = queryParams.toString();
  const endpoint = `/api/public/certifications${query ? `?${query}` : ''}`;

  return fetchAPI<any[]>(endpoint);
}

/**
 * Fetch skill hierarchy
 * V2: Returns flat SkillType[] with nested SkillItem[]
 * Structure: [{ _id, name, order, icon, skills: [{ _id, name, level, ... }] }]
 */
export async function fetchSkillHierarchy() {
  const skillTypes = await fetchAPI<any[]>('/api/public/skill-hierarchy');

  // V2: Data comes as flat SkillType[] with populated skills
  // No transformation needed - return as-is
  return skillTypes;
}

/**
 * Fetch all timeline entries (career experience)
 */
export async function fetchTimeline() {
  const timeline = await fetchAPI<any[]>('/api/public/timeline');

  // Convert date strings to Date objects
  return timeline.map(entry => ({
    ...entry,
    startDate: entry.startDate ? new Date(entry.startDate) : new Date(),
    endDate: entry.endDate ? new Date(entry.endDate) : null,
  }));
}

/**
 * Fetch all testimonials
 */
export async function fetchTestimonials() {
  return fetchAPI<any[]>('/api/public/testimonials');
}

/**
 * Fetch all blog posts
 */
export async function fetchBlogPosts(params?: {
  category?: string;
  isPublished?: boolean;
  limit?: number;
  page?: number;
}) {
  const queryParams = new URLSearchParams();

  if (params?.category) queryParams.append('category', params.category);
  if (params?.isPublished !== undefined) queryParams.append('isPublished', String(params.isPublished));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.page) queryParams.append('page', String(params.page));

  const query = queryParams.toString();
  const endpoint = `/api/public/blog${query ? `?${query}` : ''}`;

  return fetchAPI<any[]>(endpoint);
}

/**
 * Fetch portfolio metadata (site settings, display toggles)
 * Public endpoint - CORS-enabled for static site access
 */
export async function fetchPortfolioMetadata() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/metadata`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Revalidate every hour for metadata changes
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn('Portfolio metadata not available, using defaults');
      return {
        displaySettings: {
          showLookingForSection: false,
        },
      };
    }

    const result = await response.json();
    return result.data || {
      displaySettings: {
        showLookingForSection: false,
      },
    };
  } catch (error) {
    console.error('Failed to fetch portfolio metadata:', error);
    return {
      displaySettings: {
        showLookingForSection: false,
      },
    };
  }
}

/**
 * Fetch achievements/highlights
 * Public endpoint - CORS-enabled for static site access
 */
export async function fetchAchievements(params?: {
  activeOnly?: boolean;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();

  if (params?.activeOnly !== undefined) {
    queryParams.append('activeOnly', String(params.activeOnly));
  }
  if (params?.limit) {
    queryParams.append('limit', String(params.limit));
  }

  const query = queryParams.toString();
  const endpoint = `/api/public/achievements${query ? `?${query}` : ''}`;

  try {
    const data = await fetchAPI<any[]>(endpoint);
    return data;
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    // Return empty array as fallback
    return [];
  }
}
