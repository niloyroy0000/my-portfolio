"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CSS_ANIMATIONS } from "@/constants";
import Image from "next/image";
import { Certification } from "@/types/api";
import { FiAward, FiCalendar, FiExternalLink, FiKey, FiCheck, FiActivity, FiHash, FiBriefcase, FiBook } from "@/lib/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";

// Dynamic import of lightbox for better performance and to avoid SSR issues
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="text-white/60 text-sm">Loading image viewer...</div>
    </div>
  ),
});

// Only import styles on client-side and only once
const importLightboxStyles = () => {
  if (typeof window !== 'undefined') {
    import("yet-another-react-lightbox/styles.css");
  }
};

interface CertificationCardProps {
  certification: Certification;
  featured?: boolean;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  featured = false,
}) => {
  // Import lightbox styles on component mount (client-side only)
  React.useEffect(() => {
    importLightboxStyles();
  }, []);
  
  const {
    name,
    issuer,
    date,
    expiryDate,
    credentialId,
    link,
    description,
    skills,
    image,
    thumbImage,
    issuerLogo,
    isUpcoming,
    status,
    onlineVerifiable,
    certificationNumber
  } = certification;

  // State for showing all skills
  const [showAllSkills, setShowAllSkills] = useState(false);
  // State for lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  // State for description expand/collapse
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });

  // Format expiry date if available
  const formattedExpiryDate = expiryDate
    ? new Date(expiryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      })
    : null;

  // Check expiry status
  const getExpiryStatus = () => {
    if (!expiryDate) return null;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'bg-red-500/10 border-red-500/30 text-red-400' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring-soon', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' };
    }
    return { status: 'valid', color: 'bg-white/5 border-white/20 text-white/60' };
  };

  const expiryStatus = getExpiryStatus();

  // Determine which skills to show
  const maxVisibleSkills = 3;
  const visibleSkills = showAllSkills 
    ? skills || []
    : (skills || []).slice(0, maxVisibleSkills);
  const hasMoreSkills = skills && skills.length > maxVisibleSkills;

  // Toggle showing all skills
  const toggleSkillsDisplay = () => {
    setShowAllSkills(!showAllSkills);
  };

  // Check if it's a Microsoft certification
  const isMicrosoftCert = issuer === "Microsoft";
  
  // Determine which image to use (thumbnail or full image)
  const displayImage = thumbImage || image;

  return (
    <>
      <article
        data-testid={`certification-card-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
        aria-label={`${name} certification from ${issuer}${featured ? ' (Featured)' : ''}${isUpcoming ? ' (Upcoming)' : ''}`}
        className={`group relative p-5 rounded-xl border transition-all duration-500 flex flex-col hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 ${
          featured
            ? 'bg-gradient-to-br from-purple-500/5 via-gray-800 to-gray-900 border-purple-500/30 shadow-md shadow-purple-500/10 hover:border-purple-500/50 hover:shadow-purple-500/20'
            : isUpcoming
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-500/30 hover:border-amber-500/50 hover:shadow-amber-500/10'
              : 'bg-gradient-to-br from-gray-800 to-gray-900 border-secondary-default/20 hover:border-secondary-default/60 hover:shadow-secondary-default/20'
        } performance-card ${CSS_ANIMATIONS.FADE_IN_UP}`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Category Badge Icon - Top Right Corner (Outside image container for tooltip visibility) */}
        <div className="absolute top-2 right-2 z-20">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-testid={`certification-category-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-md border transition-colors cursor-help ${
                    certification.category === "Professional"
                      ? 'bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30'
                      : certification.category === "Course"
                        ? 'bg-emerald-500/20 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30'
                  }`}
                >
                  {certification.category === "Professional" ? (
                    <FiBriefcase className={`text-sm ${
                      certification.category === "Professional" ? 'text-purple-300' : ''
                    }`} />
                  ) : (
                    <FiBook className={`text-sm ${
                      certification.category === "Course" ? 'text-emerald-300' : 'text-blue-300'
                    }`} />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="z-[200]">
                <p className="text-xs">{certification.category}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Card Header with Image */}
        <div
          data-testid={`certification-image-container-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
          className="relative mb-4 flex justify-center items-center h-[180px] rounded-lg overflow-hidden bg-gradient-to-br from-secondary-default/10 to-transparent group-hover:shadow-2xl transition-all duration-500"
          style={{
            transform: 'translateZ(20px)',
          }}
        >
          {displayImage ? (
            <div 
              data-testid={`certification-image-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
              className="relative w-full h-full max-h-[160px] rounded-lg overflow-hidden bg-white/5 cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image
                src={displayImage}
                alt={`${name} certificate`}
                fill
                className="object-contain p-2 transition-transform duration-300 hover:scale-105"
              />
              
              {/* Subtle indicator to show the image is clickable */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors duration-300 opacity-0 hover:opacity-100">
                <span className="text-white text-xs px-2 py-1 bg-black/50 rounded-md">Click to enlarge</span>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center">
              <FiAward className="text-4xl text-secondary-default" />
            </div>
          )}

          {/* Issuer Logo */}
          {issuerLogo && (
            <div
              data-testid={`certification-issuer-logo-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
              className="absolute bottom-2 right-2 w-10 h-10 bg-white/10 backdrop-blur-md rounded overflow-hidden flex items-center justify-center border border-white/20 shadow-glow"
            >
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

        {/* Card Content */}
        <div
          data-testid={`certification-content-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
          className="flex-1 flex flex-col"
        >

          <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
            {/* Date Badge - Match STATUS_BADGE_CLASSES */}
            <div className="flex items-center gap-2">
              <div
                data-testid={`certification-date-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
                className="inline-flex items-center justify-center h-7 bg-secondary-default/10 backdrop-blur-sm border border-secondary-default/30 text-secondary-default px-3 rounded-full text-xs font-medium"
              >
                <FiCalendar className="text-[10px] mr-1.5" />
                <span>{formattedDate}</span>
              </div>

              {/* Expiry Date Badge if available - Color coded by status */}
              {formattedExpiryDate && expiryStatus && (
                <div
                  data-testid={`certification-expiry-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`inline-flex items-center justify-center h-7 backdrop-blur-sm border px-3 rounded-full text-xs font-medium ${expiryStatus.color}`}
                >
                  <FiCalendar className="text-[10px] mr-1.5" />
                  <span>Exp: {formattedExpiryDate}</span>
                </div>
              )}
            </div>

            {/* Status indicators with tooltips */}
            <div 
              data-testid={`certification-status-indicators-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
              className="flex gap-1.5"
            >
              {status && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        data-testid={`certification-status-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          status === "Active" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        <FiActivity size={12} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="z-[100]">
                      <p className="text-xs">{status} Certification</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {onlineVerifiable && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        data-testid={`certification-verifiable-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
                        className="w-5 h-5 rounded-full bg-secondary-default/20 text-secondary-default flex items-center justify-center"
                      >
                        <FiCheck size={12} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="z-[100]">
                      <p className="text-xs">Online Verifiable</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          <h3
            data-testid={`certification-title-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
            className={`text-lg font-bold mb-2 line-clamp-2 transition-colors duration-300 leading-tight ${
              featured
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent'
            }`}
          >
            {name}
          </h3>

          {/* Issuer as inline text - matching Project Page pattern */}
          <div
            data-testid={`certification-issuer-${certification.name.replace(/\s+/g, '-').toLowerCase()}`}
            className="mb-3 text-xs text-white/60 font-medium"
          >
            @ {issuer}
          </div>

          {/* Credential ID - Show for ALL certifications that have it */}
          {credentialId && (
            <div className="flex items-center text-white/60 text-xs mb-3 bg-white/5 p-2 rounded">
              <FiKey className="mr-1.5 text-secondary-default" />
              <span className="mr-1 font-medium">Credential ID:</span>
              <span className="font-mono text-[10px]">{credentialId}</span>
            </div>
          )}

          {/* Certification Number - Show for ALL certifications that have it */}
          {certificationNumber && (
            <div className="flex items-center text-white/60 text-xs mb-3 bg-white/5 p-2 rounded">
              <FiHash className="mr-1.5 text-secondary-default" />
              <span className="mr-1 font-medium">Cert #:</span>
              <span className="font-mono text-[10px]">{certificationNumber}</span>
            </div>
          )}
          
          {/* Description with See more/Show less */}
          {description && (
            <div className="mb-4">
              <p className={`text-white/70 text-sm ${!showFullDescription ? 'line-clamp-2' : ''}`}>
                {description}
              </p>
              {description.length > 80 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-xs text-secondary-default hover:text-secondary-default/80 transition-colors mt-1 font-medium"
                >
                  {showFullDescription ? 'Show less' : 'See more'}
                </button>
              )}
            </div>
          )}

          {/* Skills - Compact style matching ProjectSkills */}
          {skills && skills.length > 0 && (
            <div className="mt-auto mb-4">
              {/* Compact Header matching ProjectSkills CompactSectionHeader */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00BFFF]/30 to-transparent"></div>
                <h4 className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
                  Key Skills
                </h4>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00BFFF]/30 to-transparent"></div>
              </div>

              {/* Compact skill badges */}
              <div className="flex flex-wrap gap-1 items-center">
                {visibleSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF]/90 hover:bg-[#00BFFF]/20 transition-colors whitespace-nowrap"
                  >
                    {skill}
                  </span>
                ))}
                {hasMoreSkills && (
                  <button
                    onClick={toggleSkillsDisplay}
                    className="text-[9px] px-1.5 py-0.5 text-secondary-default/80 hover:text-secondary-default transition-colors font-medium whitespace-nowrap"
                  >
                    {showAllSkills ? 'Show less' : `+${skills.length - maxVisibleSkills} more`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="mt-3">
          {/* View Certificate/Image Button */}
          {link && onlineVerifiable !== false ? (
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${name} certificate on ${issuer} website (opens in new tab)`}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary-default/10 to-blue-500/10 hover:from-secondary-default/20 hover:to-blue-500/20 border border-secondary-default/30 hover:border-secondary-default/50 text-secondary-default px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary-default/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary-default/50 focus:ring-offset-2 focus:ring-offset-[#27272c]"
            >
              <FiExternalLink className="text-sm" aria-hidden="true" />
              <span>View Certificate</span>
            </Link>
          ) : (
            <button
              onClick={() => setIsLightboxOpen(true)}
              aria-label={`View full size image of ${name} certificate`}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-white/5 to-transparent hover:from-white/10 hover:to-transparent border border-white/20 hover:border-white/30 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#27272c]"
            >
              <FiExternalLink className="text-sm" aria-hidden="true" />
              <span>View Image</span>
            </button>
          )}
        </div>

        {/* 3D Depth Effect - Subtle Shadow Layer */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary-default/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
          style={{
            transform: 'translateZ(-10px)',
          }}
          aria-hidden="true"
        />

        {/* Lightbox for full-size image view */}
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={[{ src: image || '' }]}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          }}
          controller={{
            closeOnBackdropClick: true,
            closeOnPullDown: true,
          }}
        />
      </article>
    </>
  );
};

export default CertificationCard;

// Add CSS for shadow glow in a Next.js safe way
if (typeof document !== 'undefined') {
  // Check if the style already exists to avoid duplicates
  const id = 'certification-card-styles';
  if (!document.getElementById(id)) {
    const styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.innerHTML = `
      .shadow-glow {
        box-shadow: 0 0 8px rgba(0, 191, 255, 0.2);
      }
    `;
    document.head.appendChild(styleElement);
  }
} 