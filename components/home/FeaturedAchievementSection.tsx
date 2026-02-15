"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Badge from "@/components/Badge";
import { FiAward, FiArrowRight } from "@/lib/icons";
import { SiPython, SiOpenai } from "@/lib/icons";
import { RiRobot3Fill } from "@/lib/icons";
import type { Project } from "@/types/api";

interface FeaturedAchievementSectionProps {
  project: Project;
}

/**
 * FeaturedAchievementSection Component
 *
 * Displays a featured project (SpireWiz) with highlighted metrics and tech stack.
 * Extracted from HomeClient.tsx (lines 350-502) for better maintainability.
 *
 * @param project - The featured project to display (typically SpireWiz)
 */
const FeaturedAchievementSection: React.FC<FeaturedAchievementSectionProps> = ({ project }) => {
  return (
    <motion.section
      id="featured-achievement"
      data-testid="home-featured-achievement"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
      className="py-12"
    >
      {/* Section Badge */}
      <div className="flex items-center gap-2 mb-6">
        <FiAward className="text-yellow-500 text-xl" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-yellow-500">Featured Achievement</h2>
      </div>

      {/* Card Container */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-xl p-5 sm:p-6 relative overflow-hidden">
        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent pointer-events-none" aria-hidden="true" />

        <div className="relative z-10">
          {/* Title - Dynamic with subtitle */}
          <h3 className="text-2xl xl:text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            {project.title}
            {project.subtitle && `: ${project.subtitle}`}
          </h3>

          {/* Description - Use shortDescription for concise summary */}
          <p className="text-white/80 text-base leading-relaxed mb-6">
            {project.shortDescription}
          </p>

          {/* Metrics Grid - Parse string values from API */}
          {project.metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Metric 1 - Efficiency */}
              {project.metrics.efficiency && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-lg p-4 text-center hover:border-emerald-500/50 transition-all">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">
                    {project.metrics.efficiency.includes('70-80%') ? '70-80%' :
                     project.metrics.efficiency.split(' ')[0]}
                  </div>
                  <div className="text-sm text-white/60">Time Reduction</div>
                  <div className="text-xs text-white/40 mt-1">
                    {project.metrics.efficiency.includes('(') ?
                     project.metrics.efficiency.match(/\((.*?)\)/)?.[1] :
                     '40h → 8h per cycle'}
                  </div>
                </div>
              )}

              {/* Metric 2 - Users/Clients */}
              {project.metrics.users && (
                <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-lg p-4 text-center hover:border-purple-500/50 transition-all">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {project.metrics.users.match(/\d+\+?/)?.[0] || '25+'}
                  </div>
                  <div className="text-sm text-white/60">Enterprise Clients</div>
                  <div className="text-xs text-white/40 mt-1">Served annually</div>
                </div>
              )}

              {/* Metric 3 - Business Impact */}
              {project.metrics.other && project.metrics.other.length > 0 && (
                <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-lg p-4 text-center hover:border-cyan-500/50 transition-all">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">~$180K</div>
                  <div className="text-sm text-white/60">Annual Business Value</div>
                  <div className="text-xs text-white/40 mt-1">(600+ hours saved)</div>
                </div>
              )}
            </div>
          )}

          {/* Tech Stack - Show key technologies with icons */}
          {project.stacks && project.stacks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-white/50">Tech Stack:</span>
              {/* Python */}
              {project.stacks.find(t => t.includes('Python')) && (
                <Badge
                  icon={<SiPython className="text-[#3776AB]" />}
                  text={project.stacks.find(t => t.includes('Python')) || 'Python 3.10+'}
                  color="default"
                  size="compact"
                />
              )}
              {/* GPT-4o */}
              {project.stacks.find(t => t.includes('GPT-4o')) && (
                <Badge
                  icon={<SiOpenai className="text-emerald-400" />}
                  text={project.stacks.find(t => t.includes('GPT-4o'))?.replace('OpenAI ', '') || 'GPT-4o'}
                  color="emerald"
                  size="compact"
                />
              )}
              {/* AI Prompt Engineering (shown as "AI Merge" for brevity) */}
              {project.stacks.find(t => t.includes('AI Prompt')) && (
                <Badge
                  icon={<RiRobot3Fill className="text-purple-400" />}
                  text="AI Merge"
                  color="purple"
                  size="compact"
                />
              )}
              {/* Textual TUI */}
              {project.stacks.find(t => t.includes('Textual')) && (
                <Badge
                  text={project.stacks.find(t => t.includes('Textual'))?.replace(' Framework', '') || 'Textual TUI'}
                  color="default"
                  size="compact"
                />
              )}
              {/* PyInstaller */}
              {project.stacks.find(t => t.includes('PyInstaller')) && (
                <Badge
                  text="PyInstaller"
                  color="neutral"
                  size="compact"
                />
              )}
              {/* Pydantic */}
              {project.stacks.find(t => t.includes('Pydantic')) && (
                <Badge
                  text={project.stacks.find(t => t.includes('Pydantic')) || 'Pydantic (Type Safety)'}
                  color="default"
                  size="compact"
                />
              )}
              {/* Pytest */}
              {project.stacks.find(t => t.includes('Pytest')) && (
                <Badge
                  text={project.stacks.find(t => t.includes('Pytest')) || 'Pytest (90%+ Coverage)'}
                  color="default"
                  size="compact"
                />
              )}
            </div>
          )}

          {/* CTA - Dynamic using project._id */}
          <div className="text-center sm:text-left">
            <Link href={`/projects?open=${project._id}`}>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/40 hover:border-purple-500/60 rounded-lg transition-all duration-300 text-sm text-purple-400 font-medium group">
                <span>View Case Study</span>
                <FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedAchievementSection;
