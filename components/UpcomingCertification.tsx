"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Certification } from "@/types/api";
import Image from "next/image";
import { FiClock, FiTarget, FiExternalLink, FiAward } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PERFORMANCE_VARIANTS } from "@/constants";

interface UpcomingCertificationProps {
  certification: Certification;
}

const UpcomingCertification: React.FC<UpcomingCertificationProps> = ({
  certification
}) => {
  // State for showing all skills
  const [showAllSkills, setShowAllSkills] = useState(false);
  
  const {
    name,
    issuer,
    date,
    description,
    skills,
    image,
    issuerLogo
  } = certification;

  // Format the expected date
  const expectedDate = useMemo(() => {
    // Format expected date in a way that's consistent between server and client
    const dateObj = new Date(date);
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
  }, [date]);
  
  // Determine which skills to show
  const maxVisibleSkills = 4;
  const visibleSkills = showAllSkills 
    ? skills || []
    : (skills || []).slice(0, maxVisibleSkills);
  const hasMoreSkills = skills && skills.length > maxVisibleSkills;

  // Toggle showing all skills
  const toggleSkillsDisplay = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAllSkills(!showAllSkills);
  };

  // Determine certification page or external link
  const certificationUrl = certification.link || 
    (certification.category === "Professional" ? "https://learn.microsoft.com/en-us/credentials/" : "");

  // Use a deterministic progress percentage based on the certification ID to avoid hydration mismatches
  const progressPercentage = useMemo(() => {
    // Generate a number between 30-70% based on the certification ID
    const idString = certification._id.toString();
    const idSum = idString.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    return 30 + (idSum % 40); // 30-70% range
  }, [certification._id]);

  return (
    <motion.div
      variants={PERFORMANCE_VARIANTS.cardSync}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative bg-gradient-to-br from-secondary-default/20 via-blue-500/10 to-secondary-default/5 backdrop-blur-sm border border-dashed border-secondary-default/50 rounded-xl overflow-hidden shadow-lg shadow-black/10 hover:shadow-secondary-default/10 transition-all duration-300"
    >
      {/* Animated progress indicator */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-secondary-default to-blue-500 rounded-full z-10"
      />
      
      <div className="flex flex-col md:flex-row p-6 gap-6 relative">
        {/* Subtle glow effect in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-secondary-default/5 blur-3xl rounded-full" />
        
        {/* Left section with image */}
        <div className="md:w-1/4 flex justify-center items-center relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="relative w-full h-32 flex justify-center items-center"
          >
            {image ? (
              <div className="relative w-32 h-32 bg-white/5 rounded-full overflow-hidden border-2 border-secondary-default/40 group">
                <Image
                  src={image}
                  alt={`${name} certification badge`}
                  fill
                  className="object-contain p-3 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                
                {/* Pulsing overlay */}
                <motion.div
                  animate={{ 
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-secondary-default/20 to-blue-500/20 rounded-full"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border-2 border-secondary-default/40 group relative overflow-hidden">
                <FiTarget className="text-5xl text-secondary-default/70 group-hover:text-secondary-default transition-colors duration-300" />
                
                {/* Pulsing overlay */}
                <motion.div
                  animate={{ 
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-secondary-default/20 to-blue-500/20 rounded-full"
                />
              </div>
            )}
            
            {/* Issuer Logo with floating animation */}
            {issuerLogo && (
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-2 right-1/3 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full overflow-hidden flex items-center justify-center border border-white/20 shadow-lg"
              >
                <Image
                  src={issuerLogo}
                  alt={`${issuer} logo`}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Middle section with details */}
        <div className="md:w-3/4 flex flex-col justify-center relative z-10">
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <Badge 
              variant="secondary" 
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-default/20 border border-secondary-default/30 text-secondary-default font-medium"
            >
              Upcoming
            </Badge>
            
            <motion.div 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center text-white/80 text-sm bg-white/5 px-2 py-0.5 rounded-full"
            >
              <FiClock className="mr-1.5 text-secondary-default" />
              <span>Expected {expectedDate}</span>
            </motion.div>
            
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30"
            >
              In Progress • {progressPercentage}%
            </Badge>
          </div>
          
          <motion.h3 
            variants={PERFORMANCE_VARIANTS.slideUpSync}
            className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
          >
            {name}
          </motion.h3>
          
          <motion.div 
            variants={PERFORMANCE_VARIANTS.slideUpSync}
            className="flex items-center mb-3 text-sm text-secondary-default"
          >
            <FiAward className="mr-1.5" />
            <span className="font-medium">{issuer}</span>
          </motion.div>
          
          {description && (
            <motion.p 
              variants={PERFORMANCE_VARIANTS.slideUpSync}
              className="text-white/80 text-sm mb-4 line-clamp-2 bg-white/5 p-2 rounded-md border border-white/10"
            >
              {description}
            </motion.p>
          )}
          
          {/* Skills */}
          {skills && skills.length > 0 && (
            <motion.div 
              variants={PERFORMANCE_VARIANTS.containerSync}
              className="flex flex-wrap gap-2 mt-auto"
            >
              {visibleSkills.map((skill, i) => (
                <motion.div
                  key={i}
                  variants={PERFORMANCE_VARIANTS.cardSync}
                >
                  <Badge
                    variant="outline"
                    className="text-xs bg-secondary-default/10 border-secondary-default/30 text-white hover:bg-secondary-default/20 transition-all duration-300"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
              {hasMoreSkills && (
                <motion.button
                  variants={PERFORMANCE_VARIANTS.cardSync}
                  onClick={toggleSkillsDisplay}
                  className="text-secondary-default hover:text-secondary-default/80 text-xs transition-colors bg-white/5 px-2 py-1 rounded-md border border-white/10 hover:border-secondary-default/30"
                >
                  {showAllSkills ? "Show Less" : `+${skills.length - maxVisibleSkills} more`}
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Action side - link to certification page or external info */}
        <div className="absolute top-4 right-4">
          <Link 
            href={certificationUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-default hover:text-secondary-default/80 transition-colors p-2 hover:bg-white/10 rounded-full border border-transparent hover:border-white/10 flex items-center justify-center"
          >
            <FiExternalLink size={20} />
          </Link>
        </div>
        
        {/* Progress indicators */}
        <div className="absolute bottom-3 right-4 flex items-center text-xs">
          <div className="flex space-x-1 mr-2">
            {[1, 2, 3, 4].map((step, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  opacity: i < progressPercentage / 25 ? 1 : 0.3,
                  scale: i < progressPercentage / 25 ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: 1.5,
                  repeat: i < progressPercentage / 25 ? Infinity : 0,
                  repeatType: "reverse",
                  delay: i * 0.2
                }}
                className={`w-2 h-2 rounded-full ${
                  i < progressPercentage / 25 
                    ? "bg-secondary-default" 
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <span className="text-white/50 font-mono">In progress</span>
        </div>
      </div>
    </motion.div>
  );
};

export default UpcomingCertification; 