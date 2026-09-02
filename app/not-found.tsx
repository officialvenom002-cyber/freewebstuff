import Link from "next/link";
import { Search, Home } from "lucide-react";

export const metadata = {
  title: "Page Not Found | FreeWebStuff",
  description: "This page doesn't exist. Search 15,000+ free tools and resources in our directory.",
  robots: { index: false, follow: false },
};

/**
 * Branded 404 page — shown for any URL that doesn't match a route.
 * Keeps users on-site with search and category links instead of bouncing them.
 */
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-8 py-16">

      {/* Stacked 404 + icon */}
      <div className="relative flex flex-col items-center">
        <span className="text-[120px] sm:text-[160px] font-black text-white/[0.04] leading-none select-none pointer-events-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(56,189,248,0.15)]">
            🔍
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="space-y-3 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          This page doesn&apos;t exist or may have been moved. Try searching our directory
          of <strong className="text-slate-300">15,000+ free tools</strong> across 23 categories.
        </p>
      </div>

      {/* Primary CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/search"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_24px_rgba(56,189,248,0.3)] hover:scale-105"
        >
          <Search className="w-4 h-4" />
          Search Directory
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Popular category quick links */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500">Or jump to a category:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { slug: "privacy", label: "🛡️ Privacy" },
            { slug: "ai", label: "🤖 AI Tools" },
            { slug: "developer-tools", label: "💻 Dev Tools" },
            { slug: "video", label: "🎬 Streaming" },
            { slug: "gaming", label: "🎮 Gaming" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-300 hover:text-sky-300 hover:bg-sky-500/10 border border-white/[0.06] hover:border-sky-400/30 transition-all"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
