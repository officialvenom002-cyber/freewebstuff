"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sun, 
  Moon, 
  Check, 
  ChevronDown 
} from "lucide-react";

export interface ThemeOption {
  id: string;
  name: string;
  icon: React.ElementType;
}

export const THEMES: ThemeOption[] = [
  {
    id: "white",
    name: "Light",
    icon: Sun,
  },
  {
    id: "dark",
    name: "Dark",
    icon: Moon,
  },
];

// Alias for backwards compatibility
export const MATTE_THEMES = THEMES;

interface ThemeSelectorProps {
  className?: string;
  align?: "left" | "right";
  buttonVariant?: "icon" | "pill";
}

export default function ThemeSelector({
  className = "",
  align = "right",
  buttonVariant = "icon",
}: ThemeSelectorProps) {
  const [currentTheme, setCurrentTheme] = useState<string>("dark");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read stored theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("fwsf-theme") || localStorage.getItem("fins-theme") || "dark";
    const resolvedTheme = saved === "white" || saved === "light" ? "white" : "dark";
    
    setCurrentTheme(resolvedTheme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("fwsf-theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    setIsOpen(false);
  };

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[1];
  const ActiveIcon = activeThemeObj.icon;

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      
      {/* Toggle Trigger Button */}
      {buttonVariant === "pill" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151B2A] hover:bg-[#1E2538] border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm active:scale-95 group"
          title={`Theme: ${activeThemeObj.name}`}
        >
          <ActiveIcon className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />
          <span className="font-medium text-slate-200">{activeThemeObj.name}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer active:scale-95 group"
          title={`Theme: ${activeThemeObj.name}`}
          aria-label="Toggle Theme Menu"
        >
          <ActiveIcon className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
        </button>
      )}

      {/* Small, Compact Dropdown Popup */}
      {isOpen && (
        <div 
          className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-2 w-40 rounded-xl bg-[#111316] border border-[#262A30] shadow-2xl p-1.5 z-50 animate-popover space-y-1`}
          style={{ backdropFilter: "blur(20px)" }}
        >
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            const Icon = theme.icon;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelectTheme(theme.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-white/10 text-white font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-sky-400" : "text-slate-400"}`} />
                <span className="flex-1 text-left">{theme.name}</span>
                {isSelected && <Check className="w-4 h-4 text-sky-400" />}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
