"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
// Skills data will be passed as props from parent component
import DynamicIcon from '@/components/DynamicIcon';
import SkillsHeatMapModal from './SkillsHeatMapModal';

// Skill interface matching skillsData structure
interface SkillNode {
  name: string;
  metadata?: {
    icon: string;
    level?: "Expert" | "Advanced" | "Intermediate" | "Familiar";
    yearsOfExperience?: number;
    lastUsed?: string;
  };
  children?: SkillNode[];
}

// Updated level to color mapping with glassmorphism theme
const levelToColor = {
  'Expert': 'bg-gradient-to-br from-purple-500/20 to-pink-500/30 border-fuchsia-500/50 text-white backdrop-blur-sm',
  'Advanced': 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 border-emerald-500/50 text-white backdrop-blur-sm',
  'Intermediate': 'bg-gradient-to-br from-blue-500/20 to-blue-600/30 border-blue-500/50 text-white backdrop-blur-sm',
  'Familiar': 'bg-gradient-to-br from-slate-500/20 to-slate-600/30 border-slate-500/50 text-white backdrop-blur-sm',
};

const levelToGradient = {
  'Expert': 'from-purple-500/20 to-pink-500/10 border-fuchsia-500/40',
  'Advanced': 'from-emerald-500/20 to-emerald-500/10 border-emerald-500/40',
  'Intermediate': 'from-blue-500/20 to-blue-500/10 border-blue-500/40',
  'Familiar': 'from-slate-500/20 to-slate-500/10 border-slate-500/40',
};

const levelToTextColor = {
  'Expert': 'text-fuchsia-400',
  'Advanced': 'text-emerald-400',
  'Intermediate': 'text-blue-400',
  'Familiar': 'text-slate-400',
};

const levelToIcon = {
  'Expert': '🟣',
  'Advanced': '🟢',
  'Intermediate': '🔵',
  'Familiar': '⚪',
};

interface SkillProficiencySummaryProps {
  skillsHierarchy: SkillNode[];
}

export default function SkillProficiencySummary({ skillsHierarchy }: SkillProficiencySummaryProps) {
  const [showFullHeatMap, setShowFullHeatMap] = useState(false);

  // Recursively extract all skills with metadata from the tree
  const extractSkills = (node: SkillNode): SkillNode[] => {
    let allSkills: SkillNode[] = [];

    // If this node has a level metadata, it's a skill - add it
    if (node.metadata?.level) {
      allSkills.push(node);
    }

    // Recursively process all children
    if (node.children) {
      node.children.forEach(childNode => {
        allSkills = [...allSkills, ...extractSkills(childNode)];
      });
    }

    return allSkills;
  };

  // Extract skills from hierarchy
  const allSkills = skillsHierarchy.flatMap(category => extractSkills(category));

  // Count by proficiency level
  const expertCount = allSkills.filter(s => s.metadata?.level === 'Expert').length;
  const advancedCount = allSkills.filter(s => s.metadata?.level === 'Advanced').length;
  const intermediateCount = allSkills.filter(s => s.metadata?.level === 'Intermediate').length;
  const familiarCount = allSkills.filter(s => s.metadata?.level === 'Familiar').length;

  // Get top 12 skills with balanced representation across all levels
  // 3 Expert + 4 Advanced + 3 Intermediate + 2 Familiar = 12 total
  const getTopSkillsByLevel = (level: string, count: number) => {
    return allSkills
      .filter(s => s.metadata?.level === level)
      .sort((a, b) => {
        const aYears = a.metadata?.yearsOfExperience || 0;
        const bYears = b.metadata?.yearsOfExperience || 0;
        return bYears - aYears;
      })
      .slice(0, count);
  };

  const topSkills = [
    ...getTopSkillsByLevel('Expert', 3),
    ...getTopSkillsByLevel('Advanced', 4),
    ...getTopSkillsByLevel('Intermediate', 3),
    ...getTopSkillsByLevel('Familiar', 2),
  ];

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mb-6 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border border-secondary-default/30 rounded-xl p-4 shadow-lg shadow-secondary-default/10 z-[120]"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white/90">Proficiency Overview</h3>
          <button
            onClick={() => setShowFullHeatMap(true)}
            className="text-xs px-3 py-1.5 bg-gradient-to-r from-secondary-default/20 to-blue-500/20 border border-secondary-default/40 text-secondary-default rounded-lg hover:bg-secondary-default/30 transition-all"
          >
            View Full Heat Map →
          </button>
        </div>

        {/* Compact Stats Cards - 2 lines each */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`bg-gradient-to-br ${levelToGradient.Expert} rounded-lg px-2 py-1.5 text-center`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-base">{levelToIcon.Expert}</span>
              <span className={`text-lg font-bold ${levelToTextColor.Expert}`}>{expertCount}</span>
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Expert</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className={`bg-gradient-to-br ${levelToGradient.Advanced} rounded-lg px-2 py-1.5 text-center`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-base">{levelToIcon.Advanced}</span>
              <span className={`text-lg font-bold ${levelToTextColor.Advanced}`}>{advancedCount}</span>
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Advanced</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`bg-gradient-to-br ${levelToGradient.Intermediate} rounded-lg px-2 py-1.5 text-center`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-base">{levelToIcon.Intermediate}</span>
              <span className={`text-lg font-bold ${levelToTextColor.Intermediate}`}>{intermediateCount}</span>
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Intermediate</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className={`bg-gradient-to-br ${levelToGradient.Familiar} rounded-lg px-2 py-1.5 text-center`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-base">{levelToIcon.Familiar}</span>
              <span className={`text-lg font-bold ${levelToTextColor.Familiar}`}>{familiarCount}</span>
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Familiar</div>
          </motion.div>
        </div>

        {/* Compact Mini Heat Map Grid - Top 12 Skills - Single Line */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
          {topSkills.map((skill, index) => {
            const level = skill.metadata?.level || 'Familiar';
            const colorClass = levelToColor[level];
            const experience = skill.metadata?.yearsOfExperience;
            const iconName = skill.metadata?.icon || 'FaCode'; // Use icon from metadata

            // Determine if skill is in first row for smart tooltip positioning
            const isInFirstRow = index < 6; // 6 columns in lg breakpoint

            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.03 }}
                className="relative group"
              >
                <div
                  className={`relative px-2 py-1 rounded-md border ${colorClass} text-[11px] font-semibold transition-all hover:shadow-lg hover:shadow-secondary-default/20 cursor-pointer`}
                >
                  {/* Icon + Name - Single Line */}
                  <div className="flex items-center justify-center gap-1">
                    <DynamicIcon iconName={iconName} className="text-xs flex-shrink-0" />
                    <div className="truncate">{skill.name}</div>
                  </div>
                </div>

                {/* Enhanced Tooltip - Smart Positioning */}
                <div className={`absolute ${isInFirstRow ? 'top-full mt-3' : 'bottom-full mb-3'} left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[9999]`}>
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 backdrop-blur-md border-2 border-secondary-default/50 rounded-lg px-3 py-2.5 shadow-2xl shadow-secondary-default/30 w-max max-w-[280px]">
                    {/* Technology Name with Icon */}
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                      <DynamicIcon iconName={iconName} className="text-base text-secondary-default flex-shrink-0" />
                      <div className="text-sm font-bold text-white break-words">{skill.name}</div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] gap-2">
                        <span className="text-white/60">Level:</span>
                        <span className={`font-semibold ${levelToTextColor[level]}`}>{level}</span>
                      </div>
                      {experience && (
                        <div className="flex items-center justify-between text-[11px] gap-2">
                          <span className="text-white/60">Experience:</span>
                          <span className="font-semibold text-white">{experience} {experience === 1 ? 'year' : 'years'}</span>
                        </div>
                      )}
                      {skill.metadata?.lastUsed && (
                        <div className="flex items-center justify-between text-[11px] gap-2">
                          <span className="text-white/60">Last Used:</span>
                          <span className="font-semibold text-emerald-400">
                            {skill.metadata.lastUsed === 'Current' ? '🟢 Current' : skill.metadata.lastUsed}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tooltip Arrow - Dynamic Direction */}
                    <div className={`absolute ${isInFirstRow ? 'bottom-full mb-px' : 'top-full mt-px'} left-1/2 transform -translate-x-1/2`}>
                      <div className={`border-[6px] border-transparent ${isInFirstRow ? 'border-b-secondary-default/50' : 'border-t-secondary-default/50'}`}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Full Heat Map Modal */}
      {showFullHeatMap && (
        <SkillsHeatMapModal
          onClose={() => setShowFullHeatMap(false)}
          skills1={skillsHierarchy[0] || { name: "Skills", children: [] }}
          skills2={skillsHierarchy[1] || { name: "Skills", children: [] }}
        />
      )}
    </>
  );
}
