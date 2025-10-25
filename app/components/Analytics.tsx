'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

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
    // Only track in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('config', 'G-ELY8QW1VPW', {
          page_path: url,
        });
      } catch (error) {
        console.error('Google Analytics tracking error:', error);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  return (
    <>
      {/* Google Tag Manager - Using Next.js Script component for optimal loading */}
      <Script
        id="gtag-script"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-ELY8QW1VPW"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ELY8QW1VPW');
          `,
        }}
      />
    </>
  );
}