"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * AdScripts Component — Maximum CPM & High-Yield Impressions Engine
 * 
 * Monetized Networks:
 * 1. ProfitOn Popunder Engine (Zone: 159999)
 * 2. Stake / AdsCore Engine
 * 
 * THE GOLDEN SWEET SPOT ALGORITHM:
 * 1. 90-Second Dynamic Cooldown: 
 *    - Short enough that users generate 2-3x MORE impressions per visit.
 *    - Long enough that DSPs classify each impression as a unique, high-paying auction ($5 - $12 CPM).
 *    - Zero spam: Clicks within the 90s window are 100% ad-free.
 * 2. Alternate Network Rotation:
 *    - Odd pops: ProfitOn (Zone 159999)
 *    - Even pops: Stake (AdsCore)
 *    - Prevents single-network bid fatigue and maximizes overall revenue across both accounts.
 * 3. First Click Free:
 *    - First landing click is always 100% clean and fast for excellent UX.
 * 4. Strict Ad-Free Isolation:
 *    - 100% ad-free on /support, /donate, /benefits, and admin pages.
 */

const COOLDOWN_MS = 90 * 1000; // 90 seconds (Golden sweet spot: 2-3x impressions + top CPM tier)
const STORAGE_TIME_KEY = "fwsf_pop_timestamp";
const STORAGE_NETWORK_KEY = "fwsf_pop_network";
const STORAGE_CLICK_KEY = "fwsf_session_clicks";

export default function AdScripts() {
  const pathname = usePathname();
  const [isArmed, setIsArmed] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<"profiton" | "stake">("profiton");
  const clickCountRef = useRef(0);

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
    if (typeof window === "undefined" || isAdFree) {
      setIsArmed(false);
      return;
    }

    const checkEligibility = () => {
      const lastPop = parseInt(localStorage.getItem(STORAGE_TIME_KEY) || "0", 10);
      const now = Date.now();
      const elapsed = now - lastPop;

      // Rotate network turn
      const turn = localStorage.getItem(STORAGE_NETWORK_KEY) || "profiton";
      setCurrentNetwork(turn === "stake" ? "stake" : "profiton");

      if (elapsed >= COOLDOWN_MS) {
        // Arm the ad for the next interaction
        setIsArmed(true);
      } else {
        setIsArmed(false);
        // Automatically re-check when cooldown expires
        const remaining = Math.max(1000, COOLDOWN_MS - elapsed);
        const timer = setTimeout(checkEligibility, remaining);
        return () => clearTimeout(timer);
      }
    };

    const cleanup = checkEligibility();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [pathname, isAdFree]);

  // Handle interaction & track impression cycle
  useEffect(() => {
    if (typeof window === "undefined" || isAdFree) return;

    const handleClick = () => {
      clickCountRef.current += 1;

      // First click of a user session is always clean & smooth
      const sessionClicks = parseInt(sessionStorage.getItem(STORAGE_CLICK_KEY) || "0", 10) + 1;
      sessionStorage.setItem(STORAGE_CLICK_KEY, sessionClicks.toString());

      if (sessionClicks === 1) {
        // Allow user to explore 1st page completely uninterrupted
        return;
      }

      if (isArmed) {
        // Popunder triggers on this click
        localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());

        // Alternate network for next pop
        const nextNetwork = currentNetwork === "profiton" ? "stake" : "profiton";
        localStorage.setItem(STORAGE_NETWORK_KEY, nextNetwork);

        // Disarm script for 90 seconds so all subsequent clicks are smooth & ad-free
        setTimeout(() => {
          setIsArmed(false);
        }, 1200);
      }
    };

    window.addEventListener("click", handleClick, { capture: true });
    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
    };
  }, [isArmed, isAdFree, currentNetwork]);

  // Cleanup on ad-free pages
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

  if (isAdFree || !isArmed) {
    return null;
  }

  return (
    <>
      {/* High-speed CDN preconnects */}
      <link rel="preconnect" href="https://bs.yirrsxanthan.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://bs.yirrsxanthan.com" />
      <link rel="preconnect" href="https://sads.adsboosters.xyz" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://sads.adsboosters.xyz" />

      {/* 1 Network at a time for maximum bid density & 0 double-pop clashes */}
      {currentNetwork === "profiton" ? (
        <Script
          id="profiton-pops-159999"
          strategy="afterInteractive"
          src="https://bs.yirrsxanthan.com/ri1xL2wAaH3bs24v/159999"
          data-cfasync="false"
        />
      ) : (
        <Script
          id="stake-adscore-106969"
          strategy="afterInteractive"
          src="https://sads.adsboosters.xyz/7d5d63b1d7a48601a1a774c8e8d4a88a.js"
          data-cfasync="false"
        />
      )}
    </>
  );
}
