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
  badge?: string;
}

const CATEGORIES: CategoryMeta[] = [
  // ── 1st: Streaming & Movies (Most Viral) ──────────────────────────────────
  {
    id: "video",
    name: "Streaming & Movies",
    count: "1,100+",
    label: "sites",
    href: "/categories/video",
    icon: "▶",
    accent: "#f87171",
    accentBg: "rgba(248,113,113,0.10)",
    accentBorder: "rgba(248,113,113,0.30)",
    desc: "Free movies, anime streams, sports, media players",
    badge: "🔥 #1 Viral",
  },
  // ── 2nd: Gaming & Emulation ───────────────────────────────────────────────
  {
    id: "gaming",
    name: "Gaming & Emulation",
    count: "1,400+",
    label: "resources",
    href: "/categories/gaming",
    icon: "◉",
    accent: "#fb923c",
    accentBg: "rgba(251,146,60,0.10)",
    accentBorder: "rgba(251,146,60,0.30)",
    desc: "Preservation ROMs, emulators, repacks, and mods",
    badge: "⚡ #2",
  },
  // ── 3rd: Audio & Music ────────────────────────────────────────────────────
  {
    id: "audio",
    name: "Music & Podcasts",
    count: "520+",
    label: "tools",
    href: "/categories/audio",
    icon: "◈",
    accent: "#86efac",
    accentBg: "rgba(134,239,172,0.10)",
    accentBorder: "rgba(134,239,172,0.30)",
    desc: "Lossless FLAC, web radio, podcasts, sound tools",
    badge: "🎧 #3",
  },
  // ── 4th: AI Tools (Viral) ─────────────────────────────────────────────────
  {
    id: "ai",
    name: "AI & Machine Learning",
    count: "1,200+",
    label: "tools",
    href: "/categories/ai",
    icon: "✦",
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.10)",
    accentBorder: "rgba(167,139,250,0.30)",
    desc: "Frontier LLMs, image gen, chatbots, code tools",
    badge: "✦ Hot",
  },
  // ── 5th: Direct Downloads & Debrid ────────────────────────────────────────
  {
    id: "downloading",
    name: "Downloading & Direct",
    count: "680+",
    label: "sites",
    href: "/categories/downloading",
    icon: "↓",
    accent: "#94a3b8",
    accentBg: "rgba(148,163,184,0.10)",
    accentBorder: "rgba(148,163,184,0.28)",
    desc: "Debrid links, download managers, and cyberlockers",
    badge: "Popular",
  },
  // ── 6th: Torrenting & P2P ─────────────────────────────────────────────────
  {
    id: "torrenting",
    name: "Torrenting & P2P",
    count: "620+",
    label: "trackers",
    href: "/categories/torrenting",
    icon: "⚡",
    accent: "#c084fc",
    accentBg: "rgba(192,132,252,0.10)",
    accentBorder: "rgba(192,132,252,0.30)",
    desc: "Torrent clients, private trackers, magnet indexes",
    badge: "P2P",
  },
  // ── 7th: Privacy & Adblock ────────────────────────────────────────────────
  {
    id: "privacy",
    name: "Privacy & Adblock",
    count: "850+",
    label: "tools",
    href: "/categories/privacy",
    icon: "🛡",
    accent: "#6ee7b7",
    accentBg: "rgba(110,231,183,0.10)",
    accentBorder: "rgba(110,231,183,0.30)",
    desc: "Adblock filters, DNS privacy, audited VPNs",
    badge: "Essential",
  },
  // ── 8th: Books & Comics ───────────────────────────────────────────────────
  {
    id: "reading",
    name: "Books & Comics",
    count: "810+",
    label: "libraries",
    href: "/categories/reading",
    icon: "📖",
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.10)",
    accentBorder: "rgba(251,191,36,0.30)",
    desc: "E-books, manga readers, light novels, audiobooks",
  },
  // ── 9th: Mobile & Android ─────────────────────────────────────────────────
  {
    id: "mobile",
    name: "Mobile & Apps",
    count: "640+",
    label: "apps",
    href: "/categories/mobile",
    icon: "□",
    accent: "#7dd3fc",
    accentBg: "rgba(125,211,252,0.10)",
    accentBorder: "rgba(125,211,252,0.28)",
    desc: "Android APKs, iOS sideloading, F-Droid stores",
  },
  // ── 10th: Developer Tools ─────────────────────────────────────────────────
  {
    id: "developer-tools",
    name: "Developer Tools",
    count: "900+",
    label: "tools",
    href: "/categories/developer-tools",
    icon: "⌥",
    accent: "#67e8f9",
    accentBg: "rgba(103,232,249,0.10)",
    accentBorder: "rgba(103,232,249,0.28)",
    desc: "Free API endpoints, cloud hosting, dev utilities",
  },
  // ── 11th: Educational & Courses ───────────────────────────────────────────
  {
    id: "educational",
    name: "Education & Courses",
    count: "750+",
    label: "resources",
    href: "/categories/educational",
    icon: "◎",
    accent: "#fde68a",
    accentBg: "rgba(253,230,138,0.10)",
    accentBorder: "rgba(253,230,138,0.28)",
    desc: "Free university lectures, open textbooks, roadmaps",
  },
  // ── 12th: System Tools & OS ───────────────────────────────────────────────
  {
    id: "system-tools",
    name: "System Tools & OS",
    count: "540+",
    label: "utilities",
    href: "/categories/system-tools",
    icon: "⚙",
    accent: "#38bdf8",
    accentBg: "rgba(56,189,248,0.10)",
    accentBorder: "rgba(56,189,248,0.28)",
    desc: "Windows debloaters, live USBs, diagnostic tools",
  },
  // ── 13th: Linux & macOS ───────────────────────────────────────────────────
  {
    id: "linux-macos",
    name: "Linux & macOS",
    count: "480+",
    label: "tools",
    href: "/categories/linux-macos",
    icon: "⌘",
    accent: "#f43f5e",
    accentBg: "rgba(244,63,94,0.10)",
    accentBorder: "rgba(244,63,94,0.28)",
    desc: "Distros, package managers, Unix terminal apps",
  },
  // ── 14th: Cloud Storage & Drives ──────────────────────────────────────────
  {
    id: "storage",
    name: "Cloud Storage",
    count: "310+",
    label: "drives",
    href: "/categories/storage",
    icon: "☁",
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.10)",
    accentBorder: "rgba(52,211,153,0.28)",
    desc: "Free cloud storage tiers and encrypted sync",
  },
  // ── 15th: Global & Multilingual Hubs ──────────────────────────────────────
  {
    id: "non-english",
    name: "Global Hubs",
    count: "590+",
    label: "sites",
    href: "/categories/non-english",
    icon: "🌐",
    accent: "#f97316",
    accentBg: "rgba(249,115,22,0.10)",
    accentBorder: "rgba(249,115,22,0.28)",
    desc: "Multilingual repositories and regional indexes",
  },
  // ── 16th: Miscellaneous & Fun ─────────────────────────────────────────────
  {
    id: "misc",
    name: "Miscellaneous & Fun",
    count: "920+",
    label: "sites",
    href: "/categories/misc",
    icon: "✨",
    accent: "#eab308",
    accentBg: "rgba(234,179,8,0.10)",
    accentBorder: "rgba(234,179,8,0.28)",
    desc: "Internet archives, retro web games, cool utilities",
  },
];

function CategoryCard({ cat }: { cat: CategoryMeta }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={cat.href}
      className="group relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 overflow-hidden"
      style={{
        background: hovered ? cat.accentBg : "var(--card, #111316)",
        borderColor: hovered ? cat.accentBorder : "var(--border, #1E2228)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered 
          ? `0 10px 24px -6px ${cat.accentBg}, 0 0 0 1px ${cat.accentBorder}`
          : "0 2px 8px rgba(0,0,0,0.14)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon block */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] font-bold border transition-transform duration-200 group-hover:scale-105 shrink-0 shadow-inner"
        style={{
          background: "var(--bg, #0B0C0E)",
          borderColor: hovered ? cat.accentBorder : "var(--border, #262A30)",
          color: cat.accent,
        }}
      >
        {cat.icon}
      </div>

      {/* Middle info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-heading font-bold text-[14px] text-[#F2F3F5] leading-snug group-hover:text-white transition-colors truncate">
            {cat.name}
          </h3>
          {cat.badge && (
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shadow-sm tracking-tight shrink-0 leading-none"
              style={{
                color: cat.accent,
                background: cat.accentBg,
                borderColor: cat.accentBorder,
              }}
            >
              {cat.badge}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-1.5">
          <p className="text-[11px] text-[#8A92A6] leading-tight truncate">
            {cat.desc}
          </p>
          <span
            className="shrink-0 text-[10px] font-mono font-medium tabular-nums text-slate-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.08]"
          >
            {cat.count}
          </span>
        </div>
      </div>

      {/* Right arrow */}
      <ArrowUpRight
        className="w-3.5 h-3.5 shrink-0 transition-all duration-200"
        style={{
          color: cat.accent,
          opacity: hovered ? 1 : 0.25,
          transform: hovered ? "translate(2px, -2px)" : "translate(0, 0)",
        }}
      />
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <>
      {/* 4 Cards per row (4 columns x 4 rows = 4 cards in each column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[880px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-3.5">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>

      {/* "All categories" directory link */}
      <div className="flex justify-center mt-10">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-sky-400 bg-white/[0.04] border border-white/10 hover:border-sky-500/40 px-6 py-3 rounded-xl hover:bg-white/[0.08] transition-all duration-200 shadow-sm"
        >
          <span>Explore all 24+ full category archives</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </>
  );
}
