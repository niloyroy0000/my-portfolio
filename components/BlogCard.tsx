"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaClock, FaCalendar, FaArrowRight, FaExternalLinkAlt } from "@/lib/icons";
import { BlogPost } from "@/types/api";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  variant?: "default" | "compact";
}

const categoryColors: Record<BlogPost["category"], { bg: string; text: string; border: string }> = {
  "AI/ML": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  "Cloud & DevOps": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  "Full-Stack": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  "Architecture": { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  "Best Practices": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" }
};

const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0, variant = "default" }) => {
  const colors = categoryColors[post.category];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`group relative bg-gray-900/50 border border-secondary-default/20 rounded-xl overflow-hidden hover:border-secondary-default/40 transition-all duration-300 ${
        variant === "compact" ? "p-4" : "p-6"
      }`}
    >
      {/* Featured Badge - V2: Use order field to determine featured (order < 5) */}
      {post.order < 5 && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-secondary-default to-blue-500 text-white rounded-full">
            Featured
          </span>
        </div>
      )}

      {/* Category */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`px-2 py-1 text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border} rounded`}
        >
          {post.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-secondary-default transition-colors line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className={`text-sm text-white/60 leading-relaxed mb-4 ${variant === "compact" ? "line-clamp-2" : "line-clamp-3"}`}>
        {post.excerpt}
      </p>

      {/* Tags */}
      {variant === "default" && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-white/5 border border-white/10 rounded text-white/50"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-white/40">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-4 text-xs text-white/50">
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <FaCalendar className="text-[10px]" />
              {formatDate(new Date(post.publishedAt))}
            </span>
          )}
          {post.readingTime && (
            <span className="flex items-center gap-1.5">
              <FaClock className="text-[10px]" />
              {post.readingTime} min read
            </span>
          )}
        </div>

        {/* Read More Link */}
        <button
          className="flex items-center gap-1.5 text-xs text-secondary-default/80 hover:text-secondary-default font-semibold group-hover:gap-2 transition-all"
          aria-label={`Read ${post.title}`}
        >
          <span>Read More</span>
          <FaArrowRight className="text-[10px]" />
        </button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-default/0 to-blue-500/0 group-hover:from-secondary-default/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none rounded-xl" />
    </motion.article>
  );
};

export default BlogCard;
