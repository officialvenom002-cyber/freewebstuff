"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  X, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  CornerDownLeft,
  SlidersHorizontal,
  Flame,
  Layers,
  Lock,
  Code,
  Film
} from "lucide-react";
import { Resource } from "@/lib/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_FILTERS = [
  { id: "all", label: "All Items", icon: Layers },
  { id: "ai", label: "AI & LLMs", query: "ai", icon: Sparkles },
  { id: "privacy", label: "Privacy & Security", query: "privacy", icon: Lock },
  { id: "dev", label: "Developer Tools", query: "developer", icon: Code },
  { id: "media", label: "Media & Streaming", query: "streaming", icon: Film },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (results[selectedIndex]) {
        e.preventDefault();
        router.push(`/resource/${results[selectedIndex].slug}`);
        onClose();
      } else if (query.trim()) {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-gradient-to-b from-[#0e1320] via-[#090d16] to-[#060910] border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.12)] overflow-hidden flex flex-col max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar (Raycast / Spotlight style) */}
        <div className="relative p-3.5 sm:p-4 border-b border-white/[0.08] flex items-center gap-3 bg-white/[0.02]">
          <div className="relative flex items-center justify-center shrink-0">
            <Search className="w-5 h-5 text-sky-400" />
            {loading && (
              <span className="absolute -inset-1 rounded-full border border-sky-400/50 animate-ping" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type to search 15,000+ tools, apps, guides..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none font-medium selection:bg-sky-500/30 selection:text-white"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium rounded-md bg-white/[0.06] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion & Category Chips */}
        {!query && (
          <div className="p-4 border-b border-white/[0.06] bg-slate-950/40">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Popular Quick Searches
              </span>
              <span className="text-[11px] text-slate-400">Click to fill</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { name: "ChatGPT & AI", q: "chatgpt" },
                { name: "Bitwarden", q: "bitwarden" },
                { name: "OBS Studio", q: "obs studio" },
                { name: "Ollama (Local AI)", q: "ollama" },
                { name: "uBlock Origin", q: "ublock" },
                { name: "Stirling PDF", q: "stirling" },
                { name: "Brave Browser", q: "brave" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setQuery(item.q)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-300 hover:text-sky-300 hover:bg-sky-500/10 hover:border-sky-400/30 border border-white/[0.06] transition-all cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Quick Category Jump */}
            <div className="mt-3.5 pt-3 border-t border-white/[0.04] flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Categories:</span>
              {QUICK_FILTERS.slice(1).map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => setQuery(f.query || "")}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/10 transition-colors"
                  >
                    <Icon className="w-3 h-3 text-sky-400/80" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Results Area */}
        <div className="overflow-y-auto p-2 sm:p-3 space-y-1.5 max-h-[50vh] scrollbar-thin">
          {loading && (
            <div className="py-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span>Scanning 15,000+ verified resources...</span>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-12 text-center space-y-3 px-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">
                  No resources matched &ldquo;<span className="text-sky-400">{query}</span>&rdquo;
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching with a broader keyword, acronym, or category name.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href={`/submit?name=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-xs text-sky-400 hover:text-sky-300 border border-sky-500/20 font-medium transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Suggest &ldquo;{query}&rdquo; for inclusion
                </Link>
              </div>
            </div>
          )}

          {!loading && results.map((res, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={res.id}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  router.push(`/resource/${res.slug}`);
                  onClose();
                }}
                className={`relative group p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
                  isSelected 
                    ? "bg-gradient-to-r from-sky-500/15 via-[#162035] to-[#121929] border border-sky-500/30 shadow-[0_4px_16px_rgba(0,0,0,0.4)]" 
                    : "hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {/* Left Selection Indicator Bar */}
                {isSelected && (
                  <div className="absolute left-0 inset-y-2 w-1 bg-gradient-to-b from-sky-400 to-sky-600 rounded-r-full shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                )}

                <div className="flex items-center gap-3.5 min-w-0 pl-1.5">
                  {/* Icon Logo Box */}
                  <div className="w-10 h-10 rounded-xl bg-[#141a28] border border-white/10 flex items-center justify-center p-2 shrink-0 group-hover:border-sky-500/30 transition-colors shadow-inner">
                    {res.logoUrl ? (
                      <img src={res.logoUrl} alt={res.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-sky-400" />
                    )}
                  </div>

                  {/* Resource Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white group-hover:text-sky-200 transition-colors truncate">
                        {res.name}
                      </span>
                      {res.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-slate-400 capitalize px-1.5 py-0.2 rounded-md bg-white/[0.04] border border-white/[0.06]">
                        {res.pricingType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5 leading-snug">
                      {res.tagline || res.description}
                    </p>
                  </div>
                </div>

                {/* Right Action Hint */}
                <div className="flex items-center gap-2 shrink-0 pr-1">
                  <span className={`text-xs font-medium flex items-center gap-1 transition-all ${
                    isSelected ? "text-sky-400 translate-x-0 opacity-100" : "text-slate-400 opacity-0 group-hover:opacity-100"
                  }`}>
                    <span className="hidden sm:inline">Select</span>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer with Keyboard Shortcuts */}
        <div className="p-3 border-t border-white/[0.08] bg-slate-950/70 flex items-center justify-between text-xs text-slate-400 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 font-mono text-[10px] text-slate-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 font-mono text-[10px] text-slate-300">↓</kbd>
              <span>to navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 font-mono text-[10px] text-slate-300">↵</kbd>
              <span>to open</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 font-mono text-[10px] text-slate-300">ESC</kbd>
              <span>to dismiss</span>
            </div>
          </div>

          {query && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors"
            >
              See all results <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
