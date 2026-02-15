import { fetchSkillHierarchy } from "@/lib/api-client";
import SkillsClient from "@/components/SkillsClient";
import { transformApiToSkillsData } from "@/lib/skillsDataTransformer";

/**
 * Skills Page - Server Component
 *
 * Fetches skill hierarchy from portfolio-admin API at build time (SSG).
 * Transforms API data to match main branch SkillNode format (skills1, skills2).
 * Passes transformed data to client component with TreeView UI.
 */
export default async function SkillsPage() {
  let skills1Data: any = { name: "Skills", children: [] };
  let skills2Data: any = { name: "Skills", children: [] };

  try {
    // Fetch skill hierarchy from admin API at build time
    const apiCategories = await fetchSkillHierarchy();

    // Transform API response to main branch format (skills1, skills2)
    const { skills1, skills2 } = transformApiToSkillsData(apiCategories);
    skills1Data = skills1;
    skills2Data = skills2;
  } catch (error) {
    console.error('Failed to fetch or transform skills:', error);
    // Fallback to empty structures
  }

  return <SkillsClient skills1={skills1Data} skills2={skills2Data} />;
}
