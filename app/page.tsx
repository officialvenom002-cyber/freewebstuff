"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import SearchModal from "@/components/search/SearchModal";
import SearchToggle from "@/components/search/SearchToggle";
import ThemeSelector from "@/components/ui/ThemeSelector";
import CategoryGrid from "@/components/home/CategoryGrid";
import Footer from "@/components/layout/Footer";
import { 
  ChevronDown,
  Search,
  Folder,
  Bookmark,
  Rocket,
  Send,
  Heart
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Ctrl + K search */
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    /* Click outside for ecosystem menu */
    const handleClickOutside = (e: MouseEvent) => {
      if (ecosystemRef.current && !ecosystemRef.current.contains(e.target as Node)) {
        setEcosystemOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    /* Navbar scroll shadow */
    const navbar = document.querySelector<HTMLElement>("header.navbar");
    const handleScroll = () => {
      if (!navbar) return;
      navbar.classList.toggle("navbar-scrolled", window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* NAVIGATION */}
      <header className={`navbar sticky top-0 z-40 transition-all duration-300 ${mobileMenuOpen ? "navbar-scrolled !bg-[#0B0C0E]/95 !backdrop-blur-xl" : ""}`}>
        <div className="nav-inner">

          {/* Left Group: Brand + Search Bar */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0">
            <Link href="/" className="brand group shrink-0" title="FREEWEBSTUFF">
              <Logo className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="brand-name font-extrabold tracking-wider text-white text-base sm:text-lg">
                FREEWEBSTUFF
              </span>
            </Link>

            {/* Search Bar on PC / Desktop Top Navigation */}
            <div className="hidden md:flex items-center">
              <SearchToggle
                onClick={() => setIsSearchOpen(true)}
                placeholder="Search anything..."
                className="md:w-56 lg:w-64"
              />
            </div>

            
          </div>

          <div className="nav-right">

            <nav className="nav-links flex items-center gap-6 sm:gap-7">
              
              <Link 
                href="/beginners-guide" 
                className="text-[13.5px] sm:text-[14px] font-medium tracking-[0.01em] text-slate-300 hover:text-white transition-colors duration-150 py-1 whitespace-nowrap flex items-center gap-1.5"
              >
                <span>📖</span>
                <span>Quick Start</span>
              </Link>
              <Link 
                href="/trending" 
                className="text-[13.5px] sm:text-[14px] font-medium tracking-[0.01em] text-slate-300 hover:text-white transition-colors duration-150 py-1 whitespace-nowrap"
              >
                Trending
              </Link>
              <Link 
                href="/support" 
                className="text-[13px] sm:text-[13.5px] font-semibold tracking-[0.01em] text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 px-2.5 py-1 rounded-lg transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 group active:scale-95 shadow-sm"
                title="Support FreeWebStuff"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30 group-hover:scale-110 transition-transform" />
                <span>Support</span>
              </Link>

              {/* Explore More Dropdown */}
              <div ref={ecosystemRef} className="relative">
                <button
                  type="button"
                  onClick={() => setEcosystemOpen(!ecosystemOpen)}
                  className="cursor-pointer flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-medium tracking-[0.01em] text-slate-300 hover:text-white transition-colors duration-150 py-1 whitespace-nowrap bg-transparent border-none"
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${ecosystemOpen ? "rotate-180 text-white" : ""}`} />
                </button>

                {ecosystemOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#111316]/90 border border-white/[0.08] shadow-2xl p-1.5 z-50 animate-popover space-y-1 backdrop-blur-xl"
                  >
                    <Link
                      href="/categories"
                      onClick={() => setEcosystemOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150 cursor-pointer"
                    >
                      <Folder className="w-4 h-4 text-slate-400" />
                      <span className="flex-1 text-left">Categories</span>
                    </Link>
                    <Link
                      href="/search"
                      onClick={() => setEcosystemOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150 cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-slate-400" />
                      <span className="flex-1 text-left">Search</span>
                    </Link>
                    <Link
                      href="/bookmarks"
                      onClick={() => setEcosystemOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150 cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      <span className="flex-1 text-left">Bookmarks</span>
                    </Link>
                    <Link
                      href="/startpage"
                      onClick={() => setEcosystemOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150 cursor-pointer"
                    >
                      <Rocket className="w-4 h-4 text-slate-400" />
                      <span className="flex-1 text-left">Startpage</span>
                    </Link>
                    <Link
                      href="/submit"
                      onClick={() => setEcosystemOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-slate-400" />
                      <span className="flex-1 text-left">Submit</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            <div className="nav-divider"></div>

            <div className="nav-icons flex items-center gap-3.5">
              <ThemeSelector />

              <a href="https://discord.gg/mHpBcYJHM" target="_blank" rel="noopener noreferrer" className="nav-icon" aria-label="Discord">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>

              <a href="https://t.me/+N7tYaUKT2q44NGU1" target="_blank" rel="noopener noreferrer" className="nav-icon" aria-label="Telegram" title="Telegram Channel">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
                </svg>
              </a>
            </div>
          </div>

          <button 
            type="button"
            className="mobile-menu" 
            id="mobileMenu" 
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/10 bg-[#090e1c]/95 backdrop-blur-2xl px-4 py-3.5 flex flex-col gap-2.5 animate-fade-in shadow-2xl">
            {/* Quick search button */}
            <button
              type="button"
              onClick={() => { setIsSearchOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-slate-300 bg-white/[0.05] border border-white/10 active:scale-98 transition-all min-h-[44px] cursor-pointer"
            >
              <span className="flex items-center gap-2 text-slate-300">
                <Search className="w-4 h-4 text-sky-400" />
                <span>Search 20,000+ tools...</span>
              </span>
              <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-md">Tap</span>
            </button>

            {/* Quick Categories Bar on Mobile */}
            <div className="pt-1">
              <p className="text-[10.5px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1.5 px-1">Top Categories</p>
              <div className="grid grid-cols-3 gap-1.5">
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
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.1] border border-white/[0.06] text-center active:scale-95 transition-all min-h-[48px]"
                  >
                    <span className="text-base select-none">{c.emoji}</span>
                    <span className="text-[11px] font-medium text-slate-200 mt-0.5 truncate w-full">{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 my-0.5" />

            {/* Main Navigation Links */}
            <div className="grid grid-cols-2 gap-1.5">
              <Link 
                href="/donate" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-2.5 rounded-xl flex items-center gap-1.5 justify-center min-h-[42px] active:scale-98"
              >
                <span>❤️ Support Us</span>
              </Link>
              <Link 
                href="/beginners-guide" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-sky-300 bg-sky-500/10 border border-sky-500/20 px-3 py-2.5 rounded-xl flex items-center gap-1.5 justify-center min-h-[42px] active:scale-98"
              >
                <span>📖 Quick Start</span>
              </Link>
              <Link 
                href="/categories" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-white bg-white/[0.04] px-3 py-2.5 rounded-xl flex items-center justify-between min-h-[42px] active:scale-98"
              >
                <span>📂 All Categories</span>
                <span className="text-[10px] text-slate-400 font-mono bg-white/[0.06] px-1.5 py-0.5 rounded">24+</span>
              </Link>
              <Link 
                href="/trending" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-white bg-white/[0.04] px-3 py-2.5 rounded-xl flex items-center justify-center min-h-[42px] active:scale-98"
              >
                <span>🔥 Trending</span>
              </Link>
              <Link 
                href="/startpage" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-white bg-white/[0.04] px-3 py-2.5 rounded-xl flex items-center justify-center min-h-[42px] active:scale-98"
              >
                <span>🚀 Startpage</span>
              </Link>
              <Link 
                href="/bookmarks" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-white bg-white/[0.04] px-3 py-2.5 rounded-xl flex items-center justify-center min-h-[42px] active:scale-98"
              >
                <span>🔖 Bookmarks</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a href="https://discord.gg/mHpBcYJHM" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xs flex items-center gap-1 py-1">
                  <span>🎮 Discord</span>
                </a>
                <a href="https://t.me/+N7tYaUKT2q44NGU1" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xs flex items-center gap-1 py-1">
                  <span>✈️ Telegram</span>
                </a>
              </div>
              <ThemeSelector />
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <main>

        <section className="hero">

          <div className="hero-content">

            <h1 className="hero-title hero-title-anim">
              <span className="hero-gradient-text">
                Everything Free,
                <br />
                All in One Place.
              </span>
            </h1>

            <p className="hero-description hero-desc-anim">
              The official <strong>FreeWebStuff</strong> directory (freewebstuff.site). Curating 20,000+ verified free web tools, open-source software, streaming platforms, AI assistants, and developer vaults. Inspired by FMHY.
            </p>

            <div className="hero-actions hero-action-anim flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
              <Link href="/support" className="btn btn-secondary flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Support</span>
              </Link>

              <Link href="/beginners-guide" className="btn btn-primary">
                Quick Start
                <span>→</span>
              </Link>

              <Link href="/submit" className="btn btn-secondary">
                Submit Link
              </Link>

              <a href="https://t.me/+N7tYaUKT2q44NGU1" target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex items-center gap-1.5 border-[#229ED9]/40 hover:border-[#229ED9] hover:bg-[#229ED9]/10">
                <span className="text-[#229ED9]">✈</span> Join Telegram
              </a>

              <a href="https://discord.gg/mHpBcYJHM" target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex items-center gap-1.5 border-[#5865F2]/40 hover:border-[#5865F2] hover:bg-[#5865F2]/10">
                <span className="text-[#5865F2]">🎮</span> Join Discord
              </a>
            </div>

            {/* ── Full Length Centered Search Bar (Below Support & Discord actions) ── */}
            <div className="w-full mt-5 md:hidden">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmed = heroQuery.trim();
                  if (trimmed) {
                    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
                  } else {
                    router.push('/search');
                  }
                }}
                className="relative group rounded-2xl p-1 bg-gradient-to-r from-sky-500/25 via-indigo-500/25 to-purple-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all focus-within:from-sky-500/60 focus-within:to-indigo-500/60"
              >
                <div className="flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl bg-[#0F1420] border border-[#20293D] group-hover:border-sky-500/40 transition-colors hero-mobile-search-inner">
                  <Search className="w-5 h-5 text-sky-400 shrink-0" />
                  <input
                    type="text"
                    value={heroQuery}
                    onChange={(e) => setHeroQuery(e.target.value)}
                    placeholder="Search anything (e.g. 'movies dekhna hai', 'photoshop', 'video download')..."
                    className="w-full bg-transparent text-white placeholder:text-zinc-500 text-sm sm:text-base font-medium outline-none font-sans hero-mobile-search-input"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer active:scale-95 flex items-center gap-1.5 font-sans"
                  >
                    <span>Search anything</span>
                    <span>→</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* CUSTOM GRAPHICAL HERO LOGO */}
          <div className="hero-visual hero-visual-anim">

            <div className="space-glow"></div>

            <div className="planet-floor"></div>

            <div className="orbit"></div>
            <div className="orbit-two"></div>

            <div className="planet"></div>

            <div className="orbit-dot dot-one"></div>
            <div className="orbit-dot dot-two"></div>

          </div>

        </section>

        {/* CATEGORIES */}
        <section className="categories max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-10" id="categories">

          <div className="section-heading text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Browse Curated Categories ✨
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Explore 15,000+ verified tools, privacy software, media indexes, and developer resources.
            </p>
          </div>

          {/* Minimalist Card Grid with tool counts and accent styling */}
          <CategoryGrid />

        </section>

      </main>


      {/* Global Clean Professional Footer */}
      <Footer />
    </>
  );
}
