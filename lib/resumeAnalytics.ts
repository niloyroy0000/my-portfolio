// Resume Download Analytics Utility (Epic 6.3.2)
// Usage: Open browser console and run: getResumeDownloadStats()

export interface ResumeDownload {
  location: string;
  timestamp: number;
  pageUrl: string;
  referrer: string;
  timeOnPage: number;
}

// Get all resume downloads from localStorage
export const getResumeDownloads = (): ResumeDownload[] => {
  try {
    const downloads = localStorage.getItem('resume_downloads');
    return downloads ? JSON.parse(downloads) : [];
  } catch (error) {
    console.error('Failed to load resume downloads:', error);
    return [];
  }
};

// Get resume download statistics
export const getResumeDownloadStats = () => {
  const downloads = getResumeDownloads();

  if (downloads.length === 0) {
    console.log('📥 No resume downloads tracked yet');
    return null;
  }

  // Calculate statistics
  const totalDownloads = downloads.length;
  const uniqueReferrers = new Set(downloads.map(d => d.referrer)).size;
  const avgTimeOnPage = Math.round(
    downloads.reduce((sum, d) => sum + d.timeOnPage, 0) / totalDownloads
  );

  // Group by location
  const byLocation: Record<string, number> = {};
  downloads.forEach(d => {
    byLocation[d.location] = (byLocation[d.location] || 0) + 1;
  });

  // Group by referrer
  const byReferrer: Record<string, number> = {};
  downloads.forEach(d => {
    byReferrer[d.referrer] = (byReferrer[d.referrer] || 0) + 1;
  });

  // Recent downloads (last 10)
  const recentDownloads = downloads
    .slice(-10)
    .reverse()
    .map(d => ({
      ...d,
      time: new Date(d.timestamp).toLocaleString(),
    }));

  // Create stats object
  const stats = {
    totalDownloads,
    uniqueReferrers,
    avgTimeOnPage: `${avgTimeOnPage}s`,
    downloadsByLocation: byLocation,
    downloadsByReferrer: byReferrer,
    recentDownloads,
    firstDownload: new Date(downloads[0].timestamp).toLocaleString(),
    lastDownload: new Date(downloads[downloads.length - 1].timestamp).toLocaleString(),
  };

  // Pretty print to console
  console.log('📊 RESUME DOWNLOAD ANALYTICS\n');
  console.log(`📥 Total Downloads: ${stats.totalDownloads}`);
  console.log(`🌐 Unique Referrers: ${stats.uniqueReferrers}`);
  console.log(`⏱️ Avg Time on Page: ${stats.avgTimeOnPage}`);
  console.log(`📅 First Download: ${stats.firstDownload}`);
  console.log(`📅 Last Download: ${stats.lastDownload}\n`);

  console.log('📍 Downloads by Location:');
  console.table(stats.downloadsByLocation);

  console.log('\n🔗 Downloads by Referrer:');
  console.table(stats.downloadsByReferrer);

  console.log('\n🕒 Recent Downloads (Last 10):');
  console.table(recentDownloads);

  return stats;
};

// Export data as JSON (for external analysis)
export const exportResumeDownloads = () => {
  const downloads = getResumeDownloads();
  const stats = {
    downloads,
    exportedAt: new Date().toISOString(),
    totalDownloads: downloads.length,
  };

  const dataStr = JSON.stringify(stats, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-downloads-${Date.now()}.json`;
  link.click();

  console.log('✅ Resume downloads exported to JSON');
};

// Clear download history
export const clearResumeDownloads = () => {
  if (confirm('Are you sure you want to clear all resume download data?')) {
    localStorage.removeItem('resume_downloads');
    console.log('✅ Resume download history cleared');
  }
};

// Make functions available globally in browser console
if (typeof window !== 'undefined') {
  (window as typeof window & {
    getResumeDownloadStats?: () => ReturnType<typeof getResumeDownloadStats>;
    exportResumeDownloads?: () => void;
    clearResumeDownloads?: () => void;
  }).getResumeDownloadStats = getResumeDownloadStats;
  (window as typeof window & {
    exportResumeDownloads?: () => void;
  }).exportResumeDownloads = exportResumeDownloads;
  (window as typeof window & {
    clearResumeDownloads?: () => void;
  }).clearResumeDownloads = clearResumeDownloads;
}
