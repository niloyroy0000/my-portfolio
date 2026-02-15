"use client";

import { motion } from "framer-motion";
import { FiMail, FiBriefcase, FiGlobe, FiUsers } from "@/lib/icons";
import { HiOutlineBuildingOffice2 } from "@/lib/icons";
import { TbPlane } from "@/lib/icons";
import { RiRobot3Fill } from "@/lib/icons";

/**
 * LookingForSection Component
 *
 * Displays "What I'm Looking For" section with opportunity preferences.
 * Extracted from HomeClient.tsx (lines 505-584) for better maintainability.
 *
 * Shows:
 * - Currently open to opportunities indicator
 * - Grid of preferred job criteria
 * - "Get in Touch" CTA button
 */
const LookingForSection: React.FC = () => {
  return (
    <motion.section
      id="what-looking-for"
      data-testid="home-looking-for"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
      className="py-12"
    >
      {/* Section Header - Outside Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl xl:text-3xl font-bold mb-2 bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
            What I&apos;m Looking For
          </h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-sm text-emerald-400 font-medium">Currently Open to Opportunities</span>
          </div>
        </div>
        <a href="/contact">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary-default/10 to-purple-500/10 hover:from-secondary-default/20 hover:to-purple-500/20 border border-secondary-default/30 hover:border-secondary-default/50 rounded-lg transition-all duration-300 text-sm text-secondary-default font-medium group">
            <FiMail className="text-base group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span>Get in Touch</span>
          </button>
        </a>
      </div>

      {/* Card Container */}
      <div className="bg-gray-900/50 border border-secondary-default/20 rounded-xl p-6 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10">
          {/* Compact Pills - Grid Layout with Icon Left, Text Right */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Senior .NET / Full-Stack */}
            <div className="flex items-center gap-3 bg-white/10 border border-[#00BFFF]/30 rounded-lg p-3 hover:bg-white/15 hover:border-[#00BFFF]/50 transition-all group">
              <FiBriefcase className="text-[#00BFFF] text-xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <p className="text-white font-medium text-sm">Senior .NET / Full-Stack</p>
            </div>

            {/* Remote / Hybrid */}
            <div className="flex items-center gap-3 bg-white/10 border border-emerald-400/30 rounded-lg p-3 hover:bg-white/15 hover:border-emerald-400/50 transition-all group">
              <FiGlobe className="text-emerald-400 text-xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <p className="text-white font-medium text-sm">Remote / Hybrid</p>
            </div>

            {/* Visa Sponsorship */}
            <div className="flex items-center gap-3 bg-white/10 border border-purple-400/30 rounded-lg p-3 hover:bg-white/15 hover:border-purple-400/50 transition-all group">
              <TbPlane className="text-purple-400 text-xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <p className="text-white font-medium text-sm">Visa Sponsorship</p>
            </div>

            {/* Enterprise Scale */}
            <div className="flex items-center gap-3 bg-white/10 border border-[#00BFFF]/30 rounded-lg p-3 hover:bg-white/15 hover:border-[#00BFFF]/50 transition-all group">
              <HiOutlineBuildingOffice2 className="text-[#00BFFF] text-xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <p className="text-white font-medium text-sm">Enterprise Scale</p>
            </div>

            {/* AI/ML Integration */}
            <div className="flex items-center gap-3 bg-white/10 border border-emerald-400/30 rounded-lg p-3 hover:bg-white/15 hover:border-emerald-400/50 transition-all group">
              <RiRobot3Fill className="text-emerald-400 text-xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <p className="text-white font-medium text-sm">AI/ML Integration</p>
            </div>

            {/* Growth-Oriented Teams */}
            <div className="flex items-center gap-3 bg-white/10 border border-purple-400/30 rounded-lg p-3 hover:bg-white/15 hover:border-purple-400/50 transition-all group">
              <FiUsers className="text-purple-400 text-xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <p className="text-white font-medium text-sm">Growth-Oriented Teams</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default LookingForSection;
