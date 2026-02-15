import React from 'react';
import { motion } from 'framer-motion';
import { FaCogs, FaRocket, FaStar, FaCheckCircle } from "@/lib/icons";
import { PERFORMANCE_VARIANTS } from '@/constants';
import { useCountUp } from '@/hooks/useCountUp';

interface SkillsStatsCardsProps {
  totalTechnologies: number;
  totalCategories: number;
  expertCount: number;
  advancedCount: number;
}

/**
 * Stats cards section for Skills page
 * Shows total technologies, categories, expert, and advanced counts
 * Includes animated counters
 */
export const SkillsStatsCards = React.memo<SkillsStatsCardsProps>(({
  totalTechnologies,
  totalCategories,
  expertCount,
  advancedCount
}) => {
  // Animated counters for stats
  const totalTechCount = useCountUp({ end: totalTechnologies, duration: 2000 });
  const totalCategoriesCount = useCountUp({ end: totalCategories, duration: 1900 });
  const expertCountUp = useCountUp({ end: expertCount, duration: 1800 });
  const advancedCountUp = useCountUp({ end: advancedCount, duration: 1700 });

  return (
    <motion.div
      variants={PERFORMANCE_VARIANTS.containerSync}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      <div className="bg-gray-900/50 border border-secondary-default/20 rounded-lg p-4">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-4 sm:gap-6">
          {/* Total Technologies */}
          <div ref={totalTechCount.ref} className="flex items-center gap-3">
            <div className="p-2 bg-[#00BFFF]/20 rounded-lg">
              <FaCogs className="text-[#00BFFF] text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0080FF] tabular-nums">
                {totalTechCount.count}
              </div>
              <div className="text-xs text-white/60">Technologies</div>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-white/10"></div>

          {/* Total Categories */}
          <div ref={totalCategoriesCount.ref} className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <FaRocket className="text-emerald-400 text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 tabular-nums">
                {totalCategoriesCount.count}
              </div>
              <div className="text-xs text-white/60">Categories</div>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-white/10"></div>

          {/* Expert Skills */}
          <div ref={expertCountUp.ref} className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
              <FaStar className="text-fuchsia-400 text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tabular-nums">
                {expertCountUp.count}
              </div>
              <div className="text-xs text-white/60">Expert</div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-10 bg-white/10"></div>

          {/* Advanced Skills */}
          <div ref={advancedCountUp.ref} className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <FaCheckCircle className="text-green-400 text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 tabular-nums">
                {advancedCountUp.count}
              </div>
              <div className="text-xs text-white/60">Advanced</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

SkillsStatsCards.displayName = 'SkillsStatsCards';
