"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AdsterraBanner() {
  const pathname = usePathname();
  const bannerRef = useRef<HTMLDivElement>(null);

  // 100% ad-free on admin dashboard
  if (pathname.includes("admin") || pathname.includes("shobhit")) {
    return null;
  }

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.querySelector("script")) {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://bibleearthquake.com/940525bed6a894c4f710e89328b26e59/invoke.js";
      bannerRef.current.appendChild(script);
    }
  }, [pathname]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 px-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white/[0.02] border border-white/[0.06] p-3 flex flex-col items-center justify-center shadow-lg backdrop-blur-sm overflow-hidden min-h-[90px]">
        <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-2 select-none">
          Sponsored Tools & Resources
        </div>
        <div 
          ref={bannerRef}
          id="container-940525bed6a894c4f710e89328b26e59"
          className="w-full flex items-center justify-center"
        />
      </div>
    </div>
  );
}
