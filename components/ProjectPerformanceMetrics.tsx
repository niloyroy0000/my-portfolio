"use client";

import { motion } from "framer-motion";
import { FaArrowUp, FaChartLine, FaClock, FaDollarSign, FaUsers, FaRocket, FaTrophy } from "@/lib/icons";
import { ProjectMetrics } from "@/types/api";

interface ProjectPerformanceMetricsProps {
  metrics: ProjectMetrics;
}

interface MetricVisualization {
  label: string;
  value: string;
  type: "percentage" | "time" | "number" | "currency";
  icon: React.ReactNode;
  before?: string;
  after?: string;
  improvement?: number;
  color: string;
}

export default function ProjectPerformanceMetrics({ metrics }: ProjectPerformanceMetricsProps) {
  // Parse metrics into visualizable data
  const parseMetric = (key: string, value: string): MetricVisualization | null => {
    // Extract percentages and improvements
    const reductionMatch = value.match(/(\d+)%\s*(reduction|decrease|improvement|time\s*reduction|saved)/i);
    const increaseMatch = value.match(/(\d+)%\s*(increase|improvement|faster|gain)/i);

    if (key === "efficiency" || key === "performance") {
      if (reductionMatch) {
        const improvement = parseInt(reductionMatch[1]);
        return {
          label: key === "efficiency" ? "Efficiency Gain" : "Performance Improvement",
          value: `${improvement}%`,
          type: "percentage",
          icon: <FaRocket />,
          improvement: improvement,
          color: "emerald",
          before: "Before",
          after: "After"
        };
      }
      return {
        label: key === "efficiency" ? "Efficiency" : "Performance",
        value: value,
        type: "number",
        icon: <FaChartLine />,
        color: "blue",
      };
    }

    if (key === "revenue") {
      if (reductionMatch) {
        const improvement = parseInt(reductionMatch[1]);
        return {
          label: "Cost Reduction",
          value: `${improvement}%`,
          type: "percentage",
          icon: <FaDollarSign />,
          improvement: improvement,
          color: "purple",
          before: "Before",
          after: "After"
        };
      }
      return {
        label: "Revenue Impact",
        value: value,
        type: "currency",
        icon: <FaDollarSign />,
        color: "purple",
      };
    }

    if (key === "users") {
      return {
        label: "Users/Clients",
        value: value,
        type: "number",
        icon: <FaUsers />,
        color: "cyan",
      };
    }

    if (key === "downloads") {
      return {
        label: "Downloads",
        value: value,
        type: "number",
        icon: <FaRocket />,
        color: "secondary",
      };
    }

    if (key === "github_stars") {
      return {
        label: "GitHub Stars",
        value: value,
        type: "number",
        icon: <FaRocket />,
        color: "secondary",
      };
    }

    // Default handling
    return {
      label: key.replace(/_/g, " ").charAt(0).toUpperCase() + key.replace(/_/g, " ").slice(1),
      value: value,
      type: "number",
      icon: <FaChartLine />,
      color: "secondary",
    };
  };

  // Convert metrics to visualizations
  const visualizations: MetricVisualization[] = [];

  Object.entries(metrics).forEach(([key, value]) => {
    if (key === "other" && Array.isArray(value)) {
      // Skip 'other' for now, we'll handle it separately
      return;
    }
    if (value && typeof value === "string") {
      const viz = parseMetric(key, value);
      if (viz) visualizations.push(viz);
    }
  });

  const colorClasses = {
    emerald: "from-emerald-500/20 to-green-500/20 border-emerald-500/40 text-emerald-300",
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-300",
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300",
    cyan: "from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300",
    secondary: "from-secondary-default/20 to-blue-500/20 border-secondary-default/40 text-secondary-default",
  };

  return (
    <div className="space-y-4">
      {/* Main Metrics Grid - More compact layout */}
      {visualizations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {visualizations.map((viz, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-br ${
                colorClasses[viz.color as keyof typeof colorClasses] || colorClasses.secondary
              } border rounded-lg p-2.5 relative overflow-hidden`}
            >
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-2xl" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="p-1 bg-white/10 rounded text-[10px]">
                    {viz.icon}
                  </div>
                  <h4 className="font-semibold text-[10px] leading-tight">{viz.label}</h4>
                </div>

                {/* Value Display */}
                <div className="mb-1.5">
                  <p className="text-xl font-bold leading-none mb-1">{viz.value}</p>
                  {viz.improvement && (
                    <div className="flex items-center gap-1">
                      <FaArrowUp className="text-green-400 text-[10px]" />
                      <span className="text-[10px] text-white/80">
                        {viz.improvement}% improvement
                      </span>
                    </div>
                  )}
                </div>

                {/* Before/After Comparison - More compact */}
                {viz.improvement && viz.before && viz.after && (
                  <div className="space-y-1">
                    <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: `${100 - viz.improvement}%` }}
                        transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                        className="absolute left-0 h-full bg-gradient-to-r from-red-500/50 to-orange-500/50"
                      />
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${viz.improvement}%` }}
                        transition={{ delay: index * 0.05 + 0.5, duration: 0.8 }}
                        className="absolute right-0 h-full bg-gradient-to-r from-emerald-500 to-green-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-medium">
                      <span className="text-red-400">Before: 100%</span>
                      <span className="text-emerald-400">After: {100 - viz.improvement}%</span>
                    </div>
                  </div>
                )}

                {/* Progress Bar for non-improvement metrics */}
                {!viz.improvement && viz.type === "percentage" && (
                  <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: viz.value }}
                      transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-secondary-default to-blue-500"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Other Metrics - More compact */}
      {metrics.other && metrics.other.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaTrophy className="text-secondary-default text-sm" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">Additional Achievements</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {metrics.other.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: visualizations.length * 0.05 + index * 0.05 }}
                className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-colors"
              >
                <div className="w-4 h-4 rounded-full bg-secondary-default/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaChartLine className="text-secondary-default text-[8px]" />
                </div>
                <p className="text-white/90 text-xs leading-relaxed flex-1">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
