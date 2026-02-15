/**
 * Skills Tree Utilities
 *
 * Helper functions for working with hierarchical skill data structures.
 * Extracted from SkillsHeatMapModal.tsx (Priority 4.1) for reusability.
 */

interface SkillNode {
  name: string;
  metadata?: {
    icon?: string;
    level?: "Expert" | "Advanced" | "Intermediate" | "Familiar";
    yearsOfExperience?: number;
    lastUsed?: string;
  };
  children?: SkillNode[];
}

/**
 * Recursively extracts all skills from a skill tree node
 *
 * @param node - Root node to extract skills from
 * @returns Array of all skill nodes (nodes with level or yearsOfExperience metadata)
 *
 * @example
 * ```ts
 * const backend = { name: "Backend", children: [...] };
 * const allBackendSkills = extractAllSkills(backend);
 * // Returns: [{ name: "Node.js", metadata: { level: "Expert" } }, ...]
 * ```
 */
export const extractAllSkills = (node: SkillNode): SkillNode[] => {
  let allSkills: SkillNode[] = [];

  // If this node has level metadata, it's a skill
  if (node.metadata?.level || node.metadata?.yearsOfExperience) {
    allSkills.push(node);
  }

  // Recursively process children
  if (node.children) {
    node.children.forEach(childNode => {
      allSkills = [...allSkills, ...extractAllSkills(childNode)];
    });
  }

  return allSkills;
};

/**
 * Groups skills by top-level category with metadata
 *
 * @param node - Root skill tree node
 * @returns Array of categories with their skills
 *
 * @example
 * ```ts
 * const rootNode = { name: "Skills", children: [frontendNode, backendNode] };
 * const categories = groupSkillsByCategory(rootNode);
 * // Returns: [
 * //   { category: "Frontend", categoryIcon: "FaReact", skills: [...] },
 * //   { category: "Backend", categoryIcon: "FaServer", skills: [...] }
 * // ]
 * ```
 */
export const groupSkillsByCategory = (
  node: SkillNode
): { category: string; categoryIcon: string; skills: SkillNode[] }[] => {
  const categories: { category: string; categoryIcon: string; skills: SkillNode[] }[] = [];

  if (node.children) {
    node.children.forEach(categoryNode => {
      // Recursively extract all skills from this category (handles nested structures)
      const skillsInCategory = extractAllSkills(categoryNode);

      if (skillsInCategory.length > 0) {
        categories.push({
          category: categoryNode.name,
          categoryIcon: categoryNode.metadata?.icon || 'FaCode', // Use category's own icon from metadata
          skills: skillsInCategory,
        });
      }
    });
  }

  return categories;
};

/**
 * Merges categories from multiple skill trees
 *
 * @param trees - Array of skill tree root nodes
 * @returns Combined array of categories from all trees
 *
 * @example
 * ```ts
 * const allCategories = mergeSkillTrees([skills1, skills2]);
 * ```
 */
export const mergeSkillTrees = (trees: SkillNode[]): {
  category: string;
  categoryIcon: string;
  skills: SkillNode[];
}[] => {
  return trees.flatMap(tree => groupSkillsByCategory(tree));
};

/**
 * Filters skills by proficiency level
 *
 * @param skills - Array of skill nodes
 * @param levels - Array of levels to include (e.g., ["Expert", "Advanced"])
 * @returns Filtered array of skills
 *
 * @example
 * ```ts
 * const expertSkills = filterSkillsByLevel(allSkills, ["Expert"]);
 * ```
 */
export const filterSkillsByLevel = (
  skills: SkillNode[],
  levels: Array<"Expert" | "Advanced" | "Intermediate" | "Familiar">
): SkillNode[] => {
  if (levels.length === 0) return skills; // Show all if no filter

  return skills.filter(skill => {
    const skillLevel = skill.metadata?.level;
    return skillLevel && levels.includes(skillLevel);
  });
};

/**
 * Counts total skills in a tree
 *
 * @param node - Root skill tree node
 * @returns Total number of skills (nodes with level metadata)
 *
 * @example
 * ```ts
 * const totalSkills = countSkills(rootNode); // Returns: 42
 * ```
 */
export const countSkills = (node: SkillNode): number => {
  return extractAllSkills(node).length;
};
