"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Certification } from "@/types/api";
import { FiAward, FiCalendar, FiArrowRight, FiExternalLink, FiKey, FiHash } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { PERFORMANCE_VARIANTS } from "@/constants";

interface FeaturedCertificationCardProps {
  certification: Certification;
  size?: "small" | "large";
  className?: string;
  simplified?: boolean;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const FeaturedCertificationCard: React.FC<FeaturedCertificationCardProps> = ({
  certification,
  size = "large",
  className = "",
  simplified = true,
  headingLevel = 2
}) => {
  if (!certification) return null;

  const {
    name,
    issuer,
    date,
    image,
    thumbImage,
    issuerLogo,
    link,
    skills,
    credentialId,
    certificationNumber,
    description
  } = certification;

  const isSmall = size === "small";
  
  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: isSmall ? 'short' : 'long'
  });
  
  // Determine which image to use (thumbnail or full image)
  const displayImage = thumbImage || image;

  // Simplified version (for homepage) - compact design
  if (simplified) {
    return (
      <motion.div
        variants={PERFORMANCE_VARIANTS.cardSync}
        initial="visible"
        animate="visible"
        className={`bg-gradient-to-r from-secondary-default/20 to-blue-500/20 backdrop-blur-sm border border-secondary-default/30 rounded overflow-hidden ${className}`}
      >
        <div className="flex items-center gap-3 p-3">
          {/* Logo or icon - compact */}
          <div className="relative flex-shrink-0">
            {displayImage ? (
              <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                <Image
                  src={displayImage}
                  alt={`${name} certificate`}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-lg flex items-center justify-center">
                <FiAward className="text-2xl text-secondary-default" />
              </div>
            )}

            {/* Issuer Logo - smaller */}
            {issuerLogo && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/10 backdrop-blur-md rounded overflow-hidden flex items-center justify-center border border-white/20">
                <Image
                  src={issuerLogo}
                  alt={`${issuer} logo`}
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Certification Details - compact */}
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-1 text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-default/20 border border-secondary-default/30 text-secondary-default font-medium">
              Recent Certification
            </Badge>
            {React.createElement(
              `h${headingLevel}`,
              {
                className: "text-sm font-bold mb-0.5 line-clamp-1"
              },
              name
            )}
            <div className="flex flex-wrap items-center text-[11px] gap-1.5 text-white/70">
              <span className="text-secondary-default truncate">{issuer}</span>
              <span className="text-white/30">•</span>
              <div className="flex items-center">
                <FiCalendar className="mr-0.5" size={10} />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* View All Link - smaller */}
          <Link
            href="/certifications"
            className="bg-secondary-default/10 hover:bg-secondary-default/20 text-secondary-default rounded-full p-1.5 transition-colors flex-shrink-0"
            aria-label="View all certifications"
          >
            <FiArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    );
  }
  
  // Detailed version (for certifications page) - Keep cyan/blue theme for background
  const isFeatured = certification.featured || certification.category === "Professional";

  return (
    <motion.div
      variants={PERFORMANCE_VARIANTS.cardSync}
      initial="hidden"
      animate="visible"
      className={`group relative bg-gradient-to-br from-secondary-default/30 via-blue-500/20 to-secondary-default/10 backdrop-blur-sm border border-secondary-default/30 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:border-secondary-default/50 transition-all duration-300 ${className}`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Certificate image with subtle gradient border */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary-default to-blue-500 opacity-60 blur-md" />
            {displayImage ? (
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/20 bg-white/5 z-10">
                <Image
                  src={displayImage}
                  alt={`${name} certificate`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            ) : (
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center z-10">
                <FiAward className="text-5xl text-secondary-default" />
              </div>
            )}
            
            {/* Issuer Logo */}
            {issuerLogo && (
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full overflow-hidden flex items-center justify-center border border-white/20 z-20 shadow-md">
                <Image
                  src={issuerLogo}
                  alt={`${issuer} logo`}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
            )}
          </div>
          
          {/* Certification details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
              <Badge 
                variant="secondary" 
                className="text-xs inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-default/20 border border-secondary-default/30 text-secondary-default font-medium"
              >
                Featured Certification
              </Badge>
              
              <span className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300">
                {certification.category}
              </span>
            </div>
            
            <h2 className={`text-xl md:text-2xl font-bold mb-2 transition-colors duration-300 ${
              isFeatured
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                : 'text-white group-hover:text-secondary-default'
            }`}>
              {name}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start text-sm gap-2 mb-3">
              <span className="text-secondary-default font-medium">{issuer}</span>
              <span className="text-white/30">•</span>
              <div className="flex items-center text-white/70">
                <FiCalendar className="mr-1.5" size={14} />
                <span>{formattedDate}</span>
              </div>
            </div>
            
            {/* Credential ID if available */}
            {credentialId && (
              <div className="flex items-center text-white/60 text-xs mb-3 bg-white/5 p-2 rounded">
                <FiKey className="mr-1.5 text-secondary-default" />
                <span className="mr-1 font-medium">Credential ID:</span>
                <span className="font-mono">{credentialId}</span>
              </div>
            )}
            
            {/* Certification Number if available */}
            {certificationNumber && (
              <div className="flex items-center text-white/60 text-xs mb-3 bg-white/5 p-2 rounded">
                <FiHash className="mr-1.5 text-secondary-default" />
                <span className="mr-1 font-medium">Certification Number:</span>
                <span className="font-mono">{certificationNumber}</span>
              </div>
            )}
            
            {/* Description if available */}
            {description && (
              <p className="text-white/70 text-sm mb-4 line-clamp-2">
                {description}
              </p>
            )}
            
            {/* Skills tags */}
            {skills && skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white/80 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-secondary-default/10 text-secondary-default border border-secondary-default/30 rounded hover:bg-secondary-default/20 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 5 && (
                    <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded">
                      +{skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* View certificate link */}
          {link && (
            <div className="mt-4 md:mt-0 flex-shrink-0">
              <Link 
                href={link} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-secondary-default/10 hover:bg-secondary-default/20 border border-secondary-default/30 text-secondary-default px-4 py-2 rounded transition-all duration-300 hover:scale-105 text-sm font-medium"
              >
                <FiExternalLink className="text-xs" />
                <span>View Certificate</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle border at bottom */}
      <div className="h-1 w-full bg-gradient-to-r from-secondary-default/50 to-blue-500/50 opacity-80" />
    </motion.div>
  );
};

export default FeaturedCertificationCard;

// Add keyframes for the background size animation in a Next.js safe way
if (typeof document !== 'undefined') {
  // Check if the style already exists to avoid duplicates
  const id = 'featured-certification-card-styles';
  if (!document.getElementById(id)) {
    const styles = document.createElement('style');
    styles.id = id;
    styles.innerHTML = `
      .bg-size-200 {
        background-size: 200% auto;
      }
    `;
    document.head.appendChild(styles);
  }
} 