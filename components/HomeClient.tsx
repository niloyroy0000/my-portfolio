"use client";
import { lazy, Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";
import type { Certification, TestimonialData, Project, TimelineEntry } from "@/types/api";
import FeaturedCertificationCard from "@/components/FeaturedCertificationCard";
import BackgroundElements from "@/components/BackgroundElements";
import Badge from "@/components/Badge";
import Photo from "@/components/Photo";
import SocialPreviewGenerator from "@/components/SocialPreviewGenerator";
import { trackResumeDownload } from "@/lib/analytics";
import TypingAnimation from "@/components/TypingAnimation";
import FloatingCodeSymbols from "@/components/FloatingCodeSymbols";
import ScrollIndicator from "@/components/ScrollIndicator";
import { calculateTotalExperience } from "@/helpers/utility";
import ErrorBoundary from "@/components/ErrorBoundary";

// Import critical above-the-fold icons directly (no lazy loading)
import { FiDownload, FiCode, FiCloud, FiZap, FiEye } from "@/lib/icons";
import { SiReact, SiDotnet } from "@/lib/icons";
import { RiRobot3Fill } from "@/lib/icons";

// Import extracted home sections
import FeaturedAchievementSection from "@/components/home/FeaturedAchievementSection";
import LookingForSection from "@/components/home/LookingForSection";

interface SkillNode {
  name: string;
  metadata?: {
    icon: string;
    level?: "Expert" | "Advanced" | "Intermediate" | "Familiar";
    yearsOfExperience?: number;
    lastUsed?: string;
  };
  children?: SkillNode[];
}

// Typing animation phrases - Default fallback (can be overridden by portfolio metadata)
const DEFAULT_HERO_PHRASES = [
  "I build scalable enterprise systems",
  "I integrate AI to boost productivity",
  "I architect cloud-native solutions",
  "I transform legacy into modern",
];

// Lazy load only non-critical below-the-fold components
const Socials = lazy(() => import("@/components/Socials"));
const ByTheNumbersDashboard = lazy(() => import("@/components/ByTheNumbersDashboard"));
const TestimonialsCarousel = lazy(() => import("@/components/TestimonialsCarousel"));
const GitHubActivityGraph = lazy(() => import("@/components/GitHubActivityGraph"));
const MediumBlogPreview = lazy(() => import("@/components/MediumBlogPreview"));

// Lightweight loading fallback - optimized for performance
const ComponentFallback = ({ className, height = "h-64" }: { className?: string; height?: string }) => (
  <div className={`flex items-center justify-center ${height} ${className} bg-gray-800/20 rounded-lg`}>
    <div className="w-10 h-10 border-3 border-gray-700 border-t-cyan-400 rounded-full animate-spin" aria-label="Loading..." role="status" />
  </div>
);

interface HomeClientProps {
  testimonials: TestimonialData[];
  featuredCertification: Certification | null;
  projects: Project[];
  certifications: Certification[];
  timeline: TimelineEntry[];
  skills1: SkillNode;
  skills2: SkillNode;
  portfolioMetadata?: any;
}

const HomeClient = ({
  testimonials,
  featuredCertification,
  projects,
  certifications,
  timeline,
  skills1,
  skills2,
  portfolioMetadata,
}: HomeClientProps) => {
  const [pageLoadTime, setPageLoadTime] = useState(0);

  // Calculate total experience from timeline data
  const totalExperience = calculateTotalExperience(timeline);

  // Hero section content (static)
  const heroPhrases = DEFAULT_HERO_PHRASES;
  const heroTagline = "Senior .NET Architect & AI Solutions Engineer";
  const heroName = "Niloy Kumar Barman";
  const heroBio = `Senior .NET Architect with ${totalExperience} delivering mid to enterprise grade applications. Currently at Optimizely, delivering solutions for global enterprise clients. Built SpireWiz, an AI tool achieving 80% time reduction and $180K annual business value. Microsoft Certified.`;

  // Dynamic resume URL (with fallback to default)
  const resumeUrl = portfolioMetadata?.resumeUrl || "/assets/Niloy_Kumar_Barman_Resume.pdf";

  useEffect(() => {
    setPageLoadTime(Date.now());
  }, []);

  // Find SpireWiz project for Featured Achievement section (dynamic data)
  const spireWizProject = projects.find(p =>
    p.title.toLowerCase().includes('spirewiz') ||
    (p.isFeatured && p.category === 'Windows App')
  );

  // Handle resume download tracking
  const handleResumeDownload = () => {
    const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000); // seconds
    trackResumeDownload('Homepage Hero', {
      timeOnPage,
      pageUrl: window.location.href,
      referrer: document.referrer,
    });
  };

  // Dynamic SEO metadata (with fallback to defaults)
  const seoTitle = portfolioMetadata?.seoTitle || "Niloy Kumar Barman- Senior .NET Architect & AI Solutions Engineer";
  const seoDescription = portfolioMetadata?.metaDescription || `Senior .NET Architect with ${totalExperience} delivering mid to enterprise grade platforms. Currently at Optimizely, delivering solutions for global enterprise clients. Built SpireWiz, an AI tool achieving 80% time reduction and $180K annual business value. Microsoft Certified.`;
  const ogImage = portfolioMetadata?.seo?.ogImage || "https://biswajitpanday.github.io/assets/profile/profile-large.webp";
  const twitterCard = portfolioMetadata?.seo?.twitterCard || "summary_large_image";

  return (
    <ErrorBoundary>
      <SocialPreviewGenerator
        title={seoTitle}
        description={seoDescription}
        image={ogImage}
        url="https://github.com/niloyroy0000"
        type="website"
        twitterCard={twitterCard as 'summary' | 'summary_large_image'}
      />
      <section
        data-testid="home-page"
        className="min-h-[calc(100vh-136px)] flex flex-col justify-center relative overflow-hidden py-8 xl:py-0 pb-12 xl:pb-16"
      >
        {/* Enhanced Background Elements */}
        <BackgroundElements
          floatingDots={[
            {
              size: "md",
              color: "secondary",
              animation: "ping",
              position: { top: "5rem", right: "2.5rem" },
              opacity: 60,
            },
            {
              size: "sm",
              color: "blue",
              animation: "pulse",
              position: { bottom: "8rem", right: "16rem" },
              opacity: 40,
            },
            {
              size: "md",
              color: "secondary",
              animation: "bounce",
              position: { top: "33.333333%", left: "2rem" },
              opacity: 50,
            },
          ]}
        />

        {/* Floating Code Symbols Background */}
        <FloatingCodeSymbols symbolCount={12} />

        <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-secondary-default/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-8 xl:gap-16 xl:pt-8 xl:pb-8">
            {/* Content Section */}
            <motion.div
              data-testid="home-content"
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center xl:text-left order-2 xl:order-none max-w-2xl"
            >
              {/* Role Badge - Purple/Pink accent with readable white text */}
              <div
                data-testid="home-role-badge"
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-purple-500/10 backdrop-blur-sm border border-purple-500/40 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-500/25 transition-all duration-300">
                  <FiCode className="text-lg text-purple-400" />
                  <span className="text-white">{heroTagline}</span>
                  <FiZap className="text-lg text-pink-400 animate-pulse" />
                </span>
              </div>

              {/* Main Heading */}
              <h1
                data-testid="home-main-heading"
                className="text-3xl xl:text-4xl font-bold mb-4 leading-tight"
              >
                Hi, I&apos;m <br className="hidden xl:block" />
                <span className="bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
                  {heroName}
                </span>
              </h1>

              {/* Typing Animation Tagline */}
              <div
                data-testid="home-typing-tagline"
                className="h-8 mb-6 flex items-center justify-center xl:justify-start"
              >
                <span className="text-lg xl:text-xl font-light">
                  <TypingAnimation
                    phrases={heroPhrases}
                    typingSpeed={60}
                    deletingSpeed={40}
                    pauseDuration={2500}
                    className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                    cursorClassName="bg-gradient-to-b from-emerald-400 to-purple-400"
                  />
                </span>
              </div>

              {/* About Me Summary - Recruiter-focused with key highlights */}
              <p
                data-testid="home-description"
                className="text-white/70 text-base leading-relaxed max-w-2xl mb-6 mx-auto xl:mx-0"
              >
                Senior .NET Architect with{" "}
                <span className="text-[#00BFFF] font-medium">{totalExperience}</span> delivering mid
                to enterprise grade applications. Currently at{" "}
                <span className="text-[#00BFFF] font-medium">Optimizely</span> serving
                global enterprise clients. Passionate about AI integration—built{" "}
                <span className="text-[#00BFFF] font-medium">SpireWiz</span> achieving{" "}
                <span className="text-emerald-400 font-medium">80% </span>{" "} efficiency gains. {" "}
                <span className="text-purple-400 font-medium">~$180K </span> annual value, and {" "}
                <span className="text-purple-400 font-medium">600+</span> {" "}
                developer hours saved annually. {" "}
                <span className="text-[#00BFFF] font-medium">Microsoft Certified</span>.
              </p>

              {/* Tech Stack Highlights - Compact badges with gradient icons */}
              <div
                data-testid="home-tech-stack"
                className="flex flex-wrap justify-center xl:justify-start gap-2 mb-8"
              >
                <Badge
                  icon={<SiDotnet className="text-[#00BFFF]" />}
                  text=".NET"
                  color="default"
                  size="compact"
                />
                <Badge
                  icon={<SiReact className="text-[#00BFFF]" />}
                  text="React"
                  color="default"
                  size="compact"
                />
                <Badge
                  icon={<FiCloud className="text-purple-400" />}
                  text="DevOps"
                  color="purple"
                  size="compact"
                />
                <Badge
                  icon={<RiRobot3Fill className="text-emerald-400" />}
                  text="AI Integration"
                  color="emerald"
                  size="compact"
                />
              </div>

              {/* Featured Certification Card */}
              {featuredCertification && (
                <div
                  data-testid="home-featured-certification"
                  className="mb-6"
                >
                  <FeaturedCertificationCard
                    certification={featuredCertification}
                    size="small"
                    simplified={true}
                    headingLevel={2}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div
                data-testid="home-action-buttons"
                className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-6 mb-2"
              >
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={resumeUrl}
                    download="Niloy_Kumar_Barman_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleResumeDownload}
                    data-testid="home-download-resume-link"
                  >
                    <Button
                      data-testid="home-download-resume-button"
                      size="lg"
                      className="group relative overflow-hidden bg-gradient-to-r from-[#00BFFF] via-blue-500 to-purple-500 hover:from-purple-500 hover:via-blue-500 hover:to-[#00BFFF] text-white font-semibold px-6 py-3 rounded transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <FiDownload className="text-lg group-hover:animate-bounce" aria-hidden="true" />
                        <span>Download Resume</span>
                        <span className="text-xs opacity-70">PDF</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-[#00BFFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </a>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="home-view-resume-link"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-[#00BFFF]/30 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:border-[#00BFFF]/50 px-6 py-3 rounded transition-all duration-300"
                    >
                      <FiEye className="text-lg mr-2" aria-hidden="true" />
                      View Resume
                    </Button>
                  </a>
                </div>

                <div
                  data-testid="home-social-links"
                  className="flex items-center gap-4"
                >
                  <Suspense
                    fallback={<ComponentFallback className="w-40 h-10" />}
                  >
                    <Socials
                      containerStyles="flex gap-4"
                      iconStyles="w-11 h-11 border border-secondary-default/50 rounded-full flex justify-center items-center text-secondary-default text-base hover:bg-secondary-default hover:text-primary hover:border-secondary-default hover:shadow-lg hover:shadow-secondary-default/25 transition-all duration-300 hover:scale-110"
                    />
                  </Suspense>
                </div>
              </div>
            </motion.div>

            {/* Photo Section */}
            <div
              data-testid="home-photo-section"
              className="order-1 xl:order-none relative flex items-center justify-center"
            >
              <div className="relative w-[300px] h-[300px] xl:w-[506px] xl:h-[506px]">
                {/* Subtle Glow Effect - now has proper parent size */}
                <div className="absolute inset-0 bg-secondary-default/10 rounded-full blur-3xl scale-110 animate-pulse" />
                <div data-testid="home-photo-container" className="relative z-10 w-full h-full">
                  <Photo />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden xl:flex justify-center mt-8">
            <ScrollIndicator targetId="featured-achievement" />
          </div>

          {/* Featured Achievement Section - Dynamic from API */}
          {spireWizProject && <FeaturedAchievementSection project={spireWizProject} />}

          {/* What I'm Looking For - Enhanced Card (Controlled by Admin Portal) */}
          {portfolioMetadata?.displaySettings?.showLookingForSection && <LookingForSection />}

          {/* By The Numbers Dashboard - Primary Stats Display */}
          <Suspense fallback={<ComponentFallback className="w-full" height="h-32" />}>
            <ByTheNumbersDashboard
              projects={projects}
              certifications={certifications}
              timeline={timeline}
              skills1={skills1}
              skills2={skills2}
            />
          </Suspense>

          {/* GitHub Activity - Shows Active Development (MOVED UP for visibility) */}
          <Suspense fallback={<ComponentFallback className="w-full" height="h-96" />}>
            <GitHubActivityGraph />
          </Suspense>

          {/* Testimonials Carousel - Real LinkedIn Recommendations */}
          <Suspense fallback={<ComponentFallback className="w-full" height="h-80" />}>
            <TestimonialsCarousel testimonials={testimonials} />
          </Suspense>

          {/* Medium Blog Preview - Latest Articles */}
          <Suspense fallback={<ComponentFallback className="w-full" height="h-64" />}>
            <MediumBlogPreview maxPosts={3} />
          </Suspense>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default HomeClient;
