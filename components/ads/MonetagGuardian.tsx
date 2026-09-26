"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Maximum-eCPM Programmatic Ad Orchestrator
 *
 * Designed to maximize publisher revenue (eCPM) while preventing runaway popup loops:
 * 1. High-Value Priority: Never blocks premium Stake / AdsCore or Tier-1 initial impressions.
 * 2. Natural Pacing (45s): Eliminates punitive 10-minute cooldowns that suppress DSP bidder auction rates.
 * 3. 24-Hour Cap (8 impressions): Allows returning visitors to trigger high-paying impressions throughout the day.
 * 4. 100% Ad-Free on Admin Routes: Zero ads on /admin*, /shobhitadmin.
 */
export default function MonetagGuardian() {
  const pathname = usePathname();
  const sessionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === "undefined") return;

    sessionStartRef.current = Date.now();

    // 100% ad-free on admin dashboards
    if (pathname.includes("admin") || pathname.includes("shobhit")) {
      return;
    }

    const STORAGE_KEY = "fwsf_ad_caps_v2";
    const MAX_ADS_24H = 8; // Max 8 impressions per 24h
    const WINDOW_24H = 24 * 60 * 60 * 1000; // 24 hours
    const MIN_INTERVAL_MS = 45 * 1000; // 45 seconds pacing between popunders

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

    function canTriggerPopunder(urlStr: string): boolean {
      // Always allow high-value Stake / AdsCore / direct sponsor bids
      if (
        urlStr.includes("adsboosters") ||
        urlStr.includes("stake") ||
        urlStr.includes("sads.") ||
        urlStr.includes("bibleearthquake")
      ) {
        return true;
      }

      const valid = getValidTimestamps();
      // Cap at 8 in 24 hours
      if (valid.length >= MAX_ADS_24H) {
        return false;
      }

      // 45 seconds minimum spacing between popunders
      if (valid.length > 0) {
        const lastAd = Math.max(...valid);
        if (Date.now() - lastAd < MIN_INTERVAL_MS) {
          return false;
        }
      }
      return true;
    }

    // Intercept window.open smoothly
    const originalOpen = window.open;
    window.open = function (url?: string | URL, target?: string, features?: string) {
      const urlStr = String(url || "");

      // Internal / community links
      const isInternal =
        urlStr.startsWith("/") ||
        urlStr.includes("freewebstuff.site") ||
        urlStr.includes("localhost") ||
        urlStr.includes("t.me") ||
        urlStr.includes("discord.gg");

      if (isInternal) {
        return originalOpen.call(window, url, target, features);
      }

      // External ad popup
      if (!canTriggerPopunder(urlStr)) {
        return null;
      }

      recordImpression();
      return originalOpen.call(window, url, target, features);
    };

    return () => {
      window.open = originalOpen;
    };
  }, [pathname]);

  return null;
}
