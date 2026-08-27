"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { Resource } from "@/lib/types";

interface BookmarkButtonProps {
  resource: Resource;
  className?: string;
  showText?: boolean;
}

export default function BookmarkButton({ resource, className = "", showText = false }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("fis_bookmarks") || "[]");
      setIsBookmarked(saved.some((r: Resource) => r.id === resource.id));
    } catch {
      setIsBookmarked(false);
    }
  }, [resource.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved: Resource[] = JSON.parse(localStorage.getItem("fis_bookmarks") || "[]");
      let updated: Resource[];

      if (isBookmarked) {
        updated = saved.filter((r) => r.id !== resource.id);
        setIsBookmarked(false);
      } else {
        updated = [...saved, resource];
        setIsBookmarked(true);
      }

      localStorage.setItem("fis_bookmarks", JSON.stringify(updated));
      window.dispatchEvent(new Event("bookmarks-updated"));
    } catch (err) {
      console.error("Failed to save bookmark:", err);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
      title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
      className={`inline-flex items-center gap-1.5 p-2 rounded-lg border transition-all ${
        isBookmarked
          ? "bg-brand-500/15 border-brand-500/40 text-brand-400 fill-brand-400"
          : "bg-surface border-surface-border text-content-muted hover:text-content-primary hover:bg-surface-secondary"
      } ${className}`}
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-brand-400 text-brand-400" : ""}`} />
      {showText && (
        <span className="text-xs font-medium">
          {isBookmarked ? "Saved" : "Bookmark"}
        </span>
      )}
    </button>
  );
}
