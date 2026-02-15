"use client";

import { useEffect } from 'react';
import {
  trackClick,
  trackHover,
  trackScroll,
  trackSectionEngagement,
  cleanupHeatmapTracking
} from '@/lib/heatmapAnalytics';

// Heatmap Tracker - Automatically tracks user interactions
// Usage: View heatmap data in browser console: getHeatmapStats(), exportHeatmapData(), clearHeatmapData()
const HeatmapTracker = () => {
  useEffect(() => {
    // Track clicks
    const handleClick = (e: MouseEvent) => trackClick(e);
    document.addEventListener('click', handleClick);

    // Track hovers (debounced in trackHover function)
    const handleMouseMove = (e: MouseEvent) => trackHover(e);
    document.addEventListener('mousemove', handleMouseMove);

    // Track scrolling (throttled)
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => trackScroll(), 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track section engagement for main portfolio sections
    const sections = [
      'hero',
      'about',
      'skills',
      'projects',
      'experience',
      'certifications',
      'contact',
      'performance-metrics'
    ];

    sections.forEach(sectionId => {
      trackSectionEngagement(sectionId);
    });

    // Dynamically import the analytics utility to make functions available globally
    import('@/lib/heatmapAnalytics');

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cleanupHeatmapTracking();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default HeatmapTracker;
