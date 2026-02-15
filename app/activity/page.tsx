"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import GitHubActivityGraph from "@/components/GitHubActivityGraph";
import BackgroundElements from "@/components/BackgroundElements";
import { FaGithub, FaFireAlt, FaCalendarAlt, FaCodeBranch } from "@/lib/icons";
import { useCountUp } from "@/hooks/useCountUp";
import { PERFORMANCE_VARIANTS } from "@/constants";
import { GITHUB_PROFILE_URL, type GitHubStats } from "@/lib/github";

export default function ActivityPage() {
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);

  // Callback to receive stats from GitHubActivityGraph
  const handleStatsLoaded = useCallback((stats: GitHubStats) => {
    setGithubStats(stats);
  }, []);

  // Animated counters - use real data when available
  const totalContributionsCount = useCountUp({
    end: githubStats?.totalContributions || 0,
    duration: 2000
  });
  const activeDaysCount = useCountUp({
    end: githubStats?.activeDays || 0,
    duration: 1900
  });
  const currentStreakCount = useCountUp({
    end: githubStats?.currentStreak || 0,
    duration: 1800
  });

  return (
    <section className="min-h-[calc(100vh-136px)] flex flex-col relative overflow-hidden py-6">
      {/* Background Elements */}
      <BackgroundElements
        floatingDots={[
          {
            size: "lg",
            color: "secondary",
            animation: "pulse",
            position: { top: "20%", right: "15%" },
            opacity: 50
          },
          {
            size: "md",
            color: "secondary",
            animation: "ping",
            position: { bottom: "30%", left: "10%" },
            opacity: 40
          }
        ]}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Activity Header - Left Aligned matching Project/Career/Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex-1 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl xl:text-4xl font-bold leading-tight bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
                GitHub Activity
              </h1>
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-white/10 border border-secondary-default/20 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="View GitHub profile"
              >
                <FaGithub className="text-xl text-white/70 hover:text-secondary-default transition-colors" aria-hidden="true" />
              </a>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Real-time contribution data showing{" "}
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                active development
              </span>
              <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}and open source contributions
              </span>
            </p>
          </div>
        </motion.div>

        {/* Activity Stats - Inline matching Project/Career/Skills */}
        <motion.div
          variants={PERFORMANCE_VARIANTS.containerSync}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="bg-gray-900/50 border border-secondary-default/20 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Total Contributions */}
              <div ref={totalContributionsCount.ref} className="flex items-center gap-3">
                <div className="p-2 bg-[#00BFFF]/20 rounded-lg">
                  <FaCodeBranch className="text-[#00BFFF] text-xl" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0080FF] tabular-nums">
                    {githubStats ? totalContributionsCount.count : "—"}
                  </div>
                  <div className="text-xs text-white/60">Contributions</div>
                </div>
              </div>

              <div className="hidden sm:block w-px h-10 bg-white/10" aria-hidden="true"></div>

              {/* Active Days */}
              <div ref={activeDaysCount.ref} className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <FaCalendarAlt className="text-emerald-400 text-xl" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 tabular-nums">
                    {githubStats ? activeDaysCount.count : "—"}
                  </div>
                  <div className="text-xs text-white/60">Active Days</div>
                </div>
              </div>

              <div className="hidden sm:block w-px h-10 bg-white/10" aria-hidden="true"></div>

              {/* Current Streak */}
              <div ref={currentStreakCount.ref} className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <FaFireAlt className="text-orange-400 text-xl" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 tabular-nums">
                    {githubStats ? currentStreakCount.count : "—"}
                  </div>
                  <div className="text-xs text-white/60">Day Streak</div>
                </div>
              </div>

              <div className="hidden lg:block w-px h-10 bg-white/10" aria-hidden="true"></div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                  <FaGithub className="text-fuchsia-400 text-xl" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {githubStats ? (githubStats.currentStreak > 0 ? "Active" : "Ready") : "—"}
                  </div>
                  <div className="text-xs text-white/60">Status</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Graph Component */}
        <GitHubActivityGraph onStatsLoaded={handleStatsLoaded} />
      </div>
    </section>
  );
}
