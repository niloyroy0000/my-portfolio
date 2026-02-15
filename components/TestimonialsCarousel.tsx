"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaLinkedin, FaStar, FaExternalLinkAlt } from "@/lib/icons";
import { SOCIAL_LINKS } from "@/constants";
import type { TestimonialData } from "@/types/api";

interface TestimonialsCarouselProps {
  testimonials: TestimonialData[];
  autoPlayInterval?: number; // in milliseconds
  className?: string;
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  autoPlayInterval = 6000,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselId = useId();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, autoPlayInterval, testimonials.length]);

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`py-12 ${className}`}
      aria-roledescription="carousel"
      aria-labelledby={`${carouselId}-title`}
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FaStar className="text-yellow-400" aria-hidden="true" />
          <span className="text-xs uppercase tracking-wider text-white/50 font-medium">
            Trusted by Colleagues
          </span>
          <FaStar className="text-yellow-400" aria-hidden="true" />
        </div>
        <h2 id={`${carouselId}-title`} className="text-2xl xl:text-3xl font-bold mb-2 bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
          What People Say
        </h2>
        <p className="text-sm bg-gradient-to-r from-white/60 to-white/40 bg-clip-text text-transparent">
          Real LinkedIn recommendations from colleagues and collaborators
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative bg-gradient-to-br from-purple-900/20 via-gray-900/50 to-cyan-900/20 border border-secondary-default/30 rounded-xl p-8 md:p-12 shadow-lg shadow-purple-500/5">
        {/* Quote Icon */}
        <div className="absolute top-6 left-6 text-purple-400/30" aria-hidden="true">
          <FaQuoteLeft className="text-4xl md:text-5xl" />
        </div>

        {/* Testimonial Content - Fixed height for consistent layout */}
        <div
          className="relative h-[260px] flex items-center justify-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center max-w-3xl mx-auto flex flex-col justify-center h-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`Testimonial ${currentIndex + 1} of ${testimonials.length}`}
            >
              {/* Quote - smaller text to fit full content */}
              <p className="text-sm md:text-base text-white/90 leading-relaxed mb-6 italic max-h-[140px] overflow-y-auto custom-scrollbar">
                "{currentTestimonial.quote}"
              </p>

              {/* Author Info */}
              <div className="flex flex-col items-center gap-3">
                {/* Avatar */}
                {currentTestimonial.image ? (
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.author}
                    className="w-16 h-16 rounded-full border-2 border-purple-400/50 object-cover shadow-lg shadow-purple-500/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border-2 border-purple-400/50 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {currentTestimonial.author.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Name & Role */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="text-lg font-semibold text-white">
                      {currentTestimonial.author}
                    </h4>
                    {currentTestimonial.linkedinUrl && (
                      <a
                        href={currentTestimonial.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        aria-label={`${currentTestimonial.author}'s LinkedIn`}
                      >
                        <FaLinkedin className="text-lg" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-white/60">
                    {currentTestimonial.role}
                    {currentTestimonial.company && (
                      <span className="text-secondary-default/80"> @ {currentTestimonial.company}</span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary-default/50 text-white/60 hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]"
              aria-label="Go to previous testimonial"
            >
              <FaChevronLeft className="text-lg" aria-hidden="true" />
            </button>
            <button
              onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary-default/50 text-white/60 hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]"
              aria-label="Go to next testimonial"
            >
              <FaChevronRight className="text-lg" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial slides">
            {testimonials.map((testimonial, index) => (
              <button
                key={index}
                role="tab"
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  index === currentIndex
                    ? "w-6 bg-gradient-to-r from-secondary-default to-blue-500"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to testimonial from ${testimonial.author}`}
                aria-selected={index === currentIndex}
              />
            ))}
          </div>
        )}

        {/* Auto-play indicator */}
        {testimonials.length > 1 && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`text-xs px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isAutoPlaying
                  ? "text-secondary-default/60"
                  : "text-white/40"
              }`}
              aria-label={isAutoPlaying ? "Pause automatic slideshow" : "Resume automatic slideshow"}
              aria-pressed={isAutoPlaying}
            >
              {isAutoPlaying ? "●" : "○"}
            </button>
          </div>
        )}
      </div>

      {/* View on LinkedIn Link */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-center mt-4"
      >
        <a
          href={`${SOCIAL_LINKS.LINKEDIN}/details/recommendations/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-secondary-default transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2 py-1"
        >
          <FaLinkedin aria-hidden="true" />
          <span>View all recommendations on LinkedIn</span>
          <FaExternalLinkAlt className="text-[10px]" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.section>
  );
};

export default TestimonialsCarousel;
