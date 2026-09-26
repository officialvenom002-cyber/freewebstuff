"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryMeta {
  id: string;
  name: string;
  count: string;
  label: string;
  href: string;
  icon: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  desc: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: "privacy",
    name: "Privacy",
    count: "850+",
    label: "tools",
    href: "/categories/privacy",
    icon: "🛡",
    accent: "#6ee7b7",
    accentBg: "rgba(110,231,183,0.08)",
    accentBorder: "rgba(110,231,183,0.22)",
    desc: "Adblockers, VPNs, Password managers",
  },
  {
    id: "ai",
    name: "AI Tools",
    count: "1,200+",
    label: "tools",
    href: "/categories/ai",
    icon: "✦",
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.08)",
    accentBorder: "rgba(167,139,250,0.22)",
    desc: "LLMs, Image gen, Code assistants",
  },
  {
    id: "developer-tools",
    name: "Developer",
    count: "900+",
    label: "tools",
    href: "/categories/developer-tools",
    icon: "⌥",
    accent: "#67e8f9",
    accentBg: "rgba(103,232,249,0.08)",
    accentBorder: "rgba(103,232,249,0.20)",
    desc: "APIs, Hosting, Dev utilities",
  },
  {
    id: "video",
    name: "Streaming",
    count: "1,100+",
    label: "sites",
    href: "/categories/video",
    icon: "▶",
    accent: "#f87171",
    accentBg: "rgba(248,113,113,0.08)",
    accentBorder: "rgba(248,113,113,0.22)",
    desc: "Movies, Series, Anime, Sports",
  },
  {
    id: "gaming",
    name: "Gaming",
    count: "1,400+",
    label: "resources",
    href: "/categories/gaming",
    icon: "◉",
    accent: "#fb923c",
    accentBg: "rgba(251,146,60,0.08)",
    accentBorder: "rgba(251,146,60,0.22)",
    desc: "Repacks, Emulators, Mods, ROMs",
  },
  {
    id: "educational",
    name: "Education",
    count: "750+",
    label: "resources",
    href: "/categories/educational",
    icon: "◎",
    accent: "#fde68a",
    accentBg: "rgba(253,230,138,0.08)",
    accentBorder: "rgba(253,230,138,0.20)",
    desc: "Courses, Textbooks, Lectures",
  },
  {
    id: "downloading",
    name: "Downloads",
    count: "680+",
    label: "sites",
    href: "/categories/downloading",
    icon: "↓",
    accent: "#94a3b8",
    accentBg: "rgba(148,163,184,0.08)",
    accentBorder: "rgba(148,163,184,0.20)",
    desc: "DDL, Debrid, P2P, Torrent clients",
  },
  {
    id: "audio",
    name: "Audio",
    count: "520+",
    label: "tools",
    href: "/categories/audio",
    icon: "◈",
    accent: "#86efac",
    accentBg: "rgba(134,239,172,0.08)",
    accentBorder: "rgba(134,239,172,0.20)",
    desc: "Music, Podcasts, Radio, FLAC",
  },
  {
    id: "mobile",
    name: "Mobile",
    count: "640+",
    label: "apps",
    href: "/categories/mobile",
    icon: "□",
    accent: "#7dd3fc",
    accentBg: "rgba(125,211,252,0.08)",
    accentBorder: "rgba(125,211,252,0.20)",
    desc: "Android APKs, iOS sideloading, FOSS",
  },
  {
    id: "torrenting",
    name: "Torrenting",
    count: "620+",
    label: "trackers",
    href: "/categories/torrenting",
    icon: "⚡",
    accent: "#c084fc",
    accentBg: "rgba(192,132,252,0.08)",
    accentBorder: "rgba(192,132,252,0.22)",
    desc: "Clients, Private trackers, Magnet search",
  },
  {
    id: "reading",
    name: "Books & Comics",
    count: "810+",
    label: "libraries",
    href: "/categories/reading",
    icon: "📖",
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.08)",
    accentBorder: "rgba(251,191,36,0.22)",
    desc: "E-books, Manga, Light novels, Audiobooks",
  },
  {
    id: "system-tools",
    name: "System & OS",
    count: "540+",
    label: "utilities",
    href: "/categories/system-tools",
    icon: "⚙",
    accent: "#38bdf8",
    accentBg: "rgba(56,189,248,0.08)",
    accentBorder: "rgba(56,189,248,0.22)",
    desc: "Debloaters, Diagnostic tools, OS tweaks",
  },
  {
    id: "linux-macos",
    name: "Linux & macOS",
    count: "480+",
    label: "tools",
    href: "/categories/linux-macos",
    icon: "⌘",
    accent: "#f43f5e",
    accentBg: "rgba(244,63,94,0.08)",
    accentBorder: "rgba(244,63,94,0.22)",
    desc: "Distros, Terminal tools, Package managers",
  },
  {
    id: "storage",
    name: "Cloud Storage",
    count: "310+",
    label: "drives",
    href: "/categories/storage",
    icon: "☁",
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.08)",
    accentBorder: "rgba(52,211,153,0.20)",
    desc: "Free cloud drives, Decentralized storage",
  },
  {
    id: "non-english",
    name: "Global Hubs",
    count: "590+",
    label: "sites",
    href: "/categories/non-english",
    icon: "🌐",
    accent: "#f97316",
    accentBg: "rgba(249,115,22,0.08)",
    accentBorder: "rgba(249,115,22,0.20)",
    desc: "Multilingual repositories, Regional indexes",
  },
  {
    id: "misc",
    name: "Miscellaneous",
    count: "920+",
    label: "sites",
    href: "/categories/misc",
    icon: "✨",
    accent: "#eab308",
    accentBg: "rgba(234,179,8,0.08)",
    accentBorder: "rgba(234,179,8,0.20)",
    desc: "Internet archives, Fun web toys, Curiosities",
  },
];

function CategoryCard({ cat }: { cat: CategoryMeta }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={cat.href}
      className="group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200"
      style={{
        background: hovered ? cat.accentBg : "var(--card, #111316)",
        borderColor: hovered ? cat.accentBorder : "var(--border, #1E2228)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px -4px ${cat.accentBg}` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon block */}
      <div
        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-[18px] font-bold border transition-colors duration-200 shadow-inner"
        style={{
          background: "var(--bg, #0B0C0E)",
          borderColor: hovered ? cat.accentBorder : "var(--border, #262A30)",
          color: cat.accent,
        }}
      >
        {cat.icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-heading font-bold text-[15px] text-[#F2F3F5] leading-snug group-hover:text-white transition-colors">
            {cat.name}
          </span>
          <span
            className="shrink-0 text-[11px] font-mono font-semibold tabular-nums px-1.5 py-0.5 rounded-md border"
            style={{ 
              color: cat.accent,
              background: cat.accentBg,
              borderColor: cat.accentBorder 
            }}
          >
            {cat.count}
          </span>
        </div>
        <p className="text-[12px] text-[#8A92A6] leading-snug truncate">
          {cat.desc}
        </p>
      </div>

      {/* Arrow */}
      <ArrowUpRight
        className="shrink-0 w-4 h-4 transition-all duration-200"
        style={{
          color: cat.accent,
          opacity: hovered ? 1 : 0.25,
          transform: hovered ? "translate(0, 0)" : "translate(3px, 0)",
        }}
      />
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>

      {/* "All categories" directory link */}
      <div className="flex justify-center mt-8">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-sky-400 bg-white/[0.04] border border-white/10 hover:border-sky-500/40 px-5 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all duration-200 shadow-sm"
        >
          <span>Explore all 24+ full category archives</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </>
  );
}
