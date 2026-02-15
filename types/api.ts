/**
 * API Response Types
 *
 * TypeScript types matching the portfolio-admin API responses.
 * These types are used when fetching data from the deployed API.
 */

// ==================== ENUMS ====================

export interface Enums {
  projectCategories: string[];
  companies: string[];
  jobRoles: string[];
  certCategories: string[];
  certStatuses: string[];
  skillLevels: string[];
  jobTypes: string[];
  blogCategories: string[];
}

// ==================== PROJECTS ====================

export interface ProjectMetrics {
  efficiency?: string;
  users?: string;
  revenue?: string;
  performance?: string;
  downloads?: string;
  github_stars?: string;
  other?: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  linkedinUrl?: string;
  approved?: boolean;
  shouldPublish?: boolean;
  isSampleData?: boolean;
}

export interface CaseStudy {
  problem: string;
  solution: string;
  architectureDiagram?: string;
  results: string[];
  technicalHighlights?: string[];
}

export interface Recognition {
  title: string;
  description: string;
  icon?: string;
  approved?: boolean;
  shouldPublish?: boolean;
  isSampleData?: boolean;
}

export interface Project {
  _id: string;
  num: number;
  category: string;
  title: string;
  subtitle?: string;
  longDescription?: string; // V2: Made optional
  shortDescription: string;
  stacks: string[];
  image: string;
  thumbImage?: string;
  isActive: boolean;
  isOpenSource: boolean;
  isFeatured?: boolean;
  isLegacy?: boolean;
  url: string;
  github: string;
  associatedWithCompany: string;
  jobRole: string;
  startDate: string | Date;
  endDate?: string | Date | null; // Optional for ongoing projects (when isCurrent = true)
  isCurrent?: boolean; // V2: For ongoing projects
  inactivationReason?: string | null;
  responsibilities?: string[];
  metrics?: ProjectMetrics;
  testimonials?: Testimonial[];
  caseStudy?: CaseStudy;
  recognition?: Recognition[];
  skillsHighlighted?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// ==================== CERTIFICATIONS ====================

export interface Certification {
  _id: string;
  name: string;
  issuer: string;
  date: string; // V2: Supports YYYY, YYYY-MM, YYYY-MM-DD formats
  expiryDate?: string;
  credentialId?: string;
  link?: string;
  description?: string;
  skills?: string[];
  featured: boolean;
  showByDefault?: boolean;
  image?: string;
  thumbImage?: string;
  category: string;
  isUpcoming?: boolean;
  issuerLogo?: string;
  status?: string;
  onlineVerifiable?: boolean;
  certificationNumber?: string;
  order: number; // V2: Custom ordering
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// ==================== SKILLS ====================
// V2: Flat structure with SkillType + SkillItem (no more hierarchical SkillTree)

export interface SkillType {
  _id: string;
  name: string;
  parentSkillType?: {
    _id: string;
    name: string;
  } | null;
  order: number;
  icon?: string;
  description?: string;
  isActive: boolean;
  skills?: SkillItem[]; // Populated skills for this type
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface SkillItem {
  _id: string;
  name: string;
  skillType: {
    _id: string;
    name: string;
  };
  level: 'Expert' | 'Advanced' | 'Intermediate' | 'Familiar';
  yearsOfExperience?: number;
  lastUsed?: string; // V2: Can be ISO date string or "Current" for actively used skills
  icon?: string;
  description?: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// ==================== TIMELINE ====================

export interface TimelineEntry {
  _id: string;
  position: string;
  company: string;
  location: string;
  address?: string; // V2: Work location address
  startDate: string;
  endDate?: string; // Optional when isCurrent = true
  isCurrent?: boolean; // V2: Current position flag
  responsibilities: string[];
  icon?: string;
  url?: string;
  jobType: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// ==================== TESTIMONIALS ====================

export interface TestimonialData {
  _id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  linkedinUrl?: string;
  image?: string; // Optional avatar image
  order: number; // V2: Custom ordering
  shouldPublish: boolean;
  isSampleData?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// ==================== BLOG ====================

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  coverImage?: string;
  publishedAt?: string;
  updatedAt?: string;
  isPublished: boolean;
  readingTime?: number;
  order: number; // V2: Custom ordering
  createdAt?: string;
  __v?: number;
}

// ==================== PORTFOLIO METADATA ====================

export interface PortfolioMetadata {
  _id?: string;
  siteTitle: string;
  tagline: string;
  metaDescription: string;
  fullName: string;
  role: string;
  contactEmail: string;
  profilePhotoUrl: string;
  resumeUrl: string;
  portfolioUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
    medium: string;
    stackoverflow: string;
  };
  contactInfo?: {
    phone: string;
    whatsapp: string;
    teams: string;
    location: string;
  };
  bio?: {
    short: string;    // 1-2 sentences for hero section
    medium: string;   // 3-4 sentences for homepage
    long: string;     // Full bio for about page
  };
  heroAnimation?: {
    phrases: string[];
    typingSpeed: number;
    deletingSpeed: number;
    pauseDuration: number;
  };
  seo?: {
    keywords: string[];
    ogImage: string;
    twitterCard: string;
    twitterHandle: string;
  };
  displaySettings?: {
    showLookingForSection: boolean;
  };
  isSingleton?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== ACHIEVEMENTS ====================

export type AchievementColor = "emerald" | "golden" | "blue" | "purple" | "pink";

export type AchievementIcon =
  | "FaStar"
  | "FaRocket"
  | "FaTrophy"
  | "FaAward"
  | "FaChartLine"
  | "FaDollarSign"
  | "FaBolt"
  | "FaFire"
  | "FaGem"
  | "FaCrown"
  | "FaCheckCircle"
  | "FaLightbulb"
  | "FaHeart"
  | "FaThumbsUp"
  | "FaShieldAlt";

export interface Achievement {
  _id?: string;
  title: string;
  value: string;        // e.g., "80-90%", "$180K", "10x"
  metric?: string;      // e.g., "Efficiency", "Cost Savings"
  description: string;  // Full text shown on site
  icon: AchievementIcon;
  color: AchievementColor;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
