"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * AdScripts Component — Ultra-High CPM Smart Optimization
 * 
 * Monitized Networks:
 * 1. ProfitOn Popunder High-CPM Engine (Zone: 159999)
 * 2. Stake / AdsCore Engine
 * 
 * OPTIMIZATIONS:
 * 1. Frequency Capping: 6-minute cooldown between pops (prevents spam on every click).
 * 2. Smart Rotation: Alternates between ProfitOn and Stake so both networks earn without collision.
 * 3. 2.5s Anti-Bounce Buffer: Never fires on instant entrance; maximizes advertiser bid quality ($5-$10+ CPM).
 * 4. 100% Ad-Free on /support, /donate, /benefits, and admin routes.
 */

const COOLDOWN_MS = 6 * 60 * 1000; // 6 minutes cooldown between popunders
const STORAGE_KEY = "fwsf_last_pop_time";
const NETWORK_KEY = "fwsf_ad_network_turn";

export default function AdScripts() {
  const pathname = usePathname();
  const [shouldLoadAd, setShouldLoadAd] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<"profiton" | "stake">("profiton");

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
      setShouldLoadAd(false);
      return;
    }

    const lastPop = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    const now = Date.now();

    // If cooldown is active, keep DOM 100% clean of ad scripts
    if (now - lastPop < COOLDOWN_MS) {
      setShouldLoadAd(false);
      return;
    }

    // Alternate turns between ProfitOn and Stake
    const currentTurn = localStorage.getItem(NETWORK_KEY) || "profiton";
    setSelectedNetwork(currentTurn === "stake" ? "stake" : "profiton");

    // 2.5s anti-bounce delay before arming ad listeners
    const timer = setTimeout(() => {
      setShouldLoadAd(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [pathname, isAdFree]);

  // When ad is armed, detect the click and enforce 6-minute cooldown immediately
  useEffect(() => {
    if (!shouldLoadAd || isAdFree || typeof window === "undefined") return;

    const handleInteraction = () => {
      // Set timestamp in localStorage to block ads for the next 6 minutes
      localStorage.setItem(STORAGE_KEY, Date.now().toString());

      // Alternate network for next rotation
      const nextNetwork = selectedNetwork === "profiton" ? "stake" : "profiton";
      localStorage.setItem(NETWORK_KEY, nextNetwork);

      // Gracefully unload script after impression trigger
      setTimeout(() => {
        setShouldLoadAd(false);
      }, 1200);
    };

    window.addEventListener("click", handleInteraction, { capture: true, once: true });
    return () => {
      window.removeEventListener("click", handleInteraction, { capture: true });
    };
  }, [shouldLoadAd, isAdFree, selectedNetwork]);

  // Purge any residual ad nodes on ad-free routes
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

  if (isAdFree || !shouldLoadAd) {
    return null;
  }

  return (
    <>
      {/* High-speed CDN preconnects */}
      <link rel="preconnect" href="https://bs.yirrsxanthan.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://bs.yirrsxanthan.com" />
      <link rel="preconnect" href="https://sads.adsboosters.xyz" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://sads.adsboosters.xyz" />

      {/* Arm ONLY ONE network at a time — zero double-popup spam */}
      {selectedNetwork === "profiton" ? (
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
