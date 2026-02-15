"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * A debug component that monitors route changes and navigation events
 * Use this to diagnose loader issues
 */
const DebugMode = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Record pathname changes
    setEvents(prev => [...prev, `[${new Date().toLocaleTimeString()}] Path changed to: ${pathname}`]);
  }, [pathname]);

  // Monitor route change custom events
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setEvents(prev => [...prev, `[${new Date().toLocaleTimeString()}] Route change START event triggered`]);
    };

    window.addEventListener('route-change-start', handleRouteChangeStart);
    
    return () => {
      window.removeEventListener('route-change-start', handleRouteChangeStart);
    };
  }, []);

  // Add keyboard shortcut to toggle visibility (Ctrl+Shift+D)
  useEffect(() => {
    const toggleVisibility = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', toggleVisibility);
    return () => document.removeEventListener('keydown', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-0 z-[9999] bg-black/90 text-white p-4 max-h-80 overflow-auto w-80 font-mono text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Navigation Debug</h3>
        <button 
          onClick={() => setEvents([])} 
          className="px-2 py-1 bg-red-600 text-white rounded text-xs"
        >
          Clear
        </button>
      </div>
      <div className="space-y-1">
        {events.slice(-20).map((event, i) => (
          <div key={i} className="border-b border-gray-700 pb-1">
            {event}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Press Ctrl+Shift+D to hide
      </div>
    </div>
  );
};

export default DebugMode; 