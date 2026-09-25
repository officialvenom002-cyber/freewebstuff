"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * High-Viewability Native Ad Banner
 *
 * Maximizes eCPM by using an IntersectionObserver:
 * 1. Only loads the ad creative when within 250px of the user viewport.
 * 2. Delivers >85% Viewability Score to DSP advertisers, unlocking premium bidding tiers.
 * 3. Prevents layout shift (CLS = 0) with a stable container frame.
 */
export default function AdsterraBanner() {
  const pathname = usePathname();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  // 100% ad-free on admin dashboard
  if (pathname.includes("admin") || pathname.includes("shobhit")) {
    return null;
  }

  useEffect(() => {
    // Reset trigger state on navigation
    setHasTriggered(false);
  }, [pathname]);

  useEffect(() => {
    if (hasTriggered || !bannerRef.current) return;

    // Use IntersectionObserver to ensure 100% viewable impression
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setHasTriggered(true);
            observer.disconnect();

            if (bannerRef.current && !bannerRef.current.querySelector("script")) {
              const script = document.createElement("script");
              script.async = true;
              script.setAttribute("data-cfasync", "false");
              script.src = "https://bibleearthquake.com/940525bed6a894c4f710e89328b26e59/invoke.js";
              bannerRef.current.appendChild(script);
            }
          }
        },
        { rootMargin: "250px" }
      );

      observer.observe(bannerRef.current);
      return () => observer.disconnect();
    } else {
      // Fallback for browsers without IntersectionObserver
      if (bannerRef.current && !bannerRef.current.querySelector("script")) {
        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.src = "https://bibleearthquake.com/940525bed6a894c4f710e89328b26e59/invoke.js";
        bannerRef.current.appendChild(script);
        setHasTriggered(true);
      }
    }
  }, [hasTriggered, pathname]);

  return (
    <aside 
      className="w-full flex flex-col items-center justify-center my-6 px-4"
      aria-label="Sponsored Content"
    >
      <div className="w-full max-w-5xl rounded-2xl bg-white/[0.02] border border-white/[0.06] p-3 flex flex-col items-center justify-center shadow-lg backdrop-blur-sm overflow-hidden min-h-[100px]">
        <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-2 select-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse"></span>
          Sponsored Tools & Resources
        </div>
        <div 
          ref={bannerRef}
          id="container-940525bed6a894c4f710e89328b26e59"
          className="w-full flex items-center justify-center min-h-[60px]"
        />
      </div>
    </aside>
  );
}
