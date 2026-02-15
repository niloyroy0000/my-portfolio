import { useMemo } from 'react';

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

/**
 * Custom hook for calculating skills statistics
 * Counts skills by proficiency level using memoization for performance
 */
export function useSkillsStats(skills1: SkillNode, skills2: SkillNode) {
  // Helper function to count skills by proficiency level
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countSkillsByLevel = useMemo(() => (skillTree: any, level: string): number => {
    let count = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const traverseNode = (node: any) => {
      if (node.metadata?.level === level) {
        count++;
      }
      if (node.children) {
        node.children.forEach(traverseNode);
      }
    };

    traverseNode(skillTree);
    return count;
  }, []);

  // Calculate counts (memoized)
  const stats = useMemo(() => {
    const expertCount = countSkillsByLevel(skills1, "Expert") + countSkillsByLevel(skills2, "Expert");
    const advancedCount = countSkillsByLevel(skills1, "Advanced") + countSkillsByLevel(skills2, "Advanced");
    const intermediateCount = countSkillsByLevel(skills1, "Intermediate") + countSkillsByLevel(skills2, "Intermediate");
    const familiarCount = countSkillsByLevel(skills1, "Familiar") + countSkillsByLevel(skills2, "Familiar");

    return {
      expert: expertCount,
      advanced: advancedCount,
      intermediate: intermediateCount,
      familiar: familiarCount,
      total: expertCount + advancedCount + intermediateCount + familiarCount
    };
  }, [skills1, skills2, countSkillsByLevel]);

  return stats;
}
