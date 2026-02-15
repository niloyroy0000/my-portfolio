"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from "@/lib/icons";
import {
  fetchGitHubStatsWithContributions,
  generateContributionData,
  GITHUB_USERNAME,
  GITHUB_PROFILE_URL,
  type GitHubStats,
  type GitHubActivity
} from '@/lib/github';

interface GitHubActivityGraphProps {
  onStatsLoaded?: (stats: GitHubStats) => void;
}

export default function GitHubActivityGraph({ onStatsLoaded }: GitHubActivityGraphProps) {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; date: string; count: number } | null>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [graphQLContributions, setGraphQLContributions] = useState<Map<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to avoid hydration mismatch with date generation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch GitHub data on mount (GraphQL + Events API)
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const { stats: githubStats, contributionMap } = await fetchGitHubStatsWithContributions(GITHUB_USERNAME);
        if (isMounted) {
          setStats(githubStats);
          setGraphQLContributions(contributionMap);
          onStatsLoaded?.(githubStats);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load GitHub activity');
          console.error('GitHub fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [onStatsLoaded]);

  // Create contribution map for the graph
  // GraphQL data takes priority (1 year), falls back to Events API (90 days)
  const contributionMap = useMemo(() => {
    if (!stats) return new Map<string, number>();
    return generateContributionData(stats.recentActivity, graphQLContributions);
  }, [stats, graphQLContributions]);

  // Generate grid data (last 52 weeks, 7 days each)
  const generateGridData = useCallback(() => {
    const weeks: Date[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    // Adjust to start on Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    for (let week = 0; week < 53; week++) {
      const weekDays: Date[] = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + (week * 7) + day);
        if (currentDate <= today) {
          weekDays.push(currentDate);
        }
      }
      if (weekDays.length > 0) {
        weeks.push(weekDays);
      }
    }

    return weeks;
  }, []);

  const gridData = useMemo(() => isMounted ? generateGridData() : [], [generateGridData, isMounted]);

  // Get color intensity based on activity count
  const getIntensityColor = (count: number): string => {
    if (count === 0) return 'bg-white/5 border-white/10';
    if (count <= 2) return 'bg-emerald-500/30 border-emerald-400/50';
    if (count <= 5) return 'bg-emerald-500/60 border-emerald-400/70';
    if (count <= 8) return 'bg-emerald-500/80 border-emerald-400/90';
    return 'bg-emerald-500 border-emerald-400';
  };

  // Month labels
  const getMonthLabel = (weekIndex: number): string | null => {
    if (gridData[weekIndex] && gridData[weekIndex][0]) {
      const date = gridData[weekIndex][0];
      const isFirstWeekOfMonth = date.getDate() <= 7;
      if (isFirstWeekOfMonth || weekIndex === 0) {
        return date.toLocaleDateString('en-US', { month: 'short' });
      }
    }
    return null;
  };

  // Loading skeleton (also shown before mount to avoid hydration mismatch)
  if (isLoading || !isMounted) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-3"
        >
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-3 text-white/60">
              <FaGithub className="text-2xl animate-pulse" aria-hidden="true" />
              <span>Loading GitHub activity...</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-lg p-3"
        >
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-red-400 mb-2">{error}</p>
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-secondary-default hover:text-secondary-default/80 transition-colors"
              >
                <FaGithub aria-hidden="true" />
                View on GitHub
                <FaExternalLinkAlt className="text-xs" aria-hidden="true" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12"
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl xl:text-3xl font-bold mb-2 bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
          GitHub Activity
        </h2>
        <p className="text-sm bg-gradient-to-r from-white/60 to-white/40 bg-clip-text text-transparent">
          Contribution activity from the last year
        </p>
      </div>

      <div className="space-y-4">
        {/* Activity Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-4 md:p-6 overflow-x-auto"
        >
        <div className="min-w-[900px] max-w-[1100px] mx-auto">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-1 ml-8">
            {gridData.map((week, weekIndex) => {
              const monthLabel = getMonthLabel(weekIndex);
              return (
                <div key={weekIndex} className="w-3.5 text-[10px] text-white/50">
                  {monthLabel}
                </div>
              );
            })}
          </div>

          {/* Day of week labels + Graph */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] text-[10px] text-white/50 mr-1">
              <div className="h-3.5">Sun</div>
              <div className="h-3.5">Mon</div>
              <div className="h-3.5">Tue</div>
              <div className="h-3.5">Wed</div>
              <div className="h-3.5">Thu</div>
              <div className="h-3.5">Fri</div>
              <div className="h-3.5">Sat</div>
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]" role="img" aria-label="GitHub contribution graph showing activity over the past year">
              {gridData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((date, dayIndex) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const count = contributionMap.get(dateStr) || 0;
                    const colorClass = getIntensityColor(count);

                    return (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                        whileHover={{ scale: 1.3 }}
                        onMouseEnter={() => setHoveredCell({ x: weekIndex, y: dayIndex, date: dateStr, count })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`relative w-3.5 h-3.5 rounded-sm border cursor-pointer transition-all ${colorClass}`}
                        title={`${dateStr}: ${count} contributions`}
                        tabIndex={0}
                        onFocus={() => setHoveredCell({ x: weekIndex, y: dayIndex, date: dateStr, count })}
                        onBlur={() => setHoveredCell(null)}
                        aria-label={`${date.toDateString()}: ${count} contributions`}
                      >
                        {/* Tooltip */}
                        {hoveredCell?.x === weekIndex && hoveredCell?.y === dayIndex && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            role="tooltip"
                            className="absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-900 border border-secondary-default/30 rounded-lg shadow-2xl whitespace-nowrap text-xs pointer-events-none"
                          >
                            <div className="font-semibold text-white">{count} contributions</div>
                            <div className="text-white/60">{date.toDateString()}</div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-white/60">
            <span>Less</span>
            <div className="w-3.5 h-3.5 rounded-sm bg-white/5 border border-white/10" aria-hidden="true" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500/30 border border-emerald-400/50" aria-hidden="true" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500/60 border border-emerald-400/70" aria-hidden="true" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500/80 border border-emerald-400/90" aria-hidden="true" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500 border border-emerald-400" aria-hidden="true" />
            <span>More</span>
          </div>
        </div>
      </motion.div>

      {/* Activity Breakdown - Real Stats (1 Year Data) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="bg-gray-900/50 border border-secondary-default/20 rounded-lg p-3">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-4">
            {/* Total Contributions */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#00BFFF]/20 rounded-lg">
                <span className="text-[#00BFFF] text-lg" aria-hidden="true">🎯</span>
              </div>
              <div>
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0080FF] tabular-nums">
                  {stats?.totalContributions || 0}
                </div>
                <div className="text-[10px] text-white/60">Total Contributions</div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-white/10" aria-hidden="true"></div>

            {/* Active Days */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                <span className="text-emerald-400 text-lg" aria-hidden="true">📅</span>
              </div>
              <div>
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 tabular-nums">
                  {stats?.activeDays || 0}
                </div>
                <div className="text-[10px] text-white/60">Active Days</div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-white/10" aria-hidden="true"></div>

            {/* Current Streak */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg">
                <span className="text-orange-400 text-lg" aria-hidden="true">🔥</span>
              </div>
              <div>
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 tabular-nums">
                  {stats?.currentStreak || 0}
                </div>
                <div className="text-[10px] text-white/60">Current Streak</div>
              </div>
            </div>

            <div className="hidden lg:block w-px h-8 bg-white/10" aria-hidden="true"></div>

            {/* Longest Streak */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/20 rounded-lg">
                <span className="text-purple-400 text-lg" aria-hidden="true">🏆</span>
              </div>
              <div>
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tabular-nums">
                  {stats?.longestStreak || 0}
                </div>
                <div className="text-[10px] text-white/60">Longest Streak</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

        {/* GitHub Profile Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center"
        >
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-secondary-default transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2 py-1"
          >
            <FaGithub aria-hidden="true" />
            <span>View full activity on GitHub</span>
            <FaExternalLinkAlt className="text-[10px]" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
