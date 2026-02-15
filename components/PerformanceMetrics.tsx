"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import MetricCard from "./MetricCard";
import { FiZap, FiSearch, FiEye, FiCheckCircle, FiClock, FiTrendingUp } from "@/lib/icons";

interface StoredWebVital {
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsData {
  LCP?: StoredWebVital;
  FID?: StoredWebVital;
  CLS?: StoredWebVital;
  FCP?: StoredWebVital;
  TTFB?: StoredWebVital;
  INP?: StoredWebVital;
}

export default function PerformanceMetrics() {
  const [realWebVitals, setRealWebVitals] = useState<WebVitalsData>({});

  // Load real Web Vitals from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('webVitals');
      if (stored) {
        setRealWebVitals(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load web vitals:', error);
    }
  }, []);

  // Current Lighthouse scores (update these based on actual metrics)
  const lighthouseScores = {
    performance: 100,
    seo: 100,
    accessibility: 92,
    bestPractices: 96
  };

  // Format Web Vital value for display
  const formatWebVital = (vitalName: string, storedValue?: StoredWebVital, defaultValue?: string): string => {
    if (!storedValue) return defaultValue || 'N/A';

    const value = storedValue.value;
    if (vitalName === 'LCP' || vitalName === 'FCP') {
      return `${(value / 1000).toFixed(2)}s`;
    } else if (vitalName === 'CLS') {
      return value.toFixed(3);
    } else {
      return `${Math.round(value)}ms`;
    }
  };

  // Determine status based on rating
  const getStatus = (storedValue?: StoredWebVital, defaultStatus?: 'excellent' | 'good' | 'poor'): 'excellent' | 'good' | 'poor' => {
    if (!storedValue) return defaultStatus || 'excellent';

    if (storedValue.rating === 'good') return 'excellent';
    if (storedValue.rating === 'needs-improvement') return 'good';
    return 'poor';
  };

  // Core Web Vitals (with real data when available)
  const webVitals = [
    {
      name: "Largest Contentful Paint (LCP)",
      value: formatWebVital('LCP', realWebVitals.LCP, '0.5s'),
      threshold: "2.5s",
      status: getStatus(realWebVitals.LCP, 'excellent'),
      description: "How quickly the main content loads",
      icon: <FiZap />
    },
    {
      name: "Interaction to Next Paint (INP)",
      value: formatWebVital('INP', realWebVitals.INP, '<100ms'),
      threshold: "200ms",
      status: getStatus(realWebVitals.INP, 'excellent'),
      description: "Responsiveness to user interactions",
      icon: <FiClock />
    },
    {
      name: "Cumulative Layout Shift (CLS)",
      value: formatWebVital('CLS', realWebVitals.CLS, '0'),
      threshold: "0.1",
      status: getStatus(realWebVitals.CLS, 'excellent'),
      description: "Visual stability during page load",
      icon: <FiTrendingUp />
    }
  ];

  // Get color based on score
  const getScoreColor = (score: number): "green" | "yellow" | "red" => {
    if (score >= 90) return "green";
    if (score >= 50) return "yellow";
    return "red";
  };

  // Get Web Vital status color
  const getVitalStatusColor = (status: "excellent" | "good" | "poor"): string => {
    if (status === "excellent") return "text-green-400 bg-green-500/20 border-green-500/30";
    if (status === "good") return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-red-400 bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="space-y-8">
      {/* Lighthouse Scores */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-center text-white/90">
            Google Lighthouse Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Performance"
              score={lighthouseScores.performance}
              maxScore={100}
              color={getScoreColor(lighthouseScores.performance)}
              icon={<FiZap />}
              description="Perfect score"
            />
            <MetricCard
              title="SEO"
              score={lighthouseScores.seo}
              maxScore={100}
              color={getScoreColor(lighthouseScores.seo)}
              icon={<FiSearch />}
              description="SEO optimized"
            />
            <MetricCard
              title="Accessibility"
              score={lighthouseScores.accessibility}
              maxScore={100}
              color={getScoreColor(lighthouseScores.accessibility)}
              icon={<FiEye />}
              description="WCAG 2.1 AA"
            />
            <MetricCard
              title="Best Practices"
              score={lighthouseScores.bestPractices}
              maxScore={100}
              color={getScoreColor(lighthouseScores.bestPractices)}
              icon={<FiCheckCircle />}
              description="Modern standards"
            />
          </div>
        </motion.div>

        {/* Core Web Vitals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-center text-white/90">
            Core Web Vitals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {webVitals.map((vital, index) => (
              <motion.div
                key={vital.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-4 hover:border-secondary-default/40 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary-default/20 rounded-lg flex items-center justify-center text-secondary-default text-xl flex-shrink-0">
                    {vital.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-white/90 mb-1 truncate">{vital.name}</h4>
                    <p className="text-xs text-white/50 mb-2">{vital.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getVitalStatusColor(vital.status)}`}>
                        {vital.value}
                      </span>
                      <span className="text-xs text-white/40">
                        ≤ {vital.threshold}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bundle Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-5 max-w-xl mx-auto"
        >
          <h3 className="text-xl font-semibold mb-4 text-center text-white/90">
            Bundle Size
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-xs text-white/60 mb-1.5">Homepage</p>
              <p className="text-3xl font-bold text-secondary-default">3.48 KB</p>
              <p className="text-xs text-white/40 mt-1">Page bundle</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/60 mb-1.5">First Load JS</p>
              <p className="text-3xl font-bold text-secondary-default">9.11 MB</p>
              <p className="text-xs text-white/40 mt-1">Includes vendors</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-white/40">
              Optimized with code splitting and tree shaking
            </p>
          </div>
        </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs text-white/50">
          {Object.keys(realWebVitals).length > 0 ? (
            <>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Real metrics · {new Date(Math.max(...Object.values(realWebVitals).map(v => v.timestamp))).toLocaleString()}
              </span>
            </>
          ) : (
            <>Lighthouse metrics · {new Date().toLocaleDateString()}</>
          )}
        </p>
      </motion.div>
    </div>
  );
}
