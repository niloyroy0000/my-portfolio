"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  /** Fallback image source when main image fails to load */
  fallback?: string;
  /** Custom fallback component to render on error */
  fallbackComponent?: React.ReactNode;
  /** Callback when image fails to load */
  onError?: () => void;
}

/**
 * SafeImage Component
 *
 * Enhanced Next.js Image component with error handling and fallback support.
 * Created as Priority 4.2 for improved error handling across the app.
 *
 * Features:
 * - Automatic fallback to placeholder on load error
 * - Custom fallback image support
 * - Custom fallback component support
 * - Error callback for tracking
 * - Maintains all Next.js Image optimization benefits
 *
 * @param fallback - URL of fallback image (default: gray placeholder)
 * @param fallbackComponent - Custom React component to show on error
 * @param onError - Callback when image fails
 * @param ...imageProps - All standard Next.js Image props
 *
 * @example
 * ```tsx
 * <SafeImage
 *   src="/profile.jpg"
 *   alt="Profile"
 *   fallback="/placeholder.png"
 *   width={200}
 *   height={200}
 * />
 * ```
 */
const SafeImage: React.FC<SafeImageProps> = ({
  fallback,
  fallbackComponent,
  onError,
  alt,
  ...imageProps
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // If custom fallback component provided and error occurred, show it
  if (hasError && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // If error occurred and fallback image provided, show fallback
  if (hasError && fallback) {
    return (
      <Image
        {...imageProps}
        src={fallback}
        alt={alt || "Fallback image"}
        onError={() => {
          // Prevent infinite loop if fallback also fails
          console.error('Fallback image also failed to load:', fallback);
        }}
      />
    );
  }

  // If error occurred and no fallback, show default gray placeholder
  if (hasError) {
    const width = typeof imageProps.width === 'number' ? imageProps.width : 400;
    const height = typeof imageProps.height === 'number' ? imageProps.height : 300;

    return (
      <div
        className="bg-gray-800 flex items-center justify-center rounded-lg"
        style={{ width: `${width}px`, height: `${height}px` }}
        role="img"
        aria-label={alt || "Image failed to load"}
      >
        <svg
          className="w-1/4 h-1/4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // Normal image rendering
  return (
    <Image
      {...imageProps}
      alt={alt || "Image"}
      onError={handleError}
    />
  );
};

export default SafeImage;
