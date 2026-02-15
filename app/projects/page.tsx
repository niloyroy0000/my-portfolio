import { fetchProjects } from "@/lib/api-client";
import ProjectsClient from "@/components/ProjectsClient";
import type { Project } from "@/types/api";

/**
 * Projects Page - Server Component
 *
 * Fetches all projects from portfolio-admin API at build time (SSG).
 * Passes data to client component for interactive features.
 */
export default async function ProjectsPage() {
  let projects: Project[] = [];

  try {
    // Fetch all projects from admin API at build time
    projects = await fetchProjects();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    // Fallback to empty array - client component will show empty state
    projects = [];
  }

  return <ProjectsClient projects={projects} />;
}
