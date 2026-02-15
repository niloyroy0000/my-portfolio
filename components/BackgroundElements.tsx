"use client";

import React from "react";

interface FloatingDot {
  size: "sm" | "md" | "lg";
  color: "primary" | "secondary" | "blue" | "purple";
  animation: "ping" | "pulse" | "bounce";
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  opacity?: number;
}

interface BackgroundElementsProps {
  showGradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  floatingDots?: FloatingDot[];
  className?: string;
}

const BackgroundElements: React.FC<BackgroundElementsProps> = ({
  showGradient = true,
  gradientFrom = "from-primary/5",
  gradientTo = "to-secondary-default/5",
  floatingDots = [
    {
      size: "md",
      color: "secondary",
      animation: "ping",
      position: { top: "5rem", left: "2.5rem" },
      opacity: 60
    },
    {
      size: "sm",
      color: "blue",
      animation: "pulse",
      position: { bottom: "8rem", right: "4rem" },
      opacity: 40
    },
    {
      size: "md",
      color: "secondary",
      animation: "bounce",
      position: { top: "33.333333%", right: "2rem" },
      opacity: 50
    }
  ],
  className = ""
}) => {
  // Size mappings
  const sizeMap = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5", 
    lg: "w-2 h-2"
  };

  // Color mappings
  const colorMap = {
    primary: "bg-primary",
    secondary: "bg-secondary-default",
    blue: "bg-blue-400",
    purple: "bg-purple-400"
  };

  // Animation mappings
  const animationMap = {
    ping: "animate-ping",
    pulse: "animate-pulse", 
    bounce: "animate-bounce"
  };

  return (
    <>
      {/* Gradient Background */}
      {showGradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} via-transparent ${gradientTo} pointer-events-none ${className}`} />
      )}

      {/* Floating Dots */}
      {floatingDots.map((dot, index) => {
        const sizeClass = sizeMap[dot.size];
        const colorClass = colorMap[dot.color];
        const animationClass = animationMap[dot.animation];
        
        const positionStyles: React.CSSProperties = {};
        if (dot.position.top) positionStyles.top = dot.position.top;
        if (dot.position.bottom) positionStyles.bottom = dot.position.bottom;
        if (dot.position.left) positionStyles.left = dot.position.left;
        if (dot.position.right) positionStyles.right = dot.position.right;

        return (
          <div
            key={`floating-dot-${index}`}
            className={`absolute ${sizeClass} ${colorClass} rounded-full ${animationClass} opacity-${dot.opacity || 50}`}
            style={positionStyles}
          />
        );
      })}
    </>
  );
};

export default BackgroundElements; 