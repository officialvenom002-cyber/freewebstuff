"use client";

import React from "react";
import Link from "next/link";
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
  // ── Row 1: Core Entertainment & AI Pillars (High Demand) ──────────────────
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

  // ── Row 2: Downloads, P2P & Security (High Demand) ────────────────────────
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

  // ── Row 3: Trending Media & Web Utilities (High Demand) ───────────────────
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

  // ── Row 4: Reading, OS & Developer Toolkits (High Demand) ─────────────────
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
];

function CategoryCard({ cat }: { cat: CategoryMeta }) {
  const [hovered, setHovered] = React.useState(false);
  const IconComponent = cat.icon;

  return (
    <Link
      href={cat.href}
      className="group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 overflow-hidden min-h-[178px]"
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
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105"
          style={{
            background: hovered ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.03)",
            borderColor: hovered ? cat.accentBorder : "rgba(255, 255, 255, 0.08)",
          }}
        >
          <IconComponent className="w-5 h-5 transition-transform duration-200" style={{ color: cat.accent }} />
        </div>

        {/* Minimalist count badge - no tacky viral tags */}
        <span
          className="text-[11px] font-mono text-slate-400 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.06] tracking-tight group-hover:border-white/10 transition-colors"
        >
          {cat.count}
        </span>
      </div>

      {/* Middle row: Title & Description */}
      <div className="my-2.5 relative z-10">
        <h3 className="font-heading font-bold text-[15.5px] text-slate-100 leading-snug group-hover:text-white transition-colors">
          {cat.name}
        </h3>
        <p className="text-[12px] text-slate-400 group-hover:text-slate-300 leading-relaxed mt-1 line-clamp-2 transition-colors">
          {cat.desc}
        </p>
      </div>

      {/* Bottom row: Verified category label & smooth arrow button */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05] relative z-10">
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: cat.accent }}
          />
          <span className="text-[11px] font-medium text-slate-400">
            {cat.label}
          </span>
        </div>

        <div
          className="w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200"
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
    <>
      {/* 4 Cards per column/row layout (4x4 matrix = 16 high-demand categories) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>

      {/* "All categories" directory link */}
      <div className="flex justify-center mt-10">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:border-white/20 hover:text-white px-6 py-3 rounded-xl hover:bg-white/[0.06] transition-all duration-200 shadow-sm"
        >
          <span>Explore all 24+ full category archives</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </>
  );
}
