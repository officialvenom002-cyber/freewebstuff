"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import LiveUserPresence from "@/components/analytics/LiveUserPresence";
import { 
  Lock, 
  Unlock, 
  LogOut, 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Scissors, 
  Trash2, 
  Plus, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Layers,
  Globe,
  Star
} from "lucide-react";

interface CategoryMeta {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  desc?: string;
  color?: string;
}

interface WebsiteItem {
  id: string;
  boxId?: string;
  boxTitle?: string;
  name: string;
  url: string;
  isStarred?: boolean;
}

interface CategoryBox {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  accent: string;
  websites: WebsiteItem[];
}

const ALL_CATEGORIES: CategoryMeta[] = [
  { id: "video",               name: "Streaming & Movies",       slug: "video",               emoji: "🎬", color: "#EF4444", desc: "Movies, anime, TV shows, and streaming" },
  { id: "audio",               name: "Music & Podcasts",         slug: "audio",               emoji: "🎵", color: "#14B8A6", desc: "Lossless music, radio, podcasts" },
  { id: "gaming",              name: "Gaming & Emulation",       slug: "gaming",              emoji: "🎮", color: "#6366F1", desc: "Preservation ROMs, emulators, tools" },
  { id: "downloading",         name: "Downloading & Direct",     slug: "downloading",         emoji: "💾", color: "#F59E0B", desc: "Debrid services, cyberlockers, mirrors" },
  { id: "iptv",                name: "IPTV & Live TV",           slug: "video",               emoji: "📺", color: "#F97316", desc: "Free IPTV playlists, sports, live TV" },
  { id: "subtitles",           name: "Subtitles & Captions",     slug: "video",               emoji: "💬", color: "#06B6D4", desc: "SRT databases, auto-captions, tools" },
  { id: "privacy",             name: "Privacy & Adblock",        slug: "privacy",             emoji: "🛡️", color: "#10B981", desc: "Adblock filters, DNS, VPNs, trackers" },
  { id: "ai",                  name: "Artificial Intelligence",  slug: "ai",                  emoji: "🤖", color: "#8B5CF6", desc: "LLMs, chatbots, generation tools" },
  { id: "torrenting",          name: "Torrenting & P2P",         slug: "torrenting",          emoji: "🌊", color: "#A855F7", desc: "Clients, trackers, indexers, magnet" },
  { id: "reading",             name: "Books & Comics",           slug: "reading",             emoji: "📚", color: "#EC4899", desc: "Ebooks, comics, manga, webtoons" },
  { id: "educational",         name: "Educational & Courses",    slug: "educational",         emoji: "🎓", color: "#3B82F6", desc: "University archives, open courseware" },
  { id: "mobile",              name: "Android & iOS Apps",       slug: "mobile",              emoji: "📱", color: "#84CC16", desc: "FOSS apps, sideloading, root tools" },
  { id: "linux-macos",         name: "Linux & macOS",            slug: "linux-macos",         emoji: "🐧", color: "#64748B", desc: "UNIX packages, dotfiles, scripts" },
  { id: "non-english",         name: "Non-English Content",      slug: "non-english",         emoji: "🌐", color: "#0EA5E9", desc: "Global regional media, anime, dramas" },
  { id: "misc",                name: "Miscellaneous Tools",      slug: "misc",                emoji: "✨", color: "#F43F5E", desc: "Useful web curiosities, random utilities" },
  { id: "system-tools",        name: "System Tools",             slug: "system-tools",        emoji: "🛠️", color: "#64748B", desc: "Benchmark, diagnostic, OS tweak tools" },
  { id: "file-tools",          name: "File Tools",               slug: "file-tools",          emoji: "📁", color: "#EAB308", desc: "Converters, compressors, archivers" },
  { id: "internet-tools",      name: "Internet Tools",           slug: "internet-tools",      emoji: "🌐", color: "#0284C7", desc: "Web utilities, downloaders, scrapers" },
  { id: "social-media-tools",  name: "Social Media Tools",       slug: "social-media-tools",  emoji: "💬", color: "#8B5CF6", desc: "Clients, downloaders, enhancements" },
  { id: "text-tools",          name: "Text & Note Tools",        slug: "text-tools",          emoji: "📝", color: "#10B981", desc: "Markdown editors, formatters, diff tools" },
  { id: "gaming-tools",        name: "Gaming Tools",             slug: "gaming-tools",        emoji: "🕹️", color: "#6366F1", desc: "Game enhancement, save editors, mods" },
  { id: "image-tools",         name: "Image Tools",              slug: "image-tools",         emoji: "🖼️", color: "#EC4899", desc: "Upscalers, editors, vectorizers" },
  { id: "video-tools",         name: "Video Tools",              slug: "video-tools",         emoji: "🎥", color: "#EF4444", desc: "Transcoders, screen recorders, cutters" },
  { id: "developer-tools",     name: "Developer Tools",          slug: "developer-tools",     emoji: "💻", color: "#3B82F6", desc: "APIs, code formatters, debug utilities" },
  { id: "storage",             name: "Cloud Storage",            slug: "storage",             emoji: "☁️", color: "#06B6D4", desc: "Free cloud drives, file transfer, sync" },
];

export default function AdminDashboardClient({ initialAuth }: { initialAuth: boolean }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // App / Dashboard State
  const [activeTab, setActiveTab] = useState<"reorder" | "websites" | "cut-archive">("reorder");
  const [categoriesOrder, setCategoriesOrder] = useState<CategoryMeta[]>(ALL_CATEGORIES);
  const [deletedWebsites, setDeletedWebsites] = useState<string[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("video");
  const [boxes, setBoxes] = useState<CategoryBox[]>([]);
  const [isLoadingBoxes, setIsLoadingBoxes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add website modal state
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [targetBoxSlug, setTargetBoxSlug] = useState("");
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [newSiteStarred, setNewSiteStarred] = useState(false);

  // Drag state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Show toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Fetch current site customizations
  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/site-config");
      if (res.ok) {
        const config = await res.json();
        if (config?.deletedWebsites) {
          setDeletedWebsites(config.deletedWebsites);
        }
        if (Array.isArray(config?.categoryOrder) && config.categoryOrder.length > 0) {
          const orderMap = new Map<string, number>();
          config.categoryOrder.forEach((id: string, idx: number) => orderMap.set(id, idx));

          const sorted = [...ALL_CATEGORIES].sort((a, b) => {
            const orderA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
            const orderB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
            return orderA - orderB;
          });
          setCategoriesOrder(sorted);
        }
      }
    } catch (e) {
      console.error("Failed to load config:", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConfig();
    }
  }, [isAuthenticated]);

  // Load boxes for selected category
  const loadCategoryBoxes = async (catSlug: string) => {
    setIsLoadingBoxes(true);
    try {
      const res = await fetch(`/api/site-config`);
      const cfg = await res.json().catch(() => ({}));
      const deletedSet = new Set<string>((cfg?.deletedWebsites || []).map((u: string) => u.trim()));

      if (catSlug === "video") {
        setBoxes([
          {
            id: "movies-tv-english",
            slug: "movies-tv-english",
            title: "Movies & TV — English",
            emoji: "🎬",
            accent: "sky",
            websites: [
              { id: "1", name: "Flixer", url: "https://flixer.gd", isStarred: true },
              { id: "2", name: "Cineby", url: "https://cineby.at", isStarred: true },
              { id: "3", name: "Movy", url: "https://www.movy.bz", isStarred: true },
              { id: "4", name: "Moovie", url: "https://moovie.fun", isStarred: true },
              { id: "5", name: "HiveX", url: "https://hivex.stream" },
              { id: "6", name: "NOVA", url: "https://novahd.cc" },
              { id: "7", name: "Cinezo", url: "https://www.cinezo.org" },
              { id: "8", name: "Cinemove", url: "https://cinemove.cc" },
              { id: "9", name: "Chillflix", url: "https://chillflix.lol" },
              { id: "10", name: "Streamo", url: "https://streamo.pro" },
              { id: "11", name: "Surface Stream", url: "https://watchsurface.stream" },
              { id: "12", name: "Hexa", url: "https://hexa.su" },
              { id: "13", name: "NomorFlix", url: "https://nomorflix.cc" },
              { id: "14", name: "DioStream", url: "https://diostream.cc" },
              { id: "15", name: "Stigstream", url: "https://stigstream.ru" },
              { id: "16", name: "NetPlay", url: "https://netplayz.icu" },
              { id: "17", name: "Cinelove", url: "https://cinelove.live" },
            ].filter((s) => !deletedSet.has(s.url) && !deletedSet.has(s.url.replace(/\/+$/, ""))),
          },
          {
            id: "movies-hindi",
            slug: "movies-hindi",
            title: "Movies — Hindi & Bollywood",
            emoji: "🇮🇳",
            accent: "amber",
            websites: [
              { id: "h1", name: "VegaMovies", url: "https://vegamovies.ist", isStarred: true },
              { id: "h2", name: "BollyFlix", url: "https://bollyflix.vip", isStarred: true },
              { id: "h3", name: "DesiCinemas", url: "https://desicinemas.tv", isStarred: true },
              { id: "h4", name: "KatMovieHD", url: "https://katmoviehd.to", isStarred: true },
              { id: "h5", name: "MoviesMod", url: "https://moviesmod.org" },
              { id: "h6", name: "HDHub4u", url: "https://hdhub4u.tv" },
              { id: "h7", name: "FilmyZilla", url: "https://filmyzilla.org" },
              { id: "h8", name: "Bolly4u", url: "https://bolly4u.org" },
              { id: "h9", name: "7StarHD", url: "https://7starhd.run" },
              { id: "h10", name: "Yo-Desi", url: "https://yodesi.net" },
              { id: "h11", name: "ApneTV", url: "https://apnetv.cc" },
              { id: "h12", name: "IBomma", url: "https://ibomma.com" },
            ].filter((s) => !deletedSet.has(s.url) && !deletedSet.has(s.url.replace(/\/+$/, ""))),
          },
          {
            id: "anime-english",
            slug: "anime-english",
            title: "Anime — English Sub & Dub",
            emoji: "⛩️",
            accent: "violet",
            websites: [
              { id: "a1", name: "HiAnime", url: "https://hianime.to", isStarred: true },
              { id: "a2", name: "AniWatch", url: "https://aniwatchtv.to", isStarred: true },
              { id: "a3", name: "AnimePahe", url: "https://animepahe.ru", isStarred: true },
              { id: "a4", name: "Gogoanime", url: "https://anitaku.to", isStarred: true },
              { id: "a5", name: "Kaido", url: "https://kaido.to" },
              { id: "a6", name: "KickAssAnime", url: "https://kaas.to" },
              { id: "a7", name: "Zoro Anime", url: "https://zorox.to" },
            ].filter((s) => !deletedSet.has(s.url) && !deletedSet.has(s.url.replace(/\/+$/, ""))),
          },
          {
            id: "live-sports",
            slug: "live-sports",
            title: "Live Sports & Cricket",
            emoji: "⚽",
            accent: "emerald",
            websites: [
              { id: "s1", name: "StreamEast", url: "https://thestreameast.to", isStarred: true },
              { id: "s2", name: "VIPRow", url: "https://www.viprow.nu", isStarred: true },
              { id: "s3", name: "BuffStreams", url: "https://buffstream.io", isStarred: true },
              { id: "s4", name: "FootyBite", url: "https://footybite.to" },
              { id: "s5", name: "CrackStreams", url: "https://crackstreams.me" },
              { id: "s6", name: "CricHD", url: "https://crichd.com" },
            ].filter((s) => !deletedSet.has(s.url) && !deletedSet.has(s.url.replace(/\/+$/, ""))),
          },
          {
            id: "live-tv",
            slug: "live-tv",
            title: "Live TV & News Channels",
            emoji: "📺",
            accent: "indigo",
            websites: [
              { id: "tv1", name: "DaddyLive", url: "https://daddylive.sx", isStarred: true },
              { id: "tv2", name: "TvRex", url: "https://tvrex.net", isStarred: true },
              { id: "tv3", name: "USTVGO", url: "https://ustvgo.tv" },
            ].filter((s) => !deletedSet.has(s.url) && !deletedSet.has(s.url.replace(/\/+$/, ""))),
          },
          {
            id: "asian-drama",
            slug: "asian-drama",
            title: "Asian Drama & K-Drama",
            emoji: "🎭",
            accent: "rose",
            websites: [
              { id: "d1", name: "Dramacool", url: "https://dramacool.ch", isStarred: true },
              { id: "d2", name: "MyAsianTV", url: "https://myasiantv.ac", isStarred: true },
              { id: "d3", name: "KissAsian", url: "https://kissasian.lu", isStarred: true },
              { id: "d4", name: "AsianLoad", url: "https://asianload.cfd" },
              { id: "d5", name: "ViewAsian", url: "https://viewasian.co" },
            ].filter((s) => !deletedSet.has(s.url) && !deletedSet.has(s.url.replace(/\/+$/, ""))),
          },
        ]);
      } else {
        setBoxes([
          {
            id: `${catSlug}-featured`,
            slug: `${catSlug}-featured`,
            title: `${catSlug.charAt(0).toUpperCase() + catSlug.slice(1)} — Top Picks`,
            emoji: "⭐",
            accent: "sky",
            websites: [
              { id: "f1", name: `${catSlug} Hub 1`, url: `https://${catSlug}hub1.org`, isStarred: true },
              { id: "f2", name: `${catSlug} Tools`, url: `https://${catSlug}tools.net`, isStarred: true },
              { id: "f3", name: `${catSlug} Portal`, url: `https://${catSlug}portal.com` },
            ].filter((s) => !deletedSet.has(s.url) && !deletedSet.has(s.url.replace(/\/+$/, ""))),
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBoxes(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCategoryBoxes(selectedCategorySlug);
    }
  }, [selectedCategorySlug, isAuthenticated]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setIsAuthenticated(true);
        showToast("Welcome, Shobhit! Admin access granted.");
      } else {
        setLoginError(data.error || "Invalid username or password");
      }
    } catch {
      setLoginError("Failed to connect to authentication service.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
    showToast("Logged out successfully.");
  };

  // Reorder Categories via Drag & Drop
  const handleDragSort = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const listCopy = [...categoriesOrder];
    const draggedItemContent = listCopy.splice(dragItem.current, 1)[0];
    listCopy.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;
    setCategoriesOrder(listCopy);

    try {
      const orderIds = listCopy.map((c) => c.id);
      const res = await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryOrder: orderIds }),
      });
      if (res.ok) {
        showToast("Category order updated LIVE on website!");
      }
    } catch {
      showToast("Failed to save category order.");
    }
  };

  // Move Category Up / Down manually
  const moveCategory = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoriesOrder.length) return;

    const listCopy = [...categoriesOrder];
    const item = listCopy.splice(index, 1)[0];
    listCopy.splice(targetIndex, 0, item);
    setCategoriesOrder(listCopy);

    try {
      const orderIds = listCopy.map((c) => c.id);
      await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryOrder: orderIds }),
      });
      showToast(`Moved "${item.name}" ${direction} — updated live!`);
    } catch {
      showToast("Failed to save category order.");
    }
  };

  // Cut / Remove Website
  const handleCutWebsite = async (site: WebsiteItem) => {
    if (!confirm(`Are you sure you want to cut/remove "${site.name}" from the live website?`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/websites/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: site.url }),
      });

      if (res.ok) {
        setBoxes((prev) =>
          prev.map((b) => ({
            ...b,
            websites: b.websites.filter((w) => w.url !== site.url),
          }))
        );
        setDeletedWebsites((prev) => [...prev, site.url]);
        showToast(`✂️ Removed "${site.name}" from live website!`);
      } else {
        showToast("Error removing website.");
      }
    } catch {
      showToast("Network error while removing website.");
    }
  };

  // Restore Website
  const handleRestoreWebsite = async (url: string) => {
    try {
      const res = await fetch("/api/admin/websites/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (res.ok) {
        setDeletedWebsites((prev) => prev.filter((u) => u !== url));
        loadCategoryBoxes(selectedCategorySlug);
        showToast("Website restored to live site!");
      }
    } catch {
      showToast("Failed to restore website.");
    }
  };

  // Add New Website to Category
  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName || !newSiteUrl) return;

    try {
      const res = await fetch("/api/admin/websites/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug: selectedCategorySlug,
          boxSlug: targetBoxSlug || boxes[0]?.slug || "general",
          name: newSiteName,
          url: newSiteUrl,
          isStarred: newSiteStarred,
        }),
      });

      if (res.ok) {
        showToast(`✨ Added "${newSiteName}" live to website!`);
        setIsAddingSite(false);
        setNewSiteName("");
        setNewSiteUrl("");
        setNewSiteStarred(false);
        loadCategoryBoxes(selectedCategorySlug);
      } else {
        showToast("Failed to add website.");
      }
    } catch {
      showToast("Network error while adding website.");
    }
  };

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesOrder;
    const q = searchQuery.toLowerCase();
    return categoriesOrder.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categoriesOrder, searchQuery]);

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
              <Logo size="lg" />
            </Link>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                ADMIN PORTAL
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 font-sans">
              Enter your administrator credentials to manage categories and live websites.
            </p>
          </div>

          <div className="bg-[#12151B] border border-[#232936] rounded-3xl p-7 shadow-2xl backdrop-blur-xl">
            {loginError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-2.5 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-400 mb-1.5">
                  ADMIN USER ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter user id"
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0e13] border border-[#1e2533] text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-400 mb-1.5">
                  ADMIN PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0e13] border border-[#1e2533] text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all font-sans pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3.5 px-4 rounded-xl font-heading font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Unlock Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#1c2230] text-center">
              <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1 font-sans">
                ← Back to FreeWebStuff homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F2F3F5] font-sans flex flex-col selection:bg-purple-500/30">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161a24] border border-purple-500/40 text-purple-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-sans animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0B0C0E]/90 backdrop-blur-xl border-b border-[#1c2230] px-4 sm:px-8 py-3.5">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" title="Open Public Website">
              <Logo size="md" />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3 h-3 text-purple-400" />
              LIVE ADMIN
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <LiveUserPresence className="hidden sm:inline-flex" />

            <a
              href="https://analytics.google.com/analytics/web/#/realtime"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white border border-purple-500/25 text-xs font-sans transition-all"
              title="Open Google Analytics 4 Realtime Dashboard"
            >
              <span>GA4 Realtime</span>
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            </a>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141822] hover:bg-[#1a2030] text-zinc-300 hover:text-white border border-[#222a3d] text-xs font-sans transition-all"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-sans transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-[1760px] mx-auto w-full px-4 sm:px-8 py-6 flex flex-col gap-6">
        
        {/* Top Control Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f131c] border border-[#1c2232] rounded-3xl p-5 shadow-lg">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2.5">
              <span>Admin Management Hub</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Drag categories to reorder them live on the website, or click cut to instantly remove websites.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 bg-[#090b10] border border-[#1b2130] p-1.5 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveTab("reorder")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "reorder"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <GripVertical className="w-3.5 h-3.5" />
              <span>Drag & Reorder Categories</span>
            </button>

            <button
              onClick={() => setActiveTab("websites")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "websites"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Manage Websites (Live Cut)</span>
            </button>

            <button
              onClick={() => setActiveTab("cut-archive")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "cut-archive"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cut Archive ({deletedWebsites.length})</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            TAB 1: REORDER CATEGORIES (DRAG AND DROP)
           ───────────────────────────────────────────────────────────────── */}
        {activeTab === "reorder" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d1017] border border-[#1a202e] rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <GripVertical className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Drag any category card up or down to change the order. Changes take effect <strong>instantly on the live website</strong>.</span>
              </div>
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#141822] border border-[#202738] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredCategories.map((cat, idx) => (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={() => (dragItem.current = idx)}
                  onDragEnter={() => (dragOverItem.current = idx)}
                  onDragEnd={handleDragSort}
                  onDragOver={(e) => e.preventDefault()}
                  className="group relative bg-[#0d1018] border border-[#1b2131] hover:border-purple-500/50 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-150 flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex items-center gap-2 text-zinc-500 group-hover:text-purple-400">
                      <GripVertical className="w-4 h-4 shrink-0" />
                      <span className="text-[11px] font-mono font-bold w-5 text-center text-zinc-400">
                        #{idx + 1}
                      </span>
                    </div>

                    <span className="text-2xl select-none shrink-0">{cat.emoji}</span>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white font-heading truncate">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500 truncate font-mono">
                        /categories/{cat.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveCategory(idx, "up");
                      }}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-1.5 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveCategory(idx, "down");
                      }}
                      disabled={idx === filteredCategories.length - 1}
                      title="Move Down"
                      className="p-1.5 rounded-lg bg-[#141824] hover:bg-[#1f2638] text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            TAB 2: MANAGE WEBSITES (CUT & ADD)
           ───────────────────────────────────────────────────────────────── */}
        {activeTab === "websites" && (
          <div className="space-y-5">
            {/* Category Selector pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {ALL_CATEGORIES.map((cat) => {
                const isActive = selectedCategorySlug === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-heading whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                        : "bg-[#0f131c] text-zinc-400 hover:text-white hover:bg-[#151b27] border border-[#1c2232]"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Boxes Masonry Display — Exact like public website */}
            {isLoadingBoxes ? (
              <div className="p-16 text-center text-zinc-400 font-sans">
                <RefreshCw className="w-6 h-6 animate-spin text-purple-400 mx-auto mb-2" />
                <span>Loading websites for category...</span>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 xl:columns-3 gap-4 [column-fill:_balance]">
                {boxes.map((box) => (
                  <section
                    key={box.id}
                    className="break-inside-avoid mb-4 w-full rounded-2xl bg-[#0c0f17] border border-[#1b2130] shadow-md flex flex-col overflow-hidden transition-all duration-200"
                  >
                    {/* Box Header */}
                    <div className="px-5 py-3.5 bg-[#121622] border-b border-[#181f2e] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl select-none leading-none">{box.emoji}</span>
                        <h3 className="text-sm font-bold text-white font-heading truncate">
                          {box.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold text-zinc-400 bg-[#161d2d] border border-[#232c40] px-2 py-0.5 rounded-full">
                          {box.websites.length}
                        </span>
                        <button
                          onClick={() => {
                            setTargetBoxSlug(box.slug);
                            setIsAddingSite(true);
                          }}
                          title="Add website to this box"
                          className="p-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Websites List with CUT button */}
                    <div className="p-3">
                      {box.websites.length === 0 ? (
                        <div className="py-6 text-center text-xs text-zinc-500 italic">
                          No websites currently in this box.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {box.websites.map((site) => (
                            <div
                              key={site.id}
                              className="group/item flex items-center justify-between gap-2 py-2 px-3 rounded-xl hover:bg-white/[0.05] transition-colors border border-transparent hover:border-[#1e2638]"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                {site.isStarred && (
                                  <span className="text-amber-400 text-[10px] select-none" title="Top Pick">⭐</span>
                                )}
                                <span className="text-[13px] font-sans font-medium text-zinc-300 truncate">
                                  {site.name}
                                </span>
                                <a
                                  href={site.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-mono text-zinc-600 hover:text-zinc-400 truncate max-w-[130px] hidden group-hover/item:inline"
                                >
                                  {site.url.replace(/^https?:\/\//, "")}
                                </a>
                              </div>

                              {/* CUT / REMOVE ACTION BUTTON */}
                              <button
                                onClick={() => handleCutWebsite(site)}
                                title={`Cut/remove "${site.name}" from live website`}
                                className="opacity-80 group-hover/item:opacity-100 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 text-[11px] font-mono font-semibold transition-all cursor-pointer shrink-0"
                              >
                                <Scissors className="w-3 h-3" />
                                <span>Cut</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            TAB 3: CUT WEBSITES ARCHIVE (TRASH / RESTORE)
           ───────────────────────────────────────────────────────────────── */}
        {activeTab === "cut-archive" && (
          <div className="bg-[#0e121a] border border-[#1b2230] rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <span>Cut Websites Trash Bin</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                These websites were cut from the live website. Click "Restore" at any time to place them back online.
              </p>
            </div>

            {deletedWebsites.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-500 border border-dashed border-[#1f2738] rounded-xl">
                No websites have been cut yet. All sites are live!
              </div>
            ) : (
              <div className="divide-y divide-[#19202e] border border-[#19202e] rounded-xl overflow-hidden">
                {deletedWebsites.map((url) => (
                  <div
                    key={url}
                    className="flex items-center justify-between gap-4 p-3.5 bg-[#0a0d14] hover:bg-[#0f131d] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <span className="text-xs font-mono text-zinc-300 truncate">
                        {url}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRestoreWebsite(url)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/25 text-xs font-sans font-semibold transition-all cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore to Website</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ─────────────────────────────────────────────────────────────────
          MODAL: ADD WEBSITE
         ───────────────────────────────────────────────────────────────── */}
      {isAddingSite && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121622] border border-[#232c40] rounded-3xl p-6 shadow-2xl relative animate-scale-in">
            <h3 className="text-base font-bold text-white font-heading mb-1">
              Add New Website
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              This website will be added live to the selected category.
            </p>

            <form onSubmit={handleAddWebsite} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">WEBSITE NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FreeFlix HD"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090c12] border border-[#1c2333] text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">FULL URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090c12] border border-[#1c2333] text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={newSiteStarred}
                    onChange={(e) => setNewSiteStarred(e.target.checked)}
                    className="rounded accent-purple-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as Top Pick (⭐)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#1c2333]">
                <button
                  type="button"
                  onClick={() => setIsAddingSite(false)}
                  className="px-4 py-2 rounded-xl text-xs font-sans text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-heading font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  Add Website Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
