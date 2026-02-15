"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Unified Spinner Component
 *
 * Triangle-style spinner with animated gradient colors following the color hierarchy:
 * Cyan → Emerald → Purple → Pink
 *
 * Animation: Border draws and erases (fill/empty) - NOT rotating
 *
 * @example
 * ```tsx
 * <Spinner size="md" />
 * <Spinner size="lg" showLabel />
 * ```
 */

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeConfig = {
  sm: { width: 32, height: 32, strokeWidth: 3 },
  md: { width: 48, height: 48, strokeWidth: 3 },
  lg: { width: 64, height: 64, strokeWidth: 4 },
  xl: { width: 80, height: 80, strokeWidth: 4 },
};

// Triangle perimeter for stroke animation (approximate for viewBox 0 0 100 100)
const TRIANGLE_PERIMETER = 260;

export function Spinner({
  size = "md",
  showLabel = false,
  label = "Loading...",
  className = "",
}: SpinnerProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* SVG Triangle Spinner with Fill/Empty Animation */}
      <div className="relative">
        {/* Glow effect */}
        <div
          className="absolute inset-0 blur-xl opacity-40"
          style={{
            background: "linear-gradient(135deg, #00BFFF 0%, #10B981 33%, #A855F7 66%, #EC4899 100%)",
            borderRadius: "50%",
          }}
        />

        {/* Stationary Triangle with Animated Stroke */}
        <svg
          width={config.width}
          height={config.height}
          viewBox="0 0 100 100"
          className="relative z-10"
        >
          {/* Gradient Definition with Color Cycling */}
          <defs>
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00BFFF">
                <animate
                  attributeName="stop-color"
                  values="#00BFFF;#10B981;#A855F7;#EC4899;#00BFFF"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="33%" stopColor="#10B981">
                <animate
                  attributeName="stop-color"
                  values="#10B981;#A855F7;#EC4899;#00BFFF;#10B981"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="66%" stopColor="#A855F7">
                <animate
                  attributeName="stop-color"
                  values="#A855F7;#EC4899;#00BFFF;#10B981;#A855F7"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#EC4899">
                <animate
                  attributeName="stop-color"
                  values="#EC4899;#00BFFF;#10B981;#A855F7;#EC4899"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          {/* Background Triangle (faint) */}
          <path
            d="M50 10 L90 85 L10 85 Z"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Animated Triangle Path - Fill/Empty Animation */}
          <path
            d="M50 10 L90 85 L10 85 Z"
            fill="none"
            stroke="url(#spinnerGradient)"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={TRIANGLE_PERIMETER}
          >
            {/* Animate the stroke to draw and erase */}
            <animate
              attributeName="stroke-dashoffset"
              values={`${TRIANGLE_PERIMETER};0;${TRIANGLE_PERIMETER}`}
              dur="1.5s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </path>
        </svg>
      </div>

      {/* Optional Label */}
      {showLabel && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-white/60 font-medium"
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}

/**
 * Full-page loading spinner with centered layout
 */
export function PageSpinner({
  label = "Loading amazing content...",
}: {
  label?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-secondary-default rounded-full animate-ping opacity-60" aria-hidden="true" />
      <div className="absolute bottom-32 right-16 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" aria-hidden="true" />
      <div className="absolute top-1/3 right-8 w-1.5 h-1.5 bg-secondary-default rounded-full animate-bounce opacity-50" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo/Name */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-4xl font-bold text-white"
        >
          Panday<span className="text-secondary-default">.</span>
        </motion.h1>

        {/* Spinner */}
        <Spinner size="xl" />

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-white/60 text-sm font-medium"
        >
          {label}
        </motion.p>
      </div>
    </div>
  );
}

/**
 * Inline spinner for buttons and small loading states
 */
export function InlineSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-block ${className}`}>
      <svg width="16" height="16" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="inlineSpinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="33%" stopColor="#10B981" />
            <stop offset="66%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <path
          d="M50 10 L90 85 L10 85 Z"
          fill="none"
          stroke="url(#inlineSpinnerGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="260"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="260;0;260"
            dur="1.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        </path>
      </svg>
    </div>
  );
}

export default Spinner;
