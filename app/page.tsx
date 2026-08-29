"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import SearchModal from "@/components/search/SearchModal";
import SearchToggle from "@/components/search/SearchToggle";
import ThemeSelector from "@/components/ui/ThemeSelector";
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
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Github,
  MessageSquare,
  FileCode2,
  Flame
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
  {
    id: "privacy",
    name: "Privacy & Adblock",
    slug: "privacy",
    desc: "Adblock filters, DNS privacy, VPNs, trackers, and anti-telemetry.",
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
    badge: "Popular",
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
    id: "linux-macos",
    name: "Linux & macOS",
    slug: "linux-macos",
    desc: "Distros, package managers, terminal tools, and Unix software.",
    icon: Terminal,
    color: "#E11D48",
  },
  {
    id: "video",
    name: "Streaming & Movies",
    slug: "video",
    desc: "Movies, anime, TV shows, streaming sites, and web media players.",
    icon: Video,
    color: "#EF4444",
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
    id: "developer-tools",
    name: "Developer Tools",
    slug: "developer-tools",
    desc: "Code editors, free APIs, git utilities, and cloud hosting.",
    icon: Code2,
    color: "#3B82F6",
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
    id: "downloading",
    name: "Downloading & Direct",
    slug: "downloading",
    desc: "Debrid services, download managers, cyberlockers, and direct mirrors.",
    icon: Download,
    color: "#F59E0B",
  },
  {
    id: "non-english",
    name: "Non-English Resources",
    slug: "non-english",
    desc: "Multilingual repositories, international hubs, and translations.",
    icon: Globe,
    color: "#FB923C",
  },
  {
    id: "misc",
    name: "Miscellaneous & Fun",
    slug: "misc",
    desc: "Internet archives, retro web games, cool websites, and fun utilities.",
    icon: Boxes,
    color: "#EAB308",
  },
  {
    id: "system-tools",
    name: "System Tools & OS",
    slug: "system-tools",
    desc: "Windows debloating, optimization scripts, and hardware utilities.",
    icon: Cpu,
    color: "#0284C7",
  },
  {
    id: "storage",
    name: "Storage & Cloud Drives",
    slug: "storage",
    desc: "Free cloud drives, decentralized storage, and sync tools.",
    icon: HardDrive,
    color: "#059669",
  },
];

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
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

    /* Staggered card entrance via IntersectionObserver + CSS class */
    const cards = document.querySelectorAll<HTMLElement>(".category-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.cardIndex || "0", 10) * 55;
            el.style.animationDelay = `${delay}ms`;
            el.classList.add("card-enter");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05 }
    );

    cards.forEach((card, i) => {
      card.dataset.cardIndex = String(i);
      card.style.opacity = "0";
      observer.observe(card);
    });

    /* Navbar scroll shadow */
    const navbar = document.querySelector<HTMLElement>(".navbar");
    const handleScroll = () => {
      if (!navbar) return;
      navbar.classList.toggle("navbar-scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* NAVIGATION */}
      <header className="navbar">
        <div className="nav-inner">

          <Link href="/" className="brand group" title="FWSF">
            <Logo className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="brand-name font-extrabold tracking-wider text-white text-base sm:text-lg">
              FWSF
            </span>
          </Link>

          <SearchToggle
            onClick={() => setIsSearchOpen(true)}
            placeholder="Search 15,000+ resources..."
            className="w-52 sm:w-72"
          />

          <div className="nav-right">

            <nav className="nav-links">
              <Link href="/beginners-guide" className="nav-link">📖 Glossary ↗</Link>
              <Link href="/startpage" className="nav-link">💾 Backups</Link>

              {/* Ecosystem Interactive Dropdown Toggle */}
              <div ref={ecosystemRef} className="relative">
                <button
                  type="button"
                  onClick={() => setEcosystemOpen(!ecosystemOpen)}
                  className="nav-link cursor-pointer flex items-center gap-1 bg-transparent border-none p-0 text-inherit font-inherit"
                >
                  <span>🌱 Ecosystem</span>
                  <span className={`text-[11px] transition-transform duration-200 ${ecosystemOpen ? "rotate-180" : ""}`}>⌄</span>
                </button>

                {ecosystemOpen && (
                  <div className="absolute top-full right-0 mt-2.5 w-60 rounded-2xl bg-[#090e1c] border border-white/10 shadow-2xl py-2 z-50 backdrop-blur-xl animate-fade-in">
                    <Link
                      href="/search"
                      onClick={() => setEcosystemOpen(false)}
                      className="flex flex-col px-4 py-2 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-xs font-semibold text-white">🌐 Search Directory</span>
                      <span className="text-[11px] text-slate-400">Search all 15,000+ verified tools</span>
                    </Link>
                    <Link
                      href="/categories"
                      onClick={() => setEcosystemOpen(false)}
                      className="flex flex-col px-4 py-2 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-xs font-semibold text-white">📂 All 23 Categories</span>
                      <span className="text-[11px] text-slate-400">Browse complete category hub</span>
                    </Link>
                    <Link
                      href="/bookmarks"
                      onClick={() => setEcosystemOpen(false)}
                      className="flex flex-col px-4 py-2 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-xs font-semibold text-white">🔖 Saved Bookmarks</span>
                      <span className="text-[11px] text-slate-400">Your personalized saved collection</span>
                    </Link>
                    <Link
                      href="/trending"
                      onClick={() => setEcosystemOpen(false)}
                      className="flex flex-col px-4 py-2 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-xs font-semibold text-white">🔥 Trending & Popular</span>
                      <span className="text-[11px] text-slate-400">Top community favorites</span>
                    </Link>
                    <Link
                      href="/startpage"
                      onClick={() => setEcosystemOpen(false)}
                      className="flex flex-col px-4 py-2 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-xs font-semibold text-white">🚀 Minimal Startpage</span>
                      <span className="text-[11px] text-slate-400">Custom browser new tab hub</span>
                    </Link>
                    <Link
                      href="/beginners-guide"
                      onClick={() => setEcosystemOpen(false)}
                      className="flex flex-col px-4 py-2 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-xs font-semibold text-white">📖 Beginners Guide</span>
                      <span className="text-[11px] text-slate-400">Safety tips and privacy setup</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            <div className="nav-divider"></div>

            <div className="nav-icons flex items-center gap-3">
              <ThemeSelector />

              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-icon" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.13 3.17.76.84 1.22 1.91 1.22 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/>
                </svg>
              </a>

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

              <a href="#" className="nav-icon" aria-label="Community">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/>
                </svg>
              </a>

            </div>
          </div>

          <button className="mobile-menu" id="mobileMenu" aria-label="Menu">
            ☰
          </button>

        </div>
      </header>

      {/* HERO */}
      <main>

        <section className="hero">

          <div className="hero-content">

            <h1 className="hero-title hero-title-anim">
              freewebstuff
            </h1>

            <p className="hero-description hero-desc-anim">
              Your ultimate hub for the best free resources
              across the internet.
            </p>

            <div className="hero-actions hero-action-anim">
              <Link href="/beginners-guide" className="btn btn-primary">
                Beginner&apos;s Guide
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
            {HOME_CATEGORIES.map((cat) => {
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

        {/* QUICK ESSENTIAL ADVISORY BANNER */}
        <section className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#10172a] to-[#0d1322] border border-sky-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Recommended Safety Practice</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Essential Setup Before Exploring Third-Party Tools
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                For optimal security, ensure your browser is equipped with a reputable adblocker (e.g. <strong>uBlock Origin</strong>), encrypted DNS (e.g. <strong>NextDNS / Quad9</strong>), and always scan unknown downloads using <strong>VirusTotal</strong>.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <Link
                href="/beginners-guide"
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Beginner&apos;s Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              
              <Link
                href="/categories/privacy"
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 hover:border-sky-400/30 text-white font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Privacy &amp; Adblock</span>
              </Link>
            </div>

          </div>
        </section>

      </main>

      {/* Global Clean Professional Footer */}
      <Footer />
    </>
  );
}
