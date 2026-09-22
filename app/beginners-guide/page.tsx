import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Bookmark,
  Download,
  Globe,
  Lock,
  Zap,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Tv2,
  Bot,
  Gamepad2,
  BookOpen,
  Music,
  Code2,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Quick Start — FreeWebStuff",
  description:
    "New to FreeWebStuff? Learn how to find, use, and stay safe with the internet's best free tools and resources.",
};

const STEPS = [
  {
    step: "01",
    title: "Install a Trusted Adblocker First",
    description:
      "Before exploring any free resource site, protect yourself. Install uBlock Origin — free, open-source, and blocks ads, trackers, and malicious scripts instantly.",
    color: "#34D399",
    icon: ShieldCheck,
    tips: [
      "Available for Chrome, Firefox, Edge, and Brave",
      'Go to your browser\'s extension store and search "uBlock Origin"',
      "After install, it works automatically — no configuration needed",
    ],
    links: [
      { label: "uBlock Origin (Chrome)", href: "https://chrome.google.com/webstore/detail/ublock-origin" },
      { label: "uBlock Origin (Firefox)", href: "https://addons.mozilla.org/firefox/addon/ublock-origin/" },
    ],
    badges: null,
  },
  {
    step: "02",
    title: "Search Anything with Ctrl+K",
    description:
      "FreeWebStuff has 15,000+ verified resources. Use the search bar to instantly find tools by name, category, or use case. Press Ctrl+K anywhere on the site to open spotlight search.",
    color: "#7C5CFF",
    icon: Search,
    tips: [
      "Type a tool name, category, or what you want to do",
      "Press Ctrl+K (Cmd+K on Mac) for instant search from anywhere on the site",
      "Use filters on the /search page to narrow by pricing, platform, or rating",
    ],
    links: [
      { label: "Open Search", href: "/search" },
    ],
    badges: null,
  },
  {
    step: "03",
    title: "Browse Our 24+ Categories",
    description:
      "Not sure what you need? Explore curated categories — streaming, AI tools, privacy software, gaming resources, developer utilities, and much more.",
    color: "#60A5FA",
    icon: Globe,
    tips: [
      "Each category contains hundreds of hand-picked, verified entries",
      "Categories: Streaming, AI, Privacy, Gaming, Books, Dev Tools, Music, and more",
      "Click any category card on the homepage to dive straight in",
    ],
    links: [
      { label: "Browse All Categories", href: "/categories" },
    ],
    badges: null,
  },
  {
    step: "04",
    title: "Understand Resource Badges",
    description:
      "Every resource card shows badges that tell you exactly what to expect before you click. Here's what each one means:",
    color: "#FBBF24",
    icon: Star,
    tips: [],
    links: [],
    badges: [
      { label: "✓ Verified", color: "#34D399", desc: "Manually reviewed and confirmed working" },
      { label: "🆓 Free", color: "#60A5FA", desc: "Completely free — no credit card required" },
      { label: "⚡ Open Source", color: "#A78BFA", desc: "Source code is publicly available" },
      { label: "⭐ Editor's Pick", color: "#FBBF24", desc: "Top-tier recommendation by our team" },
      { label: "⚠ Freemium", color: "#F97316", desc: "Free tier exists, paid upgrades available" },
    ],
  },
  {
    step: "05",
    title: "Bookmark Your Favorites",
    description:
      "Found a tool you want to revisit? Click the bookmark icon on any resource card. Your bookmarks save locally in your browser — no account, no sign-up.",
    color: "#F472B6",
    icon: Bookmark,
    tips: [
      "Bookmarks are stored locally — 100% private, no account needed",
      "Access all your saved resources anytime at /bookmarks",
      "Works across all pages, categories, and search results",
    ],
    links: [
      { label: "View Bookmarks", href: "/bookmarks" },
    ],
    badges: null,
  },
  {
    step: "06",
    title: "Set Up Your Privacy Toolkit",
    description:
      "Protect your browsing with a private browser, search engine, and VPN. These three tools cover 95% of your daily privacy needs — and most are completely free.",
    color: "#34D399",
    icon: Lock,
    tips: [
      "Browser: Firefox + uBlock Origin, or Brave (built-in adblocker)",
      "Search engine: DuckDuckGo or Brave Search — zero tracking",
      "VPN: Mullvad or ProtonVPN — verified no-log providers",
      "Email: Proton Mail — end-to-end encrypted, free plan available",
    ],
    links: [
      { label: "Privacy & Security Tools", href: "/categories/privacy" },
    ],
    badges: null,
  },
];

const CATEGORIES = [
  { name: "Streaming & Movies", href: "/categories/video", icon: Tv2, color: "#EF4444" },
  { name: "AI Tools", href: "/categories/ai", icon: Bot, color: "#8B5CF6" },
  { name: "Privacy & Security", href: "/categories/privacy", icon: ShieldCheck, color: "#10B981" },
  { name: "Gaming & ROMs", href: "/categories/gaming", icon: Gamepad2, color: "#6366F1" },
  { name: "Books & Reading", href: "/categories/reading", icon: BookOpen, color: "#D97706" },
  { name: "Music & Audio", href: "/categories/audio", icon: Music, color: "#14B8A6" },
  { name: "Developer Tools", href: "/categories/developer-tools", icon: Code2, color: "#3B82F6" },
  { name: "Downloads", href: "/categories/downloading", icon: Download, color: "#F59E0B" },
];

export default function BeginnersGuidePage() {
  return (
    <div className="min-h-screen w-full" style={{ background: "#0B0C0E" }}>

      {/* ── Hero ── */}
      <div className="relative border-b overflow-hidden" style={{ borderColor: "#1E2228" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(124,92,255,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-[1000px] mx-auto px-5 sm:px-8 pt-14 pb-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-mono font-semibold uppercase tracking-[0.15em] mb-5"
            style={{ background: "#111316", borderColor: "#1E2228", color: "#9298A3" }}
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            Quick Start Guide
          </div>
          <h1
            className="font-extrabold text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.08] tracking-[-0.03em] mb-4"
            style={{ color: "#F2F3F5" }}
          >
            New Here? Start in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c4b5fd 0%, #7C5CFF 50%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              6 Steps.
            </span>
          </h1>
          <p className="text-[15px] max-w-[520px] mx-auto leading-relaxed" style={{ color: "#9298A3" }}>
            Everything you need to find free tools, stay safe, and get the most out of FreeWebStuff — from your very first visit.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-5 sm:px-8 py-10 space-y-4">

        {/* ── Safety Banner ── */}
        <div
          className="flex items-start gap-3.5 p-4 rounded-2xl border"
          style={{ background: "rgba(234,179,8,0.06)", borderColor: "rgba(234,179,8,0.25)" }}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#FBBF24" }} />
          <div>
            <p className="text-[13.5px] font-semibold mb-0.5" style={{ color: "#FBBF24" }}>
              Do this before anything else
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "#9298A3" }}>
              Install{" "}
              <a
                href="https://chrome.google.com/webstore/detail/ublock-origin"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: "#F2F3F5" }}
              >
                uBlock Origin
              </a>{" "}
              on your browser first. It blocks ads and malicious scripts across every site you visit — completely free.
            </p>
          </div>
        </div>

        {/* ── Steps ── */}
        <div className="space-y-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="rounded-2xl border"
                style={{ background: "#111316", borderColor: "#1E2228" }}
              >
                <div className="flex items-start gap-4 p-5 sm:p-6">
                  {/* Step icon + number */}
                  <div className="shrink-0 flex flex-col items-center gap-1.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${step.color}18`,
                        border: `1px solid ${step.color}35`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <span
                      className="text-[10px] font-mono font-bold tracking-widest"
                      style={{ color: step.color, opacity: 0.65 }}
                    >
                      {step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2
                      className="font-bold text-[1rem] sm:text-[1.05rem] leading-snug mb-1.5 tracking-tight"
                      style={{ color: "#F2F3F5" }}
                    >
                      {step.title}
                    </h2>
                    <p className="text-[13.5px] leading-relaxed mb-3" style={{ color: "#9298A3" }}>
                      {step.description}
                    </p>

                    {/* Tips */}
                    {step.tips && step.tips.length > 0 && (
                      <ul className="space-y-1.5 mb-3">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2
                              className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              style={{ color: step.color }}
                            />
                            <span className="text-[13px]" style={{ color: "#9298A3" }}>
                              {tip}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Badges breakdown */}
                    {step.badges && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {step.badges.map((badge) => (
                          <div
                            key={badge.label}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border"
                            style={{
                              background: `${badge.color}09`,
                              borderColor: `${badge.color}22`,
                            }}
                          >
                            <span
                              className="text-[11px] font-bold px-2 py-0.5 rounded-md border font-mono whitespace-nowrap"
                              style={{
                                color: badge.color,
                                background: `${badge.color}14`,
                                borderColor: `${badge.color}30`,
                              }}
                            >
                              {badge.label}
                            </span>
                            <span className="text-[12px]" style={{ color: "#9298A3" }}>
                              {badge.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    {step.links && step.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {step.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                            style={{
                              color: step.color,
                              background: `${step.color}10`,
                              border: `1px solid ${step.color}28`,
                            }}
                          >
                            {link.label}
                            {link.href.startsWith("http") ? (
                              <ExternalLink className="w-3 h-3" />
                            ) : (
                              <ArrowRight className="w-3 h-3" />
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Category Quick Links ── */}
        <div className="pt-6">
          <div className="mb-5">
            <p
              className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-1.5"
              style={{ color: "#9298A3" }}
            >
              Explore by Interest
            </p>
            <h2
              className="font-bold text-[1.25rem] tracking-tight"
              style={{ color: "#F2F3F5" }}
            >
              Jump into a Category
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group flex flex-col items-center text-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 hover:border-opacity-60"
                  style={{ background: "#15181C", borderColor: "#1E2228" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: `${cat.color}15`,
                      border: `1px solid ${cat.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <span
                    className="text-[12.5px] font-semibold leading-tight transition-colors duration-200 group-hover:text-white"
                    style={{ color: "#9298A3" }}
                  >
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        <div
          className="rounded-2xl border p-8 text-center mt-4"
          style={{ background: "#111316", borderColor: "#1E2228" }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(124,92,255,0.12)", border: "1px solid rgba(124,92,255,0.25)" }}
          >
            <Zap className="w-6 h-6" style={{ color: "#7C5CFF" }} />
          </div>
          <h2 className="font-bold text-[1.2rem] mb-2 tracking-tight" style={{ color: "#F2F3F5" }}>
            You&apos;re ready to explore.
          </h2>
          <p className="text-[13.5px] mb-6 max-w-sm mx-auto" style={{ color: "#9298A3" }}>
            Start searching, or pick a category that interests you. Everything here is free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-105"
              style={{
                background: "#7C5CFF",
                color: "#fff",
                boxShadow: "0 0 20px rgba(124,92,255,0.3)",
              }}
            >
              <Search className="w-4 h-4" />
              Search Everything
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold border transition-all"
              style={{
                background: "#15181C",
                borderColor: "#262A30",
                color: "#F2F3F5",
              }}
            >
              <Globe className="w-4 h-4" />
              Browse Categories
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

