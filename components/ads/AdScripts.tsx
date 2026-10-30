"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * AdScripts Component
 * 
 * Exclusively loads the high-CPM Stake / AdsCore engine.
 * Both Adsterra and Monetag have been completely removed as requested.
 * 
 * STRICT AD-FREE RULES:
 * - Completely disabled on /support, /donate, and /benefits routes so donors and supporters have a 100% clean, ad-free experience.
 * - Completely disabled on /admin, /shobhitadmin, and /adminshobhit routes.
 * - Active on all general directory, category, search, and resource pages.
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
      // If a user navigates to an ad-free route, aggressively purge any active third-party ad scripts, iframes, and DOM widgets
      try {
        const adSelectors = [
          "#AdsCoreLoader106969",
          'script[src*="adsboosters"]',
          'iframe[src*="adsboosters"]',
          'div[id^="AdsCore"]',
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
      {/* Preconnect for Stake / AdsCore */}
      <link rel="preconnect" href="https://sads.adsboosters.xyz" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://sads.adsboosters.xyz" />

      {/* Stake / AdsCore High-CPM Engine */}
      <Script
        id="AdsCoreLoader106969"
        strategy="afterInteractive"
        src="https://sads.adsboosters.xyz/7d5d63b1d7a48601a1a774c8e8d4a88a.js"
        data-cfasync="false"
      />
    </>
  );
}
