"use client";

import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import SEOOptimizer from "@/components/SEOOptimizer";
import WebVitalsTracker from "@/components/WebVitalsTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ResumeAnalyticsLoader from "@/components/ResumeAnalyticsLoader";
import HeatmapTracker from "@/components/HeatmapTracker";
import DebugMode from "@/components/DebugMode";
import dynamic from "next/dynamic";
import type { Project, Certification } from "@/types/api";

// Lazy load AIChatbot - includes react-markdown (~150KB)
const AIChatbot = dynamic(() => import("@/components/AIChatbot"));

interface SkillHierarchyNode {
  name: string;
  metadata?: {
    icon?: string;
    level?: string;
    yearsOfExperience?: number;
    lastUsed?: string;
  };
  children?: SkillHierarchyNode[];
}

interface RootLayoutClientProps {
  children: React.ReactNode;
  projects: Project[];
  certifications: Certification[];
  skillsHierarchy: SkillHierarchyNode[];
}

export default function RootLayoutClient({
  children,
  projects,
  certifications,
  skillsHierarchy,
}: RootLayoutClientProps) {
  return (
    <>
      <GoogleAnalytics />
      <Header
        projects={projects}
        certifications={certifications}
        skillsHierarchy={skillsHierarchy}
      />
      <PageTransition>{children}</PageTransition>
      <SEOOptimizer />
      <WebVitalsTracker />
      <ResumeAnalyticsLoader />
      <HeatmapTracker />
      <DebugMode />
      <AIChatbot />
    </>
  );
}
