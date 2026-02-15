"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface CanonicalUrlProps {
  customPath?: string;
}

/**
 * Component to add canonical URL meta tag to prevent duplicate content issues
 * @param customPath - Optional custom path to override the current URL
 */
const CanonicalUrl = ({ customPath }: CanonicalUrlProps) => {
  const pathname = usePathname();
  const baseUrl = 'https://biswajitpanday.github.io';
  const canonicalUrl = customPath ? `${baseUrl}${customPath}` : `${baseUrl}${pathname}`;

  // Using Script component to insert the canonical tag since Next.js App Router
  // doesn't support the Head component from earlier Next.js versions
  return (
    <Script id="canonical-url" strategy="afterInteractive">
      {`
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = '${canonicalUrl}';
        document.head.appendChild(link);
      `}
    </Script>
  );
};

export default CanonicalUrl; 