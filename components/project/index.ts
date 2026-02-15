/**
 * Centralized exports for all project components
 *
 * Import any project component from a single location:
 * import { CategoryBadge, TechStack, ProjectSkills } from '@/components/project';
 */

// Badge Components
export {
  CategoryBadge,
  OpenSourceBadge,
  RecognitionBadge,
  StatusBadge,
  StatusBadgeIcon,
  FeaturedBadge,
  PrimaryMetricBadge,
  CurrentBadge,
  CompanyIcon,
  BadgeSeparator,
  BadgeRow,
} from './ProjectBadges';

// Shared UI Components
export {
  GradientDivider,
  SectionHeader,
  CompactSectionHeader,
  CardContainer,
  SubsectionHeader,
} from './SharedUI';

// Tech Stack Components
export {
  TechStack,
  TechStackList,
} from './TechStack';
export type { TechStackProps } from './TechStack';

// Skills Components
export {
  ProjectSkills,
  SkillsList,
} from './ProjectSkills';
export type { ProjectSkillsProps } from './ProjectSkills';

// Metadata Components
export {
  ProjectTimeline,
  ProjectRole,
  MetadataRow,
  MetadataItem,
  formatDate,
  formatDuration,
  calculateDurationMonths,
} from './ProjectMetadata';
