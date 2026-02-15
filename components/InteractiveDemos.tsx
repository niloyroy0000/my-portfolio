"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaChevronLeft,
  FaChevronRight
} from "@/lib/icons";
import type { Project } from "@/types/api";

interface DemoProject {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  techStack: string[];
  features: string[];
}

interface InteractiveDemosProps {
  className?: string;
  projects: Project[];
}

const InteractiveDemos: React.FC<InteractiveDemosProps> = ({ className = "", projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Get projects with live URLs or GitHub links (active projects)
  const demoProjects: DemoProject[] = projects
    .filter((p: Project) => p.isActive && (p.url || p.github))
    .slice(0, 4)
    .map((p: Project) => ({
      id: p.num,
      title: p.title,
      subtitle: p.subtitle,
      description: p.shortDescription,
      image: p.image || "/assets/portfolio/placeholder.webp",
      liveUrl: p.url || undefined,
      githubUrl: p.github || undefined,
      techStack: p.stacks.slice(0, 4),
      features: p.responsibilities?.slice(0, 3) || [
        "Modern architecture",
        "Scalable design",
        "Best practices"
      ]
    }));

  if (demoProjects.length === 0) return null;

  const activeDemo = demoProjects[activeIndex];

  const nextDemo = () => {
    setActiveIndex((prev) => (prev + 1) % demoProjects.length);
  };

  const prevDemo = () => {
    setActiveIndex((prev) => (prev - 1 + demoProjects.length) % demoProjects.length);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`py-12 ${className}`}
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl xl:text-3xl font-bold mb-2 bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
          Live Demos & Projects
        </h2>
        <p className="text-sm text-white/60">
          Explore my work in action
        </p>
      </div>

      {/* Demo Container */}
      <div className="bg-gray-900/50 border border-secondary-default/20 rounded-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Preview Section */}
          <div className="relative aspect-video lg:aspect-auto lg:min-h-[400px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {/* Project Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
                <img
                  src={activeDemo.image}
                  alt={activeDemo.title}
                  className="w-full h-full object-cover object-top opacity-80"
                />

                {/* Play Button Overlay */}
                {activeDemo.liveUrl && (
                  <a
                    href={activeDemo.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center z-20 group"
                  >
                    <div className="w-20 h-20 rounded-full bg-secondary-default/20 backdrop-blur-sm border border-secondary-default/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary-default/30 transition-all duration-300">
                      <FaPlay className="text-2xl text-secondary-default ml-1" />
                    </div>
                  </a>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {demoProjects.length > 1 && (
              <>
                <button
                  onClick={prevDemo}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-all"
                  aria-label="Previous demo"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextDemo}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-all"
                  aria-label="Next demo"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Project Counter */}
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white/70">
              {activeIndex + 1} / {demoProjects.length}
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 lg:p-8 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                  {activeDemo.title}
                </h3>
                {activeDemo.subtitle && (
                  <p className="text-sm text-secondary-default/80 mb-4">
                    {activeDemo.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  {activeDemo.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeDemo.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {activeDemo.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-white/60">
                        <FaCode className="text-secondary-default/60 mt-1 shrink-0 text-xs" />
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              {activeDemo.liveUrl && (
                <a
                  href={activeDemo.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-secondary-default to-blue-500 hover:from-blue-500 hover:to-secondary-default text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                >
                  <FaExternalLinkAlt className="text-xs" />
                  <span>View Live</span>
                </a>
              )}
              {activeDemo.githubUrl && (
                <a
                  href={activeDemo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white rounded-lg transition-all duration-300 text-sm"
                >
                  <FaGithub />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Project Selector Dots */}
        {demoProjects.length > 1 && (
          <div className="flex justify-center gap-2 py-4 border-t border-white/10">
            {demoProjects.map((demo, index) => (
              <button
                key={demo.id}
                onClick={() => setActiveIndex(index)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-gradient-to-r from-secondary-default to-blue-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                }`}
              >
                {demo.title.length > 15 ? `${demo.title.slice(0, 15)}...` : demo.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default InteractiveDemos;
