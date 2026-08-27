"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Shuffle, 
  ArrowUp, 
  Info,
} from "lucide-react";
import { Category, Resource } from "@/lib/types";
import allCategorySectionsData from "@/lib/db/allCategorySections.json";

// FMHY exact Wiki & Tools Category Structure for the Left Column
const FMHY_SIDEBAR_WIKI = [
  { slug: "beginners-guide", name: "Beginners Guide", emoji: "📚", isPage: true, href: "/beginners-guide" },
  { slug: "privacy", name: "Adblocking / Privacy", emoji: "🛡️", isCategory: true, href: "/categories/privacy" },
  { slug: "ai", name: "Artificial Intelligence", emoji: "🤖", isCategory: true, href: "/categories/ai" },
  { slug: "video", name: "Movies / TV / Anime", emoji: "📺", isCategory: true, href: "/categories/video" },
  { slug: "audio", name: "Music / Podcasts / Radio", emoji: "🎵", isCategory: true, href: "/categories/audio" },
  { slug: "gaming", name: "Gaming / Emulation", emoji: "🎮", isCategory: true, href: "/categories/gaming" },
  { slug: "reading", name: "Books / Comics / Manga", emoji: "📖", isCategory: true, href: "/categories/reading" },
  { slug: "downloading", name: "Downloading", emoji: "💾", isCategory: true, href: "/categories/downloading" },
  { slug: "torrenting", name: "Torrenting", emoji: "🌀", isCategory: true, href: "/categories/torrenting" },
  { slug: "educational", name: "Educational", emoji: "🧠", isCategory: true, href: "/categories/educational" },
  { slug: "mobile", name: "Android / iOS", emoji: "📱", isCategory: true, href: "/categories/mobile" },
  { slug: "linux-macos", name: "Linux / macOS", emoji: "🐧", isCategory: true, href: "/categories/linux-macos" },
  { slug: "non-english", name: "Non-English", emoji: "🌏", isCategory: true, href: "/categories/non-english" },
  { slug: "misc", name: "Miscellaneous", emoji: "📁", isCategory: true, href: "/categories/misc" },
];

const FMHY_SIDEBAR_TOOLS = [
  { slug: "system-tools", name: "System Tools", emoji: "💻", href: "/categories/system-tools" },
  { slug: "file-tools", name: "File Tools", emoji: "🗃️", href: "/categories/file-tools" },
  { slug: "internet-tools", name: "Internet Tools", emoji: "📎", href: "/categories/internet-tools" },
  { slug: "social-media-tools", name: "Social Media Tools", emoji: "💬", href: "/categories/social-media-tools" },
  { slug: "text-tools", name: "Text Tools", emoji: "📝", href: "/categories/text-tools" },
  { slug: "gaming-tools", name: "Gaming Tools", emoji: "👾", href: "/categories/gaming-tools" },
  { slug: "image-tools", name: "Image Tools", emoji: "📷", href: "/categories/image-tools" },
  { slug: "video-tools", name: "Video Tools", emoji: "📼", href: "/categories/video-tools" },
  { slug: "developer-tools", name: "Developer Tools", emoji: "👨‍💻", href: "/categories/developer-tools" },
  { slug: "storage", name: "Storage", emoji: "📦", href: "/categories/storage" },
];

interface PrivacySectionItem {
  id: string;
  raw: string;
  isStarred: boolean;
  isIndex: boolean;
  isCrossLink: boolean;
}

interface PrivacySection {
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
  initialSub?: string;
  initialSort?: string;
}

// Parse markdown text with comfortable larger typography matching FMHY density
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
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-sky-500/50 hover:decoration-sky-300 font-bold transition-colors duration-150 text-[16px] sm:text-[17.5px]"
          >
            {match[2]}
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
          className="text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-sky-500/50 hover:decoration-sky-300 font-medium transition-colors duration-150 text-[16px] sm:text-[17.5px]"
        >
          {match[4]}
        </a>
      );
    } else if (match[6]) {
      // `code` (e.g. passwords, hashes)
      parts.push(
        <code
          key={keyIdx++}
          className="px-2.5 py-0.5 rounded bg-surface-secondary text-sky-300 font-mono text-sm sm:text-[14px] border border-white/10 select-all"
        >
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      // **Bold Text**
      parts.push(
        <strong key={keyIdx++} className="font-bold text-white">
          {match[7]}
        </strong>
      );
    }

    remaining = remaining.slice(matchIndex + fullMatch.length);
  }

  return parts;
}

export default function CategoryView({
  category,
  allResources,
}: CategoryViewProps) {
  const initialSections: PrivacySection[] = useMemo(() => {
    const slug = category.slug || category.id;
    const categoryDict = allCategorySectionsData as Record<string, PrivacySection[]>;

    if (categoryDict[slug] && categoryDict[slug].length > 0) {
      return categoryDict[slug];
    }

    // Fallback matching
    const slugKey = Object.keys(categoryDict).find(
      (k) => slug.toLowerCase().includes(k) || k.includes(slug.toLowerCase())
    );
    if (slugKey && categoryDict[slugKey] && categoryDict[slugKey].length > 0) {
      return categoryDict[slugKey];
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
  }, [category, allResources]);

  const [sections, setSections] = useState<PrivacySection[]>(initialSections);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [filterIndexesOnly, setFilterIndexesOnly] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Sync sections when switching between categories
  useEffect(() => {
    setSections(initialSections);
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

  const filteredSections = useMemo(() => {
    return sections
      .map((sec) => {
        let items = sec.items;

        if (filterStarredOnly) {
          items = items.filter((it) => it.isStarred);
        }

        if (filterIndexesOnly) {
          items = items.filter((it) => it.isIndex);
        }

        return { ...sec, items };
      })
      .filter((sec) => sec.items.length > 0 || sec.tip);
  }, [sections, filterStarredOnly, filterIndexesOnly]);

  const scrollToAnchor = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSectionId(slug);
    }
  };

  return (
    <div className="w-full text-slate-200 text-sm sm:text-[15px] leading-relaxed pb-16">
      {/* 3-Column FMHY Exact Responsive Layout */}
      <div className="flex items-start gap-6 xl:gap-8 w-full">
        
        {/* ─────────────── 1. STICKY LEFT CATEGORY COLUMN ─────────────── */}
        <aside className="w-60 xl:w-68 shrink-0 hidden lg:block sticky top-20 z-20 transition-transform duration-200">
          <div className="bg-surface/95 border border-surface-border/90 rounded-xl p-4 shadow-xl backdrop-blur-xl max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar flex flex-col space-y-4">
            
            {/* WIKI Category Group */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider px-2 pb-1.5 border-b border-surface-border/60 flex items-center justify-between">
                <span>Wiki</span>
                <span className="text-xs text-content-subtle font-mono">{FMHY_SIDEBAR_WIKI.length}</span>
              </h3>
              <nav className="space-y-0.5 pt-0.5">
                {FMHY_SIDEBAR_WIKI.map((item) => {
                  const isCurrent = category.slug === item.slug || (item.slug === "privacy" && category.slug.includes("privacy"));
                  return (
                    <Link
                      key={item.slug}
                      href={item.href}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm sm:text-[15px] flex items-center gap-2.5 transition-all duration-200 ease-out group ${
                        isCurrent
                          ? "bg-brand-500/20 text-brand-300 font-bold border-l-2 border-brand-400 pl-2.5 shadow-sm"
                          : "text-slate-300 hover:text-white hover:bg-surface-secondary/80 font-medium"
                      }`}
                    >
                      <span className="text-lg select-none transition-transform duration-200 group-hover:scale-110">{item.emoji}</span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* TOOLS Category Group */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider px-2 pb-1.5 border-b border-surface-border/60 flex items-center justify-between">
                <span>Tools</span>
                <span className="text-xs text-content-subtle font-mono">{FMHY_SIDEBAR_TOOLS.length}</span>
              </h3>
              <nav className="space-y-0.5 pt-0.5">
                {FMHY_SIDEBAR_TOOLS.map((item) => {
                  const isCurrent = category.slug === item.slug;
                  return (
                    <Link
                      key={item.slug}
                      href={item.href}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm sm:text-[15px] flex items-center gap-2.5 transition-all duration-200 ease-out group ${
                        isCurrent
                          ? "bg-brand-500/20 text-brand-300 font-bold border-l-2 border-brand-400 pl-2.5 shadow-sm"
                          : "text-slate-300 hover:text-white hover:bg-surface-secondary/80 font-medium"
                      }`}
                    >
                      <span className="text-lg select-none transition-transform duration-200 group-hover:scale-110">{item.emoji}</span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Legend & Options Box */}
            <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border space-y-2 text-xs sm:text-[13px]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Options
              </h4>

              <label className="flex items-center justify-between text-xs sm:text-[13px] text-slate-300 cursor-pointer hover:text-white transition-colors duration-150">
                <span>⭐ Starred Only</span>
                <input
                  type="checkbox"
                  checked={filterStarredOnly}
                  onChange={(e) => setFilterStarredOnly(e.target.checked)}
                  className="rounded accent-sky-400 w-4 h-4 cursor-pointer transition-transform duration-150 active:scale-90"
                />
              </label>

              <label className="flex items-center justify-between text-xs sm:text-[13px] text-slate-300 cursor-pointer hover:text-white transition-colors duration-150">
                <span>🌐 Indexes Only</span>
                <input
                  type="checkbox"
                  checked={filterIndexesOnly}
                  onChange={(e) => setFilterIndexesOnly(e.target.checked)}
                  className="rounded accent-sky-400 w-4 h-4 cursor-pointer transition-transform duration-150 active:scale-90"
                />
              </label>
            </div>

          </div>
        </aside>

        {/* ─────────────── 2. MAIN DOCUMENT CONTENT AREA ─────────────── */}
        <main className="flex-1 min-w-0 space-y-7">
          
          {/* Top Breadcrumb & Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border/60">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Link
                href="/"
                className="text-content-muted hover:text-content-primary transition-colors duration-150 flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <span className="text-content-subtle">/</span>
              <span className="text-content-primary font-semibold">{category.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReshuffle}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-hover text-content-primary border border-surface-border text-sm font-semibold transition-all duration-200 ease-out hover:border-brand-500/50 cursor-pointer active:scale-95 shadow-sm"
                title="Shuffle order of all items"
              >
                <Shuffle className="w-4 h-4 text-brand-400 transition-transform duration-300 hover:rotate-180" />
                <span>Reshuffle</span>
              </button>
            </div>
          </div>

          {/* Document Header */}
          <div className="space-y-2 pb-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight underline decoration-sky-400/60 underline-offset-8">
              {category.name}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {category.description || "Curated tools, directories, downloads, and resources"}
            </p>
          </div>

          {/* Section-by-Section Document List matching FMHY Density */}
          <div className="space-y-8 pt-1">
            {filteredSections.map((sec) => (
              <section
                key={sec.id}
                id={sec.slug}
                className="scroll-mt-20 space-y-3.5"
              >
                {/* Section Title Heading */}
                {sec.level === 2 ? (
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white pt-5 border-b border-surface-border pb-2.5 flex items-center gap-2 group">
                    <span>{sec.title}</span>
                    <a
                      href={`#${sec.slug}`}
                      className="opacity-0 group-hover:opacity-100 text-sky-400 text-base font-mono transition-opacity duration-200"
                      title="Direct anchor link"
                    >
                      #
                    </a>
                  </h2>
                ) : (
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 pt-2.5 flex items-center gap-2 group">
                    <span>{sec.title}</span>
                    <a
                      href={`#${sec.slug}`}
                      className="opacity-0 group-hover:opacity-100 text-sky-400 text-sm font-mono transition-opacity duration-200"
                      title="Direct anchor link"
                    >
                      #
                    </a>
                  </h3>
                )}

                {/* Custom Note Block */}
                {sec.tip && (
                  <div className="p-4 rounded-xl bg-sky-950/25 border-l-4 border-sky-400 text-sm sm:text-[15.5px] text-slate-200 space-y-1.5 my-3 shadow-sm transition-all duration-200">
                    <div className="font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5 text-xs sm:text-sm">
                      <Info className="w-4 h-4 text-sky-400" />
                      <span>NOTE</span>
                    </div>
                    <p className="leading-relaxed">
                      {parseMarkdownInline(sec.tip)}
                    </p>
                  </div>
                )}

                {/* Resource Items List */}
                <ul className="space-y-2.5 pl-1.5 list-none">
                  {sec.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 text-[15px] sm:text-[16.5px] leading-[1.75] text-slate-200 group hover:text-white transition-colors duration-150"
                    >
                      {/* Status / Emoji Indicator */}
                      <span className="shrink-0 mt-0.5 select-none text-lg transition-transform duration-150 group-hover:scale-110">
                        {item.isStarred ? (
                          <span className="text-amber-400 font-bold" title="Recommended Tool">⭐</span>
                        ) : item.isIndex ? (
                          <span className="text-sky-400 font-bold" title="Index / Directory">🌐</span>
                        ) : item.isCrossLink ? (
                          <span className="text-emerald-400 font-bold" title="Section Link">↪️</span>
                        ) : (
                          <span className="text-slate-500 font-bold group-hover:text-sky-400 transition-colors duration-150">•</span>
                        )}
                      </span>

                      {/* Parsed Markdown Item Content */}
                      <div className="flex-1 min-w-0">
                        {parseMarkdownInline(item.raw)}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>

        {/* ─────────────── 3. STICKY RIGHT "ON THIS PAGE" TOC ─────────────── */}
        <aside className="w-56 xl:w-64 shrink-0 hidden xl:block sticky top-20 z-20 transition-transform duration-200">
          <div className="bg-surface/90 border border-surface-border rounded-xl p-4 shadow-lg backdrop-blur-md max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar space-y-2.5">
            <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider px-1 pb-1.5 border-b border-surface-border">
              On this page
            </div>
            <nav className="space-y-1 text-xs sm:text-[14px]">
              {sections.map((sec) => {
                const isActive = activeSectionId === sec.slug;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToAnchor(sec.slug)}
                    className={`w-full text-left py-1.5 px-2 rounded transition-all duration-200 ease-out truncate block cursor-pointer ${
                      sec.level === 3 ? "pl-3 text-xs sm:text-[13px]" : "font-semibold"
                    } ${
                      isActive
                        ? "text-sky-300 font-bold bg-brand-500/20 border-l-2 border-sky-400 pl-1.5 shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-surface-secondary"
                    }`}
                  >
                    {sec.title}
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
          className="fixed bottom-6 right-6 p-3 rounded-full bg-sky-400 text-slate-950 font-bold shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 ease-out z-40 cursor-pointer border border-white/20 animate-fade-in"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}
