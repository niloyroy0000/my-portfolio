import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Small interactive badge component for filters and clickable tags
 *
 * @component Badge (Shadcn UI)
 *
 * @description
 * This is the FILTER badge component for interactive UI elements. Use this for:
 * - Filter tags in ProjectsFilter, SkillsFilter, CertificationFilter
 * - Toggleable options in filter panels
 * - Clickable tags that change state
 * - Compact indicators that need user interaction
 *
 * DO NOT use for:
 * - Large display badges (use @/components/Badge instead - decorative, prominent)
 * - Role/category labels that are purely visual
 * - Non-interactive decorative badges
 *
 * @example
 * ```tsx
 * <Badge
 *   variant={isSelected ? "default" : "outline"}
 *   onClick={() => setSelected(!isSelected)}
 * >
 *   Filter Option
 * </Badge>
 * ```
 *
 * @features
 * - Based on Shadcn UI with Class Variance Authority (CVA)
 * - 4 variants: default, secondary, destructive, outline
 * - Clickable with onClick support
 * - Size: px-2.5 py-0.5 (smaller, compact)
 * - Focus ring for accessibility
 * - Used extensively in filter components
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-secondary-default text-primary hover:bg-secondary-default/80",
        secondary:
          "border-transparent bg-secondary-default/30 text-secondary-default hover:bg-secondary-default/40",
        destructive:
          "border-transparent bg-red-500/10 text-red-500 hover:bg-red-500/20",
        outline:
          "text-white/80 border-white/10 hover:bg-white/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }; 