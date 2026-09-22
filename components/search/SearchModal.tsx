"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  X, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CornerDownLeft,
  Gamepad2,
  Lock,
  Bot,
  Film,
  Code2,
  BookOpen,
  Package,
  Layers,
  Terminal,
  ExternalLink
} from "lucide-react";
import { Resource } from "@/lib/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Minecraft",
  "AI",
  "VPN",
  "Movies",
  "Linux",
  "Adblock",
  "Emulators",
  "Ebooks",
];

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  gaming: Gamepad2,
  privacy: Lock,
  ai: Bot,
  video: Film,
  "developer-tools": Code2,
  reading: BookOpen,
  system: Terminal,
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Live search query fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=12`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.resources || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  // Group results by category for clean organized view
  const groupedResults = useMemo(() => {
    const map = new Map<string, Resource[]>();
    for (const res of results) {
      const cat = res.categoryId || "general";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(res);
    }
    return Array.from(map.entries());
  }, [results]);

  // Flat list for keyboard indexing
  const flatResults = results;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < flatResults.length ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (flatResults[selectedIndex]) {
        e.preventDefault();
        router.push(`/resource/${flatResults[selectedIndex].slug}`);
        onClose();
      } else if (query.trim()) {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      }
    }
  };

  const handleSelectChip = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#111316] border border-[#262A30] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(139,124,255,0.1)] overflow-hidden flex flex-col max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative p-3.5 sm:p-4 border-b border-[#262A30] flex items-center gap-3 bg-[#15181C]">
          <div className="relative flex items-center justify-center shrink-0">
            <Search className="w-5 h-5 text-[#8B7CFF]" />
            {loading && (
              <span className="absolute -inset-1 rounded-full border border-[#8B7CFF]/50 animate-ping" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search 15,000+ resources..."
            className="w-full bg-transparent text-[#F2F3F5] placeholder-[#9298A3] text-sm sm:text-base outline-none font-medium selection:bg-[#8B7CFF]/30 selection:text-[#F2F3F5]"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              title="Clear search"
              className="p-1.5 rounded-lg text-[#9298A3] hover:text-[#F2F3F5] hover:bg-[#1B1F24] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            title="Close (Esc)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111316] border border-[#262A30] text-[#9298A3] hover:text-[#F2F3F5] hover:border-[#8B7CFF]/40 active:scale-95 transition-all cursor-pointer text-xs"
          >
            <span className="font-mono text-[10px] font-medium">{mounted && isMac ? "⌘ ESC" : "ESC"}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-3 max-h-[55vh] scrollbar-thin">
          
          {/* Loading state */}
          {loading && (
            <div className="py-12 text-center text-sm text-[#9298A3] flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-[#8B7CFF] border-t-transparent rounded-full animate-spin" />
              <span>Searching directory...</span>
            </div>
          )}

          {/* Empty search results */}
          {!loading && query && results.length === 0 && (
            <div className="py-10 text-center space-y-3 px-4">
              <div className="w-12 h-12 rounded-2xl bg-[#15181C] border border-[#262A30] flex items-center justify-center mx-auto text-[#9298A3]">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#F2F3F5]">
                  No resources matched &ldquo;<span className="text-[#8B7CFF]">{query}</span>&rdquo;
                </p>
                <p className="text-xs text-[#9298A3] mt-1">
                  Try searching with a broader keyword, acronym, or category name.
                </p>
              </div>
            </div>
          )}

          {/* Search results grouped or listed */}
          {!loading && results.length > 0 && (
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#9298A3] px-1 font-mono">
                Search results
              </div>

              <div className="space-y-1.5">
                {results.map((res, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = CATEGORY_ICON_MAP[res.categoryId] || Package;

                  return (
                    <div
                      key={res.id}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => {
                        router.push(`/resource/${res.slug}`);
                        onClose();
                      }}
                      className={`relative p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
                        isSelected 
                          ? "bg-[#1B1F24] border border-[#8B7CFF]/50 shadow-sm" 
                          : "bg-[#15181C] hover:bg-[#1B1F24] border border-[#262A30]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-[#111316] border border-[#262A30] flex items-center justify-center shrink-0">
                          {res.logoUrl ? (
                            <img src={res.logoUrl} alt={res.name} className="w-4 h-4 object-contain" />
                          ) : (
                            <Icon className="w-4 h-4 text-[#8B7CFF]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#F2F3F5] truncate">
                              {res.name}
                            </span>
                            {res.verified && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                Verified
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-[#9298A3] uppercase px-1.5 py-0.2 rounded bg-[#111316] border border-[#262A30]">
                              {res.categoryId}
                            </span>
                          </div>
                          <p className="text-xs text-[#9298A3] truncate mt-0.5">
                            {res.tagline || res.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-medium flex items-center gap-1 transition-all ${
                          isSelected ? "text-[#8B7CFF] opacity-100" : "text-[#9298A3] opacity-0 group-hover:opacity-100"
                        }`}>
                          <span className="hidden sm:inline">Open</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Popular searches section (matches wireframe) */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9298A3] mb-2 px-1 font-mono">
              Popular searches
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {POPULAR_SEARCHES.map((item, idx) => (
                <React.Fragment key={item}>
                  <button
                    type="button"
                    onClick={() => handleSelectChip(item)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#15181C] hover:bg-[#1B1F24] border border-[#262A30] hover:border-[#8B7CFF]/50 text-[#9298A3] hover:text-[#F2F3F5] transition-all cursor-pointer"
                  >
                    {item}
                  </button>
                  {idx < POPULAR_SEARCHES.length - 1 && (
                    <span className="text-[#262A30] select-none text-xs">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer with Keyboard Shortcuts */}
        <div className="p-3 border-t border-[#262A30] bg-[#0B0C0E] flex items-center justify-between text-xs text-[#9298A3]">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[#15181C] border border-[#262A30] font-mono text-[10px] text-[#F2F3F5]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#15181C] border border-[#262A30] font-mono text-[10px] text-[#F2F3F5]">↓</kbd>
              <span>navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[#15181C] border border-[#262A30] font-mono text-[10px] text-[#F2F3F5]">↵</kbd>
              <span>open</span>
            </div>
          </div>

          {query && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-[#8B7CFF] hover:underline font-semibold flex items-center gap-1 transition-colors"
            >
              See all results <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
