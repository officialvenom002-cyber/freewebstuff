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
    badge: "📖 E-books",
  },
  // ── 9th: Mobile & Android ─────────────────────────────────────────────────
  {
    id: "mobile",
    name: "Mobile & Apps",
    count: "640+",
    label: "apps",
    href: "/categories/mobile",
    icon: "📱",
    accent: "#7dd3fc",
    accentBg: "rgba(125,211,252,0.10)",
    accentBorder: "rgba(125,211,252,0.28)",
    desc: "Android APKs, iOS sideloading, F-Droid stores",
    badge: "📱 Mobile",
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
    badge: "⌥ Dev Tools",
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
    badge: "🎓 Courses",
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
    badge: "⚙ Utilities",
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
    badge: "⌘ Unix & OS",
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
    badge: "☁ Cloud",
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
    badge: "🌐 Global",
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
    badge: "✨ Archives",
  },
];

function CategoryCard({ cat }: { cat: CategoryMeta }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={cat.href}
      className="group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 overflow-hidden min-h-[180px]"
      style={{
        background: hovered 
          ? `linear-gradient(180deg, #151821 0%, #0d0f14 100%)` 
          : `linear-gradient(180deg, rgba(20,23,30,0.85) 0%, rgba(13,15,20,0.85) 100%)`,
        borderColor: hovered ? cat.accentBorder : "rgba(255, 255, 255, 0.08)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered 
          ? `0 16px 32px -8px ${cat.accentBg}, 0 0 0 1px ${cat.accentBorder}, inset 0 1px 0 0 rgba(255,255,255,0.12)`
          : "0 4px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255,255,255,0.05)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient background glow on hover */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: cat.accent,
          opacity: hovered ? 0.22 : 0,
        }}
      />

      {/* Top row: Icon and Badge */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[20px] font-bold border transition-all duration-300 group-hover:scale-110 shadow-sm"
          style={{
            background: hovered ? "rgba(0,0,0,0.4)" : "rgba(255, 255, 255, 0.04)",
            borderColor: hovered ? cat.accentBorder : "rgba(255, 255, 255, 0.10)",
            color: cat.accent,
          }}
        >
          {cat.icon}
        </div>

        {cat.badge ? (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-sm tracking-tight shrink-0 transition-all duration-300"
            style={{
              color: cat.accent,
              background: cat.accentBg,
              borderColor: hovered ? cat.accentBorder : "rgba(255, 255, 255, 0.08)",
            }}
          >
            {cat.badge}
          </span>
        ) : (
          <span
            className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.08] shrink-0"
          >
            {cat.count}
          </span>
        )}
      </div>

      {/* Middle row: Title & Description */}
      <div className="my-2.5 relative z-10">
        <h3 className="font-heading font-bold text-[15.5px] text-white leading-snug group-hover:text-white transition-colors">
          {cat.name}
        </h3>
        <p className="text-[12px] text-slate-400 group-hover:text-slate-300 leading-relaxed mt-1 line-clamp-2 transition-colors">
          {cat.desc}
        </p>
      </div>

      {/* Bottom row: Verified count & arrow action */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] relative z-10">
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: cat.accent }}
          />
          <span className="text-[11px] font-mono font-medium text-slate-400 tabular-nums">
            {cat.count} {cat.label}
          </span>
        </div>

        <div
          className="w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{
            background: hovered ? cat.accentBg : "rgba(255,255,255,0.03)",
            borderColor: hovered ? cat.accentBorder : "rgba(255,255,255,0.08)",
            color: hovered ? cat.accent : "#94A3B8",
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
      {/* 4 Cards per column/row layout (4x4 matrix = 16 cards total) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
