"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Search, 
  Menu, 
  X, 
  Moon,
  ChevronDown,
  Globe
} from "lucide-react";
import SearchModal from "../search/SearchModal";
import SearchToggle from "../search/SearchToggle";
import Logo from "../ui/Logo";
import ThemeSelector from "../ui/ThemeSelector";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  // Global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ecosystemRef.current && !ecosystemRef.current.contains(e.target as Node)) {
        setEcosystemOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ecosystemItems = [
    { name: "Beginner's Guide", href: "/beginners-guide", desc: "New? Start here" },
    { name: "Startpage", href: "/startpage", desc: "Set as your new tab" },
    { name: "SafeGuard (Unsafe Sites)", href: "/unsafe", desc: "Security advisory" },
    { name: "Recently Removed", href: "/recently-removed", desc: "Transparency log" },
    { name: "Submit a Resource", href: "/submit", desc: "Add to the index" },
    { name: "Saved Bookmarks", href: "/bookmarks", desc: "Locally saved items" },
    { name: "Admin Panel", href: "/admin", desc: "Site moderation" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 w-full bg-[#030712]/90 backdrop-blur-md border-b border-[#1A2030]/60 transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_24px_-4px_rgba(0,0,0,0.7)]" : ""}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Cosmic Ring Logo + Pill Search Bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Glowing Planet Emblem Logo + FWSF Brand */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0" title="FWSF">
              <Logo className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="brand-name font-extrabold tracking-wider text-white text-base sm:text-lg">
                FWSF
              </span>
            </Link>

            {/* Quick Search Pill Bar (Polished Command Palette Toggle) */}
            <SearchToggle
              onClick={() => setIsSearchOpen(true)}
              placeholder="Search tools & guides..."
              className="w-48 sm:w-64"
            />

          </div>

          {/* Right: FMHY Style Navigation Links & Social Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300">
              
              <Link
                href="/beginners-guide"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-[#151B2A] transition-colors"
              >
                <span>📖</span>
                <span>Glossary</span>
              </Link>

              <Link
                href="/startpage"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-[#151B2A] transition-colors"
              >
                <span>💾</span>
                <span>Backups</span>
              </Link>

              {/* Ecosystem Dropdown */}
              <div ref={ecosystemRef} className="relative">
                <button
                  onClick={() => setEcosystemOpen(!ecosystemOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-[#151B2A] transition-colors"
                >
                  <span>🌱</span>
                  <span>Ecosystem</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${ecosystemOpen ? "rotate-180" : ""}`} />
                </button>

                {ecosystemOpen && (
                  <div className="absolute top-full right-0 mt-2 w-60 rounded-2xl bg-[#101420] border border-[#22293C] shadow-2xl py-2 z-50 animate-fade-in">
                    {ecosystemItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setEcosystemOpen(false)}
                        className="flex flex-col px-4 py-2 hover:bg-[#181E2E] transition-colors"
                      >
                        <span className="text-sm font-medium text-white">{item.name}</span>
                        <span className="text-[11px] text-slate-400">{item.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </nav>

            {/* Social Icons & Theme indicator */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#1F273B] text-slate-400">
              
              {/* Mad Design Theme Selector Popover */}
              <ThemeSelector align="right" />

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:text-white hover:bg-[#151B2A] transition-colors"
                title="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>

              {/* Discord with online counter */}
              <a
                href="https://discord.gg/ZEMSvP2HX"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:text-white hover:bg-[#151B2A] transition-colors group"
                title="Join our Discord"
              >
                <svg className="w-4 h-4 fill-current text-[#5865F2] group-hover:text-[#7289DA] transition-colors" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>

              {/* Globe Icon */}
              <button
                className="p-1.5 rounded-lg hover:text-white hover:bg-[#151B2A] transition-colors"
                title="Global Region"
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg hover:text-white hover:bg-[#151B2A] ml-1"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#1A2030] bg-[#0C0F18] px-4 py-3 space-y-1">
            <Link href="/changelog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-white">
              📑 Changelog
            </Link>
            <Link href="/beginners-guide" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-white">
              📖 Glossary / Guide
            </Link>
            <Link href="/startpage" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-white">
              💾 Backups &amp; Startpage
            </Link>
            <Link href="/unsafe" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-white">
              🛡 SafeGuard
            </Link>
            <Link href="/submit" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-white">
              ➕ Submit a Resource
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
