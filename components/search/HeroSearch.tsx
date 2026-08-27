"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ShieldCheck, Database, Sparkles } from "lucide-react";

interface HeroSearchProps {
  stats: {
    totalResources: number;
    totalCategories: number;
    verifiedResources: number;
  };
}

const PLACEHOLDERS = [
  "Search for privacy tools...",
  "Find open-source alternatives...",
  "Explore AI assistants...",
  "Discover developer utilities...",
  "Browse design resources...",
  "Find free software...",
];

export default function HeroSearch({ stats }: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Typewriter cycling placeholder
  useEffect(() => {
    const target = PLACEHOLDERS[placeholderIdx];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedPlaceholder.length < target.length) {
      timeout = setTimeout(() => {
        setDisplayedPlaceholder(target.slice(0, displayedPlaceholder.length + 1));
      }, 48);
    } else if (!isDeleting && displayedPlaceholder.length === target.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayedPlaceholder.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedPlaceholder(displayedPlaceholder.slice(0, -1));
      }, 22);
    } else if (isDeleting && displayedPlaceholder.length === 0) {
      setIsDeleting(false);
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedPlaceholder, isDeleting, placeholderIdx]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  };

  const quickChips = [
    { label: "AI Tools", href: "/categories/ai" },
    { label: "Privacy", href: "/categories/privacy-security" },
    { label: "Dev Tools", href: "/categories/developer-tools" },
    { label: "Open Source", href: "/search?q=open-source" },
    { label: "Design", href: "/categories/design" },
    { label: "Free Software", href: "/search?pricing=free" },
    { label: "Gaming", href: "/categories/gaming" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto text-center">

      {/* Badge pill */}
      <div className="hero-animate-1 flex justify-center mb-5">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Modern Search Engine &amp; Curated Web Directory
        </span>
      </div>

      {/* H1 */}
      <div className="hero-animate-2">
        <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight text-content-primary leading-[1.1] mb-4">
          Discover the Internet&apos;s
          <br />
          <span className="gradient-text">Best Tools &amp; Resources</span>
        </h1>
        <p className="text-sm sm:text-base text-content-muted max-w-lg mx-auto leading-relaxed mb-7">
          Lightning-fast, privacy-first directory of verified software,
          open-source utilities, developer platforms, and AI models.
        </p>
      </div>

      {/* Search box */}
      <form onSubmit={handleSearch} className="hero-animate-3 relative max-w-2xl mx-auto mb-4">
        <div className="search-input-wrapper flex items-center rounded-2xl bg-surface border border-surface-border overflow-hidden">
          <div className="pl-4 shrink-0">
            <Search className="w-5 h-5 text-brand-400" />
          </div>
          <input
            id="hero-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={displayedPlaceholder || "Search anything..."}
            autoComplete="off"
            className="w-full py-4 px-3 bg-transparent text-content-primary placeholder-content-subtle text-sm sm:text-base outline-none font-medium"
          />
          <button
            type="submit"
            id="hero-search-btn"
            className="m-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-semibold text-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick chips */}
      <div className="hero-animate-4 flex flex-wrap items-center justify-center gap-1.5 mb-8">
        <span className="text-xs text-content-subtle font-medium mr-0.5">Jump to:</span>
        {quickChips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => router.push(chip.href)}
            className="quick-chip px-2.5 py-1 rounded-lg text-xs font-medium bg-surface border border-surface-border text-content-secondary"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className="hero-animate-5 flex items-center justify-center gap-0 max-w-sm mx-auto">
        <div className="flex-1 text-center py-3 px-2">
          <div className="text-xl sm:text-2xl font-bold text-content-primary tabular-nums">
            {stats.totalResources.toLocaleString()}+
          </div>
          <div className="text-[11px] text-content-muted mt-0.5 flex items-center justify-center gap-1">
            <Database className="w-3 h-3" />
            Curated Resources
          </div>
        </div>
        <div className="w-px h-10 bg-surface-border" />
        <div className="flex-1 text-center py-3 px-2">
          <div className="text-xl sm:text-2xl font-bold text-brand-400 tabular-nums">
            {stats.totalCategories}
          </div>
          <div className="text-[11px] text-content-muted mt-0.5">Categories</div>
        </div>
        <div className="w-px h-10 bg-surface-border" />
        <div className="flex-1 text-center py-3 px-2">
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">100%</div>
          <div className="text-[11px] text-content-muted mt-0.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </div>
        </div>
      </div>

    </div>
  );
}
