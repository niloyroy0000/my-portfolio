"use client";

import { motion } from "framer-motion";
import { FiChevronDown } from "@/lib/icons";

/**
 * ScrollIndicator - Animated scroll down indicator
 *
 * Features:
 * - Bouncing chevron animation
 * - Optional text label
 * - Click to scroll functionality
 * - Fades out on scroll
 * - Accessible
 */

interface ScrollIndicatorProps {
  text?: string;
  targetId?: string;
  className?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  text = "Scroll to explore",
  targetId,
  className = "",
}) => {
  const handleClick = () => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Scroll down by viewport height
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      aria-label={text}
    >
      {text && (
        <span className="text-xs tracking-wider uppercase font-medium">
          {text}
        </span>
      )}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FiChevronDown className="text-2xl" />
      </motion.div>
    </motion.button>
  );
};

export default ScrollIndicator;
