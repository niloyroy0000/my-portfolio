# MongoDB Migration Analysis Report

**Analysis Date:** November 20, 2025
**Current Data Volume:** ~132 KB
**Total Files Analyzed:** 6 TypeScript files
**Target Backend:** Next.js API Routes + MongoDB

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Complete File Inventory](#complete-file-inventory)
3. [Critical Issues Identified](#critical-issues-identified)
4. [Detailed Schema Analysis](#detailed-schema-analysis)
5. [Recommended MongoDB Schema Design](#recommended-mongodb-schema-design)
6. [Next.js API Routes Architecture](#nextjs-api-routes-architecture)
7. [Performance Optimization Recommendations](#performance-optimization-recommendations)
8. [Migration Strategy](#migration-strategy)
9. [Data Quality Improvements](#data-quality-improvements)
10. [Cost & Hosting Recommendations](#cost--hosting-recommendations)
11. [Summary & Next Steps](#summary--next-steps)

---

## Executive Summary

The `biswajitpanday.github.io\data\` folder contains **6 TypeScript files** that serve as the data layer for a portfolio website. The data is currently stored as static TypeScript exports, suitable for a static site but requiring migration to MongoDB for dynamic content management.

### Current Data Inventory

| Metric | Count |
|--------|-------|
| **Projects** | 23 (8 featured, 15 active) |
| **Certifications** | 43 (26 verifiable online) |
| **Skills** | 75+ technologies |
| **Timeline Entries** | 4 career positions |
| **Companies** | 4 (Optimizely, Kaz Software, Chorki, Brain Station-23) |
| **Total Data Size** | ~132 KB |

### Key Findings

**✅ Strengths:**
- Well-structured TypeScript interfaces with clear type definitions
- Rich project data with metrics, testimonials, and case studies
- Comprehensive certification tracking with verification links
- Hierarchical skill organization with proficiency levels and years of experience

**❌ Critical Issues:**
- No referential integrity (string-based references, no foreign keys)
- Massive data redundancy (companies, skills repeated across files)
- Inconsistent date formats (Date objects vs strings)
- String-based metrics cannot be sorted numerically
- Scalability limitations (static arrays, no pagination)

---

## Complete File Inventory

| File | Size | Lines | Purpose | Records |
|------|------|-------|---------|---------|
| `portfolioData.ts` | 75.5 KB | 1,349 | Project portfolio with case studies, metrics, testimonials | 23 projects |
| `certificationsData.ts` | 35.5 KB | 785 | Professional certifications, courses, training records | 43 certifications |
| `skillsData.ts` | 13.7 KB | 230 | Technical skills in hierarchical tree structure | 75+ skills |
| `timelineData.ts` | 3.5 KB | 75 | Career timeline with company experience | 4 timeline items |
| `navigationData.ts` | 775 B | 48 | Site navigation structure | 8 navigation links |
| `schemaData.ts` | 3.6 KB | 125 | SEO structured data (Schema.org) | Metadata only |

**File Locations:**
- `C:\D\PERSONAL\biswajitpanday-portfolio\biswajitpanday.github.io\data\portfolioData.ts`
- `C:\D\PERSONAL\biswajitpanday-portfolio\biswajitpanday.github.io\data\certificationsData.ts`
- `C:\D\PERSONAL\biswajitpanday-portfolio\biswajitpanday.github.io\data\skillsData.ts`
- `C:\D\PERSONAL\biswajitpanday-portfolio\biswajitpanday.github.io\data\timelineData.ts`
- `C:\D\PERSONAL\biswajitpanday-portfolio\biswajitpanday.github.io\data\navigationData.ts`
- `C:\D\PERSONAL\biswajitpanday-portfolio\biswajitpanday.github.io\data\schemaData.ts`

---

## Critical Issues Identified

### 1. No Referential Integrity (HIGH SEVERITY)

**Current State:**
```typescript
// Project references skill by string name
project.stacks = ["TypeScript", "React", "Node.js"]

// Certification references skill by string name
certification.skills = ["C#", "Design Patterns"]

// No validation these skills exist in skillsData
// Typos go unnoticed: "ReactJS" vs "React" vs "React.js"
```

**Problems:**
- Cannot enforce data consistency
- Typos and variations go undetected
- Difficult to update skill names globally
- No cascade updates or deletes

**MongoDB Solution:**
```javascript
{
  skillIds: [
    ObjectId("507f1f77bcf86cd799439011"),
    ObjectId("507f191e810c19729de860ea")
  ]  // References to skills collection
}
```

---

### 2. Massive Data Redundancy (HIGH SEVERITY)

**Company Names** repeated 15+ times:
- `portfolioData.ts`: "Optimizely" appears in 3 projects
- `timelineData.ts`: "Optimizely" as separate timeline entry
- No shared company entity or normalization

**Skills** duplicated across 3 files:
- `portfolioData.ts`: stacks[] and skillsHighlighted[]
- `certificationsData.ts`: skills[]
- `skillsData.ts`: hierarchical tree structure

**Naming Inconsistencies:**
- "ASP.NET Core" vs "ASP.NET Core 3.1" vs "ASP.NET Core 2.2"
- "TypeScript" vs "Typescript"
- "React" vs "ReactJS" vs "React.js"

**Impact:**
- Update anomalies (changing company name requires 15+ edits)
- Inconsistent capitalization and naming
- Wasted storage space

**MongoDB Solution:**
Create normalized `companies` and `skills` collections, reference by ObjectId

---

### 3. String-Based Metrics Cannot Be Sorted (MEDIUM SEVERITY)

**Current State:**
```typescript
metrics: {
  efficiency: "80% time reduction",
  users: "20+ enterprise clients",
  revenue: "55% cost reduction",
  performance: "15% defect reduction"
}
```

**Problems:**
- Cannot sort projects by actual metric values
- Cannot filter projects with efficiency > 50%
- Cannot aggregate or perform calculations
- String comparison gives wrong results: "9%" > "80%" (alphabetically)

**MongoDB Solution:**
```javascript
metrics: {
  efficiency: {
    value: 80,
    unit: "percent",
    description: "time reduction"
  },
  users: {
    value: 20,
    unit: "clients",
    description: "enterprise clients"
  }
}

// Now can query: find projects where metrics.efficiency.value > 50
```

---

### 4. Inconsistent Date Formats (MEDIUM SEVERITY)

**Two Different Formats Found:**

1. **Date objects** (portfolioData.ts, timelineData.ts):
```typescript
startDate: new Date(2023, 3, 1)  // April 1, 2023
endDate: new Date(2025, 10, 20)  // November 20, 2025
```

2. **String dates** (certificationsData.ts):
```typescript
date: "2024-12"
expiryDate: "2027-12"
```

**Problems:**
- Difficult to query across collections
- String dates don't validate properly
- Month confusion (JavaScript months are 0-indexed)
- Inconsistent parsing on frontend

**MongoDB Solution:**
Use ISODate consistently:
```javascript
dates: {
  issued: ISODate("2024-12-01T00:00:00.000Z"),
  expires: ISODate("2027-12-01T00:00:00.000Z")
}
```

---

### 5. Missing Critical Fields for Scalability

**Projects Missing:**
- `slug` (URL-friendly identifier for SEO)
- `viewCount`, `likeCount` (analytics)
- `tags[]` (multi-dimensional categorization)
- `createdAt`, `updatedAt` (audit trails)
- `status` enum (instead of boolean `isActive`)
- `priority`/`sortOrder` (manual ordering)

**Certifications Missing:**
- `completionDate` vs `issueDate` distinction
- `courseHours` or `creditHours`
- `provider` vs `issuer` distinction

**Skills Missing:**
- `skillId` (unique identifier)
- `projects[]` (backreference to projects using this skill)
- `category` (better organization than tree structure)

**Timeline Missing:**
- `timelineId` (unique identifier)
- `teamSize`, `budget`, `industryType`
- `achievements[]` (separate from responsibilities)

---

## Detailed Schema Analysis

### portfolioData.ts (1,349 lines)

**Main Interface:**
```typescript
interface Project {
  // Identifiers & Categorization
  num: number;
  category: "Full-Stack" | "Frontend" | "Backend" | "Mobile" | "Desktop Application";

  // Basic Information
  title: string;
  subtitle?: string;
  longDescription: string;
  shortDescription: string;
  stacks: string[];  // ⚠️ Should be skill references

  // Media Assets
  image: string;
  thumbImage?: string;

  // Status & Visibility
  isActive: boolean;
  isOpenSource: boolean;
  isFeatured?: boolean;
  inactivationReason: string | undefined;

  // Links
  url: string;
  github: string;

  // Employment Context
  associatedWithCompany: string;  // ⚠️ Should be company reference
  jobRole: string;

  // Timeline
  startDate: Date;
  endDate: Date;

  // Detailed Information
  responsibilities?: string[];
  skillsHighlighted?: string[];  // ⚠️ Duplicate of stacks

  // Social Proof & Impact
  metrics?: ProjectMetrics;  // ⚠️ String values, should be numeric
  testimonials?: Testimonial[];
  caseStudy?: CaseStudy;
  recognition?: Recognition[];
}
```

**Nested Interfaces:**

```typescript
interface ProjectMetrics {
  efficiency?: string;      // ⚠️ "80% time reduction" - cannot sort
  users?: string;           // ⚠️ "20+ enterprise clients" - cannot filter
  revenue?: string;
  performance?: string;
  downloads?: string;
  github_stars?: string;
  other?: string[];
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  approved?: boolean;
}

interface CaseStudy {
  problem: string;
  solution: string;
  results: string[];
  technicalHighlights?: string[];
  architectureDiagram?: string;  // ⚠️ Multi-line Mermaid code stored as string
}
```

**Data Statistics:**
- 23 total projects (2014-2025)
- 8 featured projects
- 5 open-source projects
- 15 active, 8 inactive
- Average 8-10 technologies per project

---

### certificationsData.ts (785 lines)

**Main Interface:**
```typescript
interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;  // ⚠️ String format: "2024-12"
  expiryDate?: string;
  credentialId?: string;
  link?: string;
  description?: string;
  skills?: string[];  // ⚠️ Should be skill references
  featured: boolean;
  image?: string;
  thumbImage?: string;
  category: "Professional" | "Course" | "Training";
  isUpcoming?: boolean;
  issuerLogo?: string;
  status?: "Active" | "Expired" | "Upcoming";
  onlineVerifiable?: boolean;
  certificationNumber?: string;
}
```

**Data Statistics:**
- 43 total certifications (IDs 1-43)
- Categories: Professional (4), Course (38)
- Issuers: Microsoft (1), Optimizely (1), LinkedIn Learning (7), Pluralsight (34)
- 3 featured certifications
- 26 online verifiable
- Date range: 2013-2025
- Skills coverage: Azure, C#, .NET, AI/ML, Design Patterns, Docker, Kubernetes

---

### skillsData.ts (230 lines)

**Hierarchical Structure:**
```typescript
interface SkillNode {
  name: string;
  metadata?: {
    icon: string;
    level?: "Expert" | "Advanced" | "Intermediate" | "Familiar";
    yearsOfExperience?: number;
    lastUsed?: string;  // ⚠️ String format: "2024", "Current"
  };
  children?: SkillNode[];  // ⚠️ Nested tree - hard to query in SQL/NoSQL
}
```

**Two Separate Trees:**
- **skills1**: Backend, frameworks, languages, databases, architectures
- **skills2**: Cloud, frontend, DevOps, AI/ML, testing tools

**Data Statistics:**
- 75+ total technologies
- Proficiency levels: Expert (18), Advanced (32), Intermediate (18), Familiar (7)
- Years of experience: 1-10 years
- 62+ current technologies

**Issues:**
- Difficult to query "all skills with level=Expert"
- Cannot easily link skills to projects
- Hard to flatten for API responses
- No unique IDs per skill

---

### timelineData.ts (75 lines)

**Main Interface:**
```typescript
interface TimelineItem {
  position: string;
  startDate: Date;
  endDate: Date;
  company: string;  // ⚠️ Should reference companies collection
  location: string;
  responsibilities: string[];
  icon: string;
  url: string;
  jobType: string[];
}
```

**Data Statistics:**
- 4 career positions (2014-present)
- Companies: Optimizely, Kaz Software, Chorki Limited, Brain Station-23
- All full-time positions
- 2-5 responsibilities per role

---

### navigationData.ts (48 lines)

**Main Interface:**
```typescript
interface NavigationLink {
  name: string;
  path: string;
  shortcut?: string;
}
```

**Data:**
- 8 navigation links with keyboard shortcuts
- Could remain as static config file (rarely changes)

---

### schemaData.ts (125 lines)

**Purpose:** SEO structured data (Schema.org)

Contains Person, Website, Organization schemas for SEO. Can stay as-is or be generated dynamically from MongoDB data.

---

## Recommended MongoDB Schema Design

### 5 Collections (Normalized Structure)

```
┌─────────────┐
│  companies  │ (4 documents)
├─────────────┤
│ _id         │
│ name        │
│ slug        │
│ url         │
│ location    │
│ icon        │
└─────────────┘
       ▲
       │ referenced by
       │
┌──────┴──────┐
│             │
┌─────────────┴──┐         ┌─────────────┐
│   projects     │◄────┐   │   skills    │ (75+ documents)
├────────────────┤     │   ├─────────────┤
│ _id            │     │   │ _id         │
│ slug           │     │   │ name        │
│ companyId ─────┘     │   │ slug        │
│ skillIds[] ──────────┼───│ category    │
│ metrics (embedded)   │   │ level       │
│ testimonials[]       │   │ icon        │
│ caseStudy {}         │   └─────────────┘
└────────────────┘         ▲
                           │
                           │ referenced by
                           │
                    ┌──────┴───────────┐
                    │ certifications   │ (43 documents)
                    ├──────────────────┤
                    │ _id              │
                    │ slug             │
                    │ skillIds[] ──────┘
                    │ dates {}         │
                    │ verification {}  │
                    └──────────────────┘

┌─────────────┐
│  timeline   │ (4 documents)
├─────────────┤
│ _id         │
│ companyId ──┼──► companies._id
│ period {}   │
└─────────────┘
```

---

### Collection 1: companies

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Optimizely",
  slug: "optimizely",
  url: "https://optimizely.com",
  location: "Dhaka, Bangladesh",
  icon: "/assets/company-icon/webp/opti.webp",
  industry: "Enterprise Software",
  createdAt: ISODate("2025-11-20T00:00:00.000Z"),
  updatedAt: ISODate("2025-11-20T00:00:00.000Z")
}
```

**Indexes:**
```javascript
db.companies.createIndex({ slug: 1 }, { unique: true });
db.companies.createIndex({ name: 1 });
```

---

### Collection 2: skills

```javascript
{
  _id: ObjectId("507f191e810c19729de860ea"),
  name: "TypeScript",
  slug: "typescript",
  category: "Programming Languages",
  icon: "SiTypescript",
  level: "Expert",
  yearsOfExperience: 7,
  lastUsed: "Current",
  parentSkillId: null,  // For hierarchical relationships
  metadata: {
    officialDocs: "https://www.typescriptlang.org/",
    versions: ["4.x", "5.x"]
  },
  createdAt: ISODate("2025-11-20T00:00:00.000Z"),
  updatedAt: ISODate("2025-11-20T00:00:00.000Z")
}
```

**Indexes:**
```javascript
db.skills.createIndex({ slug: 1 }, { unique: true });
db.skills.createIndex({ category: 1, level: 1 });
db.skills.createIndex({ name: "text" });
```

**Categories:**
- Programming Languages
- Frameworks
- Databases
- Cloud Platforms
- DevOps & Containerization
- Testing Tools
- AI/ML Technologies
- Architectures/Patterns
- Project Management Tools

---

### Collection 3: projects

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  slug: "spirewiz",
  category: "Desktop Application",
  title: "SpireWiz",
  subtitle: "AI-Powered Blueprint Upgrade Automation for Optimizely CMS",

  descriptions: {
    short: "AI-powered blueprint upgrade automation tool...",
    long: "Enterprise-grade AI-powered development tool..."
  },

  media: {
    image: "/assets/portfolio/webp/spireWiz.webp",
    thumbImage: "/assets/portfolio/thumbnails/spireWiz.webp"
  },

  // References (foreign keys)
  companyId: ObjectId("507f1f77bcf86cd799439011"),  // -> companies
  skillIds: [
    ObjectId("507f191e810c19729de860ea"),  // TypeScript
    ObjectId("507f191e810c19729de860eb")   // React
  ],

  // Embedded subdocuments (frequently accessed together)
  employment: {
    jobRole: "Senior Developer",
    startDate: ISODate("2025-05-01T00:00:00.000Z"),
    endDate: ISODate("2025-11-20T00:00:00.000Z"),
    responsibilities: [
      "Led development of AI-powered automation tool",
      "Designed and implemented blueprint upgrade system"
    ]
  },

  status: {
    isActive: true,
    isFeatured: true,
    isOpenSource: false,
    inactivationReason: null
  },

  links: {
    url: "https://optimizely.com",
    github: "",
    demo: null
  },

  // Structured metrics (numbers, not strings!)
  metrics: {
    efficiency: {
      value: 80,
      unit: "percent",
      description: "time reduction"
    },
    users: {
      value: 20,
      unit: "clients",
      description: "enterprise clients"
    },
    costReduction: {
      value: 55,
      unit: "percent",
      description: "cost reduction"
    }
  },

  // Embedded arrays (1-to-few relationship)
  testimonials: [{
    quote: "Exceptional work on the blueprint automation...",
    author: "John Doe",
    role: "CTO",
    company: "Enterprise Corp",
    approved: true
  }],

  caseStudy: {
    problem: "Manual blueprint upgrades were time-consuming...",
    solution: "Developed AI-powered automation tool...",
    results: [
      "Reduced upgrade time by 80%",
      "Served 20+ enterprise clients"
    ],
    technicalHighlights: [
      "Azure OpenAI integration",
      "Pattern matching algorithms"
    ],
    architectureDiagramUrl: "/diagrams/spirewiz.mmd"
  },

  recognition: [{
    title: "Featured Project",
    description: "Highlighted in company showcase",
    icon: "trophy",
    approved: true
  }],

  // Analytics & Metadata
  viewCount: 0,
  likeCount: 0,
  tags: ["AI", "Automation", "Enterprise"],
  createdAt: ISODate("2025-11-20T00:00:00.000Z"),
  updatedAt: ISODate("2025-11-20T00:00:00.000Z")
}
```

**Indexes:**
```javascript
db.projects.createIndex({ slug: 1 }, { unique: true });
db.projects.createIndex({ companyId: 1, "employment.startDate": -1 });
db.projects.createIndex({ skillIds: 1 });
db.projects.createIndex({ "status.isFeatured": 1, "employment.startDate": -1 });
db.projects.createIndex({ category: 1, "status.isActive": 1 });
db.projects.createIndex({
  title: "text",
  "descriptions.short": "text",
  "descriptions.long": "text"
});
```

---

### Collection 4: certifications

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  name: "Microsoft Certified: Azure Fundamentals",
  slug: "microsoft-azure-fundamentals",
  issuer: "Microsoft",
  category: "Professional",

  dates: {
    issued: ISODate("2024-12-01T00:00:00.000Z"),
    expires: ISODate("2027-12-01T00:00:00.000Z"),
    completedOn: ISODate("2024-11-25T00:00:00.000Z")
  },

  verification: {
    credentialId: "733CAA4F32A38510",
    certificationNumber: "EDV661-807157",
    verificationUrl: "https://learn.microsoft.com/api/credentials/share/en-us/...",
    isOnlineVerifiable: true
  },

  skillIds: [
    ObjectId("507f191e810c19729de860ec")  // Azure skill
  ],

  media: {
    image: "/assets/certificates/webp/azure-fundamentals.webp",
    thumbImage: "/assets/certificates/thumbnails/azure-fundamentals.webp",
    issuerLogo: "/assets/logos/webp/microsoft.webp"
  },

  status: "Active",  // Active | Expired | Upcoming
  featured: true,

  description: "Validated fundamental knowledge of cloud services...",

  createdAt: ISODate("2025-11-20T00:00:00.000Z"),
  updatedAt: ISODate("2025-11-20T00:00:00.000Z")
}
```

**Indexes:**
```javascript
db.certifications.createIndex({ slug: 1 }, { unique: true });
db.certifications.createIndex({ "dates.issued": -1 });
db.certifications.createIndex({ skillIds: 1 });
db.certifications.createIndex({ status: 1, featured: -1 });
```

---

### Collection 5: timeline

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  position: "Senior Developer",
  companyId: ObjectId("507f1f77bcf86cd799439011"),  // -> companies
  location: "Dhaka, Bangladesh",
  jobType: ["Full-Time", "Hybrid"],

  period: {
    startDate: ISODate("2023-04-01T00:00:00.000Z"),
    endDate: ISODate("2025-11-20T00:00:00.000Z"),  // null if current
    durationMonths: 32
  },

  responsibilities: [
    "Led development of SpireWiz AI automation tool",
    "Architected and implemented blueprint upgrade system"
  ],

  achievements: [
    "Reduced upgrade time by 80% across 20+ clients",
    "Delivered 3 major features ahead of schedule"
  ],

  metadata: {
    teamSize: 12,
    industryType: "Enterprise Software"
  },

  createdAt: ISODate("2025-11-20T00:00:00.000Z"),
  updatedAt: ISODate("2025-11-20T00:00:00.000Z")
}
```

**Indexes:**
```javascript
db.timeline.createIndex({ companyId: 1, "period.startDate": -1 });
db.timeline.createIndex({ "period.startDate": -1, "period.endDate": -1 });
```

---

### Design Decisions: Normalize vs Embed

**Normalize (separate collections):**
- ✅ **Companies** → High reuse across projects and timeline
- ✅ **Skills** → High reuse across projects, certifications, timeline
- ✅ **Users** (future) → Authentication, profiles, admin access

**Embed (subdocuments):**
- ✅ **Testimonials** → 1-to-few, tightly coupled with projects, always loaded together
- ✅ **Case Studies** → 1-to-1, always accessed with project details
- ✅ **Metrics** → 1-to-1, project-specific, frequently displayed
- ✅ **Recognition** → 1-to-few, project-specific

**Rationale:**
- MongoDB performs best with embedded documents for 1-to-1 or 1-to-few relationships that are always accessed together
- Use references (foreign keys) for many-to-many relationships or high-reuse entities
- Embedding reduces JOIN complexity and improves read performance

---

## Next.js API Routes Architecture

### Recommended Folder Structure

```
app/api/
├── companies/
│   ├── route.ts                      # GET /api/companies
│   └── [id]/
│       ├── route.ts                  # GET /api/companies/[id]
│       ├── projects/route.ts         # GET /api/companies/[id]/projects
│       └── timeline/route.ts         # GET /api/companies/[id]/timeline
├── skills/
│   ├── route.ts                      # GET /api/skills
│   ├── [id]/
│   │   ├── route.ts                  # GET /api/skills/[id]
│   │   └── projects/route.ts         # GET /api/skills/[id]/projects
│   └── categories/route.ts           # GET /api/skills/categories
├── projects/
│   ├── route.ts                      # GET /api/projects (list with filters)
│   ├── featured/route.ts             # GET /api/projects/featured
│   ├── [slug]/
│   │   ├── route.ts                  # GET /api/projects/[slug]
│   │   └── related/route.ts          # GET /api/projects/[slug]/related
│   └── category/
│       └── [category]/route.ts       # GET /api/projects/category/[category]
├── certifications/
│   ├── route.ts                      # GET /api/certifications
│   ├── featured/route.ts             # GET /api/certifications/featured
│   └── [id]/route.ts                 # GET /api/certifications/[id]
├── timeline/
│   └── route.ts                      # GET /api/timeline
├── search/
│   └── route.ts                      # GET /api/search?q=...
└── analytics/
    └── projects/
        └── [id]/
            ├── view/route.ts         # POST /api/analytics/projects/[id]/view
            └── like/route.ts         # POST /api/analytics/projects/[id]/like
```

---

### Example API Route: GET /api/projects

```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const skip = (page - 1) * limit;

    // Filters
    const filter: any = {};

    const category = searchParams.get('category');
    if (category) filter.category = category;

    const isFeatured = searchParams.get('isFeatured');
    if (isFeatured === 'true') filter['status.isFeatured'] = true;

    const isActive = searchParams.get('isActive');
    if (isActive === 'true') filter['status.isActive'] = true;

    const companyId = searchParams.get('companyId');
    if (companyId) filter.companyId = companyId;

    const skills = searchParams.get('skills');
    if (skills) {
      const skillArray = skills.split(',');
      filter.skillIds = { $in: skillArray };
    }

    // Sorting
    const sort = searchParams.get('sort') || 'startDate:desc';
    const [sortField, sortOrder] = sort.split(':');
    const sortObj: any = {};
    sortObj[`employment.${sortField}`] = sortOrder === 'desc' ? -1 : 1;

    // Query
    const projects = await Project.find(filter)
      .populate('companyId', 'name slug icon url')
      .populate('skillIds', 'name slug icon level')
      .select('-testimonials -caseStudy')  // Exclude heavy fields in list view
      .skip(skip)
      .limit(limit)
      .sort(sortObj)
      .lean();

    const total = await Project.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
```

---

### Example API Route: GET /api/projects/[slug]

```typescript
// app/api/projects/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToDatabase();

    const project = await Project.findOne({ slug: params.slug })
      .populate('companyId')
      .populate('skillIds')
      .lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Project.updateOne(
      { slug: params.slug },
      { $inc: { viewCount: 1 } }
    );

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
```

---

### Example Mongoose Schema

```typescript
// lib/models/Project.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IProject extends Document {
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  descriptions: {
    short: string;
    long: string;
  };
  media: {
    image: string;
    thumbImage?: string;
  };
  companyId: mongoose.Types.ObjectId;
  skillIds: mongoose.Types.ObjectId[];
  employment: {
    jobRole: string;
    startDate: Date;
    endDate: Date;
    responsibilities: string[];
  };
  status: {
    isActive: boolean;
    isFeatured: boolean;
    isOpenSource: boolean;
    inactivationReason?: string;
  };
  links: {
    url: string;
    github?: string;
    demo?: string;
  };
  metrics?: {
    efficiency?: { value: number; unit: string; description: string };
    users?: { value: number; unit: string; description: string };
    revenue?: { value: number; unit: string; description: string };
  };
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    company?: string;
    approved: boolean;
  }>;
  caseStudy?: {
    problem: string;
    solution: string;
    results: string[];
    technicalHighlights?: string[];
    architectureDiagramUrl?: string;
  };
  viewCount: number;
  likeCount: number;
  tags: string[];
}

const projectSchema = new Schema<IProject>({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9-]+$/
  },
  category: {
    type: String,
    required: true,
    enum: ['Full-Stack', 'Frontend', 'Backend', 'Mobile', 'Desktop Application']
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  subtitle: String,
  descriptions: {
    short: { type: String, required: true, maxlength: 200 },
    long: { type: String, required: true }
  },
  media: {
    image: { type: String, required: true },
    thumbImage: String
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  skillIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  employment: {
    jobRole: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    responsibilities: [String]
  },
  status: {
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isOpenSource: { type: Boolean, default: false },
    inactivationReason: String
  },
  links: {
    url: { type: String, required: true },
    github: String,
    demo: String
  },
  metrics: {
    efficiency: {
      value: { type: Number, min: 0, max: 100 },
      unit: String,
      description: String
    },
    users: {
      value: Number,
      unit: String,
      description: String
    },
    revenue: {
      value: { type: Number, min: 0, max: 100 },
      unit: String,
      description: String
    }
  },
  testimonials: [{
    quote: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, required: true },
    company: String,
    approved: { type: Boolean, default: true }
  }],
  caseStudy: {
    problem: String,
    solution: String,
    results: [String],
    technicalHighlights: [String],
    architectureDiagramUrl: String
  },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  tags: [String]
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// Middleware: Auto-generate slug from title if not provided
projectSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
  next();
});

// Indexes
projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ companyId: 1, 'employment.startDate': -1 });
projectSchema.index({ skillIds: 1 });
projectSchema.index({ 'status.isFeatured': 1, 'employment.startDate': -1 });
projectSchema.index({ category: 1, 'status.isActive': 1 });
projectSchema.index({ title: 'text', 'descriptions.short': 'text', 'descriptions.long': 'text' });

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
```

---

## Performance Optimization Recommendations

### 1. Database Indexes

**Critical Indexes:**
```javascript
// projects collection
db.projects.createIndex({ slug: 1 }, { unique: true });
db.projects.createIndex({ "status.isFeatured": 1, "employment.startDate": -1 });
db.projects.createIndex({ companyId: 1, "employment.startDate": -1 });
db.projects.createIndex({ skillIds: 1 });
db.projects.createIndex({ category: 1, "status.isActive": 1 });

// Text search index for global search
db.projects.createIndex({
  title: "text",
  "descriptions.short": "text",
  "descriptions.long": "text"
}, {
  weights: {
    title: 10,
    "descriptions.short": 5,
    "descriptions.long": 1
  }
});

// skills collection
db.skills.createIndex({ slug: 1 }, { unique: true });
db.skills.createIndex({ category: 1, level: 1 });
db.skills.createIndex({ name: "text" });

// certifications collection
db.certifications.createIndex({ slug: 1 }, { unique: true });
db.certifications.createIndex({ "dates.issued": -1 });
db.certifications.createIndex({ status: 1, featured: -1 });
db.certifications.createIndex({ skillIds: 1 });

// timeline collection
db.timeline.createIndex({ companyId: 1, "period.startDate": -1 });
db.timeline.createIndex({ "period.startDate": -1, "period.endDate": -1 });

// companies collection
db.companies.createIndex({ slug: 1 }, { unique: true });
db.companies.createIndex({ name: 1 });
```

**Index Performance Tips:**
- Single-field indexes for equality queries
- Compound indexes for multi-field queries (order matters!)
- Text indexes for full-text search
- Unique indexes prevent duplicates
- Sparse indexes for optional fields

---

### 2. Pagination (Prevent Loading All Data)

**Always paginate API responses:**

```typescript
const page = parseInt(searchParams.get('page') || '1');
const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);  // Max 100
const skip = (page - 1) * limit;

const projects = await Project.find(filter)
  .skip(skip)
  .limit(limit);

const total = await Project.countDocuments(filter);

return {
  data: projects,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  }
};
```

**Cursor-based pagination for large datasets:**
```typescript
// More efficient for infinite scroll
const lastId = searchParams.get('lastId');
const filter: any = {};
if (lastId) {
  filter._id = { $gt: lastId };
}

const projects = await Project.find(filter)
  .sort({ _id: 1 })
  .limit(20);
```

---

### 3. Selective Field Projection

**Don't return unnecessary data:**

```typescript
// List view: Only thumbnail data
Project.find()
  .select('title slug category media.thumbImage status.isFeatured employment.startDate')
  .populate('companyId', 'name icon')
  .populate('skillIds', 'name slug icon');

// Detail view: Full data
Project.findOne({ slug })
  .populate('companyId')
  .populate('skillIds');
```

**Benefits:**
- Reduces network bandwidth
- Faster response times
- Lower memory usage

---

### 4. Populate Sparingly

**Bad (over-populating):**
```typescript
Project.find()
  .populate('companyId')
  .populate('skillIds')
  .populate('createdBy')
  .populate('updatedBy');  // Too much data!
```

**Good (selective populate):**
```typescript
Project.find()
  .populate('companyId', 'name icon url')  // Only needed fields
  .populate('skillIds', 'name slug icon');
```

---

### 5. Caching Strategy

**Next.js Cache (unstable_cache):**
```typescript
import { unstable_cache } from 'next/cache';

export const getFeaturedProjects = unstable_cache(
  async () => {
    await connectToDatabase();
    return await Project.find({ 'status.isFeatured': true })
      .populate('companyId skillIds')
      .sort({ 'employment.startDate': -1 })
      .lean();
  },
  ['featured-projects'],
  {
    revalidate: 3600,  // 1 hour cache
    tags: ['projects', 'featured']
  }
);

// Invalidate cache when data changes
import { revalidateTag } from 'next/cache';
revalidateTag('projects');
```

**Redis Cache (for production):**
```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

async function getFeaturedProjects() {
  // Check cache first
  const cached = await redis.get('projects:featured');
  if (cached) {
    return JSON.parse(cached);
  }

  // Query database
  const projects = await Project.find({ 'status.isFeatured': true });

  // Cache for 1 hour
  await redis.setex('projects:featured', 3600, JSON.stringify(projects));

  return projects;
}
```

---

### 6. Aggregation for Complex Queries

**Example: Project count by category**
```typescript
const categoryCounts = await Project.aggregate([
  { $match: { 'status.isActive': true } },
  { $group: { _id: "$category", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Result:
// [
//   { _id: "Full-Stack", count: 15 },
//   { _id: "Backend", count: 4 },
//   { _id: "Desktop Application", count: 1 }
// ]
```

**Example: Top skills by project count**
```typescript
const topSkills = await Project.aggregate([
  { $unwind: "$skillIds" },
  { $group: { _id: "$skillIds", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "skills",
      localField: "_id",
      foreignField: "_id",
      as: "skill"
    }
  },
  { $unwind: "$skill" },
  {
    $project: {
      name: "$skill.name",
      icon: "$skill.icon",
      count: 1
    }
  }
]);
```

---

### 7. Lean Queries

**Use `.lean()` for read-only data:**

```typescript
// Without lean (Mongoose document)
const projects = await Project.find();  // Returns Mongoose documents with methods

// With lean (plain JavaScript object)
const projects = await Project.find().lean();  // 5x faster!
```

**Benefits:**
- Much faster (no Mongoose document overhead)
- Lower memory usage
- Plain JSON objects (can be cached easily)

**Caveat:**
- No Mongoose methods (save, validate, etc.)
- Only use for read operations

---

## Migration Strategy

### Phase 1: Schema Setup (Week 1)

**Tasks:**
1. Set up MongoDB connection utility
2. Create Mongoose schemas for all 5 collections
3. Add validation rules, indexes, and relationships
4. Test schema definitions locally

**Files to Create:**
```
lib/
├── mongodb.ts                    # Connection utility
└── models/
    ├── Company.ts
    ├── Skill.ts
    ├── Project.ts
    ├── Certification.ts
    └── Timeline.ts
```

---

### Phase 2: Data Migration (Week 2)

**Tasks:**
1. Write migration script to transform TypeScript data
2. Normalize companies and skills into separate collections
3. Convert string metrics to structured numeric data
4. Add unique slugs and timestamps
5. Run migration to populate MongoDB

**Migration Script:**
```typescript
// scripts/migrate-to-mongodb.ts
import { projects } from '@/data/portfolioData';
import { certifications } from '@/data/certificationsData';
import { timeLineItems } from '@/data/timelineData';
import { Company, Skill, Project, Certification, Timeline } from '@/lib/models';

async function migrate() {
  // Step 1: Create companies
  const companies = new Map();
  timeLineItems.forEach(item => {
    companies.set(item.company, {
      name: item.company,
      slug: slugify(item.company),
      url: item.url,
      location: item.location,
      icon: item.icon
    });
  });

  const companyDocs = await Company.insertMany([...companies.values()]);
  const companyIdMap = new Map();
  companyDocs.forEach(doc => companyIdMap.set(doc.name, doc._id));

  // Step 2: Create skills
  const skills = new Set();
  projects.forEach(p => p.stacks.forEach(s => skills.add(s)));
  certifications.forEach(c => c.skills?.forEach(s => skills.add(s)));

  const skillDocs = await Skill.insertMany(
    [...skills].map(name => ({
      name,
      slug: slugify(name),
      category: categorizeSkill(name),
      icon: getSkillIcon(name)
    }))
  );

  const skillIdMap = new Map();
  skillDocs.forEach(doc => skillIdMap.set(doc.name, doc._id));

  // Step 3: Migrate projects
  const transformedProjects = projects.map(p => ({
    slug: slugify(p.title),
    category: p.category,
    title: p.title,
    subtitle: p.subtitle,
    descriptions: {
      short: p.shortDescription,
      long: p.longDescription
    },
    media: {
      image: p.image,
      thumbImage: p.thumbImage
    },
    companyId: companyIdMap.get(p.associatedWithCompany),
    skillIds: p.stacks.map(s => skillIdMap.get(s)).filter(Boolean),
    employment: {
      jobRole: p.jobRole,
      startDate: p.startDate,
      endDate: p.endDate,
      responsibilities: p.responsibilities || []
    },
    status: {
      isActive: p.isActive,
      isFeatured: p.isFeatured || false,
      isOpenSource: p.isOpenSource,
      inactivationReason: p.inactivationReason
    },
    links: {
      url: p.url,
      github: p.github
    },
    metrics: transformMetrics(p.metrics),
    testimonials: p.testimonials || [],
    caseStudy: p.caseStudy,
    recognition: p.recognition || [],
    viewCount: 0,
    likeCount: 0,
    tags: []
  }));

  await Project.insertMany(transformedProjects);

  console.log('Migration completed!');
}

function transformMetrics(metrics: any) {
  if (!metrics) return null;

  return {
    efficiency: parseMetric(metrics.efficiency),
    users: parseMetric(metrics.users),
    revenue: parseMetric(metrics.revenue),
    performance: parseMetric(metrics.performance)
  };
}

function parseMetric(metricString?: string) {
  if (!metricString) return null;

  // "80% time reduction" -> { value: 80, unit: "percent", description: "time reduction" }
  const match = metricString.match(/(\d+)([%\+\-]?)\s*(.*)/);
  if (match) {
    return {
      value: parseInt(match[1]),
      unit: match[2] === '%' ? 'percent' : 'count',
      description: match[3]
    };
  }

  return { description: metricString };
}

migrate();
```

---

### Phase 3: API Implementation (Week 3-4)

**Tasks:**
1. Create Next.js API routes for all collections
2. Implement pagination, filtering, sorting
3. Add search functionality
4. Add admin endpoints (protected routes)
5. Test all endpoints with Postman/Insomnia

**API Checklist:**
- [ ] GET /api/companies
- [ ] GET /api/skills
- [ ] GET /api/projects (with filters)
- [ ] GET /api/projects/featured
- [ ] GET /api/projects/[slug]
- [ ] GET /api/certifications
- [ ] GET /api/certifications/featured
- [ ] GET /api/timeline
- [ ] GET /api/search?q=...
- [ ] POST /api/analytics/projects/[id]/view

---

### Phase 4: Frontend Integration (Week 5)

**Tasks:**
1. Create data fetching hooks (SWR or React Query)
2. Replace static imports with API calls
3. Add loading/error states
4. Implement infinite scroll or pagination UI
5. Test all pages

**Example Migration:**

**Before:**
```typescript
// components/Projects.tsx
import { projects } from '@/data/portfolioData';

export function Projects() {
  const featuredProjects = projects.filter(p => p.isFeatured);

  return (
    <div>
      {featuredProjects.map(project => (
        <ProjectCard key={project.num} project={project} />
      ))}
    </div>
  );
}
```

**After:**
```typescript
// components/Projects.tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function Projects() {
  const { data, error, isLoading } = useSWR('/api/projects?isFeatured=true', fetcher);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <div>
      {data.data.map((project: any) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
```

---

### Phase 5: Testing & Deployment (Week 6)

**Tasks:**
1. Write integration tests for API routes
2. Set up MongoDB Atlas (free tier or paid)
3. Add MongoDB connection string to environment variables
4. Deploy to Vercel/Netlify
5. Monitor performance with indexes
6. Set up error tracking (Sentry)

**MongoDB Atlas Setup:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free tier cluster (M0 Sandbox - 512MB)
3. Whitelist IP address (0.0.0.0/0 for development)
4. Create database user
5. Get connection string
6. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

---

## Data Quality Improvements

### Before Migration, Fix These Issues:

### 1. Skill Naming Standardization

**Current Issues:**
- "ASP.NET Core" vs "ASP.NET Core 3.1" vs "ASP.NET Core 2.2"
- "TypeScript" vs "Typescript"
- "React" vs "ReactJS" vs "React.js"

**Recommended Standard:**
- Use canonical names: "ASP.NET Core" (version-agnostic)
- Capitalize consistently: "TypeScript", "React", "Node.js"
- Create skill versions as metadata:
  ```javascript
  {
    name: "ASP.NET Core",
    versions: ["2.2", "3.1", "5.0", "6.0", "7.0", "8.0"]
  }
  ```

---

### 2. Company Data Completion

**Extract All Unique Companies:**
- Optimizely
- Kaz Software
- Chorki Limited
- Brain Station-23

**Add Missing Fields:**
- Complete icons for all companies
- Add URLs for all companies
- Add locations
- Add industry types

---

### 3. Date Format Consistency

**Convert All to ISO 8601:**
```typescript
// Before:
date: "2024-12"

// After:
dates: {
  issued: new Date("2024-12-01"),
  expires: new Date("2027-12-01")
}
```

---

### 4. Metrics Normalization

**Parse String Metrics:**
```typescript
// Before:
metrics: {
  efficiency: "80% time reduction"
}

// After:
metrics: {
  efficiency: {
    value: 80,
    unit: "percent",
    description: "time reduction"
  }
}
```

**Create Parser:**
```typescript
function parseMetric(metricString: string) {
  const patterns = [
    /(\d+)%\s*(.*)/,           // "80% time reduction"
    /(\d+)\+\s*(.*)/,          // "20+ enterprise clients"
    /(\d+)x\s*(.*)/,           // "5x faster"
  ];

  for (const pattern of patterns) {
    const match = metricString.match(pattern);
    if (match) {
      return {
        value: parseInt(match[1]),
        unit: detectUnit(match[0]),
        description: match[2]
      };
    }
  }

  return { description: metricString };
}
```

---

### 5. Add Missing UUIDs/Slugs

**Generate Slugs for All Projects:**
```typescript
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Examples:
// "SpireWiz" -> "spirewiz"
// "Portfolio Website v2.0" -> "portfolio-website-v20"
```

---

## Cost & Hosting Recommendations

### MongoDB Atlas Pricing

**Free Tier (M0 Sandbox):**
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Shared vCPU
- ✅ No credit card required
- ✅ Great for development and small portfolios
- ✅ **Your 132KB data fits comfortably**

**Paid Tier (M2 - $9/month):**
- 2GB storage
- Shared RAM
- Shared vCPU
- Automated backups

**Upgrade Triggers:**
- Data exceeds 500MB
- Traffic exceeds 100 concurrent connections
- Need dedicated cluster performance
- Require advanced monitoring

### Estimated Future Size

| Scenario | Data Size | Atlas Tier |
|----------|-----------|------------|
| **Current** (23 projects) | 132 KB | Free (M0) ✅ |
| **100 projects** | ~600 KB | Free (M0) ✅ |
| **1000 projects** | ~6 MB | Free (M0) ✅ |
| **With full images** (embedded) | 500+ MB | Paid (M2+) 💰 |

**Verdict:** Free tier sufficient for 2-3 years

---

### Next.js Hosting

**Vercel (Recommended):**
- ✅ Free tier for hobby projects
- ✅ Automatic deployment from Git
- ✅ Edge functions for API routes
- ✅ Built-in analytics
- ✅ Environment variable management

**Railway:**
- ✅ $5/month for hobby projects
- ✅ MongoDB hosting included
- ✅ Good for full-stack apps

**Netlify:**
- ✅ Free tier available
- ✅ Serverless functions
- ✅ Good for static sites + API

---

## Summary & Next Steps

### Key Findings

**✅ Well-Structured Data:**
- Clear TypeScript interfaces
- Rich project data with metrics, testimonials, case studies
- 43 certifications with verification links
- 75+ skills with proficiency tracking

**❌ Critical Issues to Address:**
1. No referential integrity (string-based references)
2. Data redundancy (companies, skills repeated)
3. Inconsistent formats (dates, metrics)
4. Scalability limitations (static arrays)
5. Missing fields (slugs, timestamps, analytics)

---

### Recommended Action Plan

**Immediate (Before Migration):**
1. ✅ Standardize skill names across all files
2. ✅ Extract companies into lookup table
3. ✅ Convert metrics to structured format
4. ✅ Add slugs to all projects
5. ✅ Unify date formats

**Short-Term (Migration - 6 weeks):**
1. Set up MongoDB Atlas (free tier)
2. Create Mongoose schemas
3. Write migration scripts
4. Build Next.js API routes
5. Update frontend components
6. Deploy to production

**Long-Term Benefits:**
- ✅ Dynamic content management (no code deployments)
- ✅ Admin dashboard for editing
- ✅ Analytics (view counts, popular projects)
- ✅ Search/filter capabilities
- ✅ API for mobile app
- ✅ Data validation and integrity
- ✅ Scalable to 1000s of records

---

### Technology Stack Recommendation

```
Frontend:  Next.js 14+ (App Router)
Backend:   Next.js API Routes
Database:  MongoDB Atlas (Free M0)
ORM:       Mongoose
Caching:   Next.js unstable_cache (or Redis for production)
Hosting:   Vercel (Frontend + API)
Analytics: Vercel Analytics
Error Tracking: Sentry (optional)
```

---

### When You're Ready

**I can help you with:**
1. ✅ Writing Mongoose schemas with validation
2. ✅ Creating migration scripts
3. ✅ Building Next.js API routes
4. ✅ Updating frontend components
5. ✅ Setting up MongoDB Atlas
6. ✅ Deploying to production

**Just let me know which phase you'd like to start with!**

---

## Appendix

### File-by-File Summary

| File | Lines | Issues | Recommendations |
|------|-------|--------|-----------------|
| `portfolioData.ts` | 1,349 | String metrics, no IDs, company redundancy | Normalize companies, parse metrics, add slugs |
| `certificationsData.ts` | 785 | String dates, skill redundancy | Normalize skills, convert dates to ISO format |
| `skillsData.ts` | 230 | Hierarchical tree hard to query | Flatten with parentId references |
| `timelineData.ts` | 75 | Company redundancy, missing achievements | Normalize companies, add achievements field |
| `navigationData.ts` | 48 | No issues | Can stay as static config |
| `schemaData.ts` | 125 | No issues | Keep as-is or generate from MongoDB |

---

### Useful Resources

**MongoDB:**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [MongoDB Schema Design Best Practices](https://www.mongodb.com/developer/products/mongodb/schema-design-anti-pattern-summary/)

**Next.js:**
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Caching](https://nextjs.org/docs/app/building-your-application/caching)

**Data Fetching:**
- [SWR](https://swr.vercel.app/)
- [React Query](https://tanstack.com/query/latest)

---

**End of Report**

*This analysis was generated on November 20, 2025. Data volumes and statistics are based on current codebase state.*
