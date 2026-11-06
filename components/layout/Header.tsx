"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../ui/Logo";
import SearchModal from "../search/SearchModal";
import { Menu, X, Search, Home } from "lucide-react";
import {
  CATEGORY_SHORTCUTS,
  ALL_CATEGORIES_SHORTCUTS,
} from "@/lib/categories/categoryShortcuts";

const NAV_LINKS = [
  { label: "Quick Start", href: "/beginners-guide" },
  { label: "Explore", href: "/search" },
  { label: "Categories", href: "/categories" },
  { label: "Trending", href: "/trending" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcuts + custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((p) => !p);
      } else if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-search-modal", handleOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-search-modal", handleOpen);
    };
  }, []);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCategoryPage = Boolean(pathname?.startsWith("/categories"));
  const categorySlug = pathname?.startsWith("/categories/")
    ? pathname.replace("/categories/", "").split("/")[0]
    : "";

  // Strictly 4-5 useful toggles per category
  const shortcuts = (
    categorySlug && CATEGORY_SHORTCUTS[categorySlug]
      ? CATEGORY_SHORTCUTS[categorySlug]
      : ALL_CATEGORIES_SHORTCUTS
  ).slice(0, 5);

  const handleShortcutClick = (slug: string, href?: string) => {
    if (href && pathname !== href) {
      router.push(href);
      return;
    }
    window.dispatchEvent(new CustomEvent("select-category-box", { detail: { slug } }));
    const el = document.getElementById(slug);
    if (el) {
      const isMobile = window.innerWidth < 768;
      const headerOffset = isMobile ? 150 : 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - headerOffset),
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full transition-all duration-300 overflow-x-clip"
        style={{
          background: scrolled
            ? "rgba(11,12,14,0.95)"
            : "linear-gradient(180deg, rgba(11,12,14,0.92) 0%, rgba(11,12,14,0.78) 70%, rgba(11,12,14,0.55) 100%)",
          backdropFilter: scrolled ? "blur(20px) saturate(150%)" : "blur(16px) saturate(140%)",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(150%)" : "blur(16px) saturate(140%)",
          borderBottom: isCategoryPage ? "1px solid rgba(255,255,255,0.06)" : "none",
          boxShadow: scrolled
            ? "0 14px 38px -8px rgba(0,0,0,0.85), 0 6px 16px -2px rgba(0,0,0,0.5)"
            : "0 10px 30px -10px rgba(0,0,0,0.7), 0 4px 12px -2px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className={`${
            isCategoryPage
              ? "w-full px-2.5 sm:px-6 lg:px-8"
              : "max-w-[1160px] mx-auto px-3 sm:px-8"
          } h-[52px] sm:h-[60px] flex items-center justify-between gap-1.5 sm:gap-4 max-w-full`}
        >
          {/* ── Left Group: Brand Logo & Name + Borderless Home Toggle ── */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0 min-w-0">
            <Link
              href="/"
              prefetch={true}
              className="flex items-center gap-1.5 group shrink-0"
              title="FreeWebStuff"
            >
              <Logo className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span className="font-heading font-black text-[13.5px] sm:text-[15px] md:text-[16px] tracking-tight text-[#F2F3F5] group-hover:text-[#8B7CFF] transition-colors truncate">
                FREEWEBSTUFF
              </span>
            </Link>

            {/* Borderless Home button - compact & elegant on mobile */}
            <Link
              href="/"
              prefetch={true}
              className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-[12.5px] font-medium text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] active:bg-white/[0.12] transition-all shrink-0 active:scale-95 cursor-pointer"
              title="Back to Homepage"
            >
              <Home className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="hidden xs:inline">Home</span>
            </Link>
          </div>

          {/* ── Center: 4-5 Category Shortcuts (Desktop only) ── */}
          {isCategoryPage ? (
            <div className="hidden md:flex flex-1 items-center justify-center gap-1.5 lg:gap-2 mx-auto max-w-2xl px-2">
              {shortcuts.map((sc) => (
                <button
                  key={sc.slug}
                  type="button"
                  onClick={() => handleShortcutClick(sc.slug, sc.href)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12.5px] font-medium text-zinc-300 hover:text-white bg-transparent hover:bg-white/[0.06] active:bg-white/[0.1] transition-all duration-150 whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
                >
                  {sc.emoji && <span className="text-[13px] select-none leading-none">{sc.emoji}</span>}
                  <span>{sc.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/search"
                    ? pathname === link.href
                    : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    className="relative px-3 py-1.5 text-[13.5px] font-medium rounded-lg transition-all duration-200"
                    style={{
                      color: isActive ? "#F2F3F5" : "#9298A3",
                      background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = "#E2E4E8";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = "#9298A3";
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ── Right Actions: Search Toggle + Menu ── */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search toggle - compact and responsive, zero horizontal overflow */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="flex items-center justify-between gap-1.5 h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl text-zinc-400 hover:text-zinc-100 bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.1] transition-all w-auto max-w-[100px] xs:max-w-[130px] sm:max-w-none sm:w-52 md:w-60 shrink-0 group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Search className="w-3.5 h-3.5 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-[11.5px] sm:text-[12.5px] font-medium text-zinc-300 group-hover:text-white truncate">
                  Search
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-zinc-400 bg-white/[0.06] px-1.5 py-0.5 rounded-md shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Submit (shown on non-category pages on tablet+) */}
            {!isCategoryPage && (
              <Link
                href="/submit"
                prefetch={true}
                className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-lg text-[12px] font-bold tracking-tight transition-all duration-150 active:scale-95 shrink-0"
                style={{
                  background: "#8B7CFF",
                  color: "#0B0C0E",
                  boxShadow: "0 1px 8px rgba(139,124,255,0.3)",
                }}
              >
                Submit
              </Link>
            )}

            {/* Mobile hamburger - borderless & compact */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white bg-transparent hover:bg-white/[0.06] active:bg-white/[0.1] active:scale-95 transition-all shrink-0 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Category Quick Toggles Strip (Mobile category pages only) ── */}
        {isCategoryPage && shortcuts.length > 0 && (
          <div className="md:hidden w-full border-t border-white/[0.05] bg-[#0A0C10]/95 px-2 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 select-none scroll-smooth">
            {shortcuts.map((sc) => (
              <button
                key={sc.slug}
                type="button"
                onClick={() => handleShortcutClick(sc.slug, sc.href)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-zinc-300 active:text-white bg-white/[0.04] active:bg-white/[0.1] border border-white/[0.05] whitespace-nowrap shrink-0 active:scale-95 transition-all"
              >
                {sc.emoji && <span className="text-[12px] leading-none select-none">{sc.emoji}</span>}
                <span>{sc.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Mobile drawer ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1E2228] bg-[#0D0F11]/95 backdrop-blur-2xl px-4 py-3.5 space-y-2 animate-fade-in shadow-2xl">
            {/* Home button inside mobile menu */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-white/[0.05] border border-white/[0.08] active:scale-98 transition-all min-h-[44px]"
            >
              <Home className="w-4 h-4 text-sky-400" />
              <span>Back to Home</span>
            </Link>

            {/* Mobile search */}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#9298A3] hover:text-[#F2F3F5] bg-[#141820] border border-[#222838] active:scale-98 transition-all min-h-[44px] cursor-pointer"
            >
              <Search className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Search anything...</span>
            </button>

            {/* Quick Categories Bar */}
            <div className="pt-0.5">
              <p className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider mb-1 px-1">
                Top Categories
              </p>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { name: "Movies & TV", slug: "video", emoji: "🎬" },
                  { name: "AI Tools", slug: "ai", emoji: "🤖" },
                  { name: "Privacy", slug: "privacy", emoji: "🛡️" },
                  { name: "Gaming", slug: "gaming", emoji: "🎮" },
                  { name: "Downloads", slug: "downloading", emoji: "💾" },
                  { name: "Books", slug: "reading", emoji: "📚" },
                ].map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.1] border border-white/[0.06] text-center active:scale-95 transition-all min-h-[44px]"
                  >
                    <span className="text-sm select-none">{c.emoji}</span>
                    <span className="text-[10.5px] font-medium text-zinc-200 mt-0.5 truncate w-full">
                      {c.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1E2228] my-1" />

            <div className="grid grid-cols-2 gap-1.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#F2F3F5] bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-colors min-h-[42px]"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-[#1E2228] my-1" />

            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13.5px] font-bold text-[#0B0C0E] bg-[#8B7CFF] hover:bg-[#9d90ff] active:scale-98 transition-all min-h-[42px]"
            >
              + Submit a Resource
            </Link>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
