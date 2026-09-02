"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Shuffle, 
  ArrowUp, 
  Info,
  ExternalLink,
  Search,
  Star,
  Layers,
  LayoutGrid,
  List,
  Sparkles,
  Copy,
  Check,
  Hash,
  Filter,
  X
} from "lucide-react";
import { Category, Resource } from "@/lib/types";

// Wiki & Tools Category Structure for the Left Column
const FMHY_SIDEBAR_WIKI = [
  { slug: "beginners-guide", name: "Beginners Guide",        emoji: "📖", isPage: true,     href: "/beginners-guide" },
  { slug: "privacy",         name: "Adblocking / Privacy",   emoji: "🛡️", isCategory: true, href: "/categories/privacy" },
  { slug: "ai",              name: "Artificial Intelligence", emoji: "🤖", isCategory: true, href: "/categories/ai" },
  { slug: "video",           name: "Movies / TV / Anime",    emoji: "🎬", isCategory: true, href: "/categories/video" },
  { slug: "audio",           name: "Music / Podcasts / Radio", emoji: "🎵", isCategory: true, href: "/categories/audio" },
  { slug: "gaming",          name: "Gaming / Emulation",     emoji: "🎮", isCategory: true, href: "/categories/gaming" },
  { slug: "reading",         name: "Books / Comics / Manga", emoji: "📚", isCategory: true, href: "/categories/reading" },
  { slug: "downloading",     name: "Downloading",            emoji: "💾", isCategory: true, href: "/categories/downloading" },
  { slug: "torrenting",      name: "Torrenting",             emoji: "🌊", isCategory: true, href: "/categories/torrenting" },
  { slug: "educational",     name: "Educational",            emoji: "🎓", isCategory: true, href: "/categories/educational" },
  { slug: "mobile",          name: "Android / iOS",          emoji: "📱", isCategory: true, href: "/categories/mobile" },
  { slug: "linux-macos",     name: "Linux / macOS",          emoji: "🐧", isCategory: true, href: "/categories/linux-macos" },
  { slug: "non-english",     name: "Non-English",            emoji: "🌐", isCategory: true, href: "/categories/non-english" },
  { slug: "misc",            name: "Miscellaneous",          emoji: "✨", isCategory: true, href: "/categories/misc" },
];

const FMHY_SIDEBAR_TOOLS = [
  { slug: "system-tools",       name: "System Tools",        emoji: "🛠️", href: "/categories/system-tools" },
  { slug: "file-tools",         name: "File Tools",          emoji: "📁", href: "/categories/file-tools" },
  { slug: "internet-tools",     name: "Internet Tools",      emoji: "🌐", href: "/categories/internet-tools" },
  { slug: "social-media-tools", name: "Social Media Tools",  emoji: "💬", href: "/categories/social-media-tools" },
  { slug: "text-tools",         name: "Text Tools",          emoji: "📝", href: "/categories/text-tools" },
  { slug: "gaming-tools",       name: "Gaming Tools",        emoji: "🕹️", href: "/categories/gaming-tools" },
  { slug: "image-tools",        name: "Image Tools",         emoji: "🖼️", href: "/categories/image-tools" },
  { slug: "video-tools",        name: "Video Tools",         emoji: "🎥", href: "/categories/video-tools" },
  { slug: "developer-tools",    name: "Developer Tools",     emoji: "💻", href: "/categories/developer-tools" },
  { slug: "storage",            name: "Storage",             emoji: "☁️", href: "/categories/storage" },
];

export interface PrivacySectionItem {
  id: string;
  raw: string;
  isStarred: boolean;
  isIndex: boolean;
  isCrossLink: boolean;
}

export interface PrivacySection {
  id: string;
  slug: string;
  title: string;
  titleUrl?: string | null;
  level: number;
  tip?: string | null;
  items: PrivacySectionItem[];
}

interface CategoryViewProps {
  category: Category;
  allResources: Resource[];
  initialSectionsProp?: PrivacySection[];
  initialSub?: string;
  initialSort?: string;
}

// Structured parsed resource model for card presentation
interface ParsedResourceItem {
  id: string;
  raw: string;
  titleNodes: React.ReactNode[];
  descriptionNodes: React.ReactNode[];
  extraLinks: Array<{ label: string; url: string }>;
  isStarred: boolean;
  isIndex: boolean;
  isCrossLink: boolean;
}

// Parse markdown text with inline links and styling
function parseMarkdownInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  // Match: **[Link](url)**, [Link](url), `code`, or **bold**
  const regex = /(\*\*\[([^\]]+)\]\((https?:\/\/[^\)]+|#[^\)]+)\)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+|#[^\)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*)/;

  while (remaining) {
    const match = remaining.match(regex);
    if (!match) {
      parts.push(remaining);
      break;
    }

    const matchIndex = match.index || 0;
    if (matchIndex > 0) {
      parts.push(remaining.slice(0, matchIndex));
    }

    const fullMatch = match[0];
    if (match[2] && match[3]) {
      // **[Bold Link](url)**
      const href = match[3];
      const isExternal = href.startsWith("http");
      parts.push(
        <strong key={keyIdx++} className="font-bold">
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-sky-500/40 hover:decoration-sky-300 font-bold transition-colors duration-150 inline-flex items-center gap-1"
          >
            <span>{match[2]}</span>
            {isExternal && <ExternalLink className="w-3 h-3 opacity-70" />}
          </a>
        </strong>
      );
    } else if (match[4] && match[5]) {
      // [Normal Link](url)
      const href = match[5];
      const isExternal = href.startsWith("http");
      parts.push(
        <a
          key={keyIdx++}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-sky-500/40 hover:decoration-sky-300 font-medium transition-colors duration-150 inline-flex items-center gap-0.5"
        >
          <span>{match[4]}</span>
          {isExternal && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
        </a>
      );
    } else if (match[6]) {
      // `code` (e.g. passwords, hashes)
      parts.push(
        <code
          key={keyIdx++}
          className="px-1.5 py-0.5 rounded bg-[#161c28] text-sky-300 font-mono text-xs border border-white/10 select-all"
        >
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      // **Bold Text**
      parts.push(
        <strong key={keyIdx++} className="font-bold text-zinc-100">
          {match[7]}
        </strong>
      );
    }

    remaining = remaining.slice(matchIndex + fullMatch.length);
  }

  return parts;
}

// Parse raw line into structured title, description, and auxiliary links
function parseStructuredItem(item: PrivacySectionItem): ParsedResourceItem {
  const raw = item.raw;
  // Separate on " - " or " – "
  const splitIndex = raw.search(/\s+[-–—]\s+/);
  
  let titlePart = raw;
  let descPart = "";

  if (splitIndex !== -1) {
    titlePart = raw.slice(0, splitIndex).trim();
    descPart = raw.slice(splitIndex + 3).trim();
  }

  // Extract extra links like [Discord](...), [GitHub](...), [Mirrors](...) from descPart
  const extraLinks: Array<{ label: string; url: string }> = [];
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(descPart)) !== null) {
    extraLinks.push({ label: match[1], url: match[2] });
  }

  return {
    id: item.id,
    raw,
    titleNodes: parseMarkdownInline(titlePart),
    descriptionNodes: descPart ? parseMarkdownInline(descPart) : [],
    extraLinks,
    isStarred: item.isStarred,
    isIndex: item.isIndex,
    isCrossLink: item.isCrossLink
  };
}

export default function CategoryView({
  category,
  allResources,
  initialSectionsProp,
}: CategoryViewProps) {
  const mainRef = useRef<HTMLDivElement>(null);

  const initialSections: PrivacySection[] = useMemo(() => {
    if (initialSectionsProp && initialSectionsProp.length > 0) {
      return initialSectionsProp;
    }

    // Dynamic generation fallback
    return (category.subcategories || []).map((sub) => {
      const subItems = allResources
        .filter((r) => r.subcategoryId === sub.id)
        .map((r, i) => ({
          id: `${sub.id}-${i}`,
          raw: `**[${r.name}](${r.url})** - ${r.description}`,
          isStarred: !!r.featured,
          isIndex: false,
          isCrossLink: false,
        }));

      return {
        id: sub.slug,
        slug: sub.slug,
        title: sub.name,
        level: 2,
        tip: null,
        items: subItems,
      };
    });
  }, [category, allResources, initialSectionsProp]);

  const [sections, setSections] = useState<PrivacySection[]>(initialSections);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [selectedSubcategoryPill, setSelectedSubcategoryPill] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"boxes" | "grid">("boxes");
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [filterIndexesOnly, setFilterIndexesOnly] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync sections when switching between categories
  useEffect(() => {
    setSections(initialSections);
    setSelectedSubcategoryPill("all");
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [initialSections]);

  const handleReshuffle = () => {
    const newSections = sections.map((sec) => {
      const shuffledItems = [...sec.items];
      for (let i = shuffledItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
      }
      return { ...sec, items: shuffledItems };
    });
    setSections(newSections);
  };

  const handleCopyLink = (secSlug: string, itemId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${secSlug}`;
      navigator.clipboard.writeText(url);
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Scroll tracking for TOC highlight & back-to-top
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 350);

          const scrollPos = window.scrollY + 140;
          let current = "";
          for (const sec of sections) {
            const el = document.getElementById(sec.slug);
            if (el && scrollPos >= el.offsetTop) {
              current = sec.slug;
            }
          }
          if (current) {
            setActiveSectionId(current);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Total items count
  const totalItemCount = useMemo(() => {
    return sections.reduce((acc, s) => acc + s.items.length, 0);
  }, [sections]);

  // Filtered sections and structured parsed items
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return sections
      .map((sec) => {
        // If filtering by specific subcategory pill
        if (selectedSubcategoryPill !== "all" && sec.slug !== selectedSubcategoryPill) {
          return null;
        }

        let items = sec.items;

        if (filterStarredOnly) {
          items = items.filter((it) => it.isStarred);
        }

        if (filterIndexesOnly) {
          items = items.filter((it) => it.isIndex);
        }

        if (q) {
          items = items.filter((it) => 
            it.raw.toLowerCase().includes(q) || sec.title.toLowerCase().includes(q)
          );
        }

        return {
          ...sec,
          items,
          parsedItems: items.map(parseStructuredItem)
        };
      })
      .filter((sec): sec is (PrivacySection & { parsedItems: ParsedResourceItem[] }) => 
        sec !== null && (sec.items.length > 0 || (!filterStarredOnly && !filterIndexesOnly && !q))
      );
  }, [sections, selectedSubcategoryPill, filterStarredOnly, filterIndexesOnly, searchQuery]);

  const scrollToAnchor = (slug: string) => {
    setSelectedSubcategoryPill("all");
    setTimeout(() => {
      const el = document.getElementById(slug);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-up">

      {/* ══════════════ MAIN 3-COLUMN LAYOUT ══════════════ */}
      <div className="flex gap-0 xl:gap-7 flex-1 max-w-[1720px] mx-auto w-full px-2 sm:px-4 xl:px-6 py-4">

        {/* ══════ 1. LEFT SIDEBAR (WIKI + TOOLS NAV) ══════ */}
        <aside className="w-52 xl:w-60 shrink-0 hidden lg:flex flex-col gap-4 sticky top-20 z-10 self-start max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar pb-4 animate-slide-in-left">
          
          {/* Wiki Section */}
          <div className="bg-[#0b0e14] border border-[#1d222e] rounded-2xl p-3 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1 pb-2 mb-1 border-b border-[#1b212f] font-mono">
              📋 WIKI DIRECTORY
            </div>
            <nav className="space-y-0.5 text-[13px]">
              {FMHY_SIDEBAR_WIKI.map((item) => {
                const isActive = item.isCategory && category.slug === item.slug;
                return (
                  <Link
                    key={item.slug}
                    href={item.href}
                    prefetch={true}
                    className={`w-full text-left py-1.5 px-2.5 rounded-xl flex items-center gap-2 transition-all duration-150 truncate ${
                      isActive
                        ? "bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30 shadow-sm"
                        : "text-zinc-300 hover:text-white hover:bg-[#121622] font-medium"
                    }`}
                  >
                    <span className="text-base select-none">{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Tools Section */}
          <div className="bg-[#0b0e14] border border-[#1d222e] rounded-2xl p-3 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1 pb-2 mb-1 border-b border-[#1b212f] font-mono">
              🔧 TOOLS DIRECTORY
            </div>
            <nav className="space-y-0.5 text-[13px]">
              {FMHY_SIDEBAR_TOOLS.map((item) => {
                const isActive = category.slug === item.slug;
                return (
                  <Link
                    key={item.slug}
                    href={item.href}
                    prefetch={true}
                    className={`w-full text-left py-1.5 px-2.5 rounded-xl flex items-center gap-2 transition-all duration-150 truncate ${
                      isActive
                        ? "bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30 shadow-sm"
                        : "text-zinc-300 hover:text-white hover:bg-[#121622] font-medium"
                    }`}
                  >
                    <span className="text-base select-none">{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Filter Options */}
          <div className="p-3.5 rounded-2xl bg-[#0b0e14] border border-[#1d222e] shadow-[0_4px_16px_rgba(0,0,0,0.5)] space-y-2.5 text-[13px]">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
              ⚙️ Quick Filters
            </h4>

            <label className="flex items-center justify-between text-zinc-300 cursor-pointer hover:text-white transition-colors duration-150 group">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">⭐</span>
                <span>Starred / Top Picks</span>
              </span>
              <input
                type="checkbox"
                checked={filterStarredOnly}
                onChange={(e) => setFilterStarredOnly(e.target.checked)}
                className="rounded accent-sky-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-zinc-300 cursor-pointer hover:text-white transition-colors duration-150 group">
              <span className="flex items-center gap-1.5">
                <span className="text-sky-400">📂</span>
                <span>Directories &amp; Indexes</span>
              </span>
              <input
                type="checkbox"
                checked={filterIndexesOnly}
                onChange={(e) => setFilterIndexesOnly(e.target.checked)}
                className="rounded accent-sky-400 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

        </aside>

        {/* ══════ 2. MAIN DOCUMENT CONTENT AREA ══════ */}
        <main className="flex-1 min-w-0 space-y-6" ref={mainRef}>
          
          {/* Top Breadcrumb & Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1a202c]">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Link
                href="/"
                prefetch={true}
                className="text-zinc-400 hover:text-zinc-100 transition-colors duration-150 flex items-center gap-1 font-medium group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Home</span>
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-100 font-semibold">{category.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReshuffle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10141e] hover:bg-[#161d2c] text-zinc-300 border border-[#20283a] text-xs font-semibold transition-all cursor-pointer shadow-sm group"
                title="Shuffle order of all items"
              >
                <Shuffle className="w-3.5 h-3.5 text-sky-400 transition-transform duration-300 group-hover:rotate-180" />
                <span>Reshuffle</span>
              </button>

              {/* View Layout Switcher */}
              <div className="flex items-center p-0.5 rounded-xl bg-[#0e121a] border border-[#1e2535]">
                <button
                  type="button"
                  onClick={() => setViewMode("boxes")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "boxes" ? "bg-sky-500/20 text-sky-300 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Modular Category Boxes"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-sky-500/20 text-sky-300 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Card Grid Mode"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Header with Count Badge */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f16] border border-[#1b212f] shadow-[0_8px_24px_rgba(0,0,0,0.6)] space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/25">
                {sections.length} Categorized Types
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#141923] text-zinc-400 border border-[#222a3a]">
                {totalItemCount} Total Verified Resources
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
              {category.description || "Stream, download, explore, and find all verified software and tools."}
            </p>

            {/* In-Category Search Bar */}
            <div className="pt-3">
              <div className="relative max-w-xl">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${totalItemCount} tools inside ${category.name}...`}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#10141e] border border-[#20283a] text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-sky-400 transition-colors shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Subcategory Pill Switcher (Horizontal Category Filter) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedSubcategoryPill("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubcategoryPill === "all"
                  ? "bg-zinc-100 text-zinc-950 shadow-sm"
                  : "bg-[#0e121a] text-zinc-400 hover:text-zinc-200 hover:bg-[#141924] border border-[#1c2230]"
              }`}
            >
              All Types ({sections.length})
            </button>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSubcategoryPill(sec.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedSubcategoryPill === sec.slug
                    ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                    : "bg-[#0e121a] text-zinc-400 hover:text-zinc-200 hover:bg-[#141924] border border-[#1c2230]"
                }`}
              >
                <span>{sec.title}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  selectedSubcategoryPill === sec.slug ? "bg-sky-600 text-white" : "bg-[#181f2c] text-zinc-500"
                }`}>
                  {sec.items.length}
                </span>
              </button>
            ))}
          </div>

          {/* ══════ CATEGORIZED BOXES CONTAINER ══════ */}
          <div className="space-y-6 pt-1">
            {filteredSections.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0c0f16] border border-[#1b212f] text-zinc-400 space-y-2">
                <p className="text-sm font-semibold">No resources match your current filter.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSubcategoryPill("all");
                    setFilterStarredOnly(false);
                    setFilterIndexesOnly(false);
                  }}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredSections.map((sec) => (
                <section
                  key={sec.id}
                  id={sec.slug}
                  className="scroll-mt-24 rounded-3xl bg-[#0c0f16] border border-[#1b212f] shadow-[0_8px_24px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-200 hover:border-[#263044]"
                >
                  {/* BOX HEADER */}
                  <div className="px-6 py-4 bg-[#0f131d] border-b border-[#1b212f] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-[#161c28] border border-[#242c3c] text-sky-400">
                        <Layers className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-bold text-zinc-100 font-heading">
                            {sec.title}
                          </h2>
                          <a
                            href={`#${sec.slug}`}
                            className="text-zinc-600 hover:text-sky-400 transition-colors p-1"
                            title="Direct anchor link"
                          >
                            <Hash className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#141924] border border-[#20283a] text-zinc-400">
                        {sec.items.length} {sec.items.length === 1 ? "entry" : "entries"}
                      </span>
                    </div>
                  </div>

                  {/* BOX BODY */}
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Custom Note/Tip if present */}
                    {sec.tip && (
                      <div className="p-3.5 rounded-2xl bg-sky-950/20 border border-sky-800/40 text-xs sm:text-[13px] text-slate-200 space-y-1 shadow-sm">
                        <div className="font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5 text-xs font-mono">
                          <Info className="w-3.5 h-3.5 text-sky-400" />
                          <span>TYPE ADVISORY &amp; GUIDELINES</span>
                        </div>
                        <p className="leading-relaxed">
                          {parseMarkdownInline(sec.tip)}
                        </p>
                      </div>
                    )}

                    {/* ITEMS LIST (MODULAR BOX VIEW) */}
                    {viewMode === "boxes" ? (
                      <div className="divide-y divide-[#171d2b]">
                        {sec.parsedItems.map((item) => (
                          <div
                            key={item.id}
                            className="py-3 px-3.5 sm:px-4 rounded-2xl hover:bg-[#111622] transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                          >
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Type icon indicator */}
                                {item.isStarred ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    TOP PICK
                                  </span>
                                ) : item.isIndex ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                                    DIRECTORY
                                  </span>
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-sky-400 transition-colors shrink-0" />
                                )}

                                {/* Main Title */}
                                <div className="font-semibold text-sm text-zinc-100 hover:text-white">
                                  {item.titleNodes}
                                </div>
                              </div>

                              {/* Description */}
                              {item.descriptionNodes.length > 0 && (
                                <div className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed pl-3.5 sm:pl-4">
                                  {item.descriptionNodes}
                                </div>
                              )}
                            </div>

                            {/* Quick Actions & Extra Links */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto pl-3.5 sm:pl-0">
                              <button
                                onClick={() => handleCopyLink(sec.slug, item.id)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-[#181f2e] transition-colors"
                                title="Copy direct link to section"
                              >
                                {copiedId === item.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* CARD GRID VIEW */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {sec.parsedItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-[#0f131d] border border-[#1d2434] hover:border-sky-500/40 hover:bg-[#121724] transition-all duration-200 flex flex-col justify-between gap-3 group shadow-sm"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="font-semibold text-sm text-zinc-100">
                                  {item.titleNodes}
                                </div>
                                {item.isStarred && (
                                  <span className="text-amber-400" title="Top Pick">⭐</span>
                                )}
                              </div>
                              {item.descriptionNodes.length > 0 && (
                                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                                  {item.descriptionNodes}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-[#1a202e] text-xs">
                              <span className="text-[11px] font-mono text-zinc-500">
                                #{sec.title}
                              </span>
                              <button
                                onClick={() => handleCopyLink(sec.slug, item.id)}
                                className="text-zinc-500 hover:text-zinc-200 p-1 rounded"
                                title="Copy link"
                              >
                                {copiedId === item.id ? (
                                  <span className="text-emerald-400 text-[11px] font-mono">Copied!</span>
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </section>
              ))
            )}
          </div>
        </main>

        {/* ══════ 3. STICKY RIGHT "ON THIS PAGE" TOC ══════ */}
        <aside className="w-56 xl:w-64 shrink-0 hidden xl:block sticky top-20 z-20 self-start max-h-[calc(100vh-5rem)] animate-slide-in-right">
          <div className="bg-[#0b0e14] border border-[#1d222e] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.5)] overflow-y-auto no-scrollbar space-y-2.5">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1 pb-1.5 border-b border-[#1b212f] font-mono flex items-center justify-between">
              <span>ON THIS PAGE</span>
              <span className="text-[10px] text-zinc-500">{sections.length}</span>
            </div>
            <nav className="space-y-0.5 text-xs">
              {sections.map((sec) => {
                const isActive = activeSectionId === sec.slug;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToAnchor(sec.slug)}
                    className={`relative w-full text-left py-1.5 px-2.5 rounded-xl transition-all duration-150 truncate flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "text-sky-300 font-bold bg-sky-500/15 border border-sky-500/30 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-[#121622]"
                    }`}
                  >
                    <span className="truncate">{sec.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500 opacity-70 ml-1 shrink-0">
                      {sec.items.length}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold shadow-[0_8px_24px_rgba(0,0,0,0.6)] active:scale-95 transition-all duration-150 z-40 cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}
