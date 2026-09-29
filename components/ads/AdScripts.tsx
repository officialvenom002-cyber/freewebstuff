"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * AdScripts Component
 * 
 * Conditionally loads programmatic third-party ad scripts (AdsCore, Monetag, Adsterra).
 * 
 * STRICT AD-FREE RULES:
 * - Completely disabled on /support and /donate routes so donors and supporters have a 100% clean experience.
 * - Completely disabled on /admin and /shobhitadmin routes.
 */
export default function AdScripts() {
  const pathname = usePathname();

  // 100% Ad-Free on Admin and Support / Donation pages
  const isAdFree =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/shobhitadmin") ||
    pathname.includes("admin") ||
    pathname.includes("shobhit") ||
    pathname === "/support" ||
    pathname.startsWith("/support/") ||
    pathname === "/donate" ||
    pathname.startsWith("/donate/");

  if (isAdFree) {
    return null;
  }

  return (
    <>
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
    </>
  );
}
