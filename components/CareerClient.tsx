"use client";
import {
  calculateTotalExperience,
} from "@/helpers/utility";
import type { TimelineEntry } from "@/types/api";
import { PERFORMANCE_VARIANTS } from "@/constants";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaRocket,
  FaAward,
} from "@/lib/icons";
import { motion } from "framer-motion";
import TimelineElement from "@/components/TimelineElement";
import BackgroundElements from "@/components/BackgroundElements";
import { useCountUp } from "@/hooks/useCountUp";
import StatsCards from "@/components/StatsCards";

interface CareerClientProps {
  timeline: TimelineEntry[];
}

const CareerClient = ({ timeline }: CareerClientProps) => {
  const timeLineItems = timeline;
  const totalExperience = calculateTotalExperience(timeLineItems);
  const totalCompanies = timeLineItems.length;
  const leadershipRoles = timeLineItems.filter(item =>
    item.position.toLowerCase().includes('lead') ||
    item.position.toLowerCase().includes('senior')
  ).length;
  const totalAchievements = timeLineItems.reduce((acc, item) => acc + item.responsibilities.length, 0);

  // Animated counters for stats
  // Extract years from totalExperience (handles formats: "10+ years", "10 years", "5 months")
  const experienceYears = totalExperience.includes('year')
    ? parseInt(totalExperience.match(/\d+/)?.[0] || '0')
    : 0;

  // Initialize count-up hooks (must be before any conditional logic)
  const experienceCount = useCountUp({ end: experienceYears, duration: 2000 });
  const companiesCount = useCountUp({ end: totalCompanies, duration: 1900 });
  const leadershipCount = useCountUp({ end: leadershipRoles, duration: 1800 });
  const achievementsCount = useCountUp({ end: totalAchievements, duration: 2000 });

  // Fallback display for experience (handle edge cases)
  const displayExperience = experienceYears > 0
    ? `${experienceCount.count}y+`
    : (totalExperience.includes('month') && !totalExperience.includes('0 month'))
      ? totalExperience
      : timeLineItems.length > 0
        ? totalExperience
        : 'N/A';

  return (
    <section className="min-h-[calc(100vh-136px)] flex flex-col relative overflow-hidden py-6">
      {/* Enhanced Background Elements */}
      <BackgroundElements
        floatingDots={[
          {
            size: "md",
            color: "secondary",
            animation: "ping",
            position: { top: "25%", right: "10%" },
            opacity: 60
          },
          {
            size: "sm",
            color: "blue",
            animation: "pulse",
            position: { bottom: "20%", left: "15%" },
            opacity: 40
          }
        ]}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Professional Header - Left Aligned like Project Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex-1 mb-4">
            <h1 className="text-3xl xl:text-4xl font-bold mb-2 leading-tight bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
              Professional Journey
            </h1>
            <p className="text-sm font-medium leading-relaxed">
              <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Transforming ideas into scalable solutions through{" "}
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                {totalExperience}
              </span>
              <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}of engineering excellence
              </span>
            </p>
          </div>
        </motion.div>

        {/* Career Stats - Match Project Page Design with Count-Up Animation */}
        <motion.div
          variants={PERFORMANCE_VARIANTS.containerSync}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <StatsCards
            stats={[
              {
                icon: FaCalendarAlt,
                value: displayExperience,
                label: "Experience",
                iconColor: "text-[#00BFFF]",
                iconBgColor: "bg-[#00BFFF]/20",
                valueGradient: "from-[#00BFFF] to-[#0080FF]",
                ref: experienceCount.ref
              },
              {
                icon: FaBriefcase,
                value: companiesCount.count,
                label: "Companies",
                iconColor: "text-emerald-400",
                iconBgColor: "bg-emerald-500/20",
                valueGradient: "from-emerald-400 to-cyan-500",
                ref: companiesCount.ref
              },
              {
                icon: FaAward,
                value: leadershipCount.count,
                label: "Leadership Roles",
                iconColor: "text-purple-400",
                iconBgColor: "bg-purple-500/20",
                valueGradient: "from-purple-400 to-pink-500",
                ref: leadershipCount.ref
              },
              {
                icon: FaRocket,
                value: achievementsCount.count,
                label: "Achievements",
                iconColor: "text-orange-400",
                iconBgColor: "bg-orange-500/20",
                valueGradient: "from-orange-400 to-amber-500",
                ref: achievementsCount.ref
              }
            ]}
            showDividers={true}
          />
        </motion.div>

        {/* Simple Timeline Design - Matching Project Timeline */}
        <motion.div
          variants={PERFORMANCE_VARIANTS.fadeInFast}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Timeline Container */}
          <div className="relative">
            {/* Timeline Line - Hidden on mobile, visible on md+ - Purple at top, fades to transparent at bottom */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-transparent" />

            {/* Timeline Items */}
            <div className="space-y-6">
              {timeLineItems.map((item, index) => (
                <TimelineElement
                  key={index}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerClient;
