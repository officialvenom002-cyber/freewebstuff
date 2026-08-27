import React from "react";
import Link from "next/link";
import { BookOpen, Shield, Search, Star, AlertTriangle, CheckCircle2, Lock, Zap, Globe, Users } from "lucide-react";

export const metadata = {
  title: "Beginner's Guide — FreeInternetStuff",
  description: "New here? Learn how to use FreeInternetStuff safely, discover the best tools, and set up your privacy toolkit.",
};

const faqs = [
  {
    section: "Getting Started", icon: Zap, color: "#7C5CFF",
    items: [
      { q: "What is FreeInternetStuff?", a: "FreeInternetStuff is a modern, curated directory of the internet's best tools, websites, software, and resources. Every entry is manually reviewed, verified, and categorized." },
      { q: "How do I find something?", a: "Use the search bar at the top — it searches names, descriptions, and tags. Press Ctrl+K anywhere for instant spotlight search. You can also browse Categories, check Trending, or explore curated Collections." },
      { q: "What do the badges mean?", a: "Verified = manually checked and live. Safe = clean safety record. Free / Open Source = costs nothing. Editor's Choice = top-tier pick. Freemium = free tier with paid upgrades." },
    ]
  },
  {
    section: "Staying Safe", icon: Shield, color: "#34D399",
    items: [
      { q: "How do I know a site is safe?", a: "Look for the Safe badge on resource cards. All resources with this badge have been cross-checked against known malware and phishing databases. Caution badges mean read the note before visiting." },
      { q: "What ad-blocker should I use?", a: "uBlock Origin is the gold standard — free, open-source, and extremely effective. Available for Chrome, Firefox, and Edge. Pair with Privacy Badger for extra tracker blocking." },
      { q: "Should I use a VPN?", a: "A VPN hides your browsing from your ISP and bypasses geo-restrictions. We recommend Mullvad or ProtonVPN — verified no-log providers. Avoid free VPNs — they often sell your data." },
    ]
  },
  {
    section: "Privacy Toolkit", icon: Lock, color: "#60A5FA",
    items: [
      { q: "Which browser should I use?", a: "Firefox + uBlock Origin is our top pick. For maximum privacy out of the box, try Brave (Chromium-based, built-in adblocking) or LibreWolf (hardened Firefox fork)." },
      { q: "What's a private search engine?", a: "DuckDuckGo, Brave Search, or SearXNG. All avoid building user profiles from search history. Check our Privacy category for more options." },
      { q: "How do I get a private email?", a: "Proton Mail is the most trusted option — end-to-end encrypted, Swiss-based. Tutanota is another solid choice. Both have free tiers." },
    ]
  },
  {
    section: "Power User Tips", icon: Star, color: "#FBBF24",
    items: [
      { q: "How do I search faster?", a: "Press Ctrl+K (or Cmd+K on Mac) anywhere to open instant spotlight search. Filter by category, pricing, platform, and more on the /search page." },
      { q: "Can I save resources?", a: "Click the bookmark icon on any resource card. Bookmarks are stored locally in your browser (no account needed) and accessible at /bookmarks." },
      { q: "How do I submit a resource?", a: "Go to /submit, fill in the details, and our team reviews it within 48 hours. The resource must be active, publicly accessible, and genuinely useful." },
    ]
  },
];

export default function BeginnersGuidePage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <BookOpen className="w-3.5 h-3.5" /> Beginner&apos;s Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">Welcome to FreeInternetStuff</h1>
        <p className="text-sm text-content-muted max-w-xl mx-auto leading-relaxed">
          New here? This guide covers everything you need — how to search, stay safe, protect your privacy, and get the most out of the directory.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:"Browse Categories", href:"/categories",                icon:Globe,   desc:"24 curated niches" },
          { label:"Trending Now",       href:"/trending",                  icon:Zap,     desc:"Popular this week" },
          { label:"Privacy Tools",      href:"/categories/privacy-security",icon:Lock,  desc:"Stay safe online" },
          { label:"Submit Resource",    href:"/submit",                    icon:Users,   desc:"Contribute to index" },
        ].map(ql => {
          const Icon = ql.icon;
          return (
            <Link key={ql.label} href={ql.href} className="p-4 rounded-xl bg-surface border border-surface-border interactive-card group flex flex-col items-center text-center gap-2">
              <Icon className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-content-primary group-hover:text-brand-400 transition-colors">{ql.label}</span>
              <span className="text-[11px] text-content-muted">{ql.desc}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-content-secondary leading-relaxed">
          <span className="font-semibold text-amber-400">Safety first:</span>{" "}
          Always install <strong className="text-content-primary">uBlock Origin</strong> before visiting any site — it blocks ads, trackers, and malicious scripts.{" "}
          <Link href="/categories/privacy-security" className="text-brand-400 hover:underline">Find privacy tools →</Link>
        </p>
      </div>

      {faqs.map(sec => {
        const Icon = sec.icon;
        return (
          <section key={sec.section} className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-surface-border">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${sec.color}18`, border: `1px solid ${sec.color}30` }}>
                <Icon className="w-4 h-4" style={{ color: sec.color }} />
              </div>
              <h2 className="text-lg font-bold text-content-primary">{sec.section}</h2>
            </div>
            <div className="space-y-3">
              {sec.items.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface border border-surface-border">
                  <div className="flex items-start gap-2.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <h3 className="text-sm font-semibold text-content-primary">{item.q}</h3>
                  </div>
                  <p className="text-sm text-content-muted leading-relaxed pl-6">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <div className="text-center p-8 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h2 className="text-xl font-bold text-content-primary">Ready to explore?</h2>
        <p className="text-sm text-content-muted">Start by searching, or browse a category that interests you.</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/search" className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all flex items-center gap-2">
            <Search className="w-4 h-4" /> Search Everything
          </Link>
          <Link href="/categories" className="px-5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border hover:border-brand-500/40 text-content-primary font-semibold text-sm transition-all flex items-center gap-2">
            <Globe className="w-4 h-4" /> Browse Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
