"use client";
import React, { useRef, useState, useEffect } from "react";
import { Certification } from "@/types/api";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiExternalLink } from "@/lib/icons";
import Link from "next/link";
import { PERFORMANCE_VARIANTS, ANIMATION_DURATIONS } from "@/constants";

interface CertificationTimelineProps {
  certifications: Certification[];
  className?: string;
}

const CertificationTimeline: React.FC<CertificationTimelineProps> = ({
  certifications,
  className = ""
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const sortedCertifications = [...certifications]
    .filter(cert => !cert.isUpcoming)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleScroll = (direction: "left" | "right") => {
    if (timelineRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      timelineRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
      
      setScrollPosition(timelineRef.current.scrollLeft + scrollAmount);
    }
  };

  const updateScrollPosition = () => {
    if (timelineRef.current) {
      setScrollPosition(timelineRef.current.scrollLeft);
    }
  };

  // Update scroll position on mount and on window resize
  useEffect(() => {
    const handleResize = () => updateScrollPosition();
    window.addEventListener('resize', handleResize);
    updateScrollPosition();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (sortedCertifications.length === 0) return null;

  return (
    <motion.div 
      variants={PERFORMANCE_VARIANTS.fadeInFast}
      initial="hidden"
      animate="visible"
      className={`relative ${className}`}
    >
      <div className="flex justify-between items-center mb-3">
        <motion.h3 
          variants={PERFORMANCE_VARIANTS.slideUpSync}
          className="text-base font-bold flex items-center gap-2"
        >
          <span className="inline-block w-2 h-8 bg-gradient-to-b from-secondary-default to-blue-500 rounded-full" />
          <span className="bg-gradient-to-r from-secondary-default to-blue-500 bg-clip-text text-transparent">
            Certification Journey
          </span>
        </motion.h3>
        
        {/* Navigation arrows */}
        <motion.div 
          variants={PERFORMANCE_VARIANTS.fadeInFast}
          className="flex gap-2"
        >
          <button 
            onClick={() => handleScroll("left")}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary-default/30 rounded-full p-1.5 text-white/70 hover:text-secondary-default transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-secondary-default/50"
            aria-label="Scroll left"
          >
            <FiArrowLeft size={14} />
          </button>
          <button 
            onClick={() => handleScroll("right")}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary-default/30 rounded-full p-1.5 text-white/70 hover:text-secondary-default transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-secondary-default/50"
            aria-label="Scroll right"
          >
            <FiArrowRight size={14} />
          </button>
        </motion.div>
      </div>

      {/* Timeline track with animated gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full mb-4 relative overflow-hidden backdrop-blur-sm">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ 
            width: `${Math.min((scrollPosition / ((timelineRef.current?.scrollWidth || 1) - (timelineRef.current?.clientWidth || 0))) * 100, 100)}%`
          }}
          transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary-default via-blue-500 to-secondary-default rounded-full shadow-glow"
        />
      </div>

      {/* Timeline items */}
      <div 
        ref={timelineRef}
        className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar will-change-scroll"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={updateScrollPosition}
      >
        {sortedCertifications.map((cert, index) => {
          const isFeatured = cert.featured || cert.category === "Professional";

          return (
            <motion.div
              key={cert._id}
              variants={PERFORMANCE_VARIANTS.cardSync}
              custom={index}
              className={`min-w-[220px] max-w-[260px] bg-gradient-to-b rounded-lg transition-colors duration-300 flex flex-col shadow-sm will-change-transform ${
                isFeatured
                  ? 'from-purple-500/10 to-purple-500/5 border border-purple-500/30 hover:border-purple-500/50'
                  : 'from-white/8 to-white/3 border border-white/10 hover:border-secondary-default/30'
              }`}
              style={{
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
              whileHover={{
                y: -5,
                boxShadow: isFeatured ? "0 5px 15px rgba(168, 85, 247, 0.2)" : "0 5px 15px rgba(0, 191, 255, 0.15)"
              }}
            >
              {/* Certificate Image */}
              <div className="relative p-3 flex items-center justify-center">
                {/* Certificate image - reduced transitions */}
                <div className="relative w-full h-[120px] mt-2 mb-1">
                  {cert.thumbImage || cert.image ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className={`absolute inset-0 rounded-md blur-md opacity-70 ${
                        isFeatured ? 'bg-purple-500/5' : 'bg-secondary-default/5'
                      }`} />
                      <Image
                        src={cert.thumbImage || cert.image || ""}
                        alt={`${cert.name} certificate`}
                        width={160}
                        height={100}
                        className="object-contain z-10"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className={isFeatured ? "text-purple-400 text-4xl" : "text-secondary-default text-4xl"}>
                        {cert.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Month/Year badge placed at bottom */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center bg-primary/60 backdrop-blur-sm border border-white/10 px-2 py-1 rounded-md text-xs text-white/90">
                  <FiCalendar size={12} className={isFeatured ? "mr-1.5 text-purple-400" : "mr-1.5 text-secondary-default"} />
                  <span>
                    {new Date(cert.date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Certificate info */}
              <div className="p-3 pt-0 flex-1 flex flex-col">
                {/* Certificate name */}
                <h4 className={`font-medium text-sm line-clamp-2 mb-2 ${
                  isFeatured
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                    : 'text-white'
                }`}>{cert.name}</h4>
              
              {/* Issuer with link icon on the right */}
              <div className="flex items-center justify-between mt-auto">
                {/* Issuer logo and name */}
                <div className="flex items-center">
                  {cert.issuerLogo && (
                    <div className="w-5 h-5 bg-white/10 rounded-full overflow-hidden flex items-center justify-center border border-white/10">
                      <Image
                        src={cert.issuerLogo}
                        alt={`${cert.issuer} logo`}
                        width={12}
                        height={12}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-xs text-secondary-default/80 ml-1.5">{cert.issuer}</span>
                </div>

                {/* Link to certificate - square shaped */}
                {cert.link && (
                  <Link
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-default hover:text-secondary-default/80 flex items-center justify-center w-6 h-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary-default/30 rounded-sm transition-colors duration-300"
                  >
                    <FiExternalLink size={12} />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
      
      {/* Fade effect on sides with improved gradients */}
      <div className="absolute left-0 top-16 bottom-0 w-8 bg-gradient-to-r from-primary via-primary/90 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-16 bottom-0 w-8 bg-gradient-to-l from-primary via-primary/90 to-transparent pointer-events-none z-10" />
      
      {/* Reduced animation for dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-1">
        {[0, 1, 2].map((dot, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.3
            }}
            className="w-1 h-1 rounded-full bg-secondary-default/50"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CertificationTimeline;

// Add styles in a Next.js safe way
if (typeof document !== 'undefined') {
  const id = 'timeline-styles';
  if (!document.getElementById(id)) {
    const styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.innerHTML = `
      .shadow-glow {
        box-shadow: 0 0 8px rgba(0, 191, 255, 0.2);
      }
      
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(styleElement);
  }
} 