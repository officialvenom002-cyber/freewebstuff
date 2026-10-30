"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Film,
  Gamepad2,
  Headphones,
  Sparkles,
  Download,
  Radio,
  ShieldCheck,
  Smartphone,
  Share2,
  Palette,
  Video,
  Globe,
  BookOpen,
  Cpu,
  Code2,
  FolderArchive,
  GraduationCap,
  Terminal,
  HardDrive,
  FileText,
  Crosshair,
  Languages,
  Boxes,
  WifiOff,
  ArrowUpRight,
} from "lucide-react";

interface CategoryMeta {
  id: string;
  name: string;
  count: string;
  label: string;
  href: string;
  icon: React.ElementType;
  accent: string;
  accentBg: string;
  accentBorder: string;
  desc: string;
}

const CATEGORIES: CategoryMeta[] = [
  // ── Row 1: Core Entertainment & AI Pillars ─────────────────────────────────
  {
    id: "video",
    name: "Streaming & Movies",
    count: "1,100+",
    label: "Streams & Anime",
    href: "/categories/video",
    icon: Film,
    accent: "#f87171",
    accentBg: "rgba(248,113,113,0.08)",
    accentBorder: "rgba(248,113,113,0.25)",
    desc: "Free 4K movies, anime streams, live sports, and web media players",
  },
  {
    id: "gaming",
    name: "Gaming & Emulation",
    count: "1,400+",
    label: "ROMs & Repacks",
    href: "/categories/gaming",
    icon: Gamepad2,
    accent: "#fb923c",
    accentBg: "rgba(251,146,60,0.08)",
    accentBorder: "rgba(251,146,60,0.25)",
    desc: "Preservation ROMs, emulators, game repacks, and PC gaming mods",
  },
  {
    id: "audio",
    name: "Music & Podcasts",
    count: "520+",
    label: "Lossless & Radio",
    href: "/categories/audio",
    icon: Headphones,
    accent: "#4ade80",
    accentBg: "rgba(74,222,128,0.08)",
    accentBorder: "rgba(74,222,128,0.25)",
    desc: "Lossless FLAC music, web radio stations, podcasts, and sound tools",
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    count: "1,200+",
    label: "Frontier LLMs",
    href: "/categories/ai",
    icon: Sparkles,
    accent: "#c084fc",
    accentBg: "rgba(192,132,252,0.08)",
    accentBorder: "rgba(192,132,252,0.25)",
    desc: "Frontier LLMs, image generators, AI chatbots, and code assistants",
  },

  // ── Row 2: Downloads, P2P & Security ──────────────────────────────────────
  {
    id: "downloading",
    name: "Downloading & Direct",
    count: "680+",
    label: "Debrid & Lockers",
    href: "/categories/downloading",
    icon: Download,
    accent: "#38bdf8",
    accentBg: "rgba(56,189,248,0.08)",
    accentBorder: "rgba(56,189,248,0.25)",
    desc: "Debrid services, fast cloud lockers, and batch download managers",
  },
  {
    id: "torrenting",
    name: "Torrenting & P2P",
    count: "620+",
    label: "Private Trackers",
    href: "/categories/torrenting",
    icon: Radio,
    accent: "#a855f7",
    accentBg: "rgba(168,85,247,0.08)",
    accentBorder: "rgba(168,85,247,0.25)",
    desc: "Private trackers, magnet search engines, and open-source clients",
  },
  {
    id: "privacy",
    name: "Privacy & Adblock",
    count: "850+",
    label: "Adblock & DNS",
    href: "/categories/privacy",
    icon: ShieldCheck,
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.08)",
    accentBorder: "rgba(52,211,153,0.25)",
    desc: "Adblock filters, encrypted DNS, audited VPNs, and anti-tracking tools",
  },
  {
    id: "mobile",
    name: "Android & Mobile Apps",
    count: "640+",
    label: "APKs & Sideload",
    href: "/categories/mobile",
    icon: Smartphone,
    accent: "#60a5fa",
    accentBg: "rgba(96,165,250,0.08)",
    accentBorder: "rgba(96,165,250,0.25)",
    desc: "ReVanced patches, modded APKs, iOS sideloading, and F-Droid apps",
  },

  // ── Row 3: Trending Media & Web Utilities ─────────────────────────────────
  {
    id: "social-media-tools",
    name: "Social Media Tools",
    count: "430+",
    label: "Video Rippers",
    href: "/categories/social-media-tools",
    icon: Share2,
    accent: "#ec4899",
    accentBg: "rgba(236,72,153,0.08)",
    accentBorder: "rgba(236,72,153,0.25)",
    desc: "YouTube downloaders, TikTok/IG rippers, and media scrapers",
  },
  {
    id: "image-tools",
    name: "Image Tools & Editors",
    count: "580+",
    label: "Photo & Vector",
    href: "/categories/image-tools",
    icon: Palette,
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",
    desc: "Photoshop alternatives, background removers, vector tools, upscalers",
  },
  {
    id: "video-tools",
    name: "Video Tools & Encoders",
    count: "390+",
    label: "Converters & Recorders",
    href: "/categories/video-tools",
    icon: Video,
    accent: "#14b8a6",
    accentBg: "rgba(20,184,166,0.08)",
    accentBorder: "rgba(20,184,166,0.25)",
    desc: "Screen recorders, video converters, compressors, and subtitle tools",
  },
  {
    id: "internet-tools",
    name: "Internet & Browser Tools",
    count: "710+",
    label: "Extensions & Scrapers",
    href: "/categories/internet-tools",
    icon: Globe,
    accent: "#06b6d4",
    accentBg: "rgba(6,182,212,0.08)",
    accentBorder: "rgba(6,182,212,0.25)",
    desc: "Paywall bypassers, user scripts, web scrapers, and browser extensions",
  },

  // ── Row 4: Reading, OS & Developer Toolkits ───────────────────────────────
  {
    id: "reading",
    name: "Books, Comics & Manga",
    count: "810+",
    label: "Libraries & Manga",
    href: "/categories/reading",
    icon: BookOpen,
    accent: "#eab308",
    accentBg: "rgba(234,179,8,0.08)",
    accentBorder: "rgba(234,179,8,0.25)",
    desc: "Free e-books, manga readers, light novels, and comic archives",
  },
  {
    id: "system-tools",
    name: "System Tools & OS",
    count: "540+",
    label: "OS Debloaters",
    href: "/categories/system-tools",
    icon: Cpu,
    accent: "#38bdf8",
    accentBg: "rgba(56,189,248,0.08)",
    accentBorder: "rgba(56,189,248,0.25)",
    desc: "Windows debloaters, live USB creators, and diagnostic utilities",
  },
  {
    id: "developer-tools",
    name: "Developer Tools & APIs",
    count: "900+",
    label: "APIs & Hosting",
    href: "/categories/developer-tools",
    icon: Code2,
    accent: "#818cf8",
    accentBg: "rgba(129,140,248,0.08)",
    accentBorder: "rgba(129,140,248,0.25)",
    desc: "Free API endpoints, cloud hosting tiers, databases, and dev toolkits",
  },
  {
    id: "file-tools",
    name: "File Tools & Utilities",
    count: "340+",
    label: "Archivers & Renamers",
    href: "/categories/file-tools",
    icon: FolderArchive,
    accent: "#94a3b8",
    accentBg: "rgba(148,163,184,0.08)",
    accentBorder: "rgba(148,163,184,0.25)",
    desc: "File archivers, batch rename utilities, format converters, and unpackers",
  },

  // ── Row 5: Education, OS & Cloud Ecosystems ───────────────────────────────
  {
    id: "educational",
    name: "Educational & Courses",
    count: "1,500+",
    label: "Free Courses & Docs",
    href: "/categories/educational",
    icon: GraduationCap,
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.25)",
    desc: "University courses, free certifications, textbooks, and interactive coding labs",
  },
  {
    id: "linux-macos",
    name: "Linux & macOS",
    count: "490+",
    label: "Distros & Apps",
    href: "/categories/linux-macos",
    icon: Terminal,
    accent: "#a3e635",
    accentBg: "rgba(163,230,53,0.08)",
    accentBorder: "rgba(163,230,53,0.25)",
    desc: "Linux distributions, macOS apps, package managers, dotfiles, and terminal tools",
  },
  {
    id: "storage",
    name: "Cloud Storage & Sync",
    count: "380+",
    label: "Decentralized & Drives",
    href: "/categories/storage",
    icon: HardDrive,
    accent: "#0ea5e9",
    accentBg: "rgba(14,165,233,0.08)",
    accentBorder: "rgba(14,165,233,0.25)",
    desc: "Encrypted cloud drives, free backup storage, WebDAV hosts, and file sync apps",
  },
  {
    id: "text-tools",
    name: "Text & Document Tools",
    count: "410+",
    label: "Markdown & OCR",
    href: "/categories/text-tools",
    icon: FileText,
    accent: "#f472b6",
    accentBg: "rgba(244,114,182,0.08)",
    accentBorder: "rgba(244,114,182,0.25)",
    desc: "Markdown editors, private pastebins, PDF toolkits, diff checkers, and OCR utilities",
  },

  // ── Row 6: Gaming Mods, Global & Community Vaults ─────────────────────────
  {
    id: "gaming-tools",
    name: "Gaming Tools & Mods",
    count: "560+",
    label: "Launchers & Mods",
    href: "/categories/gaming-tools",
    icon: Crosshair,
    accent: "#fb7185",
    accentBg: "rgba(251,113,133,0.08)",
    accentBorder: "rgba(251,113,133,0.25)",
    desc: "Game trainers, FPS boosters, mod managers, cross-platform launchers, and cheat tables",
  },
  {
    id: "non-english",
    name: "Non-English Vaults",
    count: "920+",
    label: "Global Communities",
    href: "/categories/non-english",
    icon: Languages,
    accent: "#2dd4bf",
    accentBg: "rgba(45,212,191,0.08)",
    accentBorder: "rgba(45,212,191,0.25)",
    desc: "Foreign language torrent trackers, localized streaming hubs, and international archives",
  },
  {
    id: "misc",
    name: "Miscellaneous & Vaults",
    count: "640+",
    label: "Web Artifacts & Fun",
    href: "/categories/misc",
    icon: Boxes,
    accent: "#e879f9",
    accentBg: "rgba(232,121,249,0.08)",
    accentBorder: "rgba(232,121,249,0.25)",
    desc: "Internet museums, weird web projects, interactive simulations, and quirky web vaults",
  },
  {
    id: "offline",
    name: "Offline Archives & Mirrors",
    count: "250+",
    label: "Survival & Kiwix",
    href: "/categories/offline",
    icon: WifiOff,
    accent: "#ef4444",
    accentBg: "rgba(239,68,68,0.08)",
    accentBorder: "rgba(239,68,68,0.25)",
    desc: "Kiwix ZIM archives, Wikipedia offline dumps, emergency medical guides, and survival vaults",
  },
];

function CategoryCard({ cat }: { cat: CategoryMeta }) {
  const router = useRouter();
  const [hovered, setHovered] = React.useState(false);
  const IconComponent = cat.icon;

  const handleClick = (e: React.MouseEvent) => {
    // If middle click or Cmd/Ctrl/Shift click, allow browser default new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    router.push(cat.href);
  };

  return (
    <Link
      href={cat.href}
      prefetch={false}
      onClick={handleClick}
      className="group relative flex flex-col justify-between p-4.5 sm:p-5 rounded-2xl border transition-all duration-300 overflow-hidden min-h-[190px] h-full cursor-pointer select-none active:scale-[0.985]"
      style={{
        background: hovered 
          ? "linear-gradient(165deg, rgba(20, 25, 34, 0.95) 0%, rgba(12, 15, 21, 0.98) 100%)" 
          : "linear-gradient(165deg, rgba(16, 20, 27, 0.72) 0%, rgba(10, 12, 17, 0.85) 100%)",
        borderColor: hovered ? cat.accentBorder : "rgba(255, 255, 255, 0.065)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered 
          ? `0 14px 28px -6px rgba(0, 0, 0, 0.55), 0 0 0 1px ${cat.accentBorder}`
          : "0 4px 16px -2px rgba(0, 0, 0, 0.38), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Matte ambient background aura on hover */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
        style={{
          background: cat.accent,
          opacity: hovered ? 0.15 : 0,
        }}
      />

      {/* Top row: Icon and Clean Counter Badge */}
      <div className="flex items-center justify-between gap-2 relative z-10 pointer-events-none">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shrink-0"
          style={{
            background: hovered ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.03)",
            borderColor: hovered ? cat.accentBorder : "rgba(255, 255, 255, 0.08)",
          }}
        >
          <IconComponent className="w-5 h-5 transition-transform duration-200" style={{ color: cat.accent }} />
        </div>

        {/* Minimalist count badge */}
        <span
          className="text-[11px] font-mono text-slate-400 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.06] tracking-tight group-hover:border-white/10 transition-colors shrink-0"
        >
          {cat.count}
        </span>
      </div>

      {/* Middle row: Title & Description */}
      <div className="my-2.5 relative z-10 min-w-0 pointer-events-none">
        <h3 
          className="font-heading font-bold text-[15px] sm:text-[15.5px] text-slate-100 leading-snug group-hover:text-white transition-colors truncate"
          title={cat.name}
        >
          {cat.name}
        </h3>
        <p className="text-[12px] text-slate-400 group-hover:text-slate-300 leading-relaxed mt-1 line-clamp-2 transition-colors min-h-[36px]">
          {cat.desc}
        </p>
      </div>

      {/* Bottom row: Verified category label & smooth arrow button */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05] relative z-10 gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 min-w-0 pr-1">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: cat.accent }}
          />
          <span className="text-[11px] font-medium text-slate-400 truncate">
            {cat.label}
          </span>
        </div>

        <div
          className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center border transition-all duration-200"
          style={{
            background: hovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
            borderColor: hovered ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.07)",
            color: hovered ? "#ffffff" : "#94a3b8",
            transform: hovered ? "translate(1px, -1px)" : "translate(0, 0)",
          }}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CATEGORIES.map((cat) => (
        <CategoryCard key={cat.id} cat={cat} />
      ))}
    </div>
  );
}
