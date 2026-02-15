"use client";

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Type declaration for gtag
declare const gtag: (
  command: 'config' | 'event',
  targetId: string,
  config?: Record<string, unknown>
) => void;

const GoogleAnalytics = () => {
  const GA_MEASUREMENT_ID = 'G-JG3RM88C15';
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, GA_MEASUREMENT_ID]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics; 