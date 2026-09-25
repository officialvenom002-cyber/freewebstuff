"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowUp, 
  Search, 
  X,
  ChevronRight,
  WifiOff,
  ChevronDown,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { useUptimeChecker, SiteResult, setSiteHealthOverride } from "@/hooks/useUptimeChecker";
import { Category, Resource } from "@/lib/types";
import { pageview, event as trackGAEvent } from "@/lib/analytics/gtag";

const FMHY_SIDEBAR_WIKI = [
  { slug: "beginners-guide", name: "Quick Start",             emoji: "📖", isPage: true,     href: "/beginners-guide" },
  { slug: "privacy",         name: "Adblocking / Privacy",    emoji: "🛡️", isCategory: true, href: "/categories/privacy" },
  { slug: "ai",              name: "Artificial Intelligence",  emoji: "🤖", isCategory: true, href: "/categories/ai" },
  { slug: "video",           name: "Movies / TV / Anime",     emoji: "🎬", isCategory: true, href: "/categories/video" },
  { slug: "audio",           name: "Music / Podcasts / Radio",emoji: "🎵", isCategory: true, href: "/categories/audio" },
  { slug: "gaming",          name: "Gaming / Emulation",      emoji: "🎮", isCategory: true, href: "/categories/gaming" },
  { slug: "reading",         name: "Books / Comics / Manga",  emoji: "📚", isCategory: true, href: "/categories/reading" },
  { slug: "downloading",     name: "Downloading",             emoji: "💾", isCategory: true, href: "/categories/downloading" },
  { slug: "torrenting",      name: "Torrenting",              emoji: "🌊", isCategory: true, href: "/categories/torrenting" },
  { slug: "educational",     name: "Educational",             emoji: "🎓", isCategory: true, href: "/categories/educational" },
  { slug: "mobile",          name: "Android / iOS",           emoji: "📱", isCategory: true, href: "/categories/mobile" },
  { slug: "linux-macos",     name: "Linux / macOS",           emoji: "🐧", isCategory: true, href: "/categories/linux-macos" },
  { slug: "non-english",     name: "Non-English",             emoji: "🌐", isCategory: true, href: "/categories/non-english" },
  { slug: "misc",            name: "Miscellaneous",           emoji: "✨", isCategory: true, href: "/categories/misc" },
  { slug: "offline",         name: "Offline Websites",        emoji: "🔴", isPage: true,     href: "/categories/offline" },
];

const FMHY_SIDEBAR_TOOLS = [
  { slug: "system-tools",       name: "System Tools",       emoji: "🛠️", href: "/categories/system-tools" },
  { slug: "file-tools",         name: "File Tools",         emoji: "📁", href: "/categories/file-tools" },
  { slug: "internet-tools",     name: "Internet Tools",     emoji: "🌐", href: "/categories/internet-tools" },
  { slug: "social-media-tools", name: "Social Media Tools", emoji: "💬", href: "/categories/social-media-tools" },
  { slug: "text-tools",         name: "Text Tools",         emoji: "📝", href: "/categories/text-tools" },
  { slug: "gaming-tools",       name: "Gaming Tools",       emoji: "🕹️", href: "/categories/gaming-tools" },
  { slug: "image-tools",        name: "Image Tools",        emoji: "🖼️", href: "/categories/image-tools" },
  { slug: "video-tools",        name: "Video Tools",        emoji: "🎥", href: "/categories/video-tools" },
  { slug: "developer-tools",    name: "Developer Tools",    emoji: "💻", href: "/categories/developer-tools" },
  { slug: "storage",            name: "Storage",            emoji: "☁️", href: "/categories/storage" },
];

export type { PrivacySectionItem, PrivacySection, WebsiteEntry, TypedBox } from "@/lib/categories/boxExtractor";
import { 
  PrivacySectionItem, 
  PrivacySection, 
  WebsiteEntry, 
  TypedBox, 
  ACCENT_MAP, 
  ACCENT_CYCLE, 
  buildTypedBoxes 
} from "@/lib/categories/boxExtractor";

interface CategoryViewProps {
  category: Category;
  allResources: Resource[];
  initialBoxesProp?: TypedBox[];
  initialSectionsProp?: PrivacySection[];
  initialSub?: string;
  initialSort?: string;
}

interface CategoryCacheData {
  id: string;
  slug: string;
  name: string;
  description?: string;
  boxes: TypedBox[];
}

let globalDeletedSet: Set<string> | null = null;
let globalAllCategoriesCache: Record<string, CategoryCacheData> | null = null;
let globalFetchPromise: Promise<Record<string, CategoryCacheData>> | null = null;

function loadAllCategoriesCache(): Promise<Record<string, CategoryCacheData>> {
  if (globalAllCategoriesCache) return Promise.resolve(globalAllCategoriesCache);
  if (globalFetchPromise) return globalFetchPromise;

  globalFetchPromise = fetch("/data/all-categories-boxes.json", { cache: "default" })
    .then((r) => r.json())
    .then((data: Record<string, CategoryCacheData>) => {
      globalAllCategoriesCache = data;
      return data;
    })
    .catch(() => ({}));

  return globalFetchPromise;
}

export default function CategoryView({
  category,
  allResources,
  initialBoxesProp,
  initialSectionsProp,
}: CategoryViewProps) {
  const mainRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<Category>(category);
  const [activeBoxes, setActiveBoxes] = useState<TypedBox[]>(() => initialBoxesProp || []);

  const [selectedPill, setSelectedPill] = useState<string>("all");
  const [searchQuery, setSearchQuery]   = useState("");
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [deletedSet, setDeletedSet] = useState<Set<string>>(() => globalDeletedSet || new Set());

  // Background-preload all category boxes so clicking any sidebar item is instant (0ms)
  useEffect(() => {
    loadAllCategoriesCache().then((cache) => {
      if ((!activeBoxes || activeBoxes.length === 0) && cache[activeCategory.slug]) {
        setActiveBoxes(cache[activeCategory.slug].boxes);
      }
    });
  }, [activeCategory.slug, activeBoxes]);

  // Sync if prop category changes from external navigation
  useEffect(() => {
    setActiveCategory(category);
    if (initialBoxesProp && initialBoxesProp.length > 0) {
      setActiveBoxes(initialBoxesProp);
    } else if (globalAllCategoriesCache && globalAllCategoriesCache[category.slug]) {
      setActiveBoxes(globalAllCategoriesCache[category.slug].boxes);
    }
    setSelectedPill("all");
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [category.slug, initialBoxesProp]);

  // Support browser Back/Forward buttons instantaneously
  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/\/categories\/([^/?#]+)/);
      if (match && match[1]) {
        const targetSlug = match[1];
        if (globalAllCategoriesCache && globalAllCategoriesCache[targetSlug]) {
          const item = globalAllCategoriesCache[targetSlug];
          setActiveCategory({
            id: item.id || targetSlug,
            name: item.name,
            slug: item.slug,
            description: item.description,
          });
          setActiveBoxes(item.boxes);
          setSelectedPill("all");
          setSearchQuery("");
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch site-config deleted websites once
  useEffect(() => {
    if (globalDeletedSet) return;
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg && Array.isArray(cfg.deletedWebsites)) {
          const s = new Set<string>();
          cfg.deletedWebsites.forEach((u: string) => {
            const clean = u.trim();
            s.add(clean);
            s.add(clean.replace(/\/+$/, ""));
          });
          globalDeletedSet = s;
          setDeletedSet(s);
        }
      })
      .catch(() => {});
  }, []);

  // Instant 0ms category switch handler
  const handleCategorySwitch = (
    item: { slug: string; name: string; href: string; isPage?: boolean },
    e: React.MouseEvent
  ) => {
    if (item.isPage) return; // Allow normal link navigation for /beginners-guide

    const cached = globalAllCategoriesCache?.[item.slug];
    if (cached) {
      e.preventDefault();
      setActiveCategory({
        id: cached.id || item.slug,
        name: cached.name,
        slug: cached.slug,
        description: cached.description,
      });
      setActiveBoxes(cached.boxes);
      setSelectedPill("all");
      setSearchQuery("");
      window.history.pushState({ slug: item.slug }, "", item.href);
      const newTitle = `${cached.name} Directory 2026 — Best Free Tools, Websites & Software | FreeWebStuff`;
      document.title = newTitle;
      pageview(item.href, newTitle);
      trackGAEvent("category_switch", {
        category_name: cached.name,
        category_slug: item.slug,
      });
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // If cache not yet resolved, fetch and switch seamlessly without a multi-second page load
    e.preventDefault();
    loadAllCategoriesCache().then((cache) => {
      const target = cache[item.slug];
      if (target) {
        setActiveCategory({
          id: target.id || item.slug,
          name: target.name,
          slug: target.slug,
          description: target.description,
        });
        setActiveBoxes(target.boxes);
        setSelectedPill("all");
        setSearchQuery("");
        window.history.pushState({ slug: item.slug }, "", item.href);
        const newTitle = `${target.name} Directory 2026 — Best Free Tools, Websites & Software | FreeWebStuff`;
        document.title = newTitle;
        pageview(item.href, newTitle);
        trackGAEvent("category_switch", {
          category_name: target.name,
          category_slug: item.slug,
        });
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        window.location.href = item.href;
      }
    });
  };

  const initialSections: PrivacySection[] = useMemo(() => {
    if (initialSectionsProp && initialSectionsProp.length > 0) return initialSectionsProp;
    return (category.subcategories || []).map((sub) => {
      const subItems = (allResources || [])
        .filter((r) => r.subcategoryId === sub.id)
        .map((r, i) => ({
          id: `${sub.id}-${i}`,
          raw: `**[${r.name}](${r.url})** - ${r.description}`,
          isStarred: !!r.featured,
          isIndex: false,
          isCrossLink: false,
        }));
      return { id: sub.slug, slug: sub.slug, title: sub.name, level: 2, tip: null, items: subItems };
    });
  }, [category, allResources, initialSectionsProp]);

  const typedBoxes: TypedBox[] = useMemo(() => {
    const sourceBoxes = activeBoxes.length > 0 ? activeBoxes : buildTypedBoxes(activeCategory.slug, initialSections, deletedSet);
    if (deletedSet.size === 0) return sourceBoxes;
    return sourceBoxes
      .map((box) => ({
        ...box,
        websites: box.websites.filter(
          (w) => !deletedSet.has(w.url) && !deletedSet.has(w.url.replace(/\/+$/, ""))
        ),
      }))
      .filter((b) => b.websites.length > 0);
  }, [activeBoxes, activeCategory.slug, initialSections, deletedSet]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Uptime checking ──
  const allUrls = useMemo(() => {
    return typedBoxes.flatMap((b) => b.websites.map((s) => s.url));
  }, [typedBoxes]);
  const uptimeMap = useUptimeChecker(allUrls);

  // Automatically separate live websites and non-live (offline/down) websites
  const { cleanTypedBoxes, offlineBox, offlineCount } = useMemo(() => {
    const offlineSites: (WebsiteEntry & { originalBoxTitle?: string })[] = [];
    const map = uptimeMap || {};

    const liveOnlyBoxes: TypedBox[] = [];

    for (const box of typedBoxes) {
      const liveList: WebsiteEntry[] = [];
      for (const site of box.websites) {
        if (map[site.url]?.status === "down") {
          offlineSites.push({
            ...site,
            originalBoxTitle: box.title,
          });
        } else {
          liveList.push(site);
        }
      }
      if (liveList.length > 0) {
        liveOnlyBoxes.push({
          ...box,
          websites: liveList,
        });
      }
    }

    let offBox: TypedBox | null = null;
    if (offlineSites.length > 0) {
      offBox = {
        id: "offline-category-box",
        slug: "offline-sites",
        title: "Offline & Inactive Sites",
        emoji: "🔴",
        accent: "rose",
        tagline: "Websites in this category automatically moved here due to downtime or failed health checks",
        websites: offlineSites,
      };
    }

    return {
      cleanTypedBoxes: liveOnlyBoxes,
      offlineBox: offBox,
      offlineCount: offlineSites.length,
    };
  }, [typedBoxes, uptimeMap]);

  const filteredBoxes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // If viewing exclusively offline sites
    if (selectedPill === "offline-sites") {
      if (!offlineBox) return [];
      let websites = offlineBox.websites;
      if (filterStarredOnly) websites = websites.filter((w) => w.isStarred);
      if (q) websites = websites.filter((w) => w.name.toLowerCase().includes(q) || offlineBox.title.toLowerCase().includes(q));
      return [{ ...offlineBox, websites }].filter((b) => b.websites.length > 0);
    }

    // Filter through live clean boxes
    const filtered = cleanTypedBoxes.map((box) => {
      if (selectedPill !== "all" && box.slug !== selectedPill) return null;
      let websites = box.websites;
      if (filterStarredOnly) websites = websites.filter((w) => w.isStarred);
      if (q) websites = websites.filter((w) => w.name.toLowerCase().includes(q) || box.title.toLowerCase().includes(q));
      return { ...box, websites };
    }).filter((box): box is TypedBox => box !== null && (box.websites.length > 0 || (!filterStarredOnly && !q)));

    // When "all" is selected, also append the offlineBox at the bottom if offline sites exist
    if (selectedPill === "all" && offlineBox && !filterStarredOnly && !q) {
      filtered.push(offlineBox);
    }

    return filtered;
  }, [cleanTypedBoxes, offlineBox, selectedPill, filterStarredOnly, searchQuery]);

  const totalCount = useMemo(() => cleanTypedBoxes.reduce((a, b) => a + b.websites.length, 0), [cleanTypedBoxes]);

  return (
    <div className="flex flex-col min-h-screen">

      <div className="flex gap-0 xl:gap-6 flex-1 max-w-[1760px] mx-auto w-full px-3 sm:px-5 xl:px-8 py-5">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-60 xl:w-68 shrink-0 hidden lg:flex flex-col gap-3.5 sticky top-20 z-10 self-start max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar pb-4">
          
          <div className="bg-[#0b0e15] border border-[#1c2132] rounded-2xl p-3.5 shadow-lg">
            <p className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-[0.12em] px-1 pb-2.5 mb-1.5 border-b border-[#1a2030] font-mono">
              📋 Wiki Directory
            </p>
            <nav className="space-y-1">
              {FMHY_SIDEBAR_WIKI.map((item) => {
                const isActive = item.isCategory && activeCategory.slug === item.slug;
                return (
                  <Link 
                    key={item.slug} 
                    href={item.href} 
                    prefetch={true}
                    onClick={(e) => handleCategorySwitch(item, e)}
                    onMouseEnter={() => loadAllCategoriesCache()}
                    className={`flex items-center gap-2.5 py-2 px-3 rounded-xl text-[13.5px] font-sans tracking-tight transition-all duration-150 truncate cursor-pointer ${
                      isActive
                        ? "bg-sky-500/12 text-sky-300 font-semibold border border-sky-500/25 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 font-medium"
                    }`}
                  >
                    <span className="text-sm select-none">{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="bg-[#0b0e15] border border-[#1c2132] rounded-2xl p-3.5 shadow-lg">
            <p className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-[0.12em] px-1 pb-2.5 mb-1.5 border-b border-[#1a2030] font-mono">
              🔧 Tools Directory
            </p>
            <nav className="space-y-1">
              {FMHY_SIDEBAR_TOOLS.map((item) => {
                const isActive = activeCategory.slug === item.slug;
                return (
                  <Link 
                    key={item.slug} 
                    href={item.href} 
                    prefetch={true}
                    onClick={(e) => handleCategorySwitch(item, e)}
                    onMouseEnter={() => loadAllCategoriesCache()}
                    className={`flex items-center gap-2.5 py-2 px-3 rounded-xl text-[13.5px] font-sans tracking-tight transition-all duration-150 truncate cursor-pointer ${
                      isActive
                        ? "bg-sky-500/12 text-sky-300 font-semibold border border-sky-500/25 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 font-medium"
                    }`}
                  >
                    <span className="text-sm select-none">{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Filter Panel */}
          <div className="bg-[#0b0e15] border border-[#1c2132] rounded-2xl p-3.5 shadow-lg">
            <p className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-[0.12em] px-1 pb-2.5 mb-1.5 border-b border-[#1a2030] font-mono">
              ⚙️ Filters
            </p>
            <label className="flex items-center justify-between text-zinc-300 cursor-pointer hover:text-white transition-colors py-1 px-1 text-[13.5px] font-sans font-medium">
              <span className="flex items-center gap-2"><span>⭐</span><span>Top Picks Only</span></span>
              <input 
                type="checkbox" 
                checked={filterStarredOnly} 
                onChange={(e) => setFilterStarredOnly(e.target.checked)} 
                className="rounded-md accent-sky-400 w-4 h-4 cursor-pointer" 
              />
            </label>
          </div>

        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0 space-y-5 page-smooth-enter" ref={mainRef}>

          {/* Top Bar with Breadcrumb and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link href="/" prefetch={true} className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-sans font-medium group">
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-white font-extrabold text-sm font-heading tracking-[-0.015em]">
                {activeCategory.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#131824] text-zinc-400 border border-[#1e2637]">
                {totalCount} sites
              </span>
              {offlineCount > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedPill("offline-sites")}
                  className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 transition-colors cursor-pointer"
                  title="View sites in this category automatically moved to offline"
                >
                  {offlineCount} offline
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search websites..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0f1420] border border-[#1e2637] text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-sky-500/60 focus:bg-[#101624] transition-all font-sans font-normal"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery("")} 
                  aria-label="Clear search"
                  title="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Type Filter Pills Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            <button
              onClick={() => setSelectedPill("all")}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-heading whitespace-nowrap transition-all duration-200 tracking-[-0.01em] ${
                selectedPill === "all"
                  ? "bg-white text-zinc-950 font-bold shadow-sm"
                  : "bg-[#0f1420] text-zinc-400 hover:text-zinc-200 hover:bg-[#141c2c] border border-[#1e2637] font-medium"
              }`}
            >
              All ({cleanTypedBoxes.length})
            </button>
            {cleanTypedBoxes.map((box) => {
              const ac = ACCENT_MAP[box.accent] || ACCENT_MAP.sky;
              const isActive = selectedPill === box.slug;
              return (
                <button
                  key={box.id}
                  onClick={() => setSelectedPill(box.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-heading whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 tracking-[-0.01em] ${
                    isActive
                      ? `${ac.pillActive} font-bold shadow-sm`
                      : "bg-[#0f1420] text-zinc-400 hover:text-zinc-200 hover:bg-[#141c2c] border border-[#1e2637] font-medium"
                  }`}
                >
                  <span className="text-sm select-none">{box.emoji}</span>
                  <span>{box.title}</span>
                  <span className={`text-[10.5px] font-mono font-medium px-1.5 rounded-full ${isActive ? "bg-black/20 text-white/90" : "bg-[#1a2233] text-zinc-500"}`}>
                    {box.websites.length}
                  </span>
                </button>
              );
            })}
            {offlineCount > 0 && (
              <button
                onClick={() => setSelectedPill("offline-sites")}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-heading whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 tracking-[-0.01em] ${
                  selectedPill === "offline-sites"
                    ? "bg-red-500 text-white font-bold shadow-sm"
                    : "bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/30 font-medium"
                }`}
              >
                <span className="text-sm select-none">🔴</span>
                <span>Offline</span>
                <span className="text-[10.5px] font-mono font-medium px-1.5 rounded-full bg-red-950/60 text-red-300 border border-red-500/30">
                  {offlineCount}
                </span>
              </button>
            )}
          </div>

          {/* ── BOXES MASONRY COLUMNS ── */}
          {filteredBoxes.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#0c0f16] border border-[#1b212f] text-zinc-500 space-y-3 shadow-lg">
              <p className="text-sm font-heading font-semibold text-zinc-300">No websites found matching your filter.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedPill("all"); setFilterStarredOnly(false); }} 
                className="text-xs font-sans text-sky-400 hover:text-sky-300 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-4">
              {filteredBoxes.map((box) => {
                const ac = ACCENT_MAP[box.accent] || ACCENT_MAP.sky;
                return (
                  <section
                    key={box.id}
                    id={box.slug}
                    className={`category-box-card break-inside-avoid mb-4 w-full rounded-2xl bg-[#0c0f17] border border-[#1b2130] shadow-md flex flex-col overflow-hidden transition-all duration-200 ${ac.border} ${ac.glow} group hover:shadow-xl hover:border-opacity-70`}
                    style={{
                      boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    {/* Box Header */}
                    <div className={`px-5 py-3.5 bg-gradient-to-r ${ac.header} to-transparent border-b border-[#181f2e] flex items-start justify-between gap-3`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl select-none leading-none pt-0.5 shrink-0">
                          {box.emoji}
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-[15px] font-extrabold text-white leading-snug tracking-[-0.015em] font-heading truncate">
                            {box.title}
                          </h2>
                          {box.tagline && (
                            <p className="text-[11.5px] text-zinc-400 mt-0.5 font-sans font-normal tracking-[-0.005em] truncate">
                              {box.tagline}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-zinc-400 bg-[#111827]/80 border border-[#1e2840] px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                        {box.websites.length}
                      </span>
                    </div>

                    {/* Website list — split up/down */}
                    <BoxWebsiteList
                      box={box}
                      ac={ac}
                      uptimeMap={uptimeMap}
                    />
                  </section>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 shadow-xl active:scale-95 transition-all duration-150 z-40 cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────
   BoxWebsiteList — renders live sites + collapsible "Down" section
   ───────────────────────────────────────────────────────────────────────── */

interface BoxWebsiteListProps {
  box: TypedBox;
  ac: (typeof ACCENT_MAP)[string];
  uptimeMap: Record<string, SiteResult>;
}

function StatusDot({ status }: { status: SiteResult["status"] }) {
  if (status === "checking") {
    return (
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300" />
      </span>
    );
  }
  if (status === "up")
    return <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_4px_rgba(52,211,153,0.7)]" />;
  if (status === "down")
    return <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-[0_0_4px_rgba(239,68,68,0.6)]" />;
  return <span className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />;
}

function OfflineBoxWebsiteItem({ site }: { site: WebsiteEntry & { originalBoxTitle?: string } }) {
  const [testing, setTesting] = useState(false);
  const [restored, setRestored] = useState(false);

  const handleRetest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTesting(true);
    try {
      const res = await fetch(`/api/uptime?url=${encodeURIComponent(site.url)}`);
      const data = await res.json();
      if (data && data.ok) {
        setRestored(true);
        setSiteHealthOverride(site.url, "up", data.latency, data.updatedUrl);
      }
    } catch {
      // Still down
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2.5 py-2 px-3 rounded-xl bg-red-950/20 border border-red-500/15 hover:border-red-500/30 transition-all duration-150">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className={`w-2 h-2 rounded-full shrink-0 ${restored ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.7)]"}`} />
        <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[13px] font-sans font-medium truncate transition-colors ${restored ? "text-emerald-300" : "text-zinc-400 hover:text-white line-through hover:no-underline"}`}
            title="Attempt to open offline website in new tab"
          >
            {site.name}
          </a>
          {site.originalBoxTitle && (
            <span className="text-[10px] font-mono text-zinc-500 bg-[#141a29] px-1.5 py-0.5 rounded border border-[#20293d] shrink-0 w-fit">
              from {site.originalBoxTitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {restored ? (
          <span className="text-[10.5px] font-mono text-emerald-400 font-semibold">Restored!</span>
        ) : (
          <button
            type="button"
            onClick={handleRetest}
            disabled={testing}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1 text-[11px] font-sans"
            title="Re-test if site has come back online"
          >
            <RefreshCw className={`w-3 h-3 ${testing ? "animate-spin text-sky-400" : ""}`} />
            <span className="hidden sm:inline">{testing ? "Probing..." : "Re-test"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function BoxWebsiteList({ box, ac, uptimeMap }: BoxWebsiteListProps) {
  const [downOpen, setDownOpen] = useState(false);

  // If this is the dedicated offline box, render the offline list directly
  if (box.slug === "offline-sites") {
    return (
      <div className="p-3 flex flex-col gap-1.5">
        {box.websites.map((site) => (
          <OfflineBoxWebsiteItem key={site.id + site.url} site={site as any} />
        ))}
      </div>
    );
  }

  const { liveSites, downSites } = useMemo(() => {
    const live: typeof box.websites = [];
    const down: typeof box.websites = [];
    const map = uptimeMap || {};
    const list = box?.websites || [];
    for (const site of list) {
      if (!site || !site.url) continue;
      if (map[site.url]?.status === "down") down.push(site);
      else live.push(site);
    }
    return { liveSites: live, downSites: down };
  }, [box?.websites, uptimeMap]);

  const checkingCount = useMemo(
    () => box.websites.filter((s) => uptimeMap[s.url]?.status === "checking").length,
    [box.websites, uptimeMap]
  );

  const allChecked = checkingCount === 0 && liveSites.some((s) => uptimeMap[s.url]?.status === "up");

  return (
    <div className="flex flex-col">
      {/* Live / unchecked sites */}
      <div className="p-3">
        <div className="flex flex-col gap-0.5">
          {liveSites.map((site) => {
            const r = uptimeMap[site.url];
            const targetUrl = r?.updatedUrl || site.url;
            const isRedirected = Boolean(r?.updatedUrl && r.updatedUrl !== site.url);

            return (
              <a
                key={site.id}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center gap-2.5 py-2 px-3 rounded-xl text-[13.5px] font-sans font-medium text-zinc-300 hover:text-white transition-all duration-150 hover:bg-white/[0.06] cursor-pointer tracking-[-0.005em]"
              >
                <StatusDot status={r?.status ?? "up"} />
                {site.isStarred && (
                  <span className="text-amber-400 text-[10px] select-none shrink-0" title="Top Pick">⭐</span>
                )}
                <span className="truncate leading-none flex-1">{site.name}</span>
                {isRedirected && (
                  <span
                    className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/25 shrink-0"
                    title={`Domain automatically updated to: ${targetUrl}`}
                  >
                    updated
                  </span>
                )}
                {r?.status === "up" && r.latency && (
                  <span className="text-[10px] font-mono text-zinc-600 shrink-0 hidden group-hover/link:inline">
                    {r.latency}ms
                  </span>
                )}
              </a>
            );
          })}
          {checkingCount > 0 && (
            <div className="flex items-center gap-2 py-1.5 px-3 text-[11.5px] text-zinc-600 font-sans">
              <RefreshCw className="w-3 h-3 animate-spin opacity-50" />
              <span>Checking {checkingCount} site{checkingCount > 1 ? "s" : ""}…</span>
            </div>
          )}
        </div>
      </div>

      {/* All online badge */}
      {downSites.length === 0 && allChecked && (
        <div className="flex items-center gap-1.5 mx-3 mb-2.5 px-3 py-1.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/15">
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-emerald-400 font-medium font-sans">All sites online</span>
        </div>
      )}

      {/* Down sites collapsible */}
      {downSites.length > 0 && (
        <div className="mx-3 mb-3 rounded-xl border border-red-500/20 bg-red-950/20 overflow-hidden">
          <button
            type="button"
            onClick={() => setDownOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left cursor-pointer hover:bg-red-500/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-[12px] font-semibold text-red-400 font-heading tracking-tight">
                Down / Unreachable
              </span>
              <span className="text-[10.5px] font-mono bg-red-500/15 text-red-400 border border-red-500/25 px-1.5 py-0.5 rounded-full">
                {downSites.length}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-red-500/60 transition-transform duration-200 ${downOpen ? "rotate-180" : ""}`}
            />
          </button>

          {downOpen && (
            <div className="flex flex-col gap-0.5 px-2 pb-2.5">
              {downSites.map((site) => {
                const r = uptimeMap?.[site.url];
                const targetUrl = r?.updatedUrl || site.url || "#";
                return (
                  <a
                    key={site.id}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg text-[12.5px] font-sans font-medium text-zinc-500 hover:text-red-300 transition-all duration-150 hover:bg-red-500/[0.07] cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 opacity-70" />
                    <span className="truncate leading-none flex-1 line-through decoration-red-800/60">
                      {site.name}
                    </span>
                    <span className="text-[10px] font-mono text-red-600/70 shrink-0">
                      {!r?.httpStatus || r.httpStatus === 0
                        ? "offline"
                        : r.httpStatus === 408
                        ? "timeout"
                        : `${r.httpStatus}`}
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
