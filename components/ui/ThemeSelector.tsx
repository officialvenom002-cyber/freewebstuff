"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Palette, 
  Sparkles, 
  Layers, 
  Coffee, 
  Trees, 
  Compass, 
  BookOpen, 
  Check,
  ChevronDown,
  Grid,
  Anchor
} from "lucide-react";

export interface ThemeOption {
  id: string;
  name: string;
  badge: string;
  textureLabel: string;
  description: string;
  icon: React.ElementType;
  colors: [string, string, string];
  cardBg: string;
}

export const MATTE_THEMES: ThemeOption[] = [
  {
    id: "matte-sepia",
    name: "Vintage Parchment",
    badge: "Default",
    textureLabel: "Deckle Paper",
    description: "Antique ruled notebook lines with soothing bone-white text and deckle-edge cards",
    icon: BookOpen,
    colors: ["#fde68a", "#a8a29e", "#0f0d0b"],
    cardBg: "linear-gradient(145deg, #1b1714 0%, #110f0c 100%)",
  },
  {
    id: "matte-obsidian",
    name: "Classic Obsidian",
    badge: "Carbon Slate",
    textureLabel: "Micro-Dot Grid",
    description: "Deep carbon matte with micro-dot matrix pattern and soft ice-blue accents",
    icon: Layers,
    colors: ["#38bdf8", "#94a3b8", "#090b10"],
    cardBg: "linear-gradient(145deg, #141a26 0%, #0d111a 100%)",
  },
  {
    id: "matte-charcoal",
    name: "Architect Charcoal",
    badge: "Drafting Studio",
    textureLabel: "Blueprint Grid",
    description: "Technical drafting grid, precision corner marks, and zero-glare graphite slate",
    icon: Grid,
    colors: ["#cbd5e1", "#64748b", "#0d1015"],
    cardBg: "linear-gradient(145deg, #151921 0%, #0e1117 100%)",
  },
  {
    id: "matte-navy",
    name: "Oxford Heritage Navy",
    badge: "Maritime",
    textureLabel: "Star Coordinates",
    description: "Maritime coordinate constellation backdrop with muted royal sapphire cards",
    icon: Anchor,
    colors: ["#60a5fa", "#3b82f6", "#060c18"],
    cardBg: "linear-gradient(145deg, #0d192d 0%, #07101e 100%)",
  },
  {
    id: "matte-forest",
    name: "Nordic Pine & Sage",
    badge: "Organic",
    textureLabel: "Contour Wave",
    description: "Topographic contour wave aura with soothing evergreen velvet matte textures",
    icon: Trees,
    colors: ["#34d399", "#10b981", "#041009"],
    cardBg: "linear-gradient(145deg, #0a1f14 0%, #05140d 100%)",
  },
  {
    id: "matte-mocha",
    name: "Dark Espresso & Mocha",
    badge: "Warm Roast",
    textureLabel: "Velvet Grain",
    description: "Roasted coffee grain texture with warm golden caramel and mahogany trim",
    icon: Coffee,
    colors: ["#fbbf24", "#d97706", "#110906"],
    cardBg: "linear-gradient(145deg, #1e110b 0%, #130a06 100%)",
  },
];

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
  const [currentTheme, setCurrentTheme] = useState<string>("matte-sepia");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read stored theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("fins-theme") || "matte-sepia";
    const exists = MATTE_THEMES.some((t) => t.id === saved);
    const resolvedTheme = exists ? saved : "matte-sepia";
    
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
    localStorage.setItem("fins-theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    setIsOpen(false);
  };

  const activeThemeObj = MATTE_THEMES.find((t) => t.id === currentTheme) || MATTE_THEMES[0];
  const ActiveIcon = activeThemeObj.icon;

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      
      {/* Toggle Trigger Button */}
      {buttonVariant === "pill" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-secondary/90 hover:bg-surface-hover border border-surface-border text-xs font-semibold text-white transition-all cursor-pointer shadow-sm active:scale-95 group"
          title="Switch Matte Theme"
        >
          <span 
            className="w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-125"
            style={{ 
              backgroundColor: activeThemeObj.colors[0],
              boxShadow: `0 0 8px ${activeThemeObj.colors[0]}40`
            }}
          />
          <ActiveIcon className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />
          <span className="hidden sm:inline font-medium text-slate-200">{activeThemeObj.name}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#151B2A] border border-transparent hover:border-white/10 transition-all cursor-pointer active:scale-95 group"
          title={`Matte Material: ${activeThemeObj.name} (Click to change)`}
          aria-label="Toggle Matte Theme Menu"
        >
          <Palette className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 text-slate-300" />
          <span 
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-black/50"
            style={{ 
              backgroundColor: activeThemeObj.colors[0],
              boxShadow: `0 0 6px ${activeThemeObj.colors[0]}50`
            }}
          />
        </button>
      )}

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-2.5 w-84 sm:w-92 rounded-2xl bg-[#0b0e17]/98 border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-3 z-50 backdrop-blur-2xl animate-fade-in space-y-2`}
        >
          
          {/* Header */}
          <div className="px-2 py-1.5 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                Matte Material Studio
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {MATTE_THEMES.length} tactile finishes
            </span>
          </div>

          {/* Theme Option Cards List */}
          <div className="max-h-[390px] overflow-y-auto no-scrollbar py-1 space-y-2">
            {MATTE_THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              const Icon = theme.icon;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-pointer group relative overflow-hidden ${
                    isSelected
                      ? "bg-white/10 border-white/30 shadow-md ring-1 ring-white/20"
                      : "bg-white/[0.03] hover:bg-white/[0.07] border-white/6 hover:border-white/16"
                  }`}
                >
                  
                  {/* Swatch & Icon Card */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-inner transition-transform duration-200 group-hover:scale-105"
                    style={{
                      background: theme.cardBg,
                      borderColor: `${theme.colors[0]}40`,
                      color: theme.colors[0]
                    }}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-slate-100 transition-colors truncate">
                        {theme.name}
                      </span>

                      <span 
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono shrink-0"
                        style={{
                          backgroundColor: `${theme.colors[0]}18`,
                          color: theme.colors[0],
                          border: `1px solid ${theme.colors[0]}35`
                        }}
                      >
                        {theme.badge}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-slate-400 leading-snug line-clamp-1 font-normal">
                      {theme.description}
                    </p>

                    {/* Material Texture Pill */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-slate-400">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: theme.colors[0] }}
                        />
                        <span>{theme.textureLabel}</span>
                      </div>

                      <div className="flex -space-x-1">
                        <span 
                          className="w-2 h-2 rounded-full border border-black/40"
                          style={{ backgroundColor: theme.colors[0] }}
                        />
                        <span 
                          className="w-2 h-2 rounded-full border border-black/40"
                          style={{ backgroundColor: theme.colors[1] }}
                        />
                        <span 
                          className="w-2 h-2 rounded-full border border-black/40"
                          style={{ backgroundColor: theme.colors[2] }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Active Check Indicator */}
                  {isSelected && (
                    <div className="shrink-0 pt-0.5">
                      <div 
                        className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-black shadow-sm"
                        style={{ backgroundColor: theme.colors[0] }}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  )}

                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="pt-2 px-2 border-t border-white/8 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
            <span>Themes apply custom tactile textures across every page</span>
          </div>

        </div>
      )}

    </div>
  );
}
