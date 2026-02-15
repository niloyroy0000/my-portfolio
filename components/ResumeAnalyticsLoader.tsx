"use client";

import { useEffect } from 'react';

// Resume Analytics Loader - Makes analytics functions available globally
// Usage in browser console: getResumeDownloadStats(), exportResumeDownloads(), clearResumeDownloads()
const ResumeAnalyticsLoader = () => {
  useEffect(() => {
    // Dynamically import the analytics utility to make functions available globally
    import('@/lib/resumeAnalytics');
  }, []);

  return null; // This component doesn't render anything
};

export default ResumeAnalyticsLoader;
