"use client";

import { useState, useEffect } from "react";

export type SiteStatus = "unknown" | "checking" | "up" | "down";

export interface SiteResult {
  url: string;
  status: SiteStatus;
  httpStatus?: number;
  latency?: number;
  updatedUrl?: string; // Auto-detected redirected domain
  checkedAt?: number;
}

interface DailyHealthPayload {
  generatedAt?: string;
  timestamp?: number;
  sites?: Record<
    string,
    {
      status: "up" | "down";
      httpStatus?: number;
      latency?: number;
      updatedUrl?: string;
      checkedAt?: number;
    }
  >;
}

const STORAGE_KEY = "fwsf-daily-health-v1";
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory module cache across component re-renders
let memoryHealthMap: Record<string, SiteResult> | null = null;
let lastFetchTime = 0;

/**
 * Loads the daily site health registry safely.
 * Complete fail-safe guarantees:
 * - Never throws in SSR or client environments.
 * - Never blocks page load or rendering.
 * - 3-second timeout on health fetch.
 * - Falls back seamlessly to normal site operation if offline or unavailable.
 */
async function getDailyHealthMap(): Promise<Record<string, SiteResult>> {
  if (typeof window === "undefined") {
    return {};
  }

  const now = Date.now();

  if (memoryHealthMap && now - lastFetchTime < ONE_DAY_MS) {
    return memoryHealthMap;
  }

  // Check localStorage safely
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed: { timestamp?: number; sites?: Record<string, SiteResult> } = JSON.parse(local);
      if (parsed?.timestamp && now - parsed.timestamp < ONE_DAY_MS && parsed?.sites) {
        memoryHealthMap = parsed.sites;
        lastFetchTime = parsed.timestamp;
        return parsed.sites;
      }
    }
  } catch {
    // Ignore private browsing or localStorage disabled errors
  }

  // Fetch daily pre-compiled static registry with strict 3-second abort
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("/data/site-health.json", {
      cache: "default",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    clearTimeout(timer);

    if (res.ok) {
      const payload: DailyHealthPayload = await res.json();
      const mapped: Record<string, SiteResult> = {};

      if (payload && payload.sites && typeof payload.sites === "object") {
        for (const [url, item] of Object.entries(payload.sites)) {
          if (!url || !item) continue;
          mapped[url] = {
            url,
            status: item.status || "up",
            httpStatus: item.httpStatus,
            latency: item.latency,
            updatedUrl: item.updatedUrl && item.updatedUrl !== url ? item.updatedUrl : undefined,
            checkedAt: item.checkedAt || now,
          };
        }
      }

      memoryHealthMap = mapped;
      lastFetchTime = now;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: now, sites: mapped }));
      } catch {
        // Storage quota full — safely ignore
      }

      return mapped;
    }
  } catch {
    // Network offline, timeout, or missing file — gracefully fallback
  }

  return memoryHealthMap || {};
}

/**
 * useUptimeChecker
 *
 * Daily low-resource, zero-risk hook:
 * - Checks run ONCE daily via pre-compiled static health registry.
 * - Visitors NEVER make live external server requests.
 * - Completely immune to external outages or network failures.
 */
export function useUptimeChecker(urls: string[]): Record<string, SiteResult> {
  const [results, setResults] = useState<Record<string, SiteResult>>({});

  useEffect(() => {
    let isMounted = true;

    if (!Array.isArray(urls) || urls.length === 0) {
      return;
    }

    getDailyHealthMap()
      .then((healthMap) => {
        if (!isMounted) return;

        const safeMap = healthMap || {};
        const output: Record<string, SiteResult> = {};

        for (const url of urls) {
          if (!url) continue;

          if (safeMap[url]) {
            output[url] = safeMap[url];
          } else {
            const trimmed = url.replace(/\/+$/, "");
            const alt = safeMap[trimmed] || safeMap[trimmed + "/"];
            if (alt) {
              output[url] = { ...alt, url };
            } else {
              // Default to healthy "up" — never break site display
              output[url] = { url, status: "up" };
            }
          }
        }

        setResults(output);
      })
      .catch(() => {
        // Any unexpected error is safely caught — all sites remain displayed normally
      });

    return () => {
      isMounted = false;
    };
  }, [urls.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return results;
}
