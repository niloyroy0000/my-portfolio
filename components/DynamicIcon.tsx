import React, { memo } from "react";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import { convertToIconify } from "@/lib/iconify-converter";

// Import custom icon components
const CursorIcon = dynamic(() => import("./icons/CursorIcon"), {
  ssr: true,
  loading: () => (
    <div className="w-4 h-4 bg-secondary-default/30 animate-pulse rounded-sm"></div>
  ),
});

const GoogleAIStudioIcon = dynamic(() => import("./icons/GoogleAIStudioIcon"), {
  ssr: true,
  loading: () => (
    <div className="w-4 h-4 bg-secondary-default/30 animate-pulse rounded-sm"></div>
  ),
});

const ClaudeAIIcon = dynamic(() => import("./icons/ClaudeAIIcon"), {
  ssr: true,
  loading: () => (
    <div className="w-4 h-4 bg-secondary-default/30 animate-pulse rounded-sm"></div>
  ),
});

const PlaywrightIcon = dynamic(() => import("./icons/PlaywrightIcon"), {
  ssr: true,
  loading: () => (
    <div className="w-4 h-4 bg-secondary-default/30 animate-pulse rounded-sm"></div>
  ),
});

const MCPIcon = dynamic(() => import("./icons/MCPIcon"), {
  ssr: true,
  loading: () => (
    <div className="w-4 h-4 bg-secondary-default/30 animate-pulse rounded-sm"></div>
  ),
});

interface DynamicIconProps {
  iconName: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * DynamicIcon - Renders icons from database using Iconify
 *
 * This component accepts react-icons style names (e.g., "FaReact", "SiTypescript")
 * and converts them to Iconify format for rendering.
 *
 * Previously used react-icons with lazy loading (~30 MB bundle).
 * Now uses @iconify/react with on-demand loading (~50 KB + ~1 KB per icon).
 *
 * @example
 * <DynamicIcon iconName="FaReact" className="text-cyan-400" />
 */
const DynamicIcon: React.FC<DynamicIconProps> = memo(
  ({
    iconName,
    className = "mr-3 text-secondary-default",
    fallback = (
      <div
        className={className}
        style={{
          width: "1em",
          height: "1em",
          backgroundColor: "currentColor",
          borderRadius: "2px",
        }}
      />
    ),
  }) => {
    // Special case for custom SVG component icons
    if (iconName === "Cursor") {
      return <CursorIcon className={className} />;
    }

    if (iconName === "GoogleAIStudio") {
      return <GoogleAIStudioIcon className={className} />;
    }

    if (iconName === "ClaudeAI") {
      return <ClaudeAIIcon className={className} />;
    }

    if (iconName === "Playwright") {
      return <PlaywrightIcon className={className} />;
    }

    if (iconName === "MCP") {
      return <MCPIcon className={className} />;
    }

    // Convert react-icons name to Iconify format
    const iconifyName = convertToIconify(iconName);

    // If conversion failed (returns same name), show fallback
    if (iconifyName === iconName && !iconifyName.includes(":")) {
      console.warn(`Icon ${iconName} not found, using fallback`);
      return <>{fallback}</>;
    }

    // Render using Iconify (loads on-demand)
    return (
      <Icon
        icon={iconifyName}
        className={className}
        style={{
          width: "1em",
          height: "1em",
        }}
      />
    );
  }
);

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
