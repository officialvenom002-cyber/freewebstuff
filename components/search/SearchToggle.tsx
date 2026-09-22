"use client";

import React from "react";
import { Search } from "lucide-react";

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
  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Open search"
        className={`group relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#15181C]/75 backdrop-blur-md hover:bg-[#1B1F24]/90 border border-white/[0.08] hover:border-[#8B7CFF]/50 text-[#9298A3] hover:text-[#F2F3F5] transition-all duration-200 shadow-sm active:scale-95 ${className}`}
      >
        <Search className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 group-hover:text-[#8B7CFF]" />
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Search resources"
        className={`group relative flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-[#15181C]/75 backdrop-blur-md hover:bg-[#1B1F24]/90 border border-white/[0.08] hover:border-[#8B7CFF]/60 shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:shadow-[0_0_25px_rgba(139,124,255,0.18)] transition-all duration-200 cursor-pointer text-left select-none active:scale-[0.99] ${className}`}
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <Search className="w-5 h-5 text-[#8B7CFF] shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-sm sm:text-base text-[#9298A3] group-hover:text-[#F2F3F5] transition-colors truncate">
            {placeholder}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <kbd
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium text-[#9298A3] group-hover:text-[#8B7CFF] bg-[#111316] group-hover:bg-[#1B1F24] border border-[#262A30] rounded-lg transition-colors"
          >
            <span className="text-[11px]">⌘</span>
            <span>K</span>
          </kbd>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      id="searchButton"
      onClick={onClick}
      aria-label="Search resources"
      className={`group relative flex items-center justify-between gap-2.5 sm:gap-3 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#15181C]/75 backdrop-blur-md hover:bg-[#1B1F24]/90 border border-white/[0.08] hover:border-[#8B7CFF]/50 text-[#9298A3] hover:text-[#F2F3F5] transition-all duration-200 shadow-sm active:scale-[0.99] cursor-pointer text-left select-none ${className}`}
    >
      {/* Left Icon + Text */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="relative flex items-center justify-center shrink-0">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9298A3] group-hover:text-[#8B7CFF] transition-colors duration-200" />
        </div>
        <span className="text-xs sm:text-[13px] text-[#9298A3] group-hover:text-[#F2F3F5] transition-colors duration-200 font-medium truncate">
          {placeholder}
        </span>
      </div>

      {/* Right: Keycap Badge */}
      <div className="hidden sm:flex items-center gap-1 shrink-0">
        <kbd 
          className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#9298A3] group-hover:text-[#8B7CFF] bg-[#111316] group-hover:bg-[#1B1F24] border border-[#262A30] group-hover:border-[#8B7CFF]/30 rounded-[6px] transition-all duration-200"
        >
          <span className="text-[9px] tracking-tight">⌘</span>
          <span>K</span>
        </kbd>
      </div>

      {/* Mobile Dot */}
      <div className="flex sm:hidden items-center justify-center shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8B7CFF]/60 group-hover:bg-[#8B7CFF]" />
      </div>
    </button>
  );
}
