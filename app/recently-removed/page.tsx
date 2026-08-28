import React from "react";
import Link from "next/link";
import { Trash2, AlertTriangle, ExternalLink, Search } from "lucide-react";

export const metadata = {
  title: "Recently Removed — FreeWebStuff",
  description: "Transparent log of resources removed from FreeWebStuff with reasons and alternatives.",
};

const removedResources = [
  { name: "Atom Editor", url: "https://atom.io", category: "Developer Tools", reason: "deprecated" as const, note: "GitHub officially sunset Atom on December 15, 2022.", replacedBy: "VSCode or Zed", removedAt: "2026-08-15" },
  { name: "LastPass Free", url: "https://lastpass.com", category: "Privacy & Security", reason: "unsafe" as const, note: "Multiple major security breaches 2022-2023 + removed free tier cross-device sync.", replacedBy: "Bitwarden", removedAt: "2026-07-20" },
  { name: "Grooveshark", url: "https://grooveshark.com", category: "Music", reason: "dead-link" as const, note: "Service shut down in 2015 due to copyright litigation. Domain is now parked.", removedAt: "2026-07-01" },
  { name: "Opera VPN", url: "https://opera.com/vpn", category: "Privacy & Security", reason: "quality" as const, note: "Not a true VPN — only routes browser traffic through a proxy. Misleading branding.", replacedBy: "Mullvad or ProtonVPN", removedAt: "2026-06-05" },
  { name: "Sci-Hub (old domain)", url: "https://sci-hub.se", category: "Education", reason: "replaced" as const, note: "Original domain became unreliable. Use current working mirror.", replacedBy: "Check /categories/education for mirrors", removedAt: "2026-06-18" },
];

type Reason = "dead-link" | "unsafe" | "deprecated" | "replaced" | "quality";

const reasonConfig: Record<Reason, { label: string; color: string; bg: string; border: string }> = {
  "dead-link":  { label: "Dead Link",     color: "text-red-400",    bg: "bg-red-500/8",    border: "border-red-500/25" },
  "unsafe":     { label: "Unsafe",        color: "text-orange-400", bg: "bg-orange-500/8", border: "border-orange-500/25" },
  "deprecated": { label: "Deprecated",    color: "text-yellow-400", bg: "bg-yellow-500/8", border: "border-yellow-500/25" },
  "replaced":   { label: "Replaced",      color: "text-blue-400",   bg: "bg-blue-500/8",   border: "border-blue-500/25" },
  "quality":    { label: "Quality Issue", color: "text-slate-400",  bg: "bg-slate-500/8",  border: "border-slate-500/25" },
};

export default function RecentlyRemovedPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          <Trash2 className="w-3.5 h-3.5" /> Recently Removed
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">Removed from Index</h1>
        <p className="text-sm text-content-muted leading-relaxed">
          Full transparent log of resources removed from FreeWebStuff, with reasons and alternatives. Useful for finding what replaced them.
        </p>
      </div>

      <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 flex gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-content-secondary leading-relaxed">
          Resources are removed when they go offline, become unsafe, are superseded, or fail quality standards.
          If you believe a removal was incorrect, you can{" "}
          <Link href="/submit" className="text-brand-400 hover:underline">re-submit it for review</Link>.
        </p>
      </div>

      <div className="space-y-3">
        {removedResources.map((res) => {
          const cfg = reasonConfig[res.reason];
          return (
            <div key={res.name} className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-content-primary opacity-50 line-through">{res.name}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-content-muted">{res.category}</span>
                    <span className="text-content-subtle">·</span>
                    <span className="text-xs text-content-muted">
                      Removed {new Date(res.removedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <a href={res.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-content-muted hover:text-content-secondary flex items-center gap-1 transition-colors shrink-0">
                  <ExternalLink className="w-3 h-3" /> Visit anyway
                </a>
              </div>
              <p className="text-xs text-content-muted leading-relaxed">{res.note}</p>
              {res.replacedBy && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-content-muted">Alternative:</span>
                  <Link href={`/search?q=${encodeURIComponent(res.replacedBy)}`}
                    className="text-xs text-brand-400 hover:underline font-medium flex items-center gap-1">
                    <Search className="w-3 h-3" />{res.replacedBy}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2 border-t border-surface-border">
        <Link href="/changelog" className="text-sm text-brand-400 hover:underline">← Back to Changelog</Link>
      </div>
    </div>
  );
}
