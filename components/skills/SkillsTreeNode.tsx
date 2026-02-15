import React from 'react';
import DynamicIcon from '@/components/DynamicIcon';

// Node classes matching main branch
const NODE_CLASSES = {
  parent: "text-base sm:text-lg font-bold leading-none group cursor-pointer transition-all duration-300 mb-1.5 sm:mb-2 mt-1 hover:bg-white/5 p-1.5 sm:p-2 rounded",
  child: "text-xs sm:text-sm text-white/70 group hover:text-white/90 hover:bg-white/5 transition-all duration-300 mb-1 p-1 rounded cursor-default",
  highlighted: "bg-secondary-default/20 border border-secondary-default/40 rounded",
  parentText: "bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
} as const;

// Proficiency level to color bar mapping
const levelToBarColor = {
  'Expert': 'bg-gradient-to-r from-purple-500 to-pink-500',
  'Advanced': 'bg-emerald-500',
  'Intermediate': 'bg-blue-500',
  'Familiar': 'bg-slate-500',
};

const levelToBarWidth = {
  'Expert': 'w-full',
  'Advanced': 'w-3/4',
  'Intermediate': 'w-1/2',
  'Familiar': 'w-1/4',
};

interface SkillsTreeNodeProps {
  element: any;
  getNodeProps: () => any;
  level: number;
  style: React.CSSProperties;
  isHighlighted: boolean;
}

/**
 * Tree node renderer for Skills TreeView
 * Handles both parent nodes (categories) and child nodes (skills)
 * Shows proficiency bars and hover metadata for skills
 */
export const SkillsTreeNode = React.memo<SkillsTreeNodeProps>(({
  element,
  getNodeProps,
  level,
  style,
  isHighlighted
}) => {
  const isParent = element.children.length > 0;
  const iconName = element.metadata?.icon || "FaCode";
  const nodeProps = getNodeProps();

  const baseClassName = isParent ? NODE_CLASSES.parent : NODE_CLASSES.child;
  const className = isHighlighted ? `${baseClassName} ${NODE_CLASSES.highlighted}` : baseClassName;

  // Get metadata for child nodes
  const proficiencyLevel = element.metadata?.level;
  const yearsOfExperience = element.metadata?.yearsOfExperience;
  const lastUsed = element.metadata?.lastUsed;

  return (
    <div
      {...nodeProps}
      style={style}
      className={`${className} group/skill`}
    >
      {/* Main content row */}
      <div className="flex items-center flex-1 min-w-0">
        <DynamicIcon
          iconName={iconName}
          className={`mr-2.5 flex-shrink-0 ${isParent ? "text-secondary-default" : "text-secondary-default/80"}`}
        />
        <span className={`select-none ${isParent ? NODE_CLASSES.parentText : ""}`}>{element.name}</span>

        {/* Category skill count for parent nodes */}
        {isParent && element.children && element.children.length > 0 && (
          <span className="ml-2 text-xs text-white/40 font-mono">
            ({element.children.length})
          </span>
        )}

        {isHighlighted && (
          <span className="inline-flex items-center justify-center h-5 ml-2 text-[10px] bg-secondary-default/30 text-secondary-default px-1.5 rounded font-medium flex-shrink-0">
            Match
          </span>
        )}
      </div>

      {/* Right-aligned section for skill nodes - Proficiency bar + hover metadata */}
      {!isParent && proficiencyLevel && (
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Metadata badges - Hidden by default, shown on hover */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-200">
            {yearsOfExperience && (
              <span className="text-[10px] text-white/60 font-mono bg-white/10 px-1.5 py-0.5 rounded">
                {yearsOfExperience}y
              </span>
            )}
            {lastUsed && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                lastUsed === 'Current'
                  ? 'text-emerald-400 bg-emerald-500/15'
                  : 'text-white/50 bg-white/10'
              }`}>
                {lastUsed === 'Current' ? 'Active' : lastUsed}
              </span>
            )}
          </div>

          {/* Proficiency Bar - Always visible, larger indicator */}
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden" title={proficiencyLevel}>
            <div
              className={`h-full rounded-full ${levelToBarColor[proficiencyLevel as keyof typeof levelToBarColor]} ${levelToBarWidth[proficiencyLevel as keyof typeof levelToBarWidth]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
});

SkillsTreeNode.displayName = 'SkillsTreeNode';
