"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Resource } from "@/lib/types";
import { 
  Search, 
  X, 
  ArrowRight, 
  MapPin,
  Clock,
  Sparkles
} from "lucide-react";

interface BoxGroup {
  id: string;
  title: string;
  emoji: string;
  items: Resource[];
}

const SUGGESTED_TOPICS = [
  { label: "🎬 Movies & Streaming", query: "movies dekhna hai", cat: "video" },
  { label: "💾 Video Downloaders", query: "video download", cat: "downloading" },
  { label: "🎨 Photo Editors", query: "photo edit karna", cat: "image-tools" },
  { label: "🛡️ Adblock & Privacy", query: "ads kaise band kare", cat: "privacy" },
  { label: "📚 Books & Ebooks", query: "padhai ke liye books", cat: "reading" },
  { label: "🎮 PC Games", query: "pc games download", cat: "gaming" },
  { label: "🔓 Paywall Bypass", query: "bypass paywall", cat: "internet-tools" },
  { label: "🤖 AI Tools", query: "ai tools", cat: "ai" },
];

const EMOJI_MAP: Record<string, string> = {
  video: "🎬",
  downloading: "💾",
  "image-tools": "🎨",
  privacy: "🛡️",
  reading: "📚",
  gaming: "🎮",
  "internet-tools": "🌐",
  ai: "🤖",
  audio: "🎵",
  "developer-tools": "💻",
  educational: "🎓",
  "file-tools": "📁",
  "system-tools": "⚙️",
  "text-tools": "📝",
  mobile: "📱",
  storage: "☁️",
  torrenting: "🌊",
};

function formatSubcategoryTitle(subCat: string): string {
  if (!subCat) return "General Sites";
  return subCat
    .replace(/^([a-z]+-)/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// 1-2 Highlight Keywords that immediately define what the website does
function getHighlightKeywords(site: Resource): { text: string; color: string }[] {
  const text = `${site.name} ${site.tagline || ""} ${site.description || ""} ${(site.tags || []).join(" ")} ${(site.features || []).join(" ")}`.toLowerCase();
  const list: { text: string; color: string }[] = [];

  // High-value specific highlights
  if (text.includes("no ads") || text.includes("ad-free") || text.includes("adblock")) {
    list.push({ text: "🚫 No Ads", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" });
  }
  if (text.includes("hindi") || text.includes("bollywood") || text.includes("dual audio") || text.includes("indian") || text.includes("desi")) {
    list.push({ text: "🇮🇳 Hindi", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" });
  }
  if (text.includes("4k") || text.includes("1080p") || text.includes("ultra hd")) {
    list.push({ text: "✨ 1080p", color: "bg-sky-500/15 text-sky-300 border-sky-500/30" });
  } else if (text.includes("stream") || text.includes("watch")) {
    list.push({ text: "⚡ Fast Stream", color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" });
  }
  if (text.includes("download") || text.includes("torrent") || text.includes("direct download") || text.includes("magnet")) {
    list.push({ text: "📥 Direct DL", color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" });
  }
  if (text.includes("anime") || text.includes("sub") || text.includes("subtitles")) {
    list.push({ text: "🍿 Sub/Dub", color: "bg-pink-500/15 text-pink-300 border-pink-500/30" });
  }
  if (text.includes("open source") || site.pricingType === "open-source") {
    list.push({ text: "💻 Open Source", color: "bg-purple-500/15 text-purple-300 border-purple-500/30" });
  }

  // Fallback to tags if needed
  if (list.length < 2 && site.tags && site.tags.length > 0) {
    for (const tag of site.tags) {
      if (list.length >= 2) break;
      const cleanTag = tag.trim();
      if (!["fmhy", "verified", "tool", "website", "free"].includes(cleanTag.toLowerCase())) {
        const formatted = cleanTag.charAt(0).toUpperCase() + cleanTag.slice(1);
        if (!list.some(k => k.text.toLowerCase().includes(cleanTag.toLowerCase()))) {
          list.push({ text: formatted, color: "bg-[#141A29] text-zinc-300 border-[#20293D]" });
        }
      }
    }
  }

  // Fallback if none matched
  if (list.length === 0) {
    if (site.pricingType === "free") list.push({ text: "100% Free", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" });
    else list.push({ text: "Fast Mirror", color: "bg-sky-500/15 text-sky-300 border-sky-500/30" });
  }

  return list.slice(0, 2);
}

// In-memory client cache for instantaneous (0ms) responses
const clientSearchCache = new Map<string, any>();

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "all";

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [resources, setResources] = useState<Resource[]>([]);
  const [matchedTopic, setMatchedTopic] = useState<string | null>(null);
  const [targetCategory, setTargetCategory] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Region and Keyword filter state
  const [regionFilter, setRegionFilter] = useState<string>("IN");
  const [detectedCountry, setDetectedCountry] = useState<string>("IN");
  const [tagFilter, setTagFilter] = useState<string>("all");

  // Search History state
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);

    // Load search history from localStorage
    try {
      const raw = localStorage.getItem("fwsf_search_history");
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch {}

    // Detect user timezone/region
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("Asia")) {
        setDetectedCountry("IN");
        setRegionFilter("IN");
      } else if (tz.includes("America")) {
        setDetectedCountry("US");
        setRegionFilter("US");
      } else if (tz.includes("Europe")) {
        setDetectedCountry("EU");
        setRegionFilter("all");
      }
    } catch {
      // Keep defaults
    }
  }, []);

  // Sync state when URL params change
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setQuery(q);
      setDebouncedQuery(q);
    }
    const cat = searchParams.get("category");
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  // Debounce typed query by 120ms to avoid spamming the server
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 120);
    return () => clearTimeout(timer);
  }, [query]);

  // Save successful search to history
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length >= 2 && resources.length > 0) {
      try {
        const raw = localStorage.getItem("fwsf_search_history");
        const list: string[] = raw ? JSON.parse(raw) : [];
        const updated = [trimmed, ...list.filter((x) => x.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
        localStorage.setItem("fwsf_search_history", JSON.stringify(updated));
        setRecentSearches(updated);
      } catch {}
    }
  }, [debouncedQuery, resources]);

  // Fetch search results with instant cache lookup (0ms)
  useEffect(() => {
    if (!mounted) return;

    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResources([]);
      setMatchedTopic(null);
      setTargetCategory(null);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    const cacheKey = `${trimmed.toLowerCase()}_${selectedCategory}`;

    // 1. Instant check in-memory client cache
    if (clientSearchCache.has(cacheKey)) {
      const cached = clientSearchCache.get(cacheKey);
      setResources(cached.resources || []);
      setMatchedTopic(cached.matchedTopic || null);
      setTargetCategory(cached.targetCategory || (selectedCategory !== "all" ? selectedCategory : null));
      setTotalCount(cached.total || 0);
      setLoading(false);
      return;
    }

    // 2. Instant check in sessionStorage (pre-filled by search modal)
    try {
      const stored = sessionStorage.getItem(`fwsf_sc_${trimmed.toLowerCase()}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.resources) {
          clientSearchCache.set(cacheKey, {
            resources: parsed.resources,
            matchedTopic: parsed.intent?.matchedTopics?.[0] || null,
            targetCategory: parsed.intent?.targetCategories?.[0] || null,
            total: parsed.total || parsed.resources.length,
          });
          setResources(parsed.resources || []);
          setMatchedTopic(parsed.intent?.matchedTopics?.[0] || null);
          setTargetCategory(parsed.intent?.targetCategories?.[0] || null);
          setTotalCount(parsed.total || parsed.resources.length);
          setLoading(false);
          return;
        }
      }
    } catch {}

    let active = true;
    setLoading(true);

    const controller = new AbortController();
    const url = `/api/search?q=${encodeURIComponent(trimmed)}&category=${encodeURIComponent(selectedCategory)}&limit=120`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const resList = data.resources || [];
        const top = data.intent?.matchedTopics?.[0] || null;
        const cat = data.intent?.targetCategories?.[0] || (selectedCategory !== "all" ? selectedCategory : null);
        const tot = data.total || 0;

        // Save to cache
        clientSearchCache.set(cacheKey, {
          resources: resList,
          matchedTopic: top,
          targetCategory: cat,
          total: tot,
        });

        try {
          sessionStorage.setItem(`fwsf_sc_${trimmed.toLowerCase()}`, JSON.stringify(data));
        } catch {}

        setResources(resList);
        setMatchedTopic(top);
        setTargetCategory(cat);
        setTotalCount(tot);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Search fetch error:", err);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedQuery, selectedCategory, mounted]);

  // Apply real-time region & highlight filters
  const filteredResources = useMemo(() => {
    if (!resources.length) return [];

    let list = resources;

    // Region priority & sorting
    if (regionFilter === "IN") {
      list = [...list].sort((a, b) => {
        const aIsIndian = `${a.name} ${a.tagline} ${(a.tags || []).join(" ")}`.toLowerCase().match(/hindi|bolly|india|desicinema|vegamovies|braflix|sflix/);
        const bIsIndian = `${b.name} ${b.tagline} ${(b.tags || []).join(" ")}`.toLowerCase().match(/hindi|bolly|india|desicinema|vegamovies|braflix|sflix/);
        if (aIsIndian && !bIsIndian) return -1;
        if (!aIsIndian && bIsIndian) return 1;
        return 0;
      });
    }

    // Tag / Feature Filter
    if (tagFilter === "no-ads") {
      list = list.filter((r) => {
        const t = `${r.name} ${r.tagline || ""} ${r.description || ""} ${(r.tags || []).join(" ")} ${(r.features || []).join(" ")}`.toLowerCase();
        return t.includes("no ads") || t.includes("ad-free") || t.includes("adblock") || r.verified;
      });
    } else if (tagFilter === "hindi") {
      list = list.filter((r) => {
        const t = `${r.name} ${r.tagline || ""} ${r.description || ""} ${(r.tags || []).join(" ")}`.toLowerCase();
        return t.includes("hindi") || t.includes("bollywood") || t.includes("dual audio") || t.includes("indian") || t.includes("desi") || t.includes("dub");
      });
    } else if (tagFilter === "download") {
      list = list.filter((r) => {
        const t = `${r.name} ${r.tagline || ""} ${r.description || ""} ${(r.tags || []).join(" ")}`.toLowerCase();
        return t.includes("download") || t.includes("torrent") || t.includes("direct download") || t.includes("magnet");
      });
    } else if (tagFilter === "stream") {
      list = list.filter((r) => {
        const t = `${r.name} ${r.tagline || ""} ${r.description || ""} ${(r.tags || []).join(" ")}`.toLowerCase();
        return t.includes("stream") || t.includes("watch") || t.includes("player") || t.includes("online");
      });
    }

    return list;
  }, [resources, regionFilter, tagFilter]);

  // Group filtered resources into structured boxes with exact keyword match priority
  const boxGroups: BoxGroup[] = useMemo(() => {
    if (!filteredResources.length) return [];

    const qLower = (debouncedQuery || query).toLowerCase().trim();
    const map = new Map<string, Resource[]>();

    for (const r of filteredResources) {
      const groupKey = r.subcategoryId || r.categoryId || "general";
      if (!map.has(groupKey)) map.set(groupKey, []);
      map.get(groupKey)!.push(r);
    }

    const groups: BoxGroup[] = [];
    for (const [key, items] of map.entries()) {
      const catKey = items[0]?.categoryId || "general";
      const emoji = EMOJI_MAP[catKey] || "🌐";
      const title = formatSubcategoryTitle(key);

      // 1. Sort items inside each box: exact keyword matches always at TOP #1
      items.sort((a: Resource, b: Resource) => {
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();

        const aExact = aName === qLower ? 4 : aName.startsWith(qLower) ? 3 : aName.includes(qLower) ? 2 : 0;
        const bExact = bName === qLower ? 4 : bName.startsWith(qLower) ? 3 : bName.includes(qLower) ? 2 : 0;
        if (aExact !== bExact) return bExact - aExact;

        if (a.verified !== b.verified) return a.verified ? -1 : 1;
        return 0;
      });

      groups.push({
        id: key,
        title,
        emoji,
        items,
      });
    }

    // 2. Sort the boxes themselves: the box containing the keyword match is ALWAYS FIRST!
    groups.sort((a, b) => {
      if (qLower) {
        const aExactMatch = a.items.some(i => (i.name || "").toLowerCase() === qLower || (i.name || "").toLowerCase().startsWith(qLower));
        const bExactMatch = b.items.some(i => (i.name || "").toLowerCase() === qLower || (i.name || "").toLowerCase().startsWith(qLower));
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        const aHasQ = a.items.some(i => (i.name || "").toLowerCase().includes(qLower));
        const bHasQ = b.items.some(i => (i.name || "").toLowerCase().includes(qLower));
        if (aHasQ && !bHasQ) return -1;
        if (!aHasQ && bHasQ) return 1;
      }

      return b.items.length - a.items.length;
    });

    return groups;
  }, [filteredResources, debouncedQuery, query]);

  const handleSelectTopic = (topicQuery: string, cat?: string) => {
    setQuery(topicQuery);
    setDebouncedQuery(topicQuery);
    if (cat) setSelectedCategory(cat);
    const targetUrl = cat 
      ? `/search?q=${encodeURIComponent(topicQuery)}&category=${encodeURIComponent(cat)}`
      : `/search?q=${encodeURIComponent(topicQuery)}`;
    router.push(targetUrl);
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    setSelectedCategory("all");
    router.push("/search");
  };

  const handleRemoveHistory = (itemToRemove: string) => {
    try {
      const updated = recentSearches.filter((x) => x.toLowerCase() !== itemToRemove.toLowerCase());
      localStorage.setItem("fwsf_search_history", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {}
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem("fwsf_search_history");
      setRecentSearches([]);
    } catch {}
  };

  const handleOutboundClick = (siteId: string) => {
    try {
      const sessionKey = `fwsf_click_${siteId}`;
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(sessionKey)) {
        return;
      }
      sessionStorage.setItem(sessionKey, "1");
      fetch(`/api/resources/${siteId}/click`, { method: "POST" });
    } catch {
      // Non-blocking
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-7 space-y-6 sm:space-y-7">
      
      {/* ── Search Header ── */}
      <div className="rounded-2xl bg-[#0F1420] border border-[#1E2638] p-5 sm:p-6 space-y-4 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Directory Search</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Type naturally in any language (Hindi, Hinglish, English) or search by action (e.g. &ldquo;movies dekhna hai&rdquo;, &ldquo;video download&rdquo;, &ldquo;photo edit&rdquo;).
            </p>
          </div>

          {query.trim() && (
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/25 self-start sm:self-auto shrink-0">
              {filteredResources.length} websites ready
            </span>
          )}
        </div>

        {/* ── Search Bar Input ── */}
        <div className="relative">
          <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setDebouncedQuery(query);
                const trimmed = query.trim();
                if (trimmed) {
                  const targetUrl = selectedCategory !== "all" 
                    ? `/search?q=${encodeURIComponent(trimmed)}&category=${encodeURIComponent(selectedCategory)}`
                    : `/search?q=${encodeURIComponent(trimmed)}`;
                  router.push(targetUrl);
                }
              }
            }}
            placeholder="Type anything (e.g. 'movies dekhna hai', 'video download', 'photo edit', 'photoshop')..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#090D14] border border-[#20293D] text-zinc-100 placeholder:text-zinc-500 text-sm font-medium outline-none focus:border-sky-500 transition-all font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Recent Search History (Saved for easy next-time search) ── */}
        {recentSearches.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-0.5 border-t border-[#182133] pt-3">
            <span className="text-zinc-400 font-medium flex items-center gap-1 mr-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Recent:</span>
            </span>
            {recentSearches.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#141A29] hover:bg-[#1C253B] text-zinc-300 hover:text-white border border-[#20293D] transition-colors group cursor-pointer"
              >
                <button
                  type="button"
                  onClick={() => handleSelectTopic(item)}
                  className="text-left font-medium cursor-pointer"
                >
                  {item}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveHistory(item);
                  }}
                  className="text-zinc-500 hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer"
                  title="Remove from history"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 underline ml-1 cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* ── Quick Topic Links ── */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
          <span className="text-zinc-500 font-medium">Quick Topics:</span>
          {SUGGESTED_TOPICS.map((topic) => (
            <button
              key={topic.label}
              type="button"
              onClick={() => handleSelectTopic(topic.query, topic.cat)}
              className="px-2.5 py-1 rounded-lg text-xs bg-[#141A29] hover:bg-[#1C2438] text-zinc-300 hover:text-white border border-[#20293D] transition-colors cursor-pointer"
            >
              {topic.label}
            </button>
          ))}
        </div>

      </div>

      {/* ── Topic Hub Bar if Recognized ── */}
      {matchedTopic && targetCategory && targetCategory !== "all" && (
        <div className="rounded-xl bg-[#111624] border border-sky-500/25 px-4 py-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-200 min-w-0">
            <span className="text-sm shrink-0">✨</span>
            <span className="font-semibold text-white truncate">{matchedTopic}</span>
            <span className="text-zinc-500 hidden sm:inline">•</span>
            <span className="text-zinc-400 hidden sm:inline">Showing curated links</span>
          </div>

          <Link
            href={`/categories/${targetCategory}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-semibold transition-all shrink-0"
          >
            <span>Open {targetCategory.toUpperCase()} Hub</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* ── Filter Bar: Region Check & Highlight Tags ── */}
      {resources.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-[#0F1420] border border-[#1E2638] text-xs">
          {/* Region Check Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-zinc-400 font-medium flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Region:</span>
            </span>

            <button
              type="button"
              onClick={() => setRegionFilter("IN")}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer text-xs ${
                regionFilter === "IN"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold"
                  : "bg-[#141A29] text-zinc-400 border-[#20293D] hover:text-white"
              }`}
            >
              <span>🇮🇳 India (Running)</span>
              {detectedCountry === "IN" && (
                <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-200 font-mono">Auto</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setRegionFilter("all")}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-xs ${
                regionFilter === "all"
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold"
                  : "bg-[#141A29] text-zinc-400 border-[#20293D] hover:text-white"
              }`}
            >
              🌐 Global (All)
            </button>

            <button
              type="button"
              onClick={() => setRegionFilter("US")}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-xs ${
                regionFilter === "US"
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold"
                  : "bg-[#141A29] text-zinc-400 border-[#20293D] hover:text-white"
              }`}
            >
              🇺🇸 US / EU
            </button>
          </div>

          {/* Quick Highlight Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-zinc-500 font-medium text-xs">Filter:</span>
            {[
              { id: "all", label: "All" },
              { id: "no-ads", label: "🚫 No Ads" },
              { id: "hindi", label: "🇮🇳 Hindi / Dual" },
              { id: "download", label: "📥 Direct DL" },
              { id: "stream", label: "⚡ Fast Stream" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTagFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                  tagFilter === f.id
                    ? "bg-sky-500 text-black border-sky-400 font-bold"
                    : "bg-[#141A29] text-zinc-400 border-[#20293D] hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Results Container: Clean Category Boxes (Same as CategoryView) ── */}
      <div className="space-y-4">
        
        {/* Loading State */}
        {(!mounted || loading) && (
          <div className="py-16 text-center space-y-3">
            <div className="w-7 h-7 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-400 font-sans">Finding websites for &ldquo;{query}&rdquo;...</p>
          </div>
        )}

        {/* Structured Category Boxes with Full Website Names & 1-2 Highlight Keywords */}
        {!loading && boxGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-start">
            {boxGroups.map((box) => (
              <div
                key={box.id}
                className="rounded-2xl bg-[#0F1420] border border-[#1E2638] hover:border-[#2A364E] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all"
              >
                {/* Box Header: Bold Category Title with Proper Spacing */}
                <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-[#121826] border-b border-[#1E2638] flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-2.5 font-heading font-extrabold text-[15px] sm:text-[16px] text-white tracking-tight truncate">
                    <span className="text-base sm:text-lg select-none shrink-0">{box.emoji}</span>
                    <span className="truncate">{box.title}</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-[#1A2234] text-zinc-300 border border-[#242F45] shrink-0">
                    {box.items.length}
                  </span>
                </div>

                {/* Box Items: Full Website Name + 1-2 Highlight Keywords with Comfortable Spacing */}
                <div className="p-1.5 sm:p-2.5 flex flex-col gap-0.5 sm:gap-1">
                  {box.items.map((site) => {
                    const highlights = getHighlightKeywords(site);

                    return (
                      <a
                        key={site.id}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleOutboundClick(site.id)}
                        className="group/link flex items-center justify-between gap-2.5 sm:gap-3 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-zinc-200 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.12] transition-all cursor-pointer tracking-[-0.01em] min-h-[42px]"
                      >
                        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_5px_rgba(52,211,153,0.7)]" />
                          {site.verified && (
                            <span className="text-amber-400 text-xs shrink-0 select-none" title="Top Pick">⭐</span>
                          )}
                          <span className="font-semibold text-[13.5px] sm:text-[15px] text-zinc-100 group-hover/link:text-sky-300 truncate">
                            {site.name}
                          </span>
                        </div>

                        {/* 1-2 Highlight Keywords */}
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                          {highlights.map((kw, idx) => (
                            <span
                              key={idx}
                              className={`text-[9.5px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md border ${kw.color} whitespace-nowrap max-w-[110px] sm:max-w-none truncate`}
                            >
                              {kw.text}
                            </span>
                          ))}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && query.trim() && boxGroups.length === 0 && (
          <div className="py-16 px-6 text-center rounded-2xl bg-[#0F1420] border border-[#1E2638] space-y-4 max-w-lg mx-auto">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                No websites matched your filter for &ldquo;<span className="text-sky-400">{query}</span>&rdquo;
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Try switching the region filter or reset tags:
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => { setRegionFilter("all"); setTagFilter("all"); }}
                className="px-3 py-1.5 rounded-lg text-xs bg-sky-500 text-black font-semibold transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-20 text-center space-y-3">
          <div className="w-7 h-7 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Loading directory search...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
