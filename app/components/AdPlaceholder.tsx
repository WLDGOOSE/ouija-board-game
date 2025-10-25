"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export default function AdPlaceholder() {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    if (typeof window === "undefined") return;

    const init = () => {
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        pushedRef.current = true;
      } catch (e) {
        // noop
      }
    };

    if ((window as any).adsbygoogle && Array.isArray((window as any).adsbygoogle)) {
      init();
    } else {
      const t = setInterval(() => {
        if ((window as any).adsbygoogle && Array.isArray((window as any).adsbygoogle)) {
          init();
          clearInterval(t);
        }
      }, 300);
      const timeout = setTimeout(() => clearInterval(t), 8000);
      return () => {
        clearInterval(t);
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <>
      <Script
        id="adsense-script"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8618260259664925"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      <ins
        ref={adRef as any}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "100px" }}
        data-ad-client="ca-pub-8618260259664925"
        data-ad-slot="7415713367"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}