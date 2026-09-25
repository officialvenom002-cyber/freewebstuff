"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * High-eCPM Programmatic Guardian
 *
 * Designed to maximize publisher revenue (eCPM) while maintaining premium UX:
 * 1. Strict 24-Hour Cap: Max 2 ad triggers per user in 24 hours (preserves top-tier advertiser bids).
 * 2. Smart Pacing: 10-minute cooldown between Ad #1 and Ad #2 to command fresh auction bids.
 * 3. Dwell-Time Quality Gate: Requires at least 4 seconds of page dwell time or active scroll
 *    before permitting any ad trigger. Prevents instant bounce penalties and qualifies traffic
 *    for premium Tier-1 advertiser rates ($15-$45+ CPM).
 * 4. Active Tab Visibility: Only permits triggers when document is actively visible.
 * 5. 100% Ad-Free on Admin Routes: Zero ads on /admin*, /shobhitadmin.
 */
export default function MonetagGuardian() {
  const pathname = usePathname();
  const sessionStartRef = useRef<number>(Date.now());
  const userInteractedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reset session start on page change
    sessionStartRef.current = Date.now();

    // Never trigger ads on admin dashboards
    if (pathname.includes("admin") || pathname.includes("shobhit")) {
      return;
    }

    const STORAGE_KEY = "fwsf_ad_caps_v1";
    const MAX_ADS_24H = 2;
    const WINDOW_24H = 24 * 60 * 60 * 1000; // 24 hours
    const MIN_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes pacing
    const MIN_DWELL_MS = 4000; // 4 seconds dwell time to ensure high-intent quality score

    // Track genuine user interaction (scroll or mouse movement)
    const onUserInteraction = () => {
      userInteractedRef.current = true;
    };
    window.addEventListener("scroll", onUserInteraction, { passive: true, once: true });
    window.addEventListener("keydown", onUserInteraction, { passive: true, once: true });

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
      // Must be visible in foreground
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return false;
      }

      // Quality gate: Require 4s dwell time OR proven user interaction (scroll/key)
      const dwellTime = Date.now() - sessionStartRef.current;
      if (dwellTime < MIN_DWELL_MS && !userInteractedRef.current) {
        return false;
      }

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

    // Intercept window.open (used by popunders / new tab ads)
    const originalOpen = window.open;
    window.open = function (url?: string | URL, target?: string, features?: string) {
      const urlStr = String(url || "");

      // Allow internal links and community links freely
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

    // Intercept synthetic anchor clicks (used by onclick / popunder scripts)
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
          href.includes("bibleearthquake.com") ||
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
      window.removeEventListener("scroll", onUserInteraction);
      window.removeEventListener("keydown", onUserInteraction);
    };
  }, [pathname]);

  return null;
}
