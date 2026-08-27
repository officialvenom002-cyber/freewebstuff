"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Star, 
  GitCommit, 
  Calendar, 
  Rss, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight,
  Copy,
  Check,
  FileCode2,
  DownloadCloud,
  History,
  Activity,
  Layers,
  Globe,
  Lock,
  Tag
} from "lucide-react";

interface SubLink {
  label: string;
  url: string;
}

interface TrackedChange {
  id: string;
  type: "added" | "updated" | "removed";
  name: string;
  url?: string;
  oldUrl?: string;
  category: string;
  categorySlug: string;
  section: string;
  fileAffected: string;
  isStarred: boolean;
  isIndex?: boolean;
  isFoss?: boolean;
  tags?: string[];
  subLinks?: SubLink[];
  note: string;
  removalReason?: string;
  replacement?: string;
  date: string;
  timestamp: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  authorAvatar?: string;
  diffSummary?: string;
}

const TRACKED_CHANGES: TrackedChange[] = [
  // ─────────────── AUGUST 26, 2026 (LATEST COMMIT) ───────────────
  {
    id: "ch-201",
    type: "added",
    name: "Mullvad Browser v13.5",
    url: "https://mullvad.net/browser",
    category: "Privacy & Adblock",
    categorySlug: "privacy",
    section: "Browser Privacy",
    fileAffected: "docs/privacy.md",
    isStarred: true,
    isFoss: true,
    tags: ["FOSS", "Tor Project", "Anti-Fingerprint", "Zero-Telemetry"],
    subLinks: [
      { label: "GitHub", url: "https://github.com/mullvad/mullvad-browser" },
      { label: "Changelog", url: "https://mullvad.net/en/blog" },
    ],
    note: "Co-developed with the Tor Project to bring Tor's hardened fingerprinting protections to standard clearnet web browsing without routing through onion nodes.",
    date: "2026-08-26",
    timestamp: "2026-08-26T19:42:00Z",
    commitHash: "9a8f21c",
    commitMessage: "Add Mullvad Browser update and new Quad9 DoH resolvers",
    author: "taskforce",
    diffSummary: "+1 entry in #browser-privacy",
  },
  {
    id: "ch-202",
    type: "added",
    name: "Cobalt.tools v10",
    url: "https://cobalt.tools",
    category: "Downloading",
    categorySlug: "downloading",
    section: "Media Downloaders",
    fileAffected: "docs/downloading.md",
    isStarred: true,
    isFoss: true,
    tags: ["FOSS", "Web Media", "No-Ads", "API"],
    subLinks: [
      { label: "GitHub", url: "https://github.com/imputnet/cobalt" },
      { label: "Instance List", url: "https://instances.hyper.lol" },
    ],
    note: "Major v10 release supporting 4K video downloads, 320kbps audio extraction, Bluesky, TikTok, YouTube, and SoundCloud with zero ads and zero tracking.",
    date: "2026-08-26",
    timestamp: "2026-08-26T19:42:00Z",
    commitHash: "9a8f21c",
    commitMessage: "Add Mullvad Browser update and new Quad9 DoH resolvers",
    author: "taskforce",
    diffSummary: "+1 entry in #media-downloaders",
  },
  {
    id: "ch-203",
    type: "removed",
    name: "VidsRC Streaming Mirror #4",
    url: "https://vidsrc.xyz",
    category: "Movies & TV",
    categorySlug: "video",
    section: "Streaming Sites",
    fileAffected: "docs/video.md",
    isStarred: false,
    tags: ["Blacklisted", "Malicious Popups", "Hijacked"],
    removalReason: "Domain registration expired and was captured by malware scammers serving crypto drainer pop-under loops.",
    replacement: "FMHY Stream Index / Braflix",
    note: "Removed immediately upon community audit report. Added domain to global SafeGuard blacklist.",
    date: "2026-08-26",
    timestamp: "2026-08-26T19:42:00Z",
    commitHash: "9a8f21c",
    commitMessage: "Add Mullvad Browser update and new Quad9 DoH resolvers",
    author: "taskforce",
    diffSummary: "-1 entry in #streaming-sites",
  },
  {
    id: "ch-204",
    type: "updated",
    name: "CS.RIN.RU Enhancement Suite",
    url: "https://cs.rin.ru/forum",
    category: "Gaming & Emulation",
    categorySlug: "gaming",
    section: "Steam Tools",
    fileAffected: "docs/gaming.md",
    isStarred: true,
    isFoss: true,
    tags: ["Userscript", "Community Mod", "Search Guide"],
    subLinks: [
      { label: "Steam Hover v5.8", url: "https://greasyfork.org/scripts/580613" },
      { label: "Search Guide", url: "https://github.com/fmhy/edit/blob/main/docs/.vitepress/notes/csrin-search.md" },
      { label: "External Mod", url: "https://github.com/SubZeroPL/cs-rin-ru-enhanced-mod" },
    ],
    note: "Updated Steam Hover userscript compatibility for Chromium Manifest v3 and refreshed CS.RIN search guides.",
    date: "2026-08-26",
    timestamp: "2026-08-26T14:15:00Z",
    commitHash: "8c71b04",
    commitMessage: "Update CS.RIN enhancement userscripts and repacks",
    author: "curator_fox",
    diffSummary: "~1 entry modified in #steam-tools",
  },

  // ─────────────── AUGUST 25, 2026 ───────────────
  {
    id: "ch-205",
    type: "added",
    name: "AstralGames",
    url: "https://astralgames.net",
    category: "Gaming & Emulation",
    categorySlug: "gaming",
    section: "Download Games",
    fileAffected: "docs/gaming.md",
    isStarred: true,
    tags: ["Pre-Installed", "Achievements", "Fast DDL"],
    subLinks: [
      { label: "Discord", url: "https://discord.gg/snnf8RH8Fn" },
      { label: "Subreddit", url: "https://reddit.com/r/AstralGames" },
    ],
    note: "Direct pre-installed game releases with achievement unlocker support, verified clean hash checksums, and zero redirect loops.",
    date: "2026-08-25",
    timestamp: "2026-08-25T18:30:00Z",
    commitHash: "7b44a19",
    commitMessage: "Add AstralGames and UnionCrax mirrors",
    author: "curator_fox",
    diffSummary: "+1 entry in #download-games",
  },
  {
    id: "ch-206",
    type: "removed",
    name: "FitGirl Clone (fitgirl-repacks.cc)",
    category: "Gaming & Emulation",
    categorySlug: "gaming",
    section: "Game Repacks",
    fileAffected: "docs/gaming.md",
    isStarred: false,
    tags: ["Malware Warning", "Impersonation", "Trojan"],
    removalReason: "Impersonator site distributing trojanized installer binaries and fake torrent files.",
    replacement: "Official fitgirl-repacks.site",
    note: "Added warning banner and verified that only the official .site TLD is indexed.",
    date: "2026-08-25",
    timestamp: "2026-08-25T18:30:00Z",
    commitHash: "7b44a19",
    commitMessage: "Add AstralGames and UnionCrax mirrors",
    author: "curator_fox",
    diffSummary: "-1 entry in #game-repacks",
  },
  {
    id: "ch-207",
    type: "added",
    name: "UnionCrax",
    url: "https://union-crax.xyz",
    category: "Gaming & Emulation",
    categorySlug: "gaming",
    section: "Download Games",
    fileAffected: "docs/gaming.md",
    isStarred: true,
    tags: ["Direct DDL", "Torrents", "Launcher"],
    subLinks: [
      { label: "Launcher", url: "https://union-crax.xyz/direct" },
      { label: "Mirrors", url: "https://rentry.co/ucxyz" },
    ],
    note: "Torrent and direct download archives with custom open-source launcher support.",
    date: "2026-08-25",
    timestamp: "2026-08-25T18:30:00Z",
    commitHash: "7b44a19",
    commitMessage: "Add AstralGames and UnionCrax mirrors",
    author: "curator_fox",
    diffSummary: "+1 entry in #download-games",
  },

  // ─────────────── AUGUST 24, 2026 ───────────────
  {
    id: "ch-208",
    type: "updated",
    name: "FilterLists Directory",
    url: "https://filterlists.com",
    oldUrl: "https://filterlists.com/old",
    category: "Privacy & Adblock",
    categorySlug: "privacy",
    section: "Adblock Filters",
    fileAffected: "docs/privacy.md",
    isStarred: true,
    isIndex: true,
    tags: ["Index", "Filter Lists", "uBlock", "AdGuard"],
    note: "Indexed 3,500+ community adblocking, anti-malware, telemetry-blocking, and cosmetic filter lists with daily auto-validation.",
    date: "2026-08-24",
    timestamp: "2026-08-24T11:20:00Z",
    commitHash: "6d32e88",
    commitMessage: "FilterList updates for manifest v3 and uBO Lite",
    author: "adguard_ninja",
    diffSummary: "~1 entry in #adblock-filters",
  },
  {
    id: "ch-209",
    type: "added",
    name: "LibreWolf v128",
    url: "https://librewolf.net",
    category: "Privacy & Adblock",
    categorySlug: "privacy",
    section: "Browser Privacy",
    fileAffected: "docs/privacy.md",
    isStarred: true,
    isFoss: true,
    tags: ["FOSS", "Firefox Fork", "Hardened", "Telemetry-Free"],
    subLinks: [
      { label: "Source Code", url: "https://gitlab.com/librewolf-community/browser" },
      { label: "Documentation", url: "https://librewolf.net/docs/" },
    ],
    note: "Hardened Firefox fork with all telemetry, experiments, and DRM disabled by default. Comes with uBlock Origin pre-configured.",
    date: "2026-08-24",
    timestamp: "2026-08-24T11:20:00Z",
    commitHash: "6d32e88",
    commitMessage: "FilterList updates for manifest v3 and uBO Lite",
    author: "adguard_ninja",
    diffSummary: "+1 entry in #browser-privacy",
  },

  // ─────────────── AUGUST 23, 2026 ───────────────
  {
    id: "ch-210",
    type: "updated",
    name: "Zed Code Editor",
    url: "https://zed.dev",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    section: "Code Playgrounds",
    fileAffected: "docs/developer-tools.md",
    isStarred: true,
    isFoss: true,
    tags: ["Rust", "GPU-Accelerated", "Multiplayer", "FOSS"],
    subLinks: [
      { label: "GitHub", url: "https://github.com/zed-industries/zed" },
      { label: "Roadmap", url: "https://zed.dev/roadmap" },
    ],
    note: "Linux and Windows stable release with GPU acceleration, native terminal multiplexing, and real-time CRDT peer collaboration.",
    date: "2026-08-23",
    timestamp: "2026-08-23T16:05:00Z",
    commitHash: "5f190e2",
    commitMessage: "Update Zed editor and DevTools cheat sheets",
    author: "coder_sam",
    diffSummary: "~1 entry in #code-playgrounds",
  },
  {
    id: "ch-211",
    type: "added",
    name: "Kobo-UNCaGED",
    url: "https://github.com/pgaskin/kobo-uncaged",
    category: "Books & Comics",
    categorySlug: "reading",
    section: "E-Reader Tools",
    fileAffected: "docs/reading.md",
    isStarred: true,
    isFoss: true,
    tags: ["FOSS", "E-Ink", "Kobo", "Modding"],
    note: "Open-source desktop utility for managing, backing up, and sideloading DRM-free EPUBs on Kobo e-readers without account requirements.",
    date: "2026-08-23",
    timestamp: "2026-08-23T16:05:00Z",
    commitHash: "5f190e2",
    commitMessage: "Update Zed editor and DevTools cheat sheets",
    author: "coder_sam",
    diffSummary: "+1 entry in #e-reader-tools",
  },

  // ─────────────── AUGUST 22, 2026 ───────────────
  {
    id: "ch-212",
    type: "added",
    name: "Perplexity AI API & Engine",
    url: "https://perplexity.ai",
    category: "Artificial Intelligence",
    categorySlug: "ai",
    section: "AI Search",
    fileAffected: "docs/ai.md",
    isStarred: true,
    tags: ["Search Engine", "Academic Mode", "Direct Citations"],
    subLinks: [
      { label: "Documentation", url: "https://docs.perplexity.ai" },
    ],
    note: "Fast answer engine with real-time academic source citations, multimodal parsing, and customizable search domains.",
    date: "2026-08-22",
    timestamp: "2026-08-22T09:12:00Z",
    commitHash: "4c01d77",
    commitMessage: "AI category overhaul with LLM open weights",
    author: "ai_whisperer",
    diffSummary: "+1 entry in #ai-search",
  },
  {
    id: "ch-213",
    type: "updated",
    name: "Ollama Local LLM Runner",
    url: "https://ollama.com",
    category: "Artificial Intelligence",
    categorySlug: "ai",
    section: "Local AI Models",
    fileAffected: "docs/ai.md",
    isStarred: true,
    isFoss: true,
    tags: ["Local LLM", "FOSS", "GPU Acceleration", "CLI"],
    subLinks: [
      { label: "GitHub", url: "https://github.com/ollama/ollama" },
      { label: "Model Hub", url: "https://ollama.com/library" },
    ],
    note: "Added native quantization for Llama 3.1 70B, Mistral Nemo, and DeepSeek Coder with one-command terminal installation.",
    date: "2026-08-22",
    timestamp: "2026-08-22T09:12:00Z",
    commitHash: "4c01d77",
    commitMessage: "AI category overhaul with LLM open weights",
    author: "ai_whisperer",
    diffSummary: "~1 entry in #local-ai-models",
  },

  // ─────────────── AUGUST 21, 2026 ───────────────
  {
    id: "ch-214",
    type: "removed",
    name: "Atom Text Editor",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    section: "Code Editors",
    fileAffected: "docs/developer-tools.md",
    isStarred: false,
    tags: ["Sunset", "Deprecated"],
    removalReason: "Officially sunset by GitHub with unpatched Electron security vulnerabilities.",
    replacement: "Zed / VSCode / Pulsar",
    note: "Migrated links to community-maintained fork Pulsar.",
    date: "2026-08-21",
    timestamp: "2026-08-21T14:40:00Z",
    commitHash: "3b99a51",
    commitMessage: "Remove deprecated Atom packages and dead Git tools",
    author: "coder_sam",
    diffSummary: "-1 entry in #code-editors",
  },
  {
    id: "ch-215",
    type: "added",
    name: "AsciiQuarium",
    url: "https://robobunny.net/projects/asciiquarium/html/",
    category: "Miscellaneous",
    categorySlug: "misc",
    section: "Terminal Aesthetics",
    fileAffected: "docs/misc.md",
    isStarred: false,
    isFoss: true,
    tags: ["Fun", "ASCII Art", "Terminal", "Animation"],
    subLinks: [
      { label: "Source Code", url: "https://github.com/cmatsuoka/asciiquarium" },
    ],
    note: "Live interactive animated ASCII sea aquarium inside your terminal with swimming fish, sharks, and bubbles. Pure retro terminal joy.",
    date: "2026-08-20",
    timestamp: "2026-08-20T17:50:00Z",
    commitHash: "2a81f33",
    commitMessage: "Misc fun terminal ASCII tools and retro webamps",
    author: "retro_dan",
    diffSummary: "+1 entry in #terminal-aesthetics",
  },
  {
    id: "ch-216",
    type: "updated",
    name: "Proton Drive E2EE",
    url: "https://proton.me/drive",
    category: "Storage",
    categorySlug: "storage",
    section: "Cloud Storage",
    fileAffected: "docs/storage.md",
    isStarred: true,
    isFoss: true,
    tags: ["Zero-Knowledge", "Swiss Law", "E2EE", "Cloud"],
    subLinks: [
      { label: "Security Audit", url: "https://proton.me/blog/drive-security-audit" },
      { label: "Open Source Apps", url: "https://github.com/ProtonMail" },
    ],
    note: "Launched desktop backup sync with zero-knowledge Swiss encryption and version history rollback.",
    date: "2026-08-19",
    timestamp: "2026-08-19T10:15:00Z",
    commitHash: "1e72b09",
    commitMessage: "Storage category security audits",
    author: "taskforce",
    diffSummary: "~1 entry in #cloud-storage",
  },
  {
    id: "ch-217",
    type: "removed",
    name: "FreeCloudHost.ru",
    category: "Storage",
    categorySlug: "storage",
    section: "Temporary File Hosts",
    fileAffected: "docs/storage.md",
    isStarred: false,
    tags: ["Paywall", "VPN-Blocked"],
    removalReason: "Deleted all free anonymous upload tiers and started blocking VPN connections.",
    replacement: "Wormhole / Catbox / Send",
    note: "Removed from temporary file host index.",
    date: "2026-08-18",
    timestamp: "2026-08-18T10:15:00Z",
    commitHash: "1e72b09",
    commitMessage: "Storage category security audits",
    author: "taskforce",
    diffSummary: "-1 entry in #temporary-file-hosts",
  },
];

export default function ChangelogTrackerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "added" | "updated" | "removed">("all");
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<"commit" | "month">("commit");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Copy commit hash
  const copyCommitHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredChanges, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fins-tracker-changes-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Category filter options
  const categoryOptions = useMemo(() => {
    const cats = new Set(TRACKED_CHANGES.map((c) => c.category));
    return ["all", ...Array.from(cats)];
  }, []);

  // Compute live statistics
  const stats = useMemo(() => {
    return {
      all: TRACKED_CHANGES.length,
      added: TRACKED_CHANGES.filter((c) => c.type === "added").length,
      updated: TRACKED_CHANGES.filter((c) => c.type === "updated").length,
      removed: TRACKED_CHANGES.filter((c) => c.type === "removed").length,
      starred: TRACKED_CHANGES.filter((c) => c.isStarred).length,
      totalMonitored: 14240,
    };
  }, []);

  // Filter items
  const filteredChanges = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return TRACKED_CHANGES.filter((item) => {
      if (filterType !== "all" && item.type !== filterType) return false;
      if (filterStarredOnly && !item.isStarred) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (q) {
        return (
          item.name.toLowerCase().includes(q) ||
          item.note.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q) ||
          item.commitMessage.toLowerCase().includes(q) ||
          item.commitHash.toLowerCase().includes(q) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [searchQuery, filterType, filterStarredOnly, selectedCategory]);

  // Group items by Commit or Month
  const groupedData = useMemo(() => {
    const map = new Map<string, { 
      key: string;
      title: string; 
      meta: string; 
      commitHash: string;
      author: string;
      date: string;
      fileAffected: string;
      items: TrackedChange[] 
    }>();

    filteredChanges.forEach((item) => {
      let key = item.commitHash;
      let title = `Commit #${item.commitHash} — ${item.commitMessage}`;
      let meta = `${item.date} by @${item.author}`;

      if (groupBy === "month") {
        const d = new Date(item.date);
        key = `${d.getFullYear()}-${d.getMonth()}`;
        title = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        meta = `${filteredChanges.filter(c => c.date.startsWith(item.date.slice(0, 7))).length} verified updates`;
      }

      if (!map.has(key)) {
        map.set(key, { 
          key, 
          title, 
          meta, 
          commitHash: item.commitHash, 
          author: item.author, 
          date: item.date,
          fileAffected: item.fileAffected,
          items: [] 
        });
      }
      map.get(key)!.items.push(item);
    });

    return Array.from(map.values());
  }, [filteredChanges, groupBy]);

  return (
    <div className="min-h-screen max-w-[1280px] mx-auto px-3 sm:px-6 py-6 space-y-6 text-slate-200">
      
      {/* ─────────────── 1. FMHY TRACKER HEADER BANNER ─────────────── */}
      <header className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#00d9e0]/20 via-[#101420] to-[#d400ff]/20 border border-sky-500/30 text-center shadow-2xl backdrop-blur-2xl space-y-4 overflow-hidden">
        
        {/* Ambient Top Glow Dots */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Control Badges & Subscriptions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 hover:bg-black/70 border border-white/15 text-xs font-semibold text-white transition-all shadow-md active:scale-95"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub Repository</span>
          </a>

          <a
            href="/feed.xml"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/45 hover:bg-black/70 border border-white/15 text-xs font-semibold text-amber-400 transition-all shadow-md active:scale-95"
            title="RSS Changes Feed"
          >
            <Rss className="w-3.5 h-3.5 text-amber-400" />
            <span>RSS Feed</span>
          </a>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/45 hover:bg-black/70 border border-white/15 text-xs font-semibold text-sky-400 transition-all shadow-md cursor-pointer active:scale-95"
            title="Export filtered changes as JSON"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-sky-400" />
            <span>Export JSON</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          FINS Tracker
        </h1>

        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Real-time changelog tracking new tool additions, verified mirror updates, domain sunsets, and security purges across all 23 categories.
        </p>

        {/* Telemetry Metrics Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tracking <strong>{stats.totalMonitored.toLocaleString()}</strong> resources</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Live Sync: <strong>August 26, 2026</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Zero Tracking &amp; No Affiliate Redirects</span>
          </div>
        </div>
      </header>

      {/* ─────────────── 2. STICKY INTERACTIVE TOOLBAR ─────────────── */}
      <div className="sticky top-16 z-30 p-4 rounded-2xl bg-[#0d111a]/95 border border-surface-border shadow-2xl backdrop-blur-xl space-y-3.5">
        
        {/* Stat Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          
          {/* ALL */}
          <button
            onClick={() => setFilterType("all")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === "all"
                ? "bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                : "bg-surface-secondary text-slate-300 hover:text-white border border-surface-border"
            }`}
          >
            <span>All Updates</span>
            <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-black/30 font-mono">
              {stats.all}
            </span>
          </button>

          {/* NEW / ADDED */}
          <button
            onClick={() => setFilterType("added")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === "added"
                ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Added</span>
            <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-emerald-950/60 font-mono">
              {stats.added}
            </span>
          </button>

          {/* UPDATED */}
          <button
            onClick={() => setFilterType("updated")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === "updated"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Updated</span>
            <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-amber-950/60 font-mono">
              {stats.updated}
            </span>
          </button>

          {/* REMOVED */}
          <button
            onClick={() => setFilterType("removed")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === "removed"
                ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Removed</span>
            <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-red-950/60 font-mono">
              {stats.removed}
            </span>
          </button>

          {/* STARRED TOGGLE */}
          <button
            onClick={() => setFilterStarredOnly(!filterStarredOnly)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterStarredOnly
                ? "bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)] border border-amber-300"
                : "bg-surface-secondary text-amber-400 hover:bg-surface-hover border border-surface-border"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterStarredOnly ? "fill-slate-950" : "fill-amber-400"}`} />
            <span>⭐ Starred Only</span>
            <span className="text-[11px] font-mono">({stats.starred})</span>
          </button>

        </div>

        {/* Search & Secondary Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-surface-border/50">
          
          {/* Real-time Search Box */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 text-content-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, tag, commit, note, or category..."
              className="w-full pl-9 pr-4 py-1.5 bg-surface-secondary border border-surface-border rounded-xl text-xs sm:text-sm text-white placeholder:text-content-subtle outline-none focus:border-sky-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-content-subtle hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown & Grouping Switcher */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-surface-secondary border border-surface-border text-xs text-slate-200 outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="all">All Categories ({categoryOptions.length - 1})</option>
              {categoryOptions.filter(c => c !== "all").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl bg-surface-secondary p-0.5 border border-surface-border text-[11.5px] font-semibold">
              <button
                onClick={() => setGroupBy("commit")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  groupBy === "commit" ? "bg-sky-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                By Commit
              </button>
              <button
                onClick={() => setGroupBy("month")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  groupBy === "month" ? "bg-sky-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                By Month
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ─────────────── 3. RESULTS BAR ─────────────── */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>Showing <strong>{filteredChanges.length}</strong> changes</span>
        <div className="flex items-center gap-2">
          {filterType !== "all" && (
            <span className="capitalize">Type: <strong className="text-sky-300">{filterType}</strong></span>
          )}
          {selectedCategory !== "all" && (
            <span>Category: <strong className="text-sky-300">{selectedCategory}</strong></span>
          )}
        </div>
      </div>

      {/* ─────────────── 4. DETAILED COMMIT CARDS ─────────────── */}
      <div className="space-y-6">
        {groupedData.map((group, gIdx) => (
          <div
            key={gIdx}
            className="rounded-2xl bg-surface border border-surface-border/90 shadow-xl overflow-hidden backdrop-blur-md"
          >
            {/* Group / Commit Header with Actions */}
            <div className="px-5 py-3.5 bg-surface-secondary/80 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              
              <div className="flex items-center gap-2 font-bold text-white text-xs sm:text-sm min-w-0">
                <GitCommit className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">{group.title}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {groupBy === "commit" && (
                  <button
                    onClick={() => copyCommitHash(group.commitHash)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy commit hash"
                  >
                    {copiedHash === group.commitHash ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>#{group.commitHash}</span>
                      </>
                    )}
                  </button>
                )}

                <div className="text-[11px] text-slate-400 font-mono">
                  {group.meta}
                </div>
              </div>

            </div>

            {/* List of Detailed Changes within this Commit */}
            <div className="divide-y divide-surface-border/60">
              {group.items.map((item) => {
                const isAdded = item.type === "added";
                const isUpdated = item.type === "updated";
                const isRemoved = item.type === "removed";

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-surface-secondary/40 transition-colors"
                  >
                    {/* Left: Type Pill + Name + Note + Subordinate Links + Tags */}
                    <div className="space-y-2 flex-1 min-w-0">
                      
                      {/* Name & Type Badges Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        
                        {/* Type Badge */}
                        {isAdded && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <Plus className="w-3 h-3" />
                            <span>Added</span>
                          </span>
                        )}
                        {isUpdated && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <RefreshCw className="w-3 h-3" />
                            <span>Updated</span>
                          </span>
                        )}
                        {isRemoved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                            <Trash2 className="w-3 h-3" />
                            <span>Removed</span>
                          </span>
                        )}

                        {/* Star / Index Badges */}
                        {item.isStarred && (
                          <span className="text-amber-400 select-none text-sm font-bold" title="Recommended Starred Tool">
                            ⭐
                          </span>
                        )}
                        {item.isIndex && (
                          <span className="text-sky-400 select-none text-sm font-bold" title="Directory / Index">
                            🌐
                          </span>
                        )}

                        {/* Primary Resource Name / Link */}
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm sm:text-base font-bold transition-colors inline-flex items-center gap-1 ${
                              isRemoved
                                ? "line-through text-slate-400 hover:text-slate-300"
                                : "text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-sky-500/40"
                            }`}
                          >
                            <span>{item.name}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                          </a>
                        ) : (
                          <span className={`text-sm sm:text-base font-bold ${isRemoved ? "line-through text-slate-400" : "text-white"}`}>
                            {item.name}
                          </span>
                        )}

                      </div>

                      {/* Description Note */}
                      <p className="text-xs sm:text-[13.5px] text-slate-300 leading-relaxed">
                        {item.note}
                      </p>

                      {/* Removal Reason & Replacement Callout (If Removed) */}
                      {isRemoved && item.removalReason && (
                        <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/30 text-xs space-y-1 text-red-300">
                          <div><strong>Reason for Removal:</strong> {item.removalReason}</div>
                          {item.replacement && (
                            <div className="text-sky-300"><strong>Recommended Alternative:</strong> {item.replacement}</div>
                          )}
                        </div>
                      )}

                      {/* Subordinate Links & Tags Row */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        
                        {/* Subordinate Mirrors / GitHub Links */}
                        {item.subLinks && item.subLinks.map((sub, sIdx) => (
                          <a
                            key={sIdx}
                            href={sub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-secondary hover:bg-surface-hover border border-surface-border text-[11px] text-sky-300 font-medium transition-colors"
                          >
                            <span>{sub.label}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        ))}

                        {/* Feature Tags */}
                        {item.tags && item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 rounded bg-black/30 text-[10.5px] font-mono text-slate-400 border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}

                      </div>

                    </div>

                    {/* Right: Category, Section, and File Path Metadata */}
                    <div className="flex sm:flex-col items-end sm:items-end gap-1.5 shrink-0 text-right">
                      
                      <Link
                        href={`/categories/${item.categorySlug}#${item.section.toLowerCase().replace(/\s+/g, "-")}`}
                        className="px-2.5 py-1 rounded-lg bg-surface-secondary hover:bg-surface-hover border border-surface-border text-xs text-sky-300 hover:text-white font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <span>{item.category}</span>
                      </Link>

                      <span className="text-[11.5px] text-slate-400 font-mono">
                        {item.section}
                      </span>

                      <div className="flex items-center gap-1 text-[10.5px] text-slate-500 font-mono">
                        <FileCode2 className="w-3 h-3 text-slate-500" />
                        <span>{item.fileAffected}</span>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}

        {groupedData.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-surface border border-surface-border space-y-3">
            <p className="text-sm font-semibold text-slate-300">
              No updates match your selected search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setFilterStarredOnly(false);
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-xl bg-sky-500/20 text-sky-300 text-xs font-semibold hover:bg-sky-500/30 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
