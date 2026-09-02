"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Global error boundary for all Next.js app routes.
 * Catches render-time errors and shows a friendly recovery page
 * instead of crashing the entire site.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in development; swap for Sentry/LogRocket in production
    console.error("[FWSF Page Error]", error?.message, error?.digest);
  }, [error]);

  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 space-y-8">
      {/* Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(239,68,68,0.15)]">
          ⚠️
        </div>
      </div>

      {/* Message */}
      <div className="space-y-3 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          An unexpected error occurred on this page. Our team has been notified.
          Try refreshing, or head back to the homepage.
        </p>
        {error?.digest && (
          <p className="text-[11px] text-slate-600 font-mono bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 inline-block">
            Error reference: {error.digest}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={reset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:scale-105"
        >
          🔄 Try Again
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all"
        >
          🏠 Back to Home
        </Link>
      </div>

      {/* Helpful links */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <Link href="/categories" className="hover:text-sky-400 transition-colors">Browse Categories</Link>
        <span>·</span>
        <Link href="/search" className="hover:text-sky-400 transition-colors">Search Directory</Link>
        <span>·</span>
        <Link href="/report" className="hover:text-sky-400 transition-colors">Report Issue</Link>
      </div>
    </div>
  );
}
