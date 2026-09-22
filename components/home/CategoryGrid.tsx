"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "privacy",
    name: "Privacy",
    count: "850+",
    label: "tools",
    href: "/categories/privacy",
    icon: "🛡",
    accent: "#6ee7b7",
    accentBg: "rgba(110,231,183,0.07)",
    accentBorder: "rgba(110,231,183,0.18)",
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
    accentBg: "rgba(167,139,250,0.07)",
    accentBorder: "rgba(167,139,250,0.18)",
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
    accentBg: "rgba(103,232,249,0.06)",
    accentBorder: "rgba(103,232,249,0.16)",
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
    accentBg: "rgba(248,113,113,0.07)",
    accentBorder: "rgba(248,113,113,0.18)",
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
    accentBg: "rgba(251,146,60,0.07)",
    accentBorder: "rgba(251,146,60,0.18)",
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
    accentBg: "rgba(253,230,138,0.06)",
    accentBorder: "rgba(253,230,138,0.16)",
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
    accentBg: "rgba(148,163,184,0.06)",
    accentBorder: "rgba(148,163,184,0.15)",
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
    accentBg: "rgba(134,239,172,0.06)",
    accentBorder: "rgba(134,239,172,0.16)",
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
    accentBg: "rgba(125,211,252,0.06)",
    accentBorder: "rgba(125,211,252,0.16)",
    desc: "Android APKs, iOS sideloading, FOSS",
  },
];

function CategoryCard({ cat }: { cat: typeof CATEGORIES[0] }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={cat.href}
      className="group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200"
      style={{
        background: hovered ? cat.accentBg : "#111316",
        borderColor: hovered ? cat.accentBorder : "#1E2228",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon block */}
      <div
        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-[17px] font-bold border transition-colors duration-200"
        style={{
          background: "#0B0C0E",
          borderColor: hovered ? cat.accentBorder : "#262A30",
          color: cat.accent,
        }}
      >
        {cat.icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-heading font-bold text-[15px] text-[#F2F3F5] leading-snug">
            {cat.name}
          </span>
          <span
            className="shrink-0 text-[11px] font-mono font-semibold tabular-nums"
            style={{ color: cat.accent }}
          >
            {cat.count}
          </span>
        </div>
        <p className="text-[12px] text-[#5A6070] leading-snug truncate">
          {cat.desc}
        </p>
      </div>

      {/* Arrow */}
      <ArrowUpRight
        className="shrink-0 w-3.5 h-3.5 transition-all duration-200"
        style={{
          color: cat.accent,
          opacity: hovered ? 0.7 : 0,
          transform: hovered ? "translate(0, 0)" : "translate(4px, 0)",
        }}
      />
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>

      {/* Mobile "All categories" link */}
      <div className="sm:hidden flex justify-center mt-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8B7CFF] border border-[#262A30] px-4 py-2 rounded-xl hover:bg-[#15181C] transition-colors"
        >
          View all 24 categories <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </>
  );
}
