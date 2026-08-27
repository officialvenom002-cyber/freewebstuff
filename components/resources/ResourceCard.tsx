"use client";

import React from "react";
import Link from "next/link";
import { 
  ExternalLink, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  Crown,
  Flame
} from "lucide-react";
import { Resource } from "@/lib/types";
import BookmarkButton from "./BookmarkButton";

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
}

export default function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  const handleOutboundClick = () => {
    try {
      fetch(`/api/resources/${resource.id}/click`, { method: "POST" });
    } catch {
      // Non-blocking
    }
  };

  const getPricingBadge = () => {
    switch (resource.pricingType) {
      case "open-source":
        return <span className="badge badge-opensource">Open Source</span>;
      case "free":
        return <span className="badge badge-free">100% Free</span>;
      case "freemium":
        return <span className="badge bg-sky-500/10 text-sky-400 border border-sky-500/30">Freemium</span>;
      case "free-trial":
        return <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/30">Free Trial</span>;
      case "paid":
        return <span className="badge bg-slate-500/10 text-slate-300 border border-slate-500/30">Paid</span>;
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div className="p-3.5 rounded-xl bg-surface border border-surface-border interactive-card flex items-center justify-between gap-4 group">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/resource/${resource.slug}`} className="shrink-0">
            <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-surface-border flex items-center justify-center p-2 group-hover:border-brand-500/40 transition-colors">
              {resource.logoUrl ? (
                <img src={resource.logoUrl} alt={resource.name} className="w-6 h-6 object-contain" />
              ) : (
                <Sparkles className="w-5 h-5 text-brand-400" />
              )}
            </div>
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/resource/${resource.slug}`} className="font-semibold text-sm text-content-primary hover:text-brand-400 truncate">
                {resource.name}
              </Link>
              {resource.verified && (
                <span className="badge badge-verified text-[10px] py-0 px-1.5">✓ Verified</span>
              )}
              {getPricingBadge()}
            </div>
            <p className="text-xs text-content-muted truncate mt-0.5">{resource.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-xs text-amber-400 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{Number(resource.communityRating || 4.5).toFixed(1)}</span>
          </div>
          <BookmarkButton resource={resource} />
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOutboundClick}
            className="p-2 rounded-lg bg-brand-600/20 hover:bg-brand-600 text-brand-400 hover:text-white transition-colors"
            title={`Visit ${resource.name}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-surface border border-surface-border interactive-card flex flex-col justify-between group h-full relative overflow-hidden">
      
      {/* Top row with Logo, Titles and Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <Link href={`/resource/${resource.slug}`} className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-surface-border flex items-center justify-center p-2.5 group-hover:border-brand-500/40 transition-colors shrink-0">
              {resource.logoUrl ? (
                <img src={resource.logoUrl} alt={resource.name} className="w-7 h-7 object-contain" />
              ) : (
                <Sparkles className="w-6 h-6 text-brand-400" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-content-primary group-hover:text-brand-400 transition-colors truncate">
                {resource.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-content-muted">
                <span className="capitalize">{resource.categoryId.replace("-", " ")}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {Number(resource.communityRating || 4.5).toFixed(1)}
                </span>
              </div>
            </div>
          </Link>

          {/* Bookmark Quick Action */}
          <BookmarkButton resource={resource} />
        </div>

        {/* Badges Bar */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {resource.editorsChoice && (
            <span className="badge badge-featured">
              <Crown className="w-3 h-3 text-amber-400" />
              Editor&apos;s Choice
            </span>
          )}
          {resource.verified && (
            <span className="badge badge-verified">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Verified
            </span>
          )}
          {getPricingBadge()}
        </div>

        {/* Description / Tagline */}
        <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed mb-4">
          {resource.tagline || resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-surface-secondary text-content-muted border border-surface-border/60"
            >
              #{tag}
            </span>
          ))}
          {resource.platforms.slice(0, 2).map((p) => (
            <span
              key={p}
              className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border text-content-subtle uppercase"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3.5 border-t border-surface-border/60 flex items-center justify-between gap-2">
        <Link
          href={`/resource/${resource.slug}`}
          className="text-xs font-semibold text-content-muted hover:text-content-primary transition-colors flex items-center gap-1"
        >
          Details &amp; Stats &rarr;
        </Link>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOutboundClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-brand-600 text-content-primary hover:text-white border border-surface-border hover:border-transparent text-xs font-semibold transition-all shadow-sm"
        >
          <span>Visit Website</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
