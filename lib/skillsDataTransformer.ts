/**
 * Skills Data Transformer
 * V2: Converts flat SkillType[] + SkillItem[] to main branch SkillNode format
 */

import type { SkillType, SkillItem } from "@/types/api";

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
 * V2: Transform a single SkillItem to SkillNode format
 */
function transformSkillItem(skillItem: SkillItem): SkillNode {
  // Handle lastUsed: can be "Current" string or a Date
  let lastUsedDisplay: string | undefined;
  if (skillItem.lastUsed) {
    if (skillItem.lastUsed === 'Current' || skillItem.lastUsed === 'current') {
      lastUsedDisplay = 'Current';
    } else {
      lastUsedDisplay = new Date(skillItem.lastUsed).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    }
  }

  return {
    name: skillItem.name,
    metadata: {
      icon: skillItem.icon || "",
      level: skillItem.level,
      yearsOfExperience: skillItem.yearsOfExperience,
      lastUsed: lastUsedDisplay,
    },
  };
}

/**
 * V2: Transform a single SkillType to SkillNode format
 * Handles flat structure with populated skills
 */
function transformSkillType(skillType: SkillType): SkillNode {
  const node: SkillNode = {
    name: skillType.name,
    metadata: {
      icon: skillType.icon || "",
    },
  };

  // V2: SkillType has direct skills array (no children property)
  if (skillType.skills && skillType.skills.length > 0) {
    // Sort skills by order, filter active skills (if isActive field exists, otherwise include all)
    const sortedSkills = [...skillType.skills]
      .filter(skill => skill.isActive !== false) // Only show active skills
      .sort((a, b) => a.order - b.order);

    node.children = sortedSkills.map(transformSkillItem);
  }

  return node;
}

/**
 * V2: Transform flat SkillType[] to skills1 and skills2 format
 * Builds hierarchical structure from parentSkillType relationships
 * Splits top-level categories roughly in half for 2-column layout
 */
export function transformApiToSkillsData(skillTypes: SkillType[]): {
  skills1: SkillNode;
  skills2: SkillNode;
} {
  // Filter only active skill types (if isActive field exists, otherwise include all)
  const activeSkillTypes = skillTypes.filter(st => st.isActive !== false);

  // Sort by order
  const sortedTypes = activeSkillTypes.sort((a, b) => a.order - b.order);

  // Transform to SkillNode format
  const transformedTypes = sortedTypes.map(type => {
    // Check if this SkillType has children (nested SkillTypes like Cloud -> Azure/AWS)
    if ((type as any).children && Array.isArray((type as any).children)) {
      const childSkillTypes = (type as any).children as SkillType[];
      // Transform child SkillTypes to SkillNodes
      const childNodes = childSkillTypes
        .filter((child: SkillType) => child.isActive !== false)
        .sort((a: SkillType, b: SkillType) => a.order - b.order)
        .map(transformSkillType);

      return {
        name: type.name,
        metadata: {
          icon: type.icon || "",
        },
        children: childNodes,
      };
    }

    // Regular skill type with skills (SkillItems)
    return transformSkillType(type);
  });

  // Split in half for 2-column layout
  const midpoint = Math.ceil(transformedTypes.length / 2);
  const firstHalf = transformedTypes.slice(0, midpoint);
  const secondHalf = transformedTypes.slice(midpoint);

  return {
    skills1: {
      name: "Skills",
      children: firstHalf,
    },
    skills2: {
      name: "Skills",
      children: secondHalf,
    },
  };
}

/**
 * Helper function to count all technologies from skills data
 * (Matching main branch implementation)
 */
export const countAllTechnologies = (skills1: SkillNode, skills2: SkillNode) => {
  const countSkillsRecursively = (skillNode: SkillNode): number => {
    let count = 0;

    if (skillNode.children && skillNode.children.length > 0) {
      // If it has children, count them recursively
      skillNode.children.forEach((child: SkillNode) => {
        count += countSkillsRecursively(child);
      });
    } else {
      // If it's a leaf node (no children), count it as 1 technology
      count = 1;
    }

    return count;
  };

  // Count technologies from both skill trees
  const skills1Count = skills1.children?.reduce((total, category) => {
    return total + countSkillsRecursively(category);
  }, 0) || 0;

  const skills2Count = skills2.children?.reduce((total, category) => {
    return total + countSkillsRecursively(category);
  }, 0) || 0;

  return skills1Count + skills2Count;
};
