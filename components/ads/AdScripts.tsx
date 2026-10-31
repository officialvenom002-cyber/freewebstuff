"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * AdScripts Component
 * 
 * Exclusively powers the two verified monetization engines:
 * 1. ProfitOn Popunder High-CPM Engine (Zone: 159999)
 * 2. Stake / AdsCore Engine
 * 
 * Loaded via `afterInteractive` for instant listener binding and maximum fill rate.
 * 
 * STRICT AD-FREE RULES (AGENTS.md):
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
          "#stake-adscore-106969",
          'script[src*="yirrsxanthan"]',
          'script[src*="adsboosters"]',
          'iframe[src*="yirrsxanthan"]',
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
      {/* High-speed CDN preconnects for instant auction and zero delay */}
      <link rel="preconnect" href="https://bs.yirrsxanthan.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://bs.yirrsxanthan.com" />
      <link rel="preconnect" href="https://sads.adsboosters.xyz" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://sads.adsboosters.xyz" />

      {/* 1. ProfitOn Verified Pops High-CPM Engine (Zone: 159999) */}
      <Script
        id="profiton-pops-159999"
        strategy="afterInteractive"
        src="https://bs.yirrsxanthan.com/ri1xL2wAaH3bs24v/159999"
        data-cfasync="false"
      />

      {/* 2. Stake / AdsCore High-CPM Engine */}
      <Script
        id="stake-adscore-106969"
        strategy="afterInteractive"
        src="https://sads.adsboosters.xyz/7d5d63b1d7a48601a1a774c8e8d4a88a.js"
        data-cfasync="false"
      />
    </>
  );
}
