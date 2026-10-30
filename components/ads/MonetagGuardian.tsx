"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * AdFreeEnforcer
 *
 * Enforces the strict rule from AGENTS.md:
 * 1. /support, /donate, /benefits, /admin* MUST REMAIN 100% AD-FREE.
 * 2. On regular pages: Zero DOM interference, zero window.open hijacking, zero layout lag.
 */
export default function MonetagGuardian() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isAdFree =
      pathname.includes("admin") ||
      pathname.includes("shobhit") ||
      pathname === "/support" ||
      pathname.startsWith("/support/") ||
      pathname === "/donate" ||
      pathname.startsWith("/donate/") ||
      pathname === "/benefits" ||
      pathname.startsWith("/benefits/");

    if (isAdFree) {
      let styleEl = document.getElementById("support-ad-hider") as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "support-ad-hider";
        styleEl.textContent = `
          [id^="at-"], [id^="at_"], [class*="adsterra"], [id*="adsterra"],
          [class*="monetag"], [id*="monetag"], .at-cv-lightbox,
          [id^="container-940525"], [id^="asg_"],
          iframe[src*="adsboosters"], iframe[src*="yirrsxanthan"],
          iframe[src*="quge5"], iframe[src*="bibleearthquake"],
          iframe[src*="alwingulla"], iframe[src*="5gvci"], div[id^="AdsCore"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
          }
        `;
        document.head.appendChild(styleEl);
      }

      // One-time cleanup of active ad elements on support/admin pages
      try {
        const adNodes = document.querySelectorAll(
          'iframe[src*="adsboosters"], iframe[src*="yirrsxanthan"], div[id^="AdsCore"], #profiton-pops-159999'
        );
        adNodes.forEach((node) => node.remove());
      } catch {}

      return () => {
        const style = document.getElementById("support-ad-hider");
        if (style) style.remove();
      };
    } else {
      const style = document.getElementById("support-ad-hider");
      if (style) style.remove();
    }
  }, [pathname]);

  return null;
}
