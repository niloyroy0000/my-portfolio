// Heatmap Analytics - Track user interactions across the portfolio
// Usage: View heatmap data in browser console with getHeatmapStats()

export interface HeatmapInteraction {
  type: 'click' | 'hover' | 'scroll';
  elementId: string;
  elementType: string;
  x: number;
  y: number;
  timestamp: number;
  pageUrl: string;
  viewportWidth: number;
  viewportHeight: number;
}

export interface SectionEngagement {
  sectionId: string;
  viewTime: number; // milliseconds
  scrollDepth: number; // percentage
  interactions: number;
  firstView: number;
  lastView: number;
}

// Track click interaction
export const trackClick = (event: MouseEvent) => {
  if (typeof window === 'undefined') return;

  const target = event.target as HTMLElement;
  const interaction: HeatmapInteraction = {
    type: 'click',
    elementId: target.id || 'unnamed',
    elementType: target.tagName.toLowerCase(),
    x: event.clientX,
    y: event.clientY + window.scrollY,
    timestamp: Date.now(),
    pageUrl: window.location.pathname,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };

  saveInteraction(interaction);
};

// Track hover interaction (debounced)
let hoverTimeout: NodeJS.Timeout;
export const trackHover = (event: MouseEvent) => {
  if (typeof window === 'undefined') return;

  clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(() => {
    const target = event.target as HTMLElement;
    const interaction: HeatmapInteraction = {
      type: 'hover',
      elementId: target.id || 'unnamed',
      elementType: target.tagName.toLowerCase(),
      x: event.clientX,
      y: event.clientY + window.scrollY,
      timestamp: Date.now(),
      pageUrl: window.location.pathname,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };

    saveInteraction(interaction);
  }, 500); // Only track hovers lasting > 500ms
};

// Track scroll depth
export const trackScroll = () => {
  if (typeof window === 'undefined') return;

  const scrollDepth = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );

  const interaction: HeatmapInteraction = {
    type: 'scroll',
    elementId: 'page',
    elementType: 'document',
    x: 0,
    y: window.scrollY,
    timestamp: Date.now(),
    pageUrl: window.location.pathname,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };

  saveInteraction(interaction);

  // Update max scroll depth for current page
  updateScrollDepth(window.location.pathname, scrollDepth);
};

// Track section engagement (time spent viewing)
const sectionObservers = new Map<string, IntersectionObserver>();
const sectionTimers = new Map<string, number>();

export const trackSectionEngagement = (sectionId: string) => {
  if (typeof window === 'undefined') return;

  const section = document.getElementById(sectionId);
  if (!section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Section entered viewport
          sectionTimers.set(sectionId, Date.now());
        } else {
          // Section left viewport
          const startTime = sectionTimers.get(sectionId);
          if (startTime) {
            const timeSpent = Date.now() - startTime;
            updateSectionEngagement(sectionId, timeSpent);
            sectionTimers.delete(sectionId);
          }
        }
      });
    },
    { threshold: 0.5 } // Consider "viewing" when 50% visible
  );

  observer.observe(section);
  sectionObservers.set(sectionId, observer);
};

// Save interaction to localStorage
const saveInteraction = (interaction: HeatmapInteraction) => {
  try {
    const interactions = getHeatmapInteractions();
    interactions.push(interaction);

    // Keep only last 1000 interactions to avoid localStorage quota
    const trimmed = interactions.slice(-1000);
    localStorage.setItem('heatmap_interactions', JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save heatmap interaction:', error);
  }
};

// Get all interactions from localStorage
export const getHeatmapInteractions = (): HeatmapInteraction[] => {
  try {
    const data = localStorage.getItem('heatmap_interactions');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load heatmap interactions:', error);
    return [];
  }
};

// Update scroll depth for a page
const updateScrollDepth = (pageUrl: string, depth: number) => {
  try {
    const scrollData = JSON.parse(localStorage.getItem('heatmap_scroll_depth') || '{}');
    scrollData[pageUrl] = Math.max(scrollData[pageUrl] || 0, depth);
    localStorage.setItem('heatmap_scroll_depth', JSON.stringify(scrollData));
  } catch (error) {
    console.error('Failed to update scroll depth:', error);
  }
};

// Update section engagement
const updateSectionEngagement = (sectionId: string, timeSpent: number) => {
  try {
    const engagements = JSON.parse(localStorage.getItem('heatmap_section_engagement') || '{}');

    if (!engagements[sectionId]) {
      engagements[sectionId] = {
        sectionId,
        viewTime: 0,
        scrollDepth: 0,
        interactions: 0,
        firstView: Date.now(),
        lastView: Date.now(),
      };
    }

    engagements[sectionId].viewTime += timeSpent;
    engagements[sectionId].lastView = Date.now();

    localStorage.setItem('heatmap_section_engagement', JSON.stringify(engagements));
  } catch (error) {
    console.error('Failed to update section engagement:', error);
  }
};

// Get heatmap statistics
export const getHeatmapStats = () => {
  const interactions = getHeatmapInteractions();

  if (interactions.length === 0) {
    console.log('📊 No heatmap data collected yet');
    return null;
  }

  // Group by interaction type
  const byType: Record<string, number> = {};
  interactions.forEach((i) => {
    byType[i.type] = (byType[i.type] || 0) + 1;
  });

  // Group by page
  const byPage: Record<string, number> = {};
  interactions.forEach((i) => {
    byPage[i.pageUrl] = (byPage[i.pageUrl] || 0) + 1;
  });

  // Group by element type
  const byElement: Record<string, number> = {};
  interactions.forEach((i) => {
    byElement[i.elementType] = (byElement[i.elementType] || 0) + 1;
  });

  // Get most clicked elements
  const clickCounts: Record<string, number> = {};
  interactions
    .filter((i) => i.type === 'click')
    .forEach((i) => {
      const key = `${i.elementType}#${i.elementId}`;
      clickCounts[key] = (clickCounts[key] || 0) + 1;
    });

  const topClicks = Object.entries(clickCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([element, count]) => ({ element, count }));

  // Get scroll depth data
  const scrollDepth = JSON.parse(localStorage.getItem('heatmap_scroll_depth') || '{}');

  // Get section engagement
  const sectionEngagement = JSON.parse(localStorage.getItem('heatmap_section_engagement') || '{}');

  const stats = {
    totalInteractions: interactions.length,
    interactionsByType: byType,
    interactionsByPage: byPage,
    interactionsByElement: byElement,
    topClickedElements: topClicks,
    scrollDepthByPage: scrollDepth,
    sectionEngagement: Object.values(sectionEngagement).map((s: any) => ({
      ...s,
      viewTime: `${(s.viewTime / 1000).toFixed(1)}s`,
    })),
    firstInteraction: new Date(interactions[0].timestamp).toLocaleString(),
    lastInteraction: new Date(interactions[interactions.length - 1].timestamp).toLocaleString(),
  };

  // Pretty print to console
  console.log('📊 HEATMAP ANALYTICS\n');
  console.log(`📈 Total Interactions: ${stats.totalInteractions}`);
  console.log(`📅 First Interaction: ${stats.firstInteraction}`);
  console.log(`📅 Last Interaction: ${stats.lastInteraction}\n`);

  console.log('🔢 Interactions by Type:');
  console.table(stats.interactionsByType);

  console.log('\n📄 Interactions by Page:');
  console.table(stats.interactionsByPage);

  console.log('\n🖱️ Top Clicked Elements:');
  console.table(stats.topClickedElements);

  console.log('\n📏 Scroll Depth by Page:');
  console.table(stats.scrollDepthByPage);

  console.log('\n👁️ Section Engagement:');
  console.table(stats.sectionEngagement);

  return stats;
};

// Export heatmap data as JSON
export const exportHeatmapData = () => {
  const interactions = getHeatmapInteractions();
  const scrollDepth = JSON.parse(localStorage.getItem('heatmap_scroll_depth') || '{}');
  const sectionEngagement = JSON.parse(localStorage.getItem('heatmap_section_engagement') || '{}');

  const data = {
    interactions,
    scrollDepth,
    sectionEngagement,
    exportedAt: new Date().toISOString(),
    totalInteractions: interactions.length,
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `heatmap-analytics-${Date.now()}.json`;
  link.click();

  console.log('✅ Heatmap data exported to JSON');
};

// Clear heatmap data
export const clearHeatmapData = () => {
  if (confirm('Are you sure you want to clear all heatmap data?')) {
    localStorage.removeItem('heatmap_interactions');
    localStorage.removeItem('heatmap_scroll_depth');
    localStorage.removeItem('heatmap_section_engagement');
    console.log('✅ Heatmap data cleared');
  }
};

// Cleanup observers
export const cleanupHeatmapTracking = () => {
  sectionObservers.forEach((observer) => observer.disconnect());
  sectionObservers.clear();
  sectionTimers.clear();
};

// Make functions available globally in browser console
if (typeof window !== 'undefined') {
  (window as typeof window & {
    getHeatmapStats?: () => ReturnType<typeof getHeatmapStats>;
    exportHeatmapData?: () => void;
    clearHeatmapData?: () => void;
  }).getHeatmapStats = getHeatmapStats;
  (window as typeof window & {
    exportHeatmapData?: () => void;
  }).exportHeatmapData = exportHeatmapData;
  (window as typeof window & {
    clearHeatmapData?: () => void;
  }).clearHeatmapData = clearHeatmapData;
}
