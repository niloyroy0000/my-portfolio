"use client";

import React from "react";
// V2: Legacy component - getFeaturedPosts removed, data now from API
// This component is not used in current API-based architecture

interface FeaturedBlogPostsProps {
  maxItems?: number;
  className?: string;
}

const FeaturedBlogPosts: React.FC<FeaturedBlogPostsProps> = ({
  maxItems = 3,
  className = ""
}) => {
  // V2 Note: This component is legacy and not used in current API-based architecture
  // Blog posts are now shown via MediumBlogPreview component
  return null;
};

export default FeaturedBlogPosts;
