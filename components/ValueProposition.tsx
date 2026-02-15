"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaBrain,
  FaCloud,
  FaUsers,
  FaCheckCircle
} from "@/lib/icons";

interface ValueItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight?: string;
  color: string;
  bgColor: string;
}

const valueItems: ValueItem[] = [
  {
    icon: FaBrain,
    title: "AI-Powered Innovation",
    description: "Built SpireWiz, reducing merge conflicts by",
    highlight: "80-90%",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20"
  },
  {
    icon: FaCloud,
    title: "Cloud Cost Optimization",
    description: "Achieved infrastructure savings of",
    highlight: "55%",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20"
  },
  {
    icon: FaUsers,
    title: "Enterprise Scale Impact",
    description: "Solutions serving",
    highlight: "20M+ users",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20"
  },
  {
    icon: FaRocket,
    title: "Full-Stack Expertise",
    description: "End-to-end development with",
    highlight: "10+ years",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20"
  }
];

interface ValuePropositionProps {
  className?: string;
}

const ValueProposition: React.FC<ValuePropositionProps> = ({
  className = ""
}) => {
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
          Why Work With Me
        </h2>
        <p className="text-sm text-white/60">
          Proven track record of delivering impactful solutions
        </p>
      </div>

      {/* Value Cards */}
      <div className="bg-gray-900/50 border border-secondary-default/20 rounded-xl p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {valueItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 group"
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`text-xl ${item.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white mb-2">
                  {item.title}
                </h3>

                {/* Description with Highlight */}
                <p className="text-sm text-white/60 leading-relaxed">
                  {item.description}{" "}
                  {item.highlight && (
                    <span className={`${item.color} font-bold`}>
                      {item.highlight}
                    </span>
                  )}
                </p>

                {/* Checkmark indicator */}
                <div className="absolute top-4 right-4">
                  <FaCheckCircle className={`text-sm ${item.color} opacity-50`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-white/50">
            <span className="text-secondary-default">Microsoft Certified</span> ·
            <span className="text-white/70"> Open Source Contributor</span> ·
            <span className="text-emerald-400"> AI Integration Expert</span>
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default ValueProposition;
