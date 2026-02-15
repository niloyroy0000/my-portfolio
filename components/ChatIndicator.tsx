"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowDown } from "@/lib/icons";
import { RiRobot3Fill } from "@/lib/icons";

interface ChatIndicatorProps {
  isVisible: boolean;
}

export default function ChatIndicator({ isVisible }: ChatIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check localStorage to see if user has dismissed the indicator before
    const dismissed = localStorage.getItem('chatIndicatorDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Show indicator after 2 seconds delay when component mounts
    const showTimer = setTimeout(() => {
      setShowIndicator(true);
    }, 2000);

    // Auto-hide after 15 seconds
    const hideTimer = setTimeout(() => {
      setShowIndicator(false);
    }, 17000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleDismiss = () => {
    setShowIndicator(false);
    setIsDismissed(true);
    localStorage.setItem('chatIndicatorDismissed', 'true');
  };

  // Don't show if chat is open, user dismissed it, or it's not visible yet
  if (!isVisible || isDismissed || !showIndicator) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-24 right-4 z-[9998] flex flex-col items-end gap-2"
      >
        {/* Callout Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="relative bg-gradient-to-r from-purple-500/95 via-pink-500/95 to-purple-500/95 backdrop-blur-sm border-2 border-purple-400/50 rounded-2xl px-4 py-3 shadow-2xl shadow-purple-500/30 max-w-xs sm:max-w-sm"
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Dismiss chat indicator"
          >
            <FaTimes className="text-xs text-white" aria-hidden="true" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <RiRobot3Fill className="text-2xl text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-1">
                Chat with my AI Assistant!
              </p>
              <p className="text-white/90 text-xs leading-relaxed">
                Ask about my projects, skills, experience, or anything else.
              </p>
            </div>
          </div>

          {/* Pointer triangle */}
          <div
            className="absolute -bottom-2 right-8 w-4 h-4 bg-purple-500 rotate-45 border-r-2 border-b-2 border-purple-400/50"
            aria-hidden="true"
          />
        </motion.div>

        {/* Animated Arrow */}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex justify-end pr-8"
        >
          <div className="flex flex-col items-center">
            <FaArrowDown
              className="text-3xl text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              aria-hidden="true"
            />
            {/* Glow effect */}
            <div className="w-8 h-8 bg-purple-500/30 rounded-full blur-xl -mt-6" aria-hidden="true" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
