"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Resource } from "@/lib/types";
import ResourceCard from "@/components/resources/ResourceCard";
import { Bookmark, Download, Trash2, Sparkles, Compass } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Resource[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadBookmarks = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("fis_bookmarks") || "[]");
      setBookmarks(saved);
    } catch {
      setBookmarks([]);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadBookmarks();
    window.addEventListener("bookmarks-updated", loadBookmarks);
    return () => window.removeEventListener("bookmarks-updated", loadBookmarks);
  }, []);

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all saved bookmarks?")) {
      localStorage.removeItem("fis_bookmarks");
      setBookmarks([]);
      window.dispatchEvent(new Event("bookmarks-updated"));
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexushub-bookmarks-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!loaded) return null;

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/25">
            <Bookmark className="w-3.5 h-3.5 fill-brand-400" />
            Local-First Storage
          </div>
          <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
            Saved Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-content-muted">
            {bookmarks.length} {bookmarks.length === 1 ? "resource" : "resources"} saved to your browser session.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-secondary hover:bg-surface-hover text-content-primary border border-surface-border text-xs font-semibold transition-all"
            >
              <Download className="w-3.5 h-3.5 text-brand-400" />
              Export JSON
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-surface border border-surface-border space-y-4 max-w-xl mx-auto p-8">
          <div className="w-14 h-14 rounded-2xl bg-surface-secondary border border-surface-border flex items-center justify-center mx-auto text-brand-400">
            <Bookmark className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-content-primary">No Bookmarks Saved Yet</h3>
            <p className="text-xs sm:text-sm text-content-muted">
              Click the bookmark icon on any resource card or detail page to save software and tools for quick offline access.
            </p>
          </div>
          <div className="pt-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <Compass className="w-4 h-4" />
              Explore the Directory
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookmarks.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
