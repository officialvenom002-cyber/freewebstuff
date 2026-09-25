"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Monetag CPM & Frequency Capping Guardian
 *
 * Rules enforced:
 * 1. Strict 24-Hour Cap: Max 2 ad triggers per user in 24 hours.
 * 2. Smart Pacing: Minimum 10 minutes between ad 1 and ad 2 to maximize user engagement & eCPM.
 * 3. Zero Ads for Admins: Completely disabled on admin routes (/adminshobhit, /shobhitadmin).
 * 4. Intercepts both window.open and synthetic anchor tag click handlers in capture phase.
 */
export default function MonetagGuardian() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Never trigger ads on admin dashboards
    if (pathname.includes("admin") || pathname.includes("shobhit")) {
      return;
    }

    const STORAGE_KEY = "fwsf_ad_caps_v1";
    const MAX_ADS_24H = 2;
    const WINDOW_24H = 24 * 60 * 60 * 1000; // 24 hours
    const MIN_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes pacing

    function getValidTimestamps(): number[] {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        const now = Date.now();
        return parsed.filter((t) => typeof t === "number" && now - t < WINDOW_24H);
      } catch {
        return [];
      }
    }

    function recordImpression() {
      try {
        const valid = getValidTimestamps();
        valid.push(Date.now());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
      } catch {}
    }

    function canShowAd(): boolean {
      const valid = getValidTimestamps();
      // 1. Max 2 in 24h
      if (valid.length >= MAX_ADS_24H) {
        return false;
      }
      // 2. Minimum 10-minute cooldown between ad 1 and ad 2
      if (valid.length > 0) {
        const lastAd = Math.max(...valid);
        if (Date.now() - lastAd < MIN_INTERVAL_MS) {
          return false;
        }
      }
      return true;
    }

    // Intercept window.open
    const originalOpen = window.open;
    window.open = function (url?: string | URL, target?: string, features?: string) {
      const urlStr = String(url || "");

      // Allow internal links freely
      const isInternal =
        urlStr.startsWith("/") ||
        urlStr.includes("freewebstuff.site") ||
        urlStr.includes("localhost") ||
        urlStr.includes("t.me") ||
        urlStr.includes("discord.gg");

      if (isInternal) {
        return originalOpen.call(window, url, target, features);
      }

      // External popup / ad
      if (!canShowAd()) {
        return null;
      }

      recordImpression();
      return originalOpen.call(window, url, target, features);
    };

    // Intercept synthetic anchor clicks (used by some popunder scripts)
    const handleCaptureClick = (e: MouseEvent) => {
      let el = e.target as HTMLElement | null;
      while (el && el.tagName !== "A") {
        el = el.parentElement;
      }
      if (el && el.tagName === "A") {
        const href = (el as HTMLAnchorElement).href;
        if (!href) return;

        const isAd =
          href.includes("quge5.com") ||
          href.includes("3nbf4.com") ||
          href.includes("5gvci.com") ||
          href.includes("onclick");

        if (isAd) {
          if (!canShowAd()) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          recordImpression();
        }
      }
    };

    document.addEventListener("click", handleCaptureClick, true);

    return () => {
      window.open = originalOpen;
      document.removeEventListener("click", handleCaptureClick, true);
    };
  }, [pathname]);

  return null;
}
