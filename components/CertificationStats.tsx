"use client";

import React from "react";
// V2: Legacy component - getCertificationCounts removed, data now from API
// This component is not used in current API-based architecture

interface CertificationStatsProps {
  className?: string;
}

const CertificationStats: React.FC<CertificationStatsProps> = ({ className = "" }) => {
  // V2 Note: This component is legacy and not used in current API-based architecture
  // Data is now fetched from the API in the certifications page
  return null;
};

export default CertificationStats;
