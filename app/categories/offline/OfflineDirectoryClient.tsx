"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  WifiOff
} from "lucide-react";
import { OfflineSiteRecord } from "./page";
import { setSiteHealthOverride } from "@/hooks/useUptimeChecker";

interface OfflineDirectoryClientProps {
  initialSites: OfflineSiteRecord[];
  stats: {
    totalTracked: number;
    totalOffline: number;
    totalUp: number;
  };
}

export default function OfflineDirectoryClient({ initialSites, stats }: OfflineDirectoryClientProps) {
  const [sites, setSites] = useState<OfflineSiteRecord[]>(initialSites);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [testingMap, setTestingMap] = useState<Record<string, boolean>>({});
  const [restoredMap, setRestoredMap] = useState<Record<string, boolean>>({});

  // Categories list with count
  const categoriesList = useMemo(() => {
    const map: Record<string, { name: string; count: number }> = {};
    for (const site of sites) {
      if (!map[site.categorySlug]) {
        map[site.categorySlug] = { name: site.categoryName, count: 0 };
      }
      map[site.categorySlug].count++;
    }
    return Object.entries(map).map(([slug, data]) => ({ slug, ...data }));
  }, [sites]);

  const filteredSites = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return sites.filter((site) => {
      if (selectedCategory !== "all" && site.categorySlug !== selectedCategory) return false;
      if (!q) return true;
      return (
        site.name.toLowerCase().includes(q) ||
        site.url.toLowerCase().includes(q) ||
        site.categoryName.toLowerCase().includes(q) ||
        site.boxTitle.toLowerCase().includes(q)
      );
    });
  }, [sites, selectedCategory, searchQuery]);

  const handleRetest = async (site: OfflineSiteRecord) => {
    setTestingMap((prev) => ({ ...prev, [site.url]: true }));
    try {
      const res = await fetch(`/api/uptime?url=${encodeURIComponent(site.url)}`);
      const data = await res.json();
      if (data && data.ok) {
        setRestoredMap((prev) => ({ ...prev, [site.url]: true }));
        setSiteHealthOverride(site.url, "up", data.latency, data.updatedUrl);
        // Automatically animate removal from offline list after 1.5s
        setTimeout(() => {
          setSites((prev) => prev.filter((s) => s.url !== site.url));
        }, 1500);
      }
    } catch {
      // Still offline
    } finally {
      setTestingMap((prev) => ({ ...prev, [site.url]: false }));
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 min-h-screen">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 font-sans font-medium">
        <Link href="/" className="hover:text-zinc-100 transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href="/categories" className="hover:text-zinc-100 transition-colors">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-white font-semibold">Offline Directory</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1b2234]">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/25 font-mono">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Automated Offline Directory</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Offline & Unreachable Websites
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans font-normal">
            Sites that were previously listed across all 23 categories but failed live health checks. 
            They are automatically isolated here so the live directories stay fast and clutter-free.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 bg-[#0d121c] border border-[#1d273a] p-3.5 rounded-2xl shrink-0">
          <div className="text-center px-2">
            <div className="text-xl font-bold font-mono text-red-400">{sites.length}</div>
            <div className="text-[11px] font-sans text-zinc-500 uppercase tracking-wider">Offline</div>
          </div>
          <div className="h-8 w-px bg-[#1d273a]" />
          <div className="text-center px-2">
            <div className="text-xl font-bold font-mono text-emerald-400">{stats.totalUp}</div>
            <div className="text-[11px] font-sans text-zinc-500 uppercase tracking-wider">Live Sites</div>
          </div>
          <div className="h-8 w-px bg-[#1d273a]" />
          <div className="text-center px-2">
            <div className="text-xl font-bold font-mono text-sky-400">{categoriesList.length}</div>
            <div className="text-[11px] font-sans text-zinc-500 uppercase tracking-wider">Categories</div>
          </div>
        </div>
      </div>

      {/* Notice info */}
      <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-950/15 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 font-sans leading-relaxed space-y-1">
          <span className="font-semibold text-amber-300">Automated Relocation:</span> If an offline site recovers, clicking <strong>Re-test</strong> will probe its server live. Once verified, it automatically moves back into its parent category box in real time.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offline websites or domains..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d121c] border border-[#1d273a] text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-red-500/50 transition-all font-sans"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-heading whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-red-500 text-white font-bold shadow-sm"
                : "bg-[#0d121c] text-zinc-400 hover:text-zinc-200 border border-[#1d273a]"
            }`}
          >
            All Categories ({sites.length})
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? "bg-red-500 text-white font-bold shadow-sm"
                  : "bg-[#0d121c] text-zinc-400 hover:text-zinc-200 border border-[#1d273a]"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] font-mono opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Offline Cards List */}
      {filteredSites.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#0c0f16] border border-[#1b212f] text-zinc-400 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
          <h2 className="text-base font-heading font-semibold text-white">No offline sites matching criteria</h2>
          <p className="text-xs text-zinc-500">All websites in this category are active and reachable.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site) => {
            const isTesting = Boolean(testingMap[site.url]);
            const isRestored = Boolean(restoredMap[site.url]);

            return (
              <div
                key={site.id + site.url}
                className={`p-4 rounded-2xl bg-[#0d111b] border transition-all duration-200 flex flex-col justify-between gap-4 ${
                  isRestored
                    ? "border-emerald-500/40 bg-emerald-950/20 shadow-emerald-500/10 shadow-lg"
                    : "border-red-500/20 hover:border-red-500/40 shadow-sm"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isRestored ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.7)]"
                          }`}
                        />
                        <h2 className={`font-heading font-bold text-[15px] truncate ${isRestored ? "text-emerald-300" : "text-zinc-200 line-through"}`}>
                          {site.name}
                        </h2>
                      </div>
                      <p className="text-[11.5px] font-mono text-zinc-500 truncate mt-1">
                        {site.url}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                        isRestored
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/15 text-red-400 border-red-500/25"
                      }`}
                    >
                      {isRestored ? "Online" : "Offline"}
                    </span>
                  </div>

                  {/* Origin tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                      href={`/categories/${site.categorySlug}`}
                      className="text-[10.5px] font-sans text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 px-2 py-0.5 rounded-md transition-colors"
                      title={`Visit ${site.categoryName} category`}
                    >
                      📁 {site.categoryName}
                    </Link>
                    <span className="text-[10.5px] font-sans text-zinc-400 bg-[#161d2d] border border-[#232d44] px-2 py-0.5 rounded-md truncate max-w-[180px]">
                      {site.boxTitle}
                    </span>
                  </div>
                </div>

                {/* Actions bottom bar */}
                <div className="pt-3 border-t border-[#1a2133] flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleRetest(site)}
                    disabled={isTesting || isRestored}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-sans disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? "animate-spin text-sky-400" : ""}`} />
                    <span>{isTesting ? "Probing..." : isRestored ? "Restored" : "Re-test"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/search?q=${encodeURIComponent(site.name)}`}
                      className="text-[11.5px] text-zinc-400 hover:text-sky-300 transition-colors"
                      title="Search working alternatives"
                    >
                      Alternatives
                    </Link>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11.5px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                      title="Attempt visiting original link"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
