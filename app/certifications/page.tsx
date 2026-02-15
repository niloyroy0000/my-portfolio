import { fetchCertifications } from "@/lib/api-client";
import CertificationsClient from "@/components/CertificationsClient";
import type { Certification } from "@/types/api";

/**
 * Certifications Page - Server Component
 *
 * Fetches all certifications from portfolio-admin API at build time (SSG).
 * Passes data to client component for interactive features.
 */
export default async function CertificationsPage() {
  let certifications: Certification[] = [];

  try {
    // Fetch all certifications from admin API at build time
    certifications = await fetchCertifications();
  } catch (error) {
    console.error('Failed to fetch certifications:', error);
    // Fallback to empty array - client component will show empty state
    certifications = [];
  }

  return <CertificationsClient certifications={certifications} />;
}
