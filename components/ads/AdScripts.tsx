"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * AdScripts Component
 * 
 * Exclusively loads the verified ProfitOn High-CPM Pops Zone (159999).
 * Loaded via `lazyOnload` to ensure 0ms main thread blocking and lightning-fast user interactions.
 * 
 * STRICT AD-FREE RULES:
 * - Completely disabled on /support, /donate, and /benefits routes.
 * - Completely disabled on /admin, /shobhitadmin, and /adminshobhit routes.
 * - Active on general directory and category pages.
 */
export default function AdScripts() {
  const pathname = usePathname();

  // 100% Ad-Free on Admin and Support / Donation / Payment pages
  const isAdFree =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/shobhitadmin") ||
    pathname.startsWith("/adminshobhit") ||
    pathname.includes("admin") ||
    pathname.includes("shobhit") ||
    pathname === "/support" ||
    pathname.startsWith("/support/") ||
    pathname === "/donate" ||
    pathname.startsWith("/donate/") ||
    pathname === "/benefits" ||
    pathname.startsWith("/benefits/");

  useEffect(() => {
    if (isAdFree && typeof window !== "undefined") {
      try {
        const adSelectors = [
          "#profiton-pops-159999",
          'script[src*="yirrsxanthan"]',
          'iframe[src*="yirrsxanthan"]',
        ];

        document.querySelectorAll(adSelectors.join(",")).forEach((el) => {
          try {
            el.remove();
          } catch {}
        });
      } catch {}
    }
  }, [isAdFree, pathname]);

  if (isAdFree) {
    return null;
  }

  return (
    <>
      {/* High-speed CDN preconnect for ProfitOn Edge */}
      <link rel="preconnect" href="https://bs.yirrsxanthan.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://bs.yirrsxanthan.com" />

      {/* ProfitOn Verified Pops High-CPM Engine (Zone: 159999) */}
      <Script
        id="profiton-pops-159999"
        strategy="lazyOnload"
        src="https://bs.yirrsxanthan.com/ri1xL2wAaH3bs24v/159999"
        data-cfasync="false"
      />
    </>
  );
}
