# Project Components Design System

**Last Updated**: November 20, 2025
**Version**: 1.0.0 (Phase 2 Complete)

## 📋 Table of Contents

1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Badge System](#badge-system)
4. [Shared Components](#shared-components)
5. [Usage Examples](#usage-examples)
6. [Color Palette](#color-palette)
7. [Responsive Behavior](#responsive-behavior)
8. [Accessibility](#accessibility)

---

## Overview

This design system provides a unified set of reusable components for displaying project information across the portfolio website. All components follow consistent styling, behavior, and accessibility patterns.

### Goals
- **Consistency**: Same visual language across Grid, Timeline, and Modal views
- **Maintainability**: Single source of truth for all badge and UI components
- **Reusability**: Components work across different contexts with minimal configuration
- **Performance**: Optimized rendering with proper memoization
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

---

## Component Architecture

### File Structure

```
components/
├── ui/
│   └── SimpleTooltip.tsx       # Lightweight CSS-based tooltips
└── project/
    ├── index.ts                # Centralized exports
    ├── ProjectBadges.tsx       # All badge components
    ├── SharedUI.tsx            # UI utilities (dividers, headers, containers)
    ├── TechStack.tsx           # Tech stack display with expansion
    ├── ProjectSkills.tsx       # Skills display with smart rendering
    └── ProjectMetadata.tsx     # Timeline, role, and metadata components
```

### Import Pattern

```typescript
// Single import for all project components
import {
  CategoryBadge,
  TechStack,
  ProjectSkills,
  // ... other components
} from '@/components/project';
```

---

## Badge System

### Design Philosophy (Phase 8 Standards)

- **Strict Heights**: All badges use `h-7` (28px) for perfect alignment
- **Solid Backgrounds**: No gradients on badges (cleaner appearance)
- **Color Coding**: Category-specific colors for quick identification
- **Consistent Spacing**: `gap-2` between badges in BadgeRow

### Badge Components

#### 1. **CategoryBadge**

Displays project category with color coding.

```tsx
<CategoryBadge category="Full-Stack" />
```

**Colors**:
- Full-Stack: Emerald (`bg-emerald-500/15`)
- Frontend: Blue (`bg-blue-500/15`)
- Backend: Purple (`bg-purple-500/15`)
- Mobile: Orange (`bg-orange-500/15`)
- Windows App: Yellow (`bg-yellow-500/15`)

**Props**: None (uses constants from `projectConstants.ts`)

---

#### 2. **OpenSourceBadge**

Indicates open-source projects.

```tsx
// Icon-only (with tooltip)
<OpenSourceBadge variant="icon" />

// With text
<OpenSourceBadge variant="text" />
```

**Variants**:
- `icon`: Icon-only (7x7) with tooltip
- `text`: Icon + "Open Source" text

**Color**: Green (`bg-green-500/20`, `border-green-500/40`)

---

#### 3. **RecognitionBadge**

Shows award/recognition count with rich tooltip.

```tsx
<RecognitionBadge recognitions={project.recognition} />
```

**Features**:
- Filters approved recognitions automatically
- Returns `null` if no recognitions
- Rich tooltip with all award details
- Color: Amber (`bg-amber-500/10`, `border-amber-400/30`)

---

#### 4. **StatusBadge & StatusBadgeIcon**

Displays project status (Active/Completed).

```tsx
// Inline version (with text)
<StatusBadge
  isActive={true}
  inactivationReason="Project archived in favor of v2"
/>

// Icon-only version (for image overlays)
<StatusBadgeIcon
  isActive={false}
  inactivationReason="Migrated to new platform"
/>
```

**States**:
- Active: Green with pulsing dot
- Completed: Red (with optional tooltip for reason)

---

#### 5. **FeaturedBadge**

Highlights featured projects.

```tsx
// Icon-only (for image overlays)
<FeaturedBadge variant="icon" />

// With text (for inline use)
<FeaturedBadge variant="text" />
```

**Color**: Purple-to-pink gradient

---

#### 6. **PrimaryMetricBadge**

Displays key performance metrics.

```tsx
const metric = getPrimaryMetric(project);

// Default size (for cards)
<PrimaryMetricBadge metric={metric} />

// Modal size (larger)
<PrimaryMetricBadge metric={metric} variant="modal" />

// Light mode (for timeline)
<PrimaryMetricBadge metric={metric} lightMode />
```

**Metric Types**:
- Efficiency: Emerald (`from-emerald-500`)
- Impact: Blue (`from-blue-500`)
- Performance: Purple (`from-purple-500`)
- Cost Savings: Orange (`from-orange-500`)
- Downloads: Blue (`from-blue-500`)

---

#### 7. **CompanyIcon**

Shows company logo or fallback icon.

```tsx
<CompanyIcon company="Brain Station-23" />
```

**Features**:
- Automatically fetches logo from `projectConstants.ts`
- Falls back to icon (building or user) if no logo
- Tooltip shows company name

---

#### 8. **BadgeSeparator**

Consistent divider between badges.

```tsx
<BadgeRow>
  <CategoryBadge category="Full-Stack" />
  <BadgeSeparator />
  <OpenSourceBadge variant="icon" />
</BadgeRow>
```

---

#### 9. **BadgeRow**

Container for badge groups with consistent spacing.

```tsx
<BadgeRow>
  {/* All badges */}
</BadgeRow>
```

**Default Classes**: `flex flex-wrap items-center gap-2`

---

## Shared Components

### UI Utilities

#### **GradientDivider**

Horizontal gradient line for section separation.

```tsx
<GradientDivider />
<GradientDivider className="my-4" />
```

**Color**: `via-secondary-default/40` (#00BFFF with 40% opacity)

---

#### **SectionHeader**

Large section header with icon.

```tsx
<SectionHeader icon={FaInfoCircle} title="Project Overview" />
```

**Used in**: Modal tabs

---

#### **CompactSectionHeader**

Small header with gradient lines.

```tsx
<CompactSectionHeader title="Key Skills" />
```

**Used in**: Cards, inline sections

---

#### **CardContainer**

Gradient background container for content blocks.

```tsx
<CardContainer>
  {/* Content */}
</CardContainer>
```

**Gradient**: `from-secondary-default/5 via-purple-500/5 to-blue-500/5`

---

#### **SubsectionHeader**

Small header with optional action button.

```tsx
<SubsectionHeader
  title="Tech Stacks"
  icon={<span className="w-1 h-1 rounded-full bg-secondary-default"></span>}
  action={<button>+5 more</button>}
/>
```

---

### TechStack Component

Unified tech stack display with smart expansion.

```tsx
// ProjectCard usage (2-column, expandable)
<TechStack
  stacks={project.stacks}
  columns={2}
  expandable
  onTechClick={handleFilter}
  selectedTech={selectedTech}
/>

// Timeline usage (3-column, expandable)
<TechStack
  stacks={project.stacks}
  columns={3}
  expandable
/>

// Modal usage (3-column, all visible)
<TechStack
  stacks={project.stacks}
  columns={3}
  expandable={false}
  title="Technology Stack"
/>
```

**Props**:
- `stacks`: Array of technology names
- `columns`: `2` (cards) or `3` (timeline/modal)
- `expandable`: Show "+X more" button
- `initialVisibleCount`: Default 6 for 2-col, 9 for 3-col
- `onTechClick`: Optional filter callback
- `selectedTech`: Currently selected tech for highlighting
- `title`: Custom section title (default: "Tech Stacks")

**Features**:
- Smart column layout (2-col for cards, 3-col for timeline/modal)
- Expansion state managed internally
- Click handlers for filtering
- Selected state highlighting with scale effect

---

### ProjectSkills Component

Smart skills display with context-aware rendering.

```tsx
// Expandable mode (ProjectCard)
<ProjectSkills
  skills={project.skillsHighlighted}
  displayMode="expandable"
  initialVisibleCount={2}
  selectedSkill={selectedSkill}
  onSkillClick={handleFilter}
/>

// All visible mode (Timeline/Modal)
<ProjectSkills
  skills={project.skillsHighlighted}
  displayMode="all"
/>

// Without header
<ProjectSkills
  skills={project.skillsHighlighted}
  displayMode="all"
  showHeader={false}
/>
```

**Props**:
- `skills`: Array of skill names
- `displayMode`: `"expandable"` or `"all"`
- `initialVisibleCount`: Default 2
- `selectedSkill`: Currently selected skill
- `onSkillClick`: Optional filter callback
- `showHeader`: Show "Key Skills" header (default: true)
- `title`: Custom header title

**Features**:
- Context-aware display (expandable vs all)
- Compact Section Header with gradient lines
- Skill chips with hover states
- Filter integration

---

### ProjectMetadata Components

#### **ProjectTimeline**

Displays date range and duration.

```tsx
<ProjectTimeline
  startDate={project.startDate}
  endDate={project.endDate}
  className="mb-3"
/>
```

**Output**: "Jan 2024 - Nov 2025 • 10 months"

**Helper Functions**:
- `formatDate(date)`: "Jan 2024"
- `formatDuration(months)`: "1y 2m" or "10 months"
- `calculateDurationMonths(start, end)`: Number of months

---

#### **ProjectRole**

Displays job role with icon.

```tsx
<ProjectRole role="Senior Developer" />
```

---

#### **MetadataRow**

Container for metadata items.

```tsx
<MetadataRow>
  <ProjectRole role="..." />
  <ProjectTimeline startDate={...} endDate={...} />
</MetadataRow>
```

---

#### **MetadataItem**

Generic metadata display with icon.

```tsx
<MetadataItem
  icon={FaBuilding}
  label="Company Name"
  iconColor="text-blue-400"
/>
```

---

## Usage Examples

### ProjectCard Integration

```tsx
import {
  CategoryBadge,
  OpenSourceBadge,
  RecognitionBadge,
  StatusBadgeIcon,
  FeaturedBadge,
  PrimaryMetricBadge,
  CompanyIcon,
  BadgeSeparator,
  BadgeRow,
  TechStack,
  ProjectSkills,
  ProjectTimeline,
  ProjectRole,
} from '@/components/project';

// In component render
<div className="project-card">
  {/* Image overlay badges */}
  <div className="absolute top-2 right-2 flex flex-col gap-2">
    {isFeatured && <FeaturedBadge variant="icon" />}
    <StatusBadgeIcon
      isActive={project.isActive}
      inactivationReason={project.inactivationReason}
    />
  </div>

  {/* Primary metric */}
  {primaryMetric && (
    <div className="absolute bottom-2 left-2">
      <PrimaryMetricBadge metric={primaryMetric} />
    </div>
  )}

  {/* Title with company icon */}
  <div className="flex items-center gap-2">
    <CompanyIcon company={project.associatedWithCompany} />
    <h3>{project.title}</h3>
  </div>

  {/* Badge row */}
  <BadgeRow>
    <CategoryBadge category={project.category} />
    <BadgeSeparator />
    {project.isOpenSource && <OpenSourceBadge variant="icon" />}
    {project.recognition?.length > 0 && (
      <>
        <BadgeSeparator />
        <RecognitionBadge recognitions={project.recognition} />
      </>
    )}
  </BadgeRow>

  {/* Metadata */}
  <ProjectRole role={project.jobRole} />
  <ProjectTimeline startDate={project.startDate} endDate={project.endDate} />

  {/* Skills */}
  <ProjectSkills
    skills={project.skillsHighlighted}
    displayMode="expandable"
    selectedSkill={selectedSkill}
    onSkillClick={handleFilter}
  />

  {/* Tech stack */}
  <TechStack
    stacks={project.stacks}
    columns={2}
    expandable
    selectedTech={selectedTech}
    onTechClick={handleFilter}
  />
</div>
```

---

## Color Palette

### Primary Colors

- **Primary**: `#1c1c22` (Dark background)
- **Secondary**: `#00BFFF` (Cyan - used for highlights, buttons, gradients)

### Badge Colors

| Element | Color | Usage |
|---------|-------|-------|
| **Category: Full-Stack** | Emerald (`#10b981`) | Category badge background |
| **Category: Frontend** | Blue (`#3b82f6`) | Category badge background |
| **Category: Backend** | Purple (`#a855f7`) | Category badge background |
| **Category: Mobile** | Orange (`#f97316`) | Category badge background |
| **Category: Windows App** | Yellow (`#eab308`) | Category badge background |
| **Open Source** | Green (`#22c55e`) | Badge background/border |
| **Featured** | Purple-Pink Gradient | Featured badge |
| **Active Status** | Green (`#22c55e`) | Active project badge |
| **Completed Status** | Red (`#ef4444`) | Completed project badge |
| **Recognition** | Amber (`#f59e0b`) | Awards badge |

### Metric Colors

| Metric Type | Gradient | Icon |
|-------------|----------|------|
| **Efficiency** | Emerald to Green | FaRocket |
| **Impact** | Blue to Cyan | FaUsers |
| **Performance** | Purple to Pink | FaChartLine |
| **Cost Savings** | Orange to Amber | FaChartLine |
| **Downloads** | Blue to Cyan | FaUsers |

---

## Responsive Behavior

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1279px
- **Desktop**: ≥ 1280px

### Component Adaptations

#### TechStack
- **2-column layout**: Always 2 columns (ProjectCard)
- **3-column layout**:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns

#### Badge Rows
- **All views**: `flex-wrap` ensures badges wrap on smaller screens
- **Gap**: Consistent `gap-2` for spacing

#### Skills
- **Expandable mode**: Shows 2 skills initially, expands to show all
- **All mode**: Shows all skills with automatic wrapping

---

## Accessibility

### ARIA Labels

All interactive components include proper ARIA labels:

```tsx
// Tech stack item
<button
  aria-label="Filter projects by React"
  aria-pressed={isSelected}
>
  React
</button>

// Skill chip
<button
  aria-label="Filter projects by skill: TypeScript"
  aria-pressed={isSelected}
>
  TypeScript
</button>
```

### Keyboard Navigation

- All clickable items are `<button>` elements
- Focus states with visible outline (`focus:ring-2`)
- Tab order follows visual layout

### Screen Readers

- Tooltips have `role="tooltip"`
- Badge containers have proper semantic structure
- Section headers use semantic heading tags

### Color Contrast

All text meets WCAG AA standards:
- White text on colored backgrounds: 4.5:1 minimum
- Colored text on dark backgrounds: 4.5:1 minimum

---

## Maintenance Guidelines

### Adding New Badge Types

1. Create badge component in `ProjectBadges.tsx`
2. Define badge classes in `constants/badgeSizes.ts`
3. Add color mapping to `constants/projectConstants.ts` (if needed)
4. Export from `components/project/index.ts`
5. Document in this file

### Updating Colors

1. Update color constants in `projectConstants.ts`
2. Update this documentation
3. Run visual regression tests

### Modifying Component APIs

1. Update component props and TypeScript interfaces
2. Update all usage locations
3. Update this documentation with new examples
4. Add migration notes if breaking changes

---

## Version History

### v1.0.0 (November 20, 2025) - Phase 2 Complete
- Initial release of unified project components
- All badges standardized to h-7 (28px)
- Shared components created: TechStack, ProjectSkills, ProjectMetadata
- Z-index centralized in constants
- 40% code reduction through refactoring

---

## Support & Questions

For questions or issues with these components:
1. Check this documentation first
2. Review component source code in `components/project/`
3. Check usage examples in `ProjectCard.tsx`, `ProjectTimeline.tsx`, `ProjectModal.tsx`

---

**End of Documentation**
