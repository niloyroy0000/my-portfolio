"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaBriefcase,
  FaCertificate,
  FaUsers,
  FaRocket,
  FaCloud,
  FaStar,
  FaGithub
} from "@/lib/icons";
import type { Project, Certification, TimelineEntry } from "@/types/api";
import { calculateTotalExperience } from "@/helpers/utility";
import { countAllTechnologies } from "@/lib/skillsDataTransformer";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

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

interface ByTheNumbersDashboardProps {
  projects: Project[];
  certifications: Certification[];
  timeline: TimelineEntry[];
  skills1: SkillNode;
  skills2: SkillNode;
}

// Simple count-up hook
const useCountUp = ({ end, suffix = "", prefix = "", duration = 2000 }: CountUpProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          const startTime = Date.now();
          const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(end * eased));
            if (progress >= 1) {
              clearInterval(timer);
              setCount(end);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasStarted]);

  return { count: `${prefix}${count}${suffix}`, ref };
};

const ByTheNumbersDashboard: React.FC<ByTheNumbersDashboardProps> = ({
  projects,
  certifications,
  timeline,
  skills1,
  skills2,
}) => {
  // Calculate all metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.isActive).length;
  const totalCertifications = certifications.filter(c => !c.isUpcoming).length;
  const totalTechnologies = countAllTechnologies(skills1, skills2);
  const totalExperience = calculateTotalExperience(timeline);
  const totalCompanies = timeline.length;
  const openSourceProjects = projects.filter(p => p.isOpenSource).length;

  // Extract numeric value from experience string (e.g., "10+ Years" -> 10)
  const experienceYears = parseInt(totalExperience.replace(/\D/g, '')) || 10;

  // Animated counters
  const projectsCount = useCountUp({ end: totalProjects, suffix: "+" });
  const certificationsCount = useCountUp({ end: totalCertifications, suffix: "+" });
  const technologiesCount = useCountUp({ end: totalTechnologies, suffix: "+" });
  const experienceCount = useCountUp({ end: experienceYears, suffix: "+" });
  const companiesCount = useCountUp({ end: totalCompanies });
  const openSourceCount = useCountUp({ end: openSourceProjects });

  const metrics = [
    {
      icon: FaBriefcase,
      value: experienceCount,
      label: "Years Experience",
      color: "from-[#00BFFF] to-[#0080FF]",
      iconBg: "bg-[#00BFFF]/20",
      iconColor: "text-[#00BFFF]"
    },
    {
      icon: FaCode,
      value: projectsCount,
      label: "Projects Delivered",
      color: "from-emerald-400 to-cyan-500",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400"
    },
    {
      icon: FaCertificate,
      value: certificationsCount,
      label: "Certifications",
      color: "text-purple-400",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      useSolidColor: true
    },
    {
      icon: FaRocket,
      value: technologiesCount,
      label: "Technologies",
      color: "text-orange-400",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
      useSolidColor: true
    },
    {
      icon: FaUsers,
      value: companiesCount,
      label: "Companies",
      color: "text-blue-400",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      useSolidColor: true
    },
    {
      icon: FaGithub,
      value: openSourceCount,
      label: "Open Source",
      color: "text-slate-400",
      iconBg: "bg-slate-500/20",
      iconColor: "text-slate-400",
      useSolidColor: true
    }
  ];

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
          By The Numbers
        </h2>
        <p className="text-sm text-white/60">
          A quantified overview of my professional journey
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="bg-gray-900/50 border border-secondary-default/20 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                {/* Icon */}
                <div className={`w-12 h-12 mx-auto mb-3 ${metric.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`text-xl ${metric.iconColor}`} />
                </div>

                {/* Value */}
                <div
                  ref={metric.value.ref}
                  className={`text-2xl xl:text-3xl font-bold tabular-nums ${
                    metric.useSolidColor
                      ? metric.color
                      : `bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`
                  }`}
                >
                  {metric.value.count}
                </div>

                {/* Label */}
                <div className="text-xs text-white/60 mt-1 font-medium">
                  {metric.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Impact Highlights */}
        <div className="mt-6 pt-6 border-white/10">
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <FaStar className="text-emerald-400" />
              <span className="text-emerald-300">80-90% Efficiency Gains with SpireWiz</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-golden-500/10 border border-golden-500/30 rounded-full">
              <FaStar className="text-golden-400" />
              <span className="text-golden-400">$180K Annual Business Impact</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <FaStar className="text-emerald-400" />
              <span className="text-emerald-300">75% Upgrade Time Reduction</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <FaRocket className="text-blue-400" />
              <span className="text-blue-300">10x Performance Boost</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ByTheNumbersDashboard;
