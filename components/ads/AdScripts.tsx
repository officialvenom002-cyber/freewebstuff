"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * AdScripts Component
 * 
 * Conditionally loads programmatic third-party ad scripts (AdsCore, Monetag, Adsterra).
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
          "#monetag-multitag",
          "#adsterra-social-bar",
          "#adsterra-inpage",
          "#monetag-sw-register",
          'script[src*="adsboosters"]',
          'script[src*="quge5"]',
          'script[src*="bibleearthquake"]',
          'script[src*="alwingulla"]',
          'script[src*="5gvci"]',
          'iframe[src*="adsboosters"]',
          'iframe[src*="quge5"]',
          'iframe[src*="bibleearthquake"]',
          'iframe[src*="alwingulla"]',
          'iframe[src*="5gvci"]',
          '[id^="at-"]',
          '[id^="at_"]',
          '[class*="adsterra"]',
          '[id*="adsterra"]',
          '[class*="monetag"]',
          '[id*="monetag"]',
          ".at-cv-lightbox",
          '[id^="container-940525"]',
          '[id^="asg_"]',
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
      {/* Preconnect only on ad-enabled routes */}
      <link rel="preconnect" href="https://sads.adsboosters.xyz" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://sads.adsboosters.xyz" />
      <link rel="preconnect" href="https://bibleearthquake.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://bibleearthquake.com" />
      <link rel="preconnect" href="https://quge5.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://alwingulla.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://alwingulla.com" />
      <link rel="preconnect" href="https://5gvci.com" crossOrigin="anonymous" />

      {/* 1. AdsCore / Stake High-CPM Engine */}
      <Script
        id="AdsCoreLoader106969"
        strategy="afterInteractive"
        src="https://sads.adsboosters.xyz/7d5d63b1d7a48601a1a774c8e8d4a88a.js"
        data-cfasync="false"
      />

      {/* 2. Monetag MultiTag (Zone 286666) */}
      <Script
        id="monetag-multitag"
        strategy="afterInteractive"
        src="https://quge5.com/88/tag.min.js"
        data-zone="286666"
        data-cfasync="false"
      />

      {/* 3. Adsterra Social Bar & Popunder */}
      <Script
        id="adsterra-social-bar"
        strategy="afterInteractive"
        src="https://bibleearthquake.com/b7/ae/5a/b7ae5af830f6bf0bc3210b84a8a94fe7.js"
        data-cfasync="false"
      />

      {/* 4. Adsterra In-Page Direct */}
      <Script
        id="adsterra-inpage"
        strategy="afterInteractive"
        src="https://bibleearthquake.com/0e/99/fa/0e99fa0311152f33953e4d7b110510ee.js"
        data-cfasync="false"
      />

      {/* 5. Service Worker Auto-Registration for Monetag Push Notifications */}
      <Script
        id="monetag-sw-register"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== "undefined" && "serviceWorker" in navigator) {
              window.addEventListener("load", function() {
                navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function(){});
              });
            }
          `,
        }}
      />
    </>
  );
}
