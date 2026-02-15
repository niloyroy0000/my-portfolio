import type { Certification } from "@/types/api";
import { v2Helpers } from "@/lib/api-client";

/**
 * useCertificationFiltering Hook
 *
 * Provides certification filtering and sorting utilities.
 * Extracted from CertificationsClient.tsx (lines 150-207) for reusability.
 *
 * @param initialDisplayCount - Number of certifications to show initially (default: 12)
 */
export const useCertificationFiltering = (initialDisplayCount: number = 12) => {
  /**
   * Get important certifications for initial display
   * Sorts by priority: showByDefault > order > Featured + Professional > Professional > Other categories by date
   */
  const getImportantCertifications = (certs: Certification[]): Certification[] => {
    // V2: Sort by priority: showByDefault > order (custom) > Featured + Professional > Professional > Other categories by date
    const sortedCerts = [...certs].sort((a, b) => {
      // Priority 0: showByDefault flag (highest priority)
      const aShowByDefault = a.showByDefault === true;
      const bShowByDefault = b.showByDefault === true;

      if (aShowByDefault && !bShowByDefault) return -1;
      if (!aShowByDefault && bShowByDefault) return 1;

      // Priority 1: V2 order field (custom ordering)
      const aOrder = v2Helpers.getCertOrder(a);
      const bOrder = v2Helpers.getCertOrder(b);

      // If both have non-zero order values, sort by order ascending (lower order = higher priority)
      if (aOrder > 0 && bOrder > 0) {
        return aOrder - bOrder;
      }
      // If only one has order, prioritize it
      if (aOrder > 0 && bOrder === 0) return -1;
      if (aOrder === 0 && bOrder > 0) return 1;

      // Priority 2: Featured + Professional
      const aIsFeaturedProfessional = a.featured && a.category === "Professional";
      const bIsFeaturedProfessional = b.featured && b.category === "Professional";

      if (aIsFeaturedProfessional && !bIsFeaturedProfessional) return -1;
      if (!aIsFeaturedProfessional && bIsFeaturedProfessional) return 1;

      // Priority 3: Professional (second priority)
      const aIsProfessional = a.category === "Professional";
      const bIsProfessional = b.category === "Professional";

      if (aIsProfessional && !bIsProfessional) return -1;
      if (!aIsProfessional && bIsProfessional) return 1;

      // Priority 4: Sort by date (most recent first)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Get showByDefault first, then featured+professional, then fill with others
    const showByDefaultCerts = sortedCerts.filter(cert => cert.showByDefault === true);
    const featuredProfessional = sortedCerts.filter(cert => !cert.showByDefault && cert.featured && cert.category === "Professional");
    const professional = sortedCerts.filter(cert => !cert.showByDefault && !cert.featured && cert.category === "Professional");
    const others = sortedCerts.filter(cert => !cert.showByDefault && cert.category !== "Professional");

    // Combine: showByDefault + featured+professional + professional + others to reach initialDisplayCount
    const important = [...showByDefaultCerts, ...featuredProfessional, ...professional];
    const remainingSlots = initialDisplayCount - important.length;

    if (remainingSlots > 0) {
      important.push(...others.slice(0, remainingSlots));
    }

    return important;
  };

  /**
   * Sort certifications by priority for display
   * Uses same sorting logic as getImportantCertifications but returns all items
   */
  const sortByPriority = (certs: Certification[]): Certification[] => {
    return [...certs].sort((a, b) => {
      // Priority 0: showByDefault flag
      const aShowByDefault = a.showByDefault === true;
      const bShowByDefault = b.showByDefault === true;

      if (aShowByDefault && !bShowByDefault) return -1;
      if (!aShowByDefault && bShowByDefault) return 1;

      // Priority 1: V2 order field
      const aOrder = v2Helpers.getCertOrder(a);
      const bOrder = v2Helpers.getCertOrder(b);

      if (aOrder > 0 && bOrder > 0) {
        return aOrder - bOrder;
      }
      if (aOrder > 0 && bOrder === 0) return -1;
      if (aOrder === 0 && bOrder > 0) return 1;

      // Priority 2: Featured + Professional
      const aIsFeaturedProfessional = a.featured && a.category === "Professional";
      const bIsFeaturedProfessional = b.featured && b.category === "Professional";

      if (aIsFeaturedProfessional && !bIsFeaturedProfessional) return -1;
      if (!aIsFeaturedProfessional && bIsFeaturedProfessional) return 1;

      // Priority 3: Professional
      const aIsProfessional = a.category === "Professional";
      const bIsProfessional = b.category === "Professional";

      if (aIsProfessional && !bIsProfessional) return -1;
      if (!aIsProfessional && bIsProfessional) return 1;

      // Priority 4: Date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  };

  /**
   * Filter certifications by category
   */
  const filterByCategory = (
    certs: Certification[],
    category: "Professional" | "Course" | "Training" | "all"
  ): Certification[] => {
    if (category === "all") {
      return certs;
    }
    return certs.filter(cert => cert.category === category);
  };

  return {
    getImportantCertifications,
    sortByPriority,
    filterByCategory,
  };
};
