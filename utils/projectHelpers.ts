import { Project } from "@/types/api";
import { FaRocket, FaUsers, FaChartLine } from "@/lib/icons";
import type { IconType } from "@/lib/icons";

/**
 * Interface for primary metric badge data
 */
export interface PrimaryMetric {
  icon: IconType;
  text: string;
  label: "Efficiency" | "Impact" | "Performance" | "Cost Savings" | "Downloads";
}

/**
 * Extracts the primary metric from a project's metrics object
 * Priority: efficiency > users > performance > revenue > downloads
 *
 * @param project - Project object with optional metrics
 * @returns Primary metric object or null if no metrics exist
 */
export function getPrimaryMetric(project: Project): PrimaryMetric | null {
  if (!project.metrics) return null;

  if (project.metrics.efficiency) {
    return {
      icon: FaRocket,
      text: project.metrics.efficiency,
      label: "Efficiency"
    };
  }

  if (project.metrics.users) {
    return {
      icon: FaUsers,
      text: project.metrics.users,
      label: "Impact"
    };
  }

  if (project.metrics.performance) {
    return {
      icon: FaChartLine,
      text: project.metrics.performance,
      label: "Performance"
    };
  }

  if (project.metrics.revenue) {
    return {
      icon: FaChartLine,
      text: project.metrics.revenue,
      label: "Cost Savings"
    };
  }

  if (project.metrics.downloads) {
    return {
      icon: FaUsers,
      text: project.metrics.downloads,
      label: "Downloads"
    };
  }

  return null;
}

/**
 * Gets Tailwind CSS classes for metric badge styling based on label
 * Updated: Reduced transparency for better visibility on all backgrounds
 *
 * @param label - Metric label type
 * @returns Tailwind CSS class string for badge styling
 */
export function getMetricBadgeClasses(label: string): string {
  const metricColors: Record<string, string> = {
    "Efficiency": "bg-gradient-to-r from-emerald-500/90 to-green-500/90 border-emerald-400/80 text-white",
    "Impact": "bg-gradient-to-r from-blue-500/90 to-cyan-500/90 border-blue-400/80 text-white",
    "Downloads": "bg-gradient-to-r from-blue-500/90 to-cyan-500/90 border-blue-400/80 text-white",
    "Performance": "bg-gradient-to-r from-purple-500/90 to-pink-500/90 border-purple-400/80 text-white",
    "Cost Savings": "bg-gradient-to-r from-orange-500/90 to-amber-500/90 border-orange-400/80 text-white",
  };

  return metricColors[label] || "bg-gradient-to-r from-secondary-default/90 to-blue-500/90 border-secondary-default/80 text-white";
}

/**
 * Gets lighter version of metric badge classes for Timeline view
 * Updated: Reduced transparency for better visibility on lighter backgrounds
 *
 * @param label - Metric label type
 * @returns Tailwind CSS class string for lighter badge styling
 */
export function getMetricBadgeClassesLight(label: string): string {
  const metricColors: Record<string, string> = {
    "Efficiency": "bg-gradient-to-r from-emerald-500/60 to-green-500/60 border-emerald-400/70 text-white",
    "Impact": "bg-gradient-to-r from-blue-500/60 to-cyan-500/60 border-blue-400/70 text-white",
    "Downloads": "bg-gradient-to-r from-blue-500/60 to-cyan-500/60 border-blue-400/70 text-white",
    "Performance": "bg-gradient-to-r from-purple-500/60 to-pink-500/60 border-purple-400/70 text-white",
    "Cost Savings": "bg-gradient-to-r from-orange-500/60 to-amber-500/60 border-orange-400/70 text-white",
  };

  return metricColors[label] || "bg-gradient-to-r from-secondary-default/60 to-blue-500/60 border-secondary-default/70 text-white";
}
