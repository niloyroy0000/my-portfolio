"use client";

import { useMemo, useState, useEffect } from "react";

/**
 * FloatingCodeSymbols - Animated code symbols floating in the background
 *
 * Features:
 * - CSS-only animations (GPU-accelerated, better performance)
 * - Random positioning and timing
 * - Code-related symbols: { } < > / = ; ( ) [ ]
 * - Subtle, non-distracting appearance
 * - Respects reduced motion preferences
 * - Client-side only rendering to prevent hydration mismatch
 *
 * Performance Optimization:
 * - Uses CSS keyframes instead of Framer Motion (reduces JS overhead)
 * - will-change: transform for GPU acceleration
 * - Respects prefers-reduced-motion
 */

interface FloatingCodeSymbolsProps {
  symbolCount?: number;
  className?: string;
}

const CODE_SYMBOLS = ["{", "}", "<", ">", "/", "=", ";", "(", ")", "[", "]", "//", "=>", "&&", "||", "++", "::", "!=", "==="];

const FloatingCodeSymbols: React.FC<FloatingCodeSymbolsProps> = ({
  symbolCount = 15,
  className = "",
}) => {
  // Track if component has mounted to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate random symbol configurations only on client
  const symbols = useMemo(() => {
    if (!isMounted) return [];
    return Array.from({ length: symbolCount }, (_, i) => ({
      id: i,
      symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 12 + Math.random() * 16, // 12-28px
      opacity: 0.03 + Math.random() * 0.07, // 0.03-0.10
      duration: 15 + Math.random() * 20, // 15-35s
      delay: Math.random() * -20, // Random start offset
      yOffset: 20 + Math.random() * 40, // Vertical float distance
    }));
  }, [symbolCount, isMounted]);

  // Return empty container during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <style jsx>{`
        @keyframes floatSymbol {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotate-start));
            opacity: var(--base-opacity);
          }
          50% {
            transform: translateY(calc(var(--y-offset) * -1)) rotate(var(--rotate-end));
            opacity: calc(var(--base-opacity) * 1.5);
          }
        }

        .floating-symbol {
          animation: floatSymbol var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-symbol {
            animation: none !important;
          }
        }
      `}</style>

      {symbols.map((symbol) => (
        <span
          key={symbol.id}
          className="floating-symbol absolute font-mono text-[#00BFFF] select-none"
          style={{
            left: symbol.left,
            top: symbol.top,
            fontSize: `${symbol.size}px`,
            opacity: symbol.opacity,
            '--base-opacity': symbol.opacity,
            '--duration': `${symbol.duration}s`,
            '--delay': `${symbol.delay}s`,
            '--y-offset': `${symbol.yOffset}px`,
            '--rotate-start': `${Math.random() * 360}deg`,
            '--rotate-end': `${Math.random() * 360}deg`,
          } as React.CSSProperties}
        >
          {symbol.symbol}
        </span>
      ))}
    </div>
  );
};

export default FloatingCodeSymbols;
