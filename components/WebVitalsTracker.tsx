"use client";

import { useEffect } from 'react';
import { onCLS, onLCP, onFCP, onTTFB, onINP, type Metric } from 'web-vitals';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Web Vitals tracking for performance monitoring (Epic 6.2.2)
const WebVitalsTracker = () => {
  useEffect(() => {
    // Track Web Vitals and send to Google Analytics
    const sendToAnalytics = (metric: Metric) => {
      if (typeof window !== 'undefined' && window.gtag) {
        // Send to Google Analytics
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }

      // Log to console in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });
      }

      // Store in localStorage for dashboard display
      try {
        const existingMetrics = JSON.parse(localStorage.getItem('webVitals') || '{}');
        existingMetrics[metric.name] = {
          value: metric.value,
          rating: metric.rating,
          timestamp: Date.now(),
        };
        localStorage.setItem('webVitals', JSON.stringify(existingMetrics));
      } catch (error) {
        console.error('Failed to store web vitals:', error);
      }
    };

    // Track Core Web Vitals
    onCLS(sendToAnalytics);    // Cumulative Layout Shift
    onLCP(sendToAnalytics);    // Largest Contentful Paint
    onFCP(sendToAnalytics);    // First Contentful Paint
    onTTFB(sendToAnalytics);   // Time to First Byte
    onINP(sendToAnalytics);    // Interaction to Next Paint (replaces FID)

  }, []);

  return null; // This component doesn't render anything
};

export default WebVitalsTracker; 