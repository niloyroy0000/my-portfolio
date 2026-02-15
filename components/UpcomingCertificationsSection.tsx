"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiClock } from "@/lib/icons";
import { Certification } from "@/types/api";
import UpcomingCertification from "@/components/UpcomingCertification";
import { PERFORMANCE_VARIANTS } from "@/constants";

interface UpcomingCertificationsSectionProps {
  certifications: Certification[];
  show?: boolean;
}

const UpcomingCertificationsSection: React.FC<UpcomingCertificationsSectionProps> = ({
  certifications,
  show = true
}) => {
  // If there are no upcoming certifications, don't render anything
  if (!certifications || certifications.length === 0 || !show) {
    return null;
  }

  return (
    <motion.div
      variants={PERFORMANCE_VARIANTS.fadeInFast}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      <div className="flex items-center mb-4">
        <FiClock className="text-secondary-default mr-2" />
        <h3 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-secondary-default to-blue-500 bg-clip-text text-transparent">
            Upcoming Certifications
          </span>
        </h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {certifications.map((certification) => (
          <UpcomingCertification
            key={certification._id}
            certification={certification}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default UpcomingCertificationsSection; 