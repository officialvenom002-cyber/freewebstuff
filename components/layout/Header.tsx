"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../ui/Logo";
import SearchModal from "../search/SearchModal";
import { Menu, X, Search } from "lucide-react";

const NAV_LINKS = [
  { label: "Explore", href: "/search" },
  { label: "Categories", href: "/categories" },
  { label: "Trending", href: "/trending" },
  { label: "Collections", href: "/collections" },
];

export default function Header() {
  const pathname = usePathname();
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

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(11,12,14,0.85)"
            : "linear-gradient(180deg, rgba(11,12,14,0.82) 0%, rgba(11,12,14,0.62) 70%, rgba(11,12,14,0.40) 100%)",
          backdropFilter: scrolled ? "blur(20px) saturate(150%)" : "blur(16px) saturate(140%)",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(150%)" : "blur(16px) saturate(140%)",
          borderBottom: "none",
          boxShadow: scrolled
            ? "0 14px 38px -8px rgba(0,0,0,0.85), 0 6px 16px -2px rgba(0,0,0,0.5)"
            : "0 10px 30px -10px rgba(0,0,0,0.7), 0 4px 12px -2px rgba(0,0,0,0.4)",
        }}
      >
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between gap-6">

          {/* ── Brand ── */}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-2.5 group shrink-0"
            title="FreeWebStuff"
          >
            <Logo className="w-7 h-7" />
            <span className="font-heading font-black text-[16px] tracking-[-0.02em] text-[#F2F3F5] group-hover:text-[#8B7CFF] transition-colors duration-200">
              FREEWEBSTUFF
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
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

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2.5">
            {/* Search icon button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg text-[#9298A3] hover:text-[#F2F3F5] transition-colors border border-[#262A30] hover:border-[#3a3f48] bg-[#111316] hover:bg-[#15181C]"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[12px] font-medium">Search</span>
              <kbd className="hidden lg:inline text-[10px] font-mono text-[#5A6070] border border-[#262A30] px-1.5 py-0.5 rounded bg-[#0B0C0E]">
                ⌘K
              </kbd>
            </button>

            {/* Submit */}
            <Link
              href="/submit"
              prefetch={true}
              className="inline-flex items-center justify-center h-8 px-4 rounded-lg text-[12.5px] font-bold tracking-tight transition-all duration-150 active:scale-95"
              style={{
                background: "#8B7CFF",
                color: "#0B0C0E",
                boxShadow: "0 1px 8px rgba(139,124,255,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#9d90ff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#8B7CFF";
              }}
            >
              Submit
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#9298A3] hover:text-[#F2F3F5] border border-[#262A30] bg-[#111316] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1E2228] bg-[#0D0F11] px-5 py-4 space-y-1 animate-fade-in">
            {/* Mobile search */}
            <button
              type="button"
              onClick={() => { setIsSearchOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-[#9298A3] hover:text-[#F2F3F5] hover:bg-[#15181C] transition-colors"
            >
              <Search className="w-4 h-4" />
              Search 15,000+ resources...
            </button>
            <div className="border-t border-[#1E2228] my-2" />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-[#F2F3F5] hover:bg-[#15181C] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#1E2228] my-2" />
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[14px] font-bold text-[#0B0C0E] bg-[#8B7CFF] hover:bg-[#9d90ff] transition-colors"
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
