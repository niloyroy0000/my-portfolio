"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaLightbulb,
  FaArrowRight
} from "@/lib/icons";
import { CaseStudy, Project } from "@/types/api";

interface CaseStudyCardProps {
  project: Project;
  caseStudy: CaseStudy;
  onViewDetails?: () => void;
  className?: string;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  project,
  caseStudy,
  onViewDetails,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`bg-gray-900/50 border border-purple-500/30 rounded-xl overflow-hidden h-full flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div>
          <span className="text-xs text-purple-400/80 font-medium uppercase tracking-wider">
            Case Study
          </span>
          <h3 className="text-xl font-bold mt-1 text-purple-400">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="text-sm font-medium text-purple-300/80 mt-1 line-clamp-1">{project.subtitle}</p>
          )}
        </div>
      </div>

      {/* Challenge Section */}
      <div className="px-5 py-3 border-t border-white/10">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-red-500/20 rounded-lg shrink-0">
            <FaExclamationTriangle className="text-red-400 text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-red-400 mb-1">The Challenge</h4>
            <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
              {caseStudy.problem}
            </p>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="px-5 py-3 border-t border-white/10 flex-1">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-emerald-500/20 rounded-lg shrink-0">
            <FaLightbulb className="text-emerald-400 text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-emerald-400 mb-1">The Solution</h4>
            <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
              {caseStudy.solution}
            </p>
          </div>
        </div>
      </div>

      {/* View Full Case Study Button - Opens Modal */}
      <button
        onClick={onViewDetails}
        className="w-full px-5 py-3 border-t border-white/10 flex items-center justify-center gap-2 text-sm text-purple-400/80 hover:text-purple-300 hover:bg-purple-500/10 transition-all mt-auto group"
      >
        <span>View Full Case Study</span>
        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

export default CaseStudyCard;
