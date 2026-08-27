"use client";

import React, { useEffect, useState } from "react";
import { Search, Sparkles, Command } from "lucide-react";

interface SearchToggleProps {
  onClick: () => void;
  className?: string;
  placeholder?: string;
  variant?: "header" | "compact" | "hero";
}

export default function SearchToggle({
  onClick,
  className = "",
  placeholder = "Search 15,000+ resources...",
  variant = "header",
}: SearchToggleProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Detect OS for keyboard shortcut display
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
    }
  }, []);

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Open search"
        className={`group relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-sky-400/40 text-slate-400 hover:text-sky-300 transition-all duration-200 shadow-sm hover:shadow-[0_0_16px_rgba(56,189,248,0.2)] active:scale-95 ${className}`}
      >
        <Search className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
      </button>
    );
  }

  return (
    <button
      type="button"
      id="searchButton"
      onClick={onClick}
      aria-label="Search resources"
      className={`group relative flex items-center justify-between gap-2.5 sm:gap-3 px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-b from-[#121724]/90 via-[#0e1320]/90 to-[#0a0e18]/90 hover:from-[#161d2e] hover:to-[#0f1524] border border-white/[0.09] hover:border-sky-400/40 text-slate-400 hover:text-white transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] active:scale-[0.99] cursor-pointer text-left select-none backdrop-blur-md ${className}`}
    >
      {/* Subtle Inner Top Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-t-xl pointer-events-none" />

      {/* Left Icon + Text */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="relative flex items-center justify-center shrink-0">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-sky-400 transition-colors duration-200" />
        </div>
        <span className="text-xs sm:text-[13px] text-slate-400 group-hover:text-slate-200 transition-colors duration-200 font-medium truncate">
          {placeholder}
        </span>
      </div>

      {/* Right: Premium Keycap Badge */}
      <div className="hidden sm:flex items-center gap-1 shrink-0">
        <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 group-hover:text-sky-300 bg-[#161c2b] group-hover:bg-[#1a2336] border border-white/[0.08] group-hover:border-sky-400/30 rounded-[6px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-200">
          {isMac ? (
            <>
              <span className="text-[11px] leading-none">⌘</span>
              <span>K</span>
            </>
          ) : (
            <>
              <span className="text-[9px] tracking-tight">Ctrl</span>
              <span>K</span>
            </>
          )}
        </kbd>
      </div>

      {/* Mobile Icon Shortcut */}
      <div className="flex sm:hidden items-center justify-center shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400/50 group-hover:bg-sky-400 animate-pulse" />
      </div>
    </button>
  );
}
