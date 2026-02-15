"use client";

import React from "react";
// V2: Legacy component - projects constant removed, data now from API
// This component is not used in current API-based architecture

interface FeaturedCaseStudiesProps {
  maxItems?: number;
  className?: string;
}

const FeaturedCaseStudies: React.FC<FeaturedCaseStudiesProps> = ({
  maxItems = 2,
  className = ""
}) => {
  // V2 Note: This component is legacy and not used in current API-based architecture
  // Case studies are now shown via ProjectModal in the projects page
  return null;
};

export default FeaturedCaseStudies;
