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
    count: "1,100+ sites",
    label: "sites",
    href: "/categories/video",
    icon: "▶",
    accent: "#f87171",
    accentBg: "rgba(248,113,113,0.10)",
    accentBorder: "rgba(248,113,113,0.30)",
    desc: "Free movie sites, anime streams, sports channels, and web media players.",
    badge: "🔥 #1 Viral",
  },
  // ── 2nd: Gaming & Emulation ───────────────────────────────────────────────
  {
    id: "gaming",
    name: "Gaming & Emulation",
    count: "1,400+ games",
    label: "resources",
    href: "/categories/gaming",
    icon: "◉",
    accent: "#fb923c",
    accentBg: "rgba(251,146,60,0.10)",
    accentBorder: "rgba(251,146,60,0.30)",
    desc: "Preservation ROMs, console emulators, repacks, indie titles, and mods.",
    badge: "⚡ #2 Trending",
  },
  // ── 3rd: Audio & Music ────────────────────────────────────────────────────
  {
    id: "audio",
    name: "Music & Podcasts",
    count: "520+ tools",
    label: "tools",
    href: "/categories/audio",
    icon: "◈",
    accent: "#86efac",
    accentBg: "rgba(134,239,172,0.10)",
    accentBorder: "rgba(134,239,172,0.30)",
    desc: "Lossless FLAC audio, internet radio, podcasts, sound editors, and mixers.",
    badge: "🎧 #3 Trending",
  },
  // ── 4th: AI Tools (Viral) ─────────────────────────────────────────────────
  {
    id: "ai",
    name: "AI & Machine Learning",
    count: "1,200+ tools",
    label: "tools",
    href: "/categories/ai",
    icon: "✦",
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.10)",
    accentBorder: "rgba(167,139,250,0.30)",
    desc: "Frontier LLMs, image generation, code assistants, and local AI frontends.",
    badge: "✦ Hot",
  },
  // ── 5th: Direct Downloads & Debrid ────────────────────────────────────────
  {
    id: "downloading",
    name: "Downloading & Direct",
    count: "680+ sites",
    label: "sites",
    href: "/categories/downloading",
    icon: "↓",
    accent: "#94a3b8",
    accentBg: "rgba(148,163,184,0.10)",
    accentBorder: "rgba(148,163,184,0.28)",
    desc: "Debrid services, multi-download managers, cyberlockers, and direct mirrors.",
    badge: "Popular",
  },
  // ── 6th: Torrenting & P2P ─────────────────────────────────────────────────
  {
    id: "torrenting",
    name: "Torrenting & P2P",
    count: "620+ trackers",
    label: "trackers",
    href: "/categories/torrenting",
    icon: "⚡",
    accent: "#c084fc",
    accentBg: "rgba(192,132,252,0.10)",
    accentBorder: "rgba(192,132,252,0.30)",
    desc: "Verified torrent clients, private trackers, magnet indexes, and seedboxes.",
    badge: "P2P",
  },
  // ── 7th: Privacy & Adblock ────────────────────────────────────────────────
  {
    id: "privacy",
    name: "Privacy & Adblock",
    count: "850+ tools",
    label: "tools",
    href: "/categories/privacy",
    icon: "🛡",
    accent: "#6ee7b7",
    accentBg: "rgba(110,231,183,0.10)",
    accentBorder: "rgba(110,231,183,0.30)",
    desc: "Adblock filters, DNS privacy, audited VPNs, trackers, and telemetry blockers.",
    badge: "Essential",
  },
  // ── 8th: Books & Comics ───────────────────────────────────────────────────
  {
    id: "reading",
    name: "Books & Comics",
    count: "810+ sources",
    label: "libraries",
    href: "/categories/reading",
    icon: "📖",
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.10)",
    accentBorder: "rgba(251,191,36,0.30)",
    desc: "E-books, manga readers, light novels, audiobooks, and free digital libraries.",
  },
  // ── 9th: Mobile & Android ─────────────────────────────────────────────────
  {
    id: "mobile",
    name: "Mobile & Apps",
    count: "640+ apps",
    label: "apps",
    href: "/categories/mobile",
    icon: "□",
    accent: "#7dd3fc",
    accentBg: "rgba(125,211,252,0.10)",
    accentBorder: "rgba(125,211,252,0.28)",
    desc: "Android APKs, iOS sideloading, F-Droid repositories, and mobile utilities.",
  },
  // ── 10th: Developer Tools ─────────────────────────────────────────────────
  {
    id: "developer-tools",
    name: "Developer Tools",
    count: "900+ tools",
    label: "tools",
    href: "/categories/developer-tools",
    icon: "⌥",
    accent: "#67e8f9",
    accentBg: "rgba(103,232,249,0.10)",
    accentBorder: "rgba(103,232,249,0.28)",
    desc: "Free API endpoints, cloud hosting, CSS generators, and developer utilities.",
  },
  // ── 11th: Educational & Courses ───────────────────────────────────────────
  {
    id: "educational",
    name: "Education & Courses",
    count: "750+ courses",
    label: "resources",
    href: "/categories/educational",
    icon: "◎",
    accent: "#fde68a",
    accentBg: "rgba(253,230,138,0.10)",
    accentBorder: "rgba(253,230,138,0.28)",
    desc: "Free college lectures, open textbooks, computer science tracks, and roadmaps.",
  },
  // ── 12th: System Tools & OS ───────────────────────────────────────────────
  {
    id: "system-tools",
    name: "System Tools & OS",
    count: "540+ utilities",
    label: "utilities",
    href: "/categories/system-tools",
    icon: "⚙",
    accent: "#38bdf8",
    accentBg: "rgba(56,189,248,0.10)",
    accentBorder: "rgba(56,189,248,0.28)",
    desc: "Windows debloaters, live USB builders, diagnostic tools, and OS optimization.",
  },
  // ── 13th: Linux & macOS ───────────────────────────────────────────────────
  {
    id: "linux-macos",
    name: "Linux & macOS",
    count: "480+ tools",
    label: "tools",
    href: "/categories/linux-macos",
    icon: "⌘",
    accent: "#f43f5e",
    accentBg: "rgba(244,63,94,0.10)",
    accentBorder: "rgba(244,63,94,0.28)",
    desc: "Linux distros, package managers, terminal applications, and Unix software.",
  },
  // ── 14th: Cloud Storage & Drives ──────────────────────────────────────────
  {
    id: "storage",
    name: "Cloud Storage",
    count: "310+ drives",
    label: "drives",
    href: "/categories/storage",
    icon: "☁",
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.10)",
    accentBorder: "rgba(52,211,153,0.28)",
    desc: "Free cloud storage tiers, encrypted sync utilities, and decentralized drives.",
  },
  // ── 15th: Global & Multilingual Hubs ──────────────────────────────────────
  {
    id: "non-english",
    name: "Global Hubs",
    count: "590+ sites",
    label: "sites",
    href: "/categories/non-english",
    icon: "🌐",
    accent: "#f97316",
    accentBg: "rgba(249,115,22,0.10)",
    accentBorder: "rgba(249,115,22,0.28)",
    desc: "Multilingual repositories, international indexes, translations, and regional tools.",
  },
  // ── 16th: Miscellaneous & Fun ─────────────────────────────────────────────
  {
    id: "misc",
    name: "Miscellaneous & Fun",
    count: "920+ sites",
    label: "sites",
    href: "/categories/misc",
    icon: "✨",
    accent: "#eab308",
    accentBg: "rgba(234,179,8,0.10)",
    accentBorder: "rgba(234,179,8,0.28)",
    desc: "Internet archives, retro web games, weird websites, and fun utilities.",
  },
];

function CategoryCard({ cat }: { cat: CategoryMeta }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={cat.href}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border transition-all duration-300"
      style={{
        background: hovered ? cat.accentBg : "var(--card, #111316)",
        borderColor: hovered ? cat.accentBorder : "var(--border, #1E2228)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered 
          ? `0 12px 28px -6px ${cat.accentBg}, 0 0 0 1px ${cat.accentBorder}`
          : "0 2px 8px rgba(0,0,0,0.15)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        {/* Top Header: Icon + Badge + Count */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] font-bold border transition-transform duration-300 group-hover:scale-110 shadow-inner shrink-0"
            style={{
              background: "var(--bg, #0B0C0E)",
              borderColor: hovered ? cat.accentBorder : "var(--border, #262A30)",
              color: cat.accent,
            }}
          >
            {cat.icon}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {cat.badge && (
              <span
                className="text-[10px] sm:text-[10.5px] font-semibold px-2 py-0.5 rounded-full border shadow-sm tracking-wide"
                style={{
                  color: cat.accent,
                  background: cat.accentBg,
                  borderColor: cat.accentBorder,
                }}
              >
                {cat.badge}
              </span>
            )}
            <span
              className="text-[10.5px] font-mono font-medium tabular-nums px-2 py-0.5 rounded-md border text-slate-400 bg-white/[0.03] border-white/[0.08]"
            >
              {cat.count}
            </span>
          </div>
        </div>

        {/* Content: Title & Description */}
        <h3 className="font-heading font-bold text-[16px] sm:text-[17px] text-[#F2F3F5] leading-snug group-hover:text-white transition-colors mb-2">
          {cat.name}
        </h3>
        <p className="text-[12.5px] sm:text-[13px] text-[#8A92A6] leading-relaxed line-clamp-2">
          {cat.desc}
        </p>
      </div>

      {/* Footer: Explore link + dynamic arrow */}
      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span 
          className="text-[11.5px] sm:text-xs font-semibold tracking-wide transition-colors duration-200"
          style={{ color: hovered ? cat.accent : "#64748b" }}
        >
          Explore category
        </span>
        <ArrowUpRight
          className="w-4 h-4 transition-all duration-300"
          style={{
            color: cat.accent,
            transform: hovered ? "translate(2px, -2px) scale(1.15)" : "translate(0, 0)",
            opacity: hovered ? 1 : 0.35,
          }}
        />
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
