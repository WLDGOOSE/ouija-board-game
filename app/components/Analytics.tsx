'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function RouteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams.toString()}`;
    if (window.gtag) {
      window.gtag('config', 'G-ELY8QW1VPW', {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
