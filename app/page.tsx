"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import SearchModal from "@/components/search/SearchModal";
import SearchToggle from "@/components/search/SearchToggle";
import ThemeSelector from "@/components/ui/ThemeSelector";
import LiveUserPresence from "@/components/analytics/LiveUserPresence";
import Footer from "@/components/layout/Footer";
import { 
  ShieldCheck, 
  Bot, 
  Share2, 
  GraduationCap, 
  Smartphone, 
  Terminal, 
  Video, 
  Headphones, 
  Gamepad2, 
  Code2, 
  BookOpen, 
  Download, 
  Globe, 
  Boxes, 
  Cpu, 
  HardDrive,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  ExternalLink,
  Github,
  MessageSquare,
  FileCode2,
  Flame,
  ChevronDown,
  Search,
  Folder,
  Bookmark,
  Rocket,
  Send,
  Tv2,
  Subtitles,
  Radio
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  badge?: string;
}

const HOME_CATEGORIES: CategoryItem[] = [
  // ── Priority 1-4 (user-specified order) ──────────────────────────────────
  {
    id: "video",
    name: "Streaming & Movies",
    slug: "video",
    desc: "Movies, anime, TV shows, streaming sites, and web media players.",
    icon: Video,
    color: "#EF4444",
    badge: "🔥 Hot",
  },
  {
    id: "audio",
    name: "Music & Podcasts",
    slug: "audio",
    desc: "Lossless streaming, podcasts, radio stations, and audio tools.",
    icon: Headphones,
    color: "#14B8A6",
  },
  {
    id: "gaming",
    name: "Gaming & Emulation",
    slug: "gaming",
    desc: "Preservation ROMs, emulators, free indie games, and launcher tools.",
    icon: Gamepad2,
    color: "#6366F1",
  },
  {
    id: "downloading",
    name: "Downloading & Direct",
    slug: "downloading",
    desc: "Debrid services, download managers, cyberlockers, and direct mirrors.",
    icon: Download,
    color: "#F59E0B",
  },
  // ── Trending new additions ─────────────────────────────────────────────
  {
    id: "iptv",
    name: "IPTV & Live TV",
    slug: "video",
    desc: "Free IPTV playlists, live TV channels, sports streams, and M3U indexes.",
    icon: Tv2,
    color: "#F97316",
    badge: "Trending",
  },
  {
    id: "subtitles",
    name: "Subtitles & Captions",
    slug: "video",
    desc: "Subtitle databases, auto-caption tools, synced SRT files, and translators.",
    icon: Radio,
    color: "#06B6D4",
    badge: "Trending",
  },
  // ── Core essentials ────────────────────────────────────────────────────
  {
    id: "privacy",
    name: "Privacy & Adblock",
    slug: "privacy",
    desc: "Adblock filters, DNS privacy, VPNs, tracker blockers, and anti-telemetry.",
    icon: ShieldCheck,
    color: "#10B981",
    badge: "Essential",
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    slug: "ai",
    desc: "LLMs, AI assistants, chatbots, local AI frontends, and generation tools.",
    icon: Bot,
    color: "#8B5CF6",
    badge: "Trending",
  },
  {
    id: "torrenting",
    name: "Torrenting & P2P",
    slug: "torrenting",
    desc: "Verified torrent clients, indexers, trackers, search engines, and P2P.",
    icon: Share2,
    color: "#A855F7",
  },
  {
    id: "reading",
    name: "Books & Comics",
    slug: "reading",
    desc: "E-books, manga, comics, light novels, audiobooks, and e-readers.",
    icon: BookOpen,
    color: "#D97706",
  },
  {
    id: "educational",
    name: "Educational & Courses",
    slug: "educational",
    desc: "Free university lectures, courses, certifications, and research tools.",
    icon: GraduationCap,
    color: "#84CC16",
  },
  {
    id: "mobile",
    name: "Android & iOS",
    slug: "mobile",
    desc: "Sideloading, F-Droid open source, jailbreak tools, and mobile apps.",
    icon: Smartphone,
    color: "#22C55E",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    slug: "developer-tools",
    desc: "Code editors, free APIs, git utilities, and cloud hosting.",
    icon: Code2,
    color: "#3B82F6",
  },
  {
    id: "system-tools",
    name: "System Tools & OS",
    slug: "system-tools",
    desc: "Windows debloating, optimization scripts, and hardware utilities.",
    icon: Cpu,
    color: "#0284C7",
  },
];

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderedCategories, setOrderedCategories] = useState(HOME_CATEGORIES);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg && Array.isArray(cfg.categoryOrder) && cfg.categoryOrder.length > 0) {
          const orderMap = new Map<string, number>();
          cfg.categoryOrder.forEach((id: string, idx: number) => orderMap.set(id, idx));
          const sorted = [...HOME_CATEGORIES].sort((a, b) => {
            const orderA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
            const orderB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
            return orderA - orderB;
          });
          setOrderedCategories(sorted);
        }
      })
      .catch(() => {});
  }, []);

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
    const navbar = document.querySelector<HTMLElement>(".navbar");
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

          {/* Left Group: Brand + Shrunk Search Bar */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0">
            <Link href="/" className="brand group shrink-0" title="FREEWEBSTUFF">
              <Logo className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="brand-name font-extrabold tracking-wider text-white text-base sm:text-lg">
                FREEWEBSTUFF
              </span>
            </Link>

            <SearchToggle
              onClick={() => setIsSearchOpen(true)}
              placeholder="Search..."
              className="w-28 xs:w-36 sm:w-44 md:w-52"
            />
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
          <div className="sm:hidden border-t border-white/10 bg-[#090e1c]/90 backdrop-blur-xl px-5 py-4 flex flex-col gap-3 animate-fade-in shadow-2xl">
            <Link 
              href="/categories" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-white hover:text-sky-400 py-1.5 flex items-center justify-between"
            >
              <span>📂 Browse Categories</span>
              <span className="text-xs text-slate-500">23+</span>
            </Link>
            <Link 
              href="/trending" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-white hover:text-sky-400 py-1.5"
            >
              Trending Tools
            </Link>
            <Link 
              href="/beginners-guide" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-white hover:text-sky-400 py-1.5"
            >
              📖 Quick Start
            </Link>
            <Link 
              href="/startpage" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-white hover:text-sky-400 py-1.5"
            >
              🚀 Minimal Startpage
            </Link>
            <Link 
              href="/bookmarks" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-white hover:text-sky-400 py-1.5"
            >
              🔖 Saved Bookmarks
            </Link>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a href="https://discord.gg/mHpBcYJHM" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xs">Discord</a>
                <a href="https://t.me/+N7tYaUKT2q44NGU1" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xs">Telegram</a>
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

            <div className="flex items-center justify-center mb-5 hero-title-anim">
              <LiveUserPresence className="px-3.5 py-1 text-xs shadow-sm shadow-emerald-500/10" />
            </div>

            <h1 className="hero-title hero-title-anim">
              Everything Free.
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                All in One Place.
              </span>
            </h1>

            <div className="hero-actions hero-action-anim">
              <Link href="/beginners-guide" className="btn btn-primary">
                Quick Start
                <span>→</span>
              </Link>

              <Link href="/submit" className="btn btn-secondary">
                Contribute
              </Link>

              <a href="https://t.me/+N7tYaUKT2q44NGU1" target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex items-center gap-1.5 border-[#229ED9]/40 hover:border-[#229ED9] hover:bg-[#229ED9]/10">
                <span className="text-[#229ED9]">✈</span> Join Telegram
              </a>

              <a href="https://discord.gg/mHpBcYJHM" target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex items-center gap-1.5 border-[#5865F2]/40 hover:border-[#5865F2] hover:bg-[#5865F2]/10">
                <span className="text-[#5865F2]">🎮</span> Join Discord
              </a>
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
        <section className="categories" id="categories">

          <div className="section-heading">
            <h2>Browse Curated Categories ✨</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Explore 15,000+ verified tools, privacy software, media indexes, and developer resources.
            </p>
          </div>

          <div className="category-grid">
            {orderedCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link 
                  key={cat.id} 
                  href={`/categories/${cat.slug}`} 
                  prefetch={true}
                  className="category-card group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div 
                        className="category-icon transition-transform duration-200 group-hover:scale-110"
                        style={{
                          background: `${cat.color}15`,
                          borderColor: `${cat.color}35`,
                          color: cat.color
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {cat.badge && (
                        <span 
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                          style={{
                            background: `${cat.color}12`,
                            color: cat.color,
                            borderColor: `${cat.color}30`
                          }}
                        >
                          {cat.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="group-hover:text-sky-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p>
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

        </section>



      </main>

      {/* Global Clean Professional Footer */}
      <Footer />
    </>
  );
}
