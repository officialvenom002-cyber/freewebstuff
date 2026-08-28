"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Globe, Flame, Bookmark, Star, Layers, Bot, ShieldCheck, Code2, Gamepad2, GraduationCap, Palette, Video, Music, Plus, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const TILES = [
  { id:"ai",       label:"AI Tools",     href:"/categories/ai",                   icon:Bot,          color:"#7C5CFF" },
  { id:"privacy",  label:"Privacy",      href:"/categories/privacy-security",      icon:ShieldCheck,  color:"#34D399" },
  { id:"dev",      label:"Dev Tools",    href:"/categories/developer-tools",       icon:Code2,        color:"#60A5FA" },
  { id:"gaming",   label:"Gaming",       href:"/categories/gaming",                icon:Gamepad2,     color:"#F59E0B" },
  { id:"video",    label:"Video",        href:"/categories/video",                 icon:Video,        color:"#EF4444" },
  { id:"design",   label:"Design",       href:"/categories/design",                icon:Palette,      color:"#EC4899" },
  { id:"edu",      label:"Education",    href:"/categories/education",             icon:GraduationCap,color:"#A78BFA" },
  { id:"music",    label:"Music",        href:"/categories/music",                 icon:Music,        color:"#FB7185" },
  { id:"trending", label:"Trending",     href:"/trending",                         icon:Flame,        color:"#FB923C" },
  { id:"bookmarks",label:"Bookmarks",    href:"/bookmarks",                        icon:Bookmark,     color:"#64748B" },
  { id:"colls",    label:"Collections",  href:"/collections",                      icon:Layers,       color:"#6EE7B7" },
  { id:"new",      label:"New Adds",     href:"/new",                              icon:Star,         color:"#FCD34D" },
];

function LiveClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(n.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", hour12:true }));
      setDate(n.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-center select-none">
      <div className="text-5xl sm:text-7xl font-bold text-content-primary tracking-tight tabular-nums hero-animate-1">{time}</div>
      <div className="text-sm text-content-muted mt-2 hero-animate-2">{date}</div>
    </div>
  );
}

export default function StartpagePage() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    else router.push("/search");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-radial-gradient flex flex-col items-center justify-center px-4 pb-16 gap-10">

      {/* Hint banner */}
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-xs text-content-muted">
          <div className="flex items-center gap-2">
            <Home className="w-3.5 h-3.5 text-brand-400" />
            Set FreeWebStuff as your browser&apos;s new tab for instant access
          </div>
          <Link href="/beginners-guide" className="text-brand-400 hover:underline shrink-0 ml-2">How? →</Link>
        </div>
      </div>

      {/* Clock */}
      <LiveClock />

      {/* Search */}
      <form onSubmit={onSearch} className="w-full max-w-xl hero-animate-3">
        <div className="search-input-wrapper flex items-center rounded-2xl bg-surface border border-surface-border overflow-hidden">
          <div className="pl-4 shrink-0">
            <Search className="w-5 h-5 text-brand-400" />
          </div>
          <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Search FreeWebStuff..." autoFocus
            className="w-full py-4 px-3 bg-transparent text-content-primary placeholder-content-subtle text-base outline-none font-medium" />
          <button type="submit" className="m-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-semibold text-sm transition-all shrink-0">
            Search
          </button>
        </div>
      </form>

      {/* Tiles */}
      <div className="w-full max-w-xl hero-animate-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-content-muted uppercase tracking-wider">Quick Launch</span>
          <Link href="/categories" className="text-xs text-brand-400 hover:underline">All Categories →</Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link key={tile.id} href={tile.href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface border border-surface-border category-card group text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${tile.color}18`, border: `1px solid ${tile.color}30` }}>
                  <Icon className="w-5 h-5" style={{ color: tile.color }} />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-content-muted group-hover:text-content-primary transition-colors leading-tight">{tile.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer links */}
      <div className="w-full max-w-xl hero-animate-5 flex items-center justify-center gap-5 flex-wrap border-t border-surface-border pt-6 text-xs text-content-muted">
        {[
          { l:"Beginner's Guide", h:"/beginners-guide" },
          { l:"Changelog",        h:"/changelog" },
          { l:"Submit Resource",  h:"/submit" },
          { l:"SafeGuard",        h:"/unsafe" },
          { l:"Bookmarks",        h:"/bookmarks" },
        ].map(({l,h}) => (
          <Link key={l} href={h} className="hover:text-brand-400 transition-colors">{l}</Link>
        ))}
      </div>
    </div>
  );
}
