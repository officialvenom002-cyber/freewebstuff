"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Shuffle, 
  ArrowUp, 
  Info,
} from "lucide-react";
import { Category, Resource } from "@/lib/types";

// FMHY exact Wiki & Tools Category Structure for the Left Column
const FMHY_SIDEBAR_WIKI = [
  { slug: "beginners-guide", name: "Beginners Guide",       emoji: "📖", isPage: true,     href: "/beginners-guide" },
  { slug: "privacy",         name: "Adblocking / Privacy",  emoji: "🛡️", isCategory: true, href: "/categories/privacy" },
  { slug: "ai",              name: "Artificial Intelligence",emoji: "🤖", isCategory: true, href: "/categories/ai" },
  { slug: "video",           name: "Movies / TV / Anime",   emoji: "🎬", isCategory: true, href: "/categories/video" },
  { slug: "audio",           name: "Music / Podcasts / Radio", emoji: "🎵", isCategory: true, href: "/categories/audio" },
  { slug: "gaming",          name: "Gaming / Emulation",    emoji: "🎮", isCategory: true, href: "/categories/gaming" },
  { slug: "reading",         name: "Books / Comics / Manga",emoji: "📚", isCategory: true, href: "/categories/reading" },
  { slug: "downloading",     name: "Downloading",           emoji: "💾", isCategory: true, href: "/categories/downloading" },
  { slug: "torrenting",      name: "Torrenting",            emoji: "🌊", isCategory: true, href: "/categories/torrenting" },
  { slug: "educational",     name: "Educational",           emoji: "🎓", isCategory: true, href: "/categories/educational" },
  { slug: "mobile",          name: "Android / iOS",         emoji: "📱", isCategory: true, href: "/categories/mobile" },
  { slug: "linux-macos",     name: "Linux / macOS",         emoji: "🐧", isCategory: true, href: "/categories/linux-macos" },
  { slug: "non-english",     name: "Non-English",           emoji: "🌐", isCategory: true, href: "/categories/non-english" },
  { slug: "misc",            name: "Miscellaneous",         emoji: "✨", isCategory: true, href: "/categories/misc" },
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

// Parse markdown text with refined, compact and readable typography
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
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-sky-500/40 hover:decoration-sky-300 font-bold transition-colors duration-150 text-[13.5px] sm:text-[14.5px]"
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
          className="text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-sky-500/40 hover:decoration-sky-300 font-medium transition-colors duration-150 text-[13.5px] sm:text-[14.5px]"
        >
          {match[4]}
        </a>
      );
    } else if (match[6]) {
      // `code` (e.g. passwords, hashes)
      parts.push(
        <code
          key={keyIdx++}
          className="px-2 py-0.5 rounded bg-surface-secondary text-sky-300 font-mono text-xs sm:text-[12.5px] border border-white/10 select-all"
        >
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      // **Bold Text**
      parts.push(
        <strong key={keyIdx++} className="font-bold text-white text-[13.5px] sm:text-[14.5px]">
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

  // Section entrance animations via IntersectionObserver
  useEffect(() => {
    const sectionEls = document.querySelectorAll<HTMLElement>("[data-section-anim]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("section-enter");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.04 }
    );

    sectionEls.forEach((el) => {
      el.style.opacity = "0";
      observer.observe(el);
    });

    return () => observer.disconnect();
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
      .filter((sec) => sec.items.length > 0 || (!filterStarredOnly && !filterIndexesOnly));
  }, [sections, filterStarredOnly, filterIndexesOnly]);

  const scrollToAnchor = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-up">

      {/* ══════════════ MAIN 3-COLUMN LAYOUT ══════════════ */}
      <div className="flex gap-0 xl:gap-7 flex-1 max-w-[1720px] mx-auto w-full px-2 sm:px-4 xl:px-6 py-4">

        {/* ══════ 1. LEFT SIDEBAR (WIKI + TOOLS NAV) ══════ */}
        <aside className="w-52 xl:w-60 shrink-0 hidden lg:flex flex-col gap-4 sticky top-20 z-10 self-start max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar pb-4 animate-slide-in-left">
          
          {/* Wiki Section */}
          <div className="bg-surface/90 border border-surface-border rounded-xl p-3 shadow-lg backdrop-blur-md">
            <div className="text-[11px] font-bold text-content-secondary uppercase tracking-widest px-1 pb-2 mb-1 border-b border-surface-border">
              📋 Wiki
            </div>
            <nav className="space-y-0.5 text-[13px]">
              {FMHY_SIDEBAR_WIKI.map((item) => {
                const isActive =
                  (item.isCategory && category.slug === item.slug) ||
                  (item.isPage && false);
                return (
                  <Link
                    key={item.slug}
                    href={item.href}
                    prefetch={true}
                    className={`w-full text-left py-1.5 px-2 rounded-lg flex items-center gap-2 transition-all duration-200 truncate ${
                      isActive
                        ? "bg-sky-500/15 text-sky-300 font-semibold border-l-2 border-sky-400 pl-1.5"
                        : "text-slate-300 hover:text-white hover:bg-surface-secondary/80 font-medium"
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
          <div className="bg-surface/90 border border-surface-border rounded-xl p-3 shadow-lg backdrop-blur-md">
            <div className="text-[11px] font-bold text-content-secondary uppercase tracking-widest px-1 pb-2 mb-1 border-b border-surface-border">
              🔧 Tools
            </div>
            <nav className="space-y-0.5 text-[13px]">
              {FMHY_SIDEBAR_TOOLS.map((item) => {
                const isActive = category.slug === item.slug;
                return (
                  <Link
                    key={item.slug}
                    href={item.href}
                    prefetch={true}
                    className={`w-full text-left py-1.5 px-2 rounded-lg flex items-center gap-2 transition-all duration-200 truncate ${
                      isActive
                        ? "bg-sky-500/15 text-sky-300 font-semibold border-l-2 border-sky-400 pl-1.5"
                        : "text-slate-300 hover:text-white hover:bg-surface-secondary/80 font-medium"
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
          <div className="p-3 rounded-xl bg-surface/90 border border-surface-border shadow-lg backdrop-blur-md space-y-2 text-[13px]">
            <h4 className="text-[11px] font-bold text-content-secondary uppercase tracking-widest">
              ⚙️ Options
            </h4>

            <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white transition-colors duration-150 group">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">⭐</span>
                <span>Starred Only</span>
              </span>
              <input
                type="checkbox"
                checked={filterStarredOnly}
                onChange={(e) => setFilterStarredOnly(e.target.checked)}
                className="rounded accent-sky-400 w-4 h-4 cursor-pointer transition-transform duration-150 active:scale-90"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white transition-colors duration-150 group">
              <span className="flex items-center gap-1.5">
                <span className="text-sky-400">📂</span>
                <span>Indexes Only</span>
              </span>
              <input
                type="checkbox"
                checked={filterIndexesOnly}
                onChange={(e) => setFilterIndexesOnly(e.target.checked)}
                className="rounded accent-sky-400 w-4 h-4 cursor-pointer transition-transform duration-150 active:scale-90"
              />
            </label>
          </div>

        </aside>

        {/* ══════ 2. MAIN DOCUMENT CONTENT AREA ══════ */}
        <main className="flex-1 min-w-0 space-y-7" ref={mainRef}>
          
          {/* Top Breadcrumb & Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border/60 animate-fade-down">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Link
                href="/"
                prefetch={true}
                className="text-content-muted hover:text-content-primary transition-colors duration-150 flex items-center gap-1 font-medium group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Home</span>
              </Link>
              <span className="text-content-subtle">/</span>
              <span className="text-content-primary font-semibold">{category.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReshuffle}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-hover text-content-primary border border-surface-border text-xs sm:text-sm font-semibold transition-all duration-200 ease-out hover:border-brand-500/50 cursor-pointer active:scale-95 shadow-sm group"
                title="Shuffle order of all items"
              >
                <Shuffle className="w-3.5 h-3.5 text-brand-400 transition-transform duration-300 group-hover:rotate-180" />
                <span>Reshuffle</span>
              </button>
            </div>
          </div>

          {/* Document Header */}
          <div className="space-y-2 pb-2 animate-fade-up anim-delay-100">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight underline decoration-sky-400/60 underline-offset-8">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {category.description || "Curated tools, directories, downloads, and resources"}
            </p>
          </div>

          {/* Section-by-Section Document List */}
          <div className="space-y-7 pt-1">
            {filteredSections.map((sec, secIdx) => (
              <section
                key={sec.id}
                id={sec.slug}
                data-section-anim="true"
                className="scroll-mt-24 space-y-3"
                style={{ 
                  contentVisibility: "auto", 
                  containIntrinsicSize: "0 140px", 
                  animationDelay: `${secIdx * 30}ms` 
                }}
              >
                {/* Section Title Heading */}
                {sec.level === 2 ? (
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white pt-4 border-b border-surface-border pb-2 flex items-center gap-2 group">
                    <span>{sec.title}</span>
                    <a
                      href={`#${sec.slug}`}
                      className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-sky-400 text-sm font-mono transition-all duration-200 ml-1"
                      title="Direct anchor link"
                    >
                      #
                    </a>
                  </h2>
                ) : (
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 pt-2 flex items-center gap-2 group">
                    <span>{sec.title}</span>
                    <a
                      href={`#${sec.slug}`}
                      className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-sky-400 text-xs font-mono transition-all duration-200 ml-1"
                      title="Direct anchor link"
                    >
                      #
                    </a>
                  </h3>
                )}

                {/* Custom Note Block */}
                {sec.tip && (
                  <div className="p-3.5 rounded-xl bg-sky-950/25 border-l-4 border-sky-400 text-xs sm:text-[13.5px] text-slate-200 space-y-1 my-2.5 shadow-sm transition-all duration-200">
                    <div className="font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                      <Info className="w-3.5 h-3.5 text-sky-400" />
                      <span>NOTE</span>
                    </div>
                    <p className="leading-relaxed">
                      {parseMarkdownInline(sec.tip)}
                    </p>
                  </div>
                )}

                {/* Resource Items List */}
                <ul className="space-y-2 pl-1 list-none">
                  {sec.items.map((item) => (
                    <li
                      key={item.id}
                      className="resource-item flex items-start gap-2.5 text-[13.5px] sm:text-[14px] leading-[1.65] text-slate-300 group hover:text-white transition-colors duration-150"
                    >
                      {/* Status / Emoji Indicator */}
                      <span className="shrink-0 mt-0.5 select-none text-base transition-transform duration-200 group-hover:scale-110">
                        {item.isStarred ? (
                          <span className="text-amber-400 font-bold" title="Recommended Tool">⭐</span>
                        ) : item.isIndex ? (
                          <span className="text-sky-400 font-bold" title="Index / Directory">📂</span>
                        ) : item.isCrossLink ? (
                          <span className="text-emerald-400 font-bold" title="Section Link">🔗</span>
                        ) : (
                          <span className="text-slate-500 font-bold group-hover:text-sky-400 transition-colors duration-150">▸</span>
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

        {/* ══════ 3. STICKY RIGHT "ON THIS PAGE" TOC ══════ */}
        <aside className="w-56 xl:w-64 shrink-0 hidden xl:block sticky top-20 z-20 self-start max-h-[calc(100vh-5rem)] animate-slide-in-right">
          <div className="bg-surface/90 border border-surface-border rounded-xl p-4 shadow-lg backdrop-blur-md overflow-y-auto no-scrollbar space-y-2.5">
            <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider px-1 pb-1.5 border-b border-surface-border">
              On this page
            </div>
            <nav className="space-y-0.5 text-xs sm:text-[13px]">
              {sections.map((sec) => {
                const isActive = activeSectionId === sec.slug;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToAnchor(sec.slug)}
                    className={`relative w-full text-left py-1.5 px-2 rounded-lg transition-all duration-200 ease-out truncate block cursor-pointer ${
                      sec.level === 3 ? "pl-4 text-xs sm:text-[12px] opacity-80" : "font-semibold"
                    } ${
                      isActive
                        ? "text-sky-300 font-bold bg-sky-500/10 border-l-2 border-sky-400 pl-2 shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-surface-secondary/80 border-l-2 border-transparent"
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
          className="back-to-top-enter fixed bottom-6 right-6 p-3 rounded-full bg-sky-400 text-slate-950 font-bold shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 ease-out z-40 cursor-pointer border border-white/20"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}
