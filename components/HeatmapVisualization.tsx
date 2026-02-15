"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMousePointer, FiActivity, FiEye, FiDownload, FiTrash2 } from "@/lib/icons";
import {
  getHeatmapInteractions,
  exportHeatmapData,
  clearHeatmapData,
  type HeatmapInteraction
} from '@/lib/heatmapAnalytics';

interface SectionEngagement {
  sectionId: string;
  viewTime: number;
}

export default function HeatmapVisualization() {
  const [interactions, setInteractions] = useState<HeatmapInteraction[]>([]);
  const [scrollDepth, setScrollDepth] = useState<Record<string, number>>({});
  const [sectionEngagement, setSectionEngagement] = useState<Record<string, SectionEngagement>>({});

  useEffect(() => {
    loadHeatmapData();
  }, []);

  const loadHeatmapData = () => {
    const data = getHeatmapInteractions();
    setInteractions(data);

    try {
      const scroll = JSON.parse(localStorage.getItem('heatmap_scroll_depth') || '{}');
      setScrollDepth(scroll);

      const engagement = JSON.parse(localStorage.getItem('heatmap_section_engagement') || '{}');
      setSectionEngagement(engagement);
    } catch (error) {
      console.error('Failed to load heatmap data:', error);
    }
  };

  const handleClearData = () => {
    clearHeatmapData();
    loadHeatmapData();
  };

  const handleExportData = () => {
    exportHeatmapData();
  };

  // Calculate statistics
  const totalInteractions = interactions.length;
  const clicks = interactions.filter(i => i.type === 'click').length;
  const hovers = interactions.filter(i => i.type === 'hover').length;
  const scrolls = interactions.filter(i => i.type === 'scroll').length;

  // Top clicked elements
  const clickCounts: Record<string, number> = {};
  interactions
    .filter(i => i.type === 'click' && i.elementId !== 'unnamed')
    .forEach(i => {
      clickCounts[i.elementId] = (clickCounts[i.elementId] || 0) + 1;
    });

  const topClicks = Object.entries(clickCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Section engagement sorted by view time
  const topSections = Object.values(sectionEngagement)
    .sort((a: SectionEngagement, b: SectionEngagement) => b.viewTime - a.viewTime)
    .slice(0, 5);

  return (
    <section className="py-12 bg-gradient-to-br from-primary via-primary/95 to-primary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-secondary-default bg-clip-text text-transparent">
            Heatmap Analytics
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            User interactions and engagement metrics
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-4 hover:border-secondary-default/40 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <FiActivity className="text-lg text-secondary-default" />
              <h3 className="text-xs font-medium text-white/60">Total</h3>
            </div>
            <p className="text-2xl font-bold text-white">{totalInteractions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-4 hover:border-blue-400/40 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <FiMousePointer className="text-lg text-blue-400" />
              <h3 className="text-xs font-medium text-white/60">Clicks</h3>
            </div>
            <p className="text-2xl font-bold text-white">{clicks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-4 hover:border-green-400/40 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <FiEye className="text-lg text-green-400" />
              <h3 className="text-xs font-medium text-white/60">Hovers</h3>
            </div>
            <p className="text-2xl font-bold text-white">{hovers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-4 hover:border-purple-400/40 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <FiActivity className="text-lg text-purple-400" />
              <h3 className="text-xs font-medium text-white/60">Scrolls</h3>
            </div>
            <p className="text-2xl font-bold text-white">{scrolls}</p>
          </motion.div>
        </div>

        {/* Top Clicked Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-5 mb-5"
        >
          <h3 className="text-lg font-semibold text-white/90 mb-3">Top Clicked Elements</h3>
          {topClicks.length > 0 ? (
            <div className="space-y-2">
              {topClicks.map(([elementId, count], index) => (
                <div key={elementId} className="flex items-center gap-2">
                  <span className="text-xs text-white/40 w-6">#{index + 1}</span>
                  <div className="flex-1 bg-white/5 rounded-lg p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/80 font-mono">#{elementId}</span>
                      <span className="text-xs text-secondary-default font-bold">{count} clicks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-xs">No click data available yet</p>
          )}
        </motion.div>

        {/* Section Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-5 mb-5"
        >
          <h3 className="text-lg font-semibold text-white/90 mb-3">Section Engagement</h3>
          {topSections.length > 0 ? (
            <div className="space-y-2.5">
              {topSections.map((section: SectionEngagement, index) => (
                <div key={section.sectionId} className="flex items-center gap-2">
                  <span className="text-xs text-white/40 w-6">#{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/80 capitalize">{section.sectionId}</span>
                      <span className="text-xs text-secondary-default font-bold">
                        {(section.viewTime / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-secondary-default to-blue-500 h-1.5 rounded-full"
                        style={{
                          width: `${Math.min((section.viewTime / (topSections[0]?.viewTime || 1)) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-xs">No section engagement data available yet</p>
          )}
        </motion.div>

        {/* Scroll Depth by Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-white/5 backdrop-blur-sm border border-secondary-default/20 rounded-lg p-5 mb-5"
        >
          <h3 className="text-lg font-semibold text-white/90 mb-3">Scroll Depth by Page</h3>
          {Object.keys(scrollDepth).length > 0 ? (
            <div className="space-y-2.5">
              {Object.entries(scrollDepth)
                .sort(([, a], [, b]) => b - a)
                .map(([page, depth]) => (
                  <div key={page} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/80">{page || '/'}</span>
                        <span className="text-xs text-secondary-default font-bold">{depth}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full"
                          style={{ width: `${depth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-white/40 text-xs">No scroll depth data available yet</p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-secondary-default to-blue-500 text-primary rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <FiDownload className="text-base" />
            Export
          </button>

          <button
            onClick={loadHeatmapData}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-secondary-default/20 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <FiActivity className="text-base" />
            Refresh
          </button>

          <button
            onClick={handleClearData}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            <FiTrash2 className="text-base" />
            Clear
          </button>
        </motion.div>

        {/* Console Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-white/40">
            Console: <code className="text-secondary-default">getHeatmapStats()</code> for detailed analytics
          </p>
        </motion.div>
      </div>
    </section>
  );
}
