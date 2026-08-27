"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Sparkles, Filter, SlidersHorizontal } from "lucide-react";
import { Resource } from "@/lib/types";
import ResourceCard from "./ResourceCard";

interface ResourceGridProps {
  resources: Resource[];
  initialSort?: string;
  onSortChange?: (sort: string) => void;
  showViewToggle?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function ResourceGrid({
  resources,
  initialSort = "popular",
  onSortChange,
  showViewToggle = true,
  emptyTitle = "No resources found",
  emptyMessage = "Try adjusting your search terms or filter selections.",
}: ResourceGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentSort, setCurrentSort] = useState(initialSort);

  const handleSortChange = (newSort: string) => {
    setCurrentSort(newSort);
    if (onSortChange) onSortChange(newSort);
  };

  if (resources.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-surface-border flex items-center justify-center mx-auto text-content-muted">
          <Sparkles className="w-6 h-6 text-brand-400" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold text-content-primary">{emptyTitle}</h3>
          <p className="text-sm text-content-muted mt-1">{emptyMessage}</p>
        </div>
        <div className="pt-2">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Submit Missing Resource
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header controls */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-surface-border/50">
        <span className="text-xs font-semibold text-content-muted uppercase tracking-wider">
          {resources.length} {resources.length === 1 ? "Resource" : "Resources"} Available
        </span>

        <div className="flex items-center gap-2.5">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface border border-surface-border rounded-lg px-2.5 py-1 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-content-muted" />
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-content-secondary font-medium outline-none cursor-pointer"
            >
              <option value="popular" className="bg-surface text-content-primary">Most Popular</option>
              <option value="rating" className="bg-surface text-content-primary">Highest Rated</option>
              <option value="newest" className="bg-surface text-content-primary">Recently Added</option>
              <option value="az" className="bg-surface text-content-primary">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Grid / List Switcher */}
          {showViewToggle && (
            <div className="flex items-center p-0.5 rounded-lg bg-surface border border-surface-border">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-surface-secondary text-brand-400"
                    : "text-content-muted hover:text-content-primary"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-surface-secondary text-brand-400"
                    : "text-content-muted hover:text-content-primary"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid or List Layout */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} compact />
          ))}
        </div>
      )}
    </div>
  );
}
