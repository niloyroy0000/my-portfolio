"use client";

import { motion } from "framer-motion";
import type { Certification } from "@/types/api";
import type { IconType } from "react-icons";
import CertificationCard from "@/components/CertificationCard";
import EmptyState from "@/components/ui/EmptyState";
import { PERFORMANCE_VARIANTS } from "@/constants";

interface CertificationTabContentProps {
  certifications: Certification[];
  totalCount: number;
  category: "professional" | "courses" | "training";
  emptyStateIcon: IconType;
  emptyStateTitle: string;
  emptyStateDescription?: string;
  showMoreButton: boolean;
  showAllCertifications: boolean;
  onShowMore: () => void;
  onClearFilters: () => void;
}

/**
 * CertificationTabContent Component
 *
 * Reusable tab content component for certification categories.
 * Extracted from CertificationsClient.tsx (lines 605-755) for better maintainability.
 *
 * Displays:
 * - Grid of certification cards
 * - Show More/Less button (conditional)
 * - Empty state when no certifications match filters
 */
const CertificationTabContent: React.FC<CertificationTabContentProps> = ({
  certifications,
  totalCount,
  category,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  showMoreButton,
  showAllCertifications,
  onShowMore,
  onClearFilters,
}) => {
  // Default empty state descriptions by category
  const defaultEmptyDescription = {
    professional: "Try adjusting your search criteria or check back later as new certifications are added.",
    courses: "Try adjusting your search criteria or check back later as new courses are completed.",
    training: "Try adjusting your search criteria or check back later as new training programs are completed.",
  };

  const description = emptyStateDescription || defaultEmptyDescription[category];

  // Format category name for display
  const getCategoryLabel = () => {
    switch (category) {
      case "professional":
        return "Professional Certifications";
      case "courses":
        return "Course Certifications";
      case "training":
        return "Training Certifications";
      default:
        return "Certifications";
    }
  };

  return (
    <>
      {certifications.length > 0 ? (
        <>
          <motion.div
            variants={PERFORMANCE_VARIANTS.containerSync}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certifications.map((certification) => (
              <CertificationCard
                key={certification._id}
                certification={certification}
                featured={certification.featured || certification.category === "Professional"}
              />
            ))}
          </motion.div>

          {/* Show More/Less Button */}
          {showMoreButton && (
            <div className="flex justify-center mt-8">
              <button
                onClick={onShowMore}
                className="px-3 py-1.5 text-sm bg-secondary-default/10 hover:bg-secondary-default/20 border border-secondary-default/30 text-secondary-default rounded-lg transition-all duration-300 font-medium"
              >
                {showAllCertifications ? (
                  <>Show Less Certifications</>
                ) : (
                  <>Show All {totalCount} {getCategoryLabel()}</>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={emptyStateIcon}
          title={emptyStateTitle}
          description={description}
          action={{
            label: "Clear Filters",
            onClick: onClearFilters,
          }}
        />
      )}
    </>
  );
};

export default CertificationTabContent;
