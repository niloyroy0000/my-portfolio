"use client";

import React from "react";
import { IconType } from "@/lib/icons";

export interface StatCard {
  icon: IconType;
  value: string | number;
  label: string;
  gradient?: string;
  iconColor?: string;
  iconBgColor?: string;
  valueGradient?: string;
  ref?: React.RefObject<HTMLDivElement>; // Optional ref for useCountUp animation
}

interface StatsCardsProps {
  stats: StatCard[];
  className?: string;
  showDividers?: boolean;
  variant?: "default" | "compact";
}

// Default color schemes matching Project Page design
const defaultIconColors = [
  { icon: "text-[#00BFFF]", bg: "bg-[#00BFFF]/20", value: "from-[#00BFFF] to-[#0080FF]" },
  { icon: "text-emerald-400", bg: "bg-emerald-500/20", value: "from-emerald-400 to-cyan-500" },
  { icon: "text-purple-400", bg: "bg-purple-500/20", value: "from-purple-400 to-pink-500" },
  { icon: "text-blue-400", bg: "bg-blue-500/20", value: "from-blue-400 to-secondary-default" },
  { icon: "text-orange-400", bg: "bg-orange-500/20", value: "from-orange-400 to-amber-500" },
];

const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  className = "",
  showDividers = true,
  variant = "default"
}) => {
  return (
    <div className={`bg-gray-900/50 border border-secondary-default/20 rounded-lg p-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const colorScheme = defaultIconColors[index % defaultIconColors.length];

          // Allow custom overrides
          const iconColor = stat.iconColor || colorScheme.icon;
          const iconBgColor = stat.iconBgColor || colorScheme.bg;
          const valueGradient = stat.valueGradient || colorScheme.value;

          return (
            <React.Fragment key={`${stat.label}-${index}`}>
              {/* Stat Item - Apply ref if provided for useCountUp animation */}
              <div ref={stat.ref} className="flex items-center gap-3">
                {/* Icon Box - Project Page style */}
                <div className={`p-2 ${iconBgColor} rounded-lg`}>
                  <IconComponent className={`${iconColor} text-xl`} />
                </div>

                {/* Value and Label - Vertical layout */}
                <div>
                  <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${valueGradient} tabular-nums`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/60">
                    {stat.label}
                  </div>
                </div>
              </div>

              {/* Vertical Divider - Hidden on mobile, visible on sm+ */}
              {showDividers && index < stats.length - 1 && (
                <div className="hidden sm:block w-px h-10 bg-white/10" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCards;
