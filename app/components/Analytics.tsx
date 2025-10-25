// Analytics.tsx - Server component for optimal loading and SEO

import Script from 'next/script';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-ELY8QW1VPW';

export function Analytics() {
  return (
    <>
      {/* Google Analytics measurement code - optimized for SEO and crawlability */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        id="gtag-script"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              transport_type: 'beacon',
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}

// Client component for route change tracking
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Type declaration for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function RouteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Skip tracking in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Construct the full URL with search parameters
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Send pageview with path
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
          transport_type: 'beacon'
        });
      } catch (error) {
        // Silent fail in production, log in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('Google Analytics tracking error:', error);
        }
      }
    }
  }, [pathname, searchParams]);

  return null;
}