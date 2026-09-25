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
 * Synchronously checks if health map is in memory or local storage.
 * Eliminates double-renders on page switches!
 */
export function getSyncCachedHealthMap(): Record<string, SiteResult> | null {
  if (typeof window === "undefined") {
    return null;
  }
  const now = Date.now();
  if (memoryHealthMap && now - lastFetchTime < ONE_DAY_MS) {
    return memoryHealthMap;
  }

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
    // Ignore private browsing error
  }

  return memoryHealthMap;
}

function resolveUrlsMap(urls: string[], safeMap: Record<string, SiteResult> | null): Record<string, SiteResult> {
  if (!urls || urls.length === 0) return {};
  const map = safeMap || {};
  const output: Record<string, SiteResult> = {};
  for (const url of urls) {
    if (!url) continue;
    if (map[url]) {
      output[url] = map[url];
    } else {
      const trimmed = url.replace(/\/+$/, "");
      const alt = map[trimmed] || map[trimmed + "/"];
      if (alt) {
        output[url] = { ...alt, url };
      } else {
        output[url] = { url, status: "up" };
      }
    }
  }
  return output;
}

/**
 * Loads the daily site health registry safely.
 */
async function getDailyHealthMap(): Promise<Record<string, SiteResult>> {
  if (typeof window === "undefined") {
    return {};
  }

  const cached = getSyncCachedHealthMap();
  if (cached && Object.keys(cached).length > 0) {
    return cached;
  }

  const now = Date.now();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

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
        // Safe quota ignore
      }

      return mapped;
    }
  } catch {
    // Graceful fallback
  }

  return memoryHealthMap || {};
}

/**
 * Updates site health status dynamically in memory and storage,
 * and notifies active components to re-render in 0ms.
 */
export function setSiteHealthOverride(
  url: string,
  status: "up" | "down",
  latency?: number,
  updatedUrl?: string
) {
  if (!url) return;
  const now = Date.now();
  if (!memoryHealthMap) memoryHealthMap = getSyncCachedHealthMap() || {};
  memoryHealthMap[url] = {
    url,
    status,
    latency,
    updatedUrl,
    checkedAt: now,
  };

  const cleanUrl = url.replace(/\/+$/, "");
  memoryHealthMap[cleanUrl] = memoryHealthMap[url];
  memoryHealthMap[cleanUrl + "/"] = memoryHealthMap[url];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: now, sites: memoryHealthMap }));
  } catch {}

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fwsf-health-update", { detail: { url, status } }));
  }
}

/**
 * useUptimeChecker
 *
 * Butter-smooth, zero-jank uptime checker:
 * - Synchronously populates with in-memory health map on category changes.
 * - Reacts immediately when a site goes down or comes back up.
 */
export function useUptimeChecker(urls: string[]): Record<string, SiteResult> {
  const [results, setResults] = useState<Record<string, SiteResult>>(() => {
    const cached = getSyncCachedHealthMap();
    if (cached) {
      return resolveUrlsMap(urls, cached);
    }
    return {};
  });

  useEffect(() => {
    let isMounted = true;

    if (!Array.isArray(urls) || urls.length === 0) {
      return;
    }

    const cached = getSyncCachedHealthMap();
    if (cached && Object.keys(cached).length > 0) {
      setResults(resolveUrlsMap(urls, cached));
      return;
    }

    getDailyHealthMap()
      .then((healthMap) => {
        if (!isMounted) return;
        setResults(resolveUrlsMap(urls, healthMap));
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [urls]);

  // Listen for real-time uptime status overrides
  useEffect(() => {
    const handleUpdate = () => {
      const cached = getSyncCachedHealthMap();
      if (cached) {
        setResults(resolveUrlsMap(urls, cached));
      }
    };
    window.addEventListener("fwsf-health-update", handleUpdate);
    return () => window.removeEventListener("fwsf-health-update", handleUpdate);
  }, [urls]);

  return results;
}
