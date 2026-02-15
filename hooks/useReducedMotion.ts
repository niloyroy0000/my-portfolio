"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if user prefers reduced motion
 *
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * <motion.div
 *   animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
 *   transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
 * />
 * ```
 *
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if the browser supports matchMedia
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation props that respect reduced motion preference
 *
 * Usage:
 * ```tsx
 * const animationProps = getMotionProps(prefersReducedMotion, {
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   transition: { duration: 0.5 }
 * });
 *
 * <motion.div {...animationProps} />
 * ```
 */
export function getMotionProps<T extends Record<string, unknown>>(
  prefersReducedMotion: boolean,
  props: T
): T | { initial: Record<string, unknown>; animate: Record<string, unknown>; transition: { duration: number } } {
  if (prefersReducedMotion) {
    return {
      initial: {},
      animate: {},
      transition: { duration: 0 },
    };
  }
  return props;
}

export default useReducedMotion;
