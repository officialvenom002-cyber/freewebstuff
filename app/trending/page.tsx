import React from "react";
import { getTrendingResources } from "@/lib/db/store";
import ResourceCard from "@/components/resources/ResourceCard";
import { Flame, Sparkles, TrendingUp, Info } from "lucide-react";

export const metadata = {
  title: "Trending Resources & Popular Software | FreeWebStuff",
  description: "Discover what the developer and privacy community is discovering, bookmarking, and rating highest this week.",
};

export default function TrendingPage() {
  const trending = getTrendingResources(18);

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          Multi-Factor Community Ranking
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
          Trending Tools &amp; Software
        </h1>
        <p className="text-xs sm:text-sm text-content-muted max-w-2xl leading-relaxed">
          Ranked dynamically by combining weekly outbound traffic, bookmarks saved, user satisfaction votes, and community engagement.
        </p>

        <div className="flex items-center gap-2 pt-2 text-[11px] text-content-subtle">
          <Info className="w-3.5 h-3.5" />
          <span>Ranking weights: 30% visits · 25% clicks · 20% bookmarks · 15% satisfaction · 10% velocity</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {trending.map((res, index) => (
          <div key={res.id} className="relative group">
            <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[11px] flex items-center justify-center pointer-events-none">
              #{index + 1}
            </div>
            <ResourceCard resource={res} />
          </div>
        ))}
      </div>
    </div>
  );
}
