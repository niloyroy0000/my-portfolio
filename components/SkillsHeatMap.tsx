"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
// Skills data will be passed as props from parent component

/**
 * SkillsHeatMap - Accessible skills visualization component
 * WCAG 2.1 AA compliant with keyboard navigation and ARIA labels
 */

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

// Level to intensity mapping
const levelToIntensity = {
  'Expert': 4,
  'Advanced': 3,
  'Intermediate': 2,
  'Familiar': 1,
};

const levelToColor = {
  'Expert': 'bg-purple-500/90 border-purple-400',
  'Advanced': 'bg-emerald-500/80 border-emerald-400',
  'Intermediate': 'bg-blue-500/70 border-blue-400',
  'Familiar': 'bg-slate-500/60 border-slate-400',
};

interface SkillsHeatMapProps {
  skillsData?: SkillNode;
}

export default function SkillsHeatMap({ skillsData }: SkillsHeatMapProps = { skillsData: { name: 'Skills', children: [] } }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);

  // Extract all skills with metadata
  const extractSkills = (node: SkillNode): { category: string; skills: SkillNode[] }[] => {
    const categories: { category: string; skills: SkillNode[] }[] = [];

    if (node.children) {
      node.children.forEach(categoryNode => {
        if (categoryNode.children) {
          const skillsWithMetadata = categoryNode.children.filter(
            skill => skill.metadata && (skill.metadata.level || skill.metadata.yearsOfExperience)
          );

          if (skillsWithMetadata.length > 0) {
            categories.push({
              category: categoryNode.name,
              skills: skillsWithMetadata
            });
          }
        }
      });
    }

    return categories;
  };

  const skillCategories = skillsData ? extractSkills(skillsData) : [];

  // Filter categories
  const displayedCategories = selectedCategory
    ? skillCategories.filter(c => c.category === selectedCategory)
    : skillCategories;

  return (
    <section
      className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary"
      aria-labelledby="skills-heatmap-title"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            id="skills-heatmap-title"
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-secondary-default bg-clip-text text-transparent"
          >
            Skills Heat Map
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Visual representation of my technical skills, proficiency levels, and years of experience.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
          role="group"
          aria-label="Filter skills by category"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f] ${
              selectedCategory === null
                ? 'bg-secondary-default text-primary'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
            aria-pressed={selectedCategory === null}
          >
            All Categories
          </button>
          {skillCategories.map(({ category }) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f] ${
                selectedCategory === category
                  ? 'bg-secondary-default text-primary'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-6 justify-center mb-12"
          role="group"
          aria-label="Skill proficiency level legend"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500/90 border border-purple-400 rounded" aria-hidden="true" />
            <span className="text-sm text-white/80">Expert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500/80 border border-emerald-400 rounded" aria-hidden="true" />
            <span className="text-sm text-white/80">Advanced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500/70 border border-blue-400 rounded" aria-hidden="true" />
            <span className="text-sm text-white/80">Intermediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-500/60 border border-slate-400 rounded" aria-hidden="true" />
            <span className="text-sm text-white/80">Familiar</span>
          </div>
        </motion.div>

        {/* Heat Map Grid */}
        <div className="space-y-12" role="list" aria-label="Skills by category">
          {displayedCategories.map(({ category, skills }, categoryIndex) => (
            <motion.article
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + categoryIndex * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-xl p-6"
              aria-labelledby={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <h3
                id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                className="text-2xl font-semibold text-white/90 mb-6"
              >
                {category}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list">
                {skills.map((skill, skillIndex) => {
                  const level = skill.metadata?.level || 'Familiar';
                  const colorClass = levelToColor[level];
                  const experience = skill.metadata?.yearsOfExperience;
                  const lastUsed = skill.metadata?.lastUsed;

                  return (
                    <motion.div
                      key={skill.name}
                      role="listitem"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onFocus={() => setHoveredSkill(skill)}
                      onBlur={() => setHoveredSkill(null)}
                      tabIndex={0}
                      className={`relative p-4 rounded-lg border-2 ${colorClass} cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]`}
                      aria-label={`${skill.name}: ${level} level${experience ? `, ${experience} years experience` : ''}${lastUsed ? `, last used ${lastUsed}` : ''}`}
                    >
                      {/* Skill Name */}
                      <div className="text-white font-semibold text-sm mb-2">{skill.name}</div>

                      {/* Experience Badge */}
                      {experience && (
                        <div className="text-xs text-white/90 mb-1">
                          {experience}+ {experience === 1 ? 'year' : 'years'}
                        </div>
                      )}

                      {/* Level Badge */}
                      <div className="text-xs text-white/80">{level}</div>

                      {/* Last Used */}
                      {lastUsed && (
                        <div className="text-xs text-white/60 mt-1">
                          {lastUsed === 'Current' ? '🟢 Current' : `Last: ${lastUsed}`}
                        </div>
                      )}

                      {/* Hover/Focus Tooltip */}
                      {hoveredSkill === skill && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          role="tooltip"
                          className="absolute z-10 top-full left-0 mt-2 p-3 bg-primary border border-secondary-default/30 rounded-lg shadow-xl min-w-[200px]"
                        >
                          <div className="text-sm font-semibold text-white mb-1">{skill.name}</div>
                          <div className="text-xs text-white/70 space-y-1">
                            <div>Level: {level}</div>
                            {experience && <div>Experience: {experience} years</div>}
                            {lastUsed && <div>Last Used: {lastUsed}</div>}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {skillCategories.reduce((acc, { skills }) =>
                acc + skills.filter(s => s.metadata?.level === 'Expert').length, 0
              )}
            </div>
            <div className="text-sm text-white/60">Expert Skills</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {skillCategories.reduce((acc, { skills }) =>
                acc + skills.filter(s => s.metadata?.level === 'Advanced').length, 0
              )}
            </div>
            <div className="text-sm text-white/60">Advanced Skills</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {skillCategories.reduce((acc, { skills }) =>
                acc + skills.filter(s => s.metadata?.level === 'Intermediate').length, 0
              )}
            </div>
            <div className="text-sm text-white/60">Intermediate Skills</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-secondary-default mb-2">
              {skillCategories.reduce((acc, { skills }) =>
                acc + skills.filter(s => s.metadata?.lastUsed === 'Current').length, 0
              )}
            </div>
            <div className="text-sm text-white/60">Currently Active</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
