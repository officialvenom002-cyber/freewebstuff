"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAllCategories, getAllResources, filterResources } from "@/lib/db/store";
import { searchResources } from "@/lib/search/engine";
import { Resource, PricingType, PlatformType, Category } from "@/lib/types";
import FilterSidebar from "@/components/search/FilterSidebar";
import ResourceGrid from "@/components/resources/ResourceGrid";
import { Search, X, Sparkles } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCat = searchParams.get("category") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedPricing, setSelectedPricing] = useState<PricingType[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "popular" | "newest" | "rating" | "az">("popular");

  const categories = useMemo(() => getAllCategories(), []);
  const allResources = useMemo(() => getAllResources(), []);

  // Sync query when searchParams change
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setQuery(q);
    const cat = searchParams.get("category");
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  // Filter & Search Logic
  const filteredResources = useMemo(() => {
    let result = filterResources({
      category: selectedCategory,
      pricing: selectedPricing.length > 0 ? selectedPricing : undefined,
      platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
      verifiedOnly,
      openSourceOnly,
      sortBy: sortBy as any,
    });

    if (query.trim()) {
      result = searchResources(result, query);
    }

    return result;
  }, [allResources, query, selectedCategory, selectedPricing, selectedPlatforms, verifiedOnly, openSourceOnly, sortBy]);

  const handleResetFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedPricing([]);
    setSelectedPlatforms([]);
    setVerifiedOnly(false);
    setOpenSourceOnly(false);
    setSortBy("popular");
  };

  return (
    <div className="space-y-6 py-4">
      {/* Top Search Header */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
              Explore &amp; Filter Resources
            </h1>
            <p className="text-xs sm:text-sm text-content-muted mt-1">
              Fuzzy search with real-time faceted filters across all 24 categories.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface-secondary text-brand-400 border border-surface-border self-start sm:self-auto">
            {filteredResources.length} Results Found
          </span>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-brand-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by tool name, keyword, feature (e.g. 'OCR', 'Local AI', 'Transcoder')..."
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-surface-secondary border border-surface-border text-content-primary placeholder-content-muted text-sm font-medium outline-none focus:border-brand-500 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-content-muted hover:text-content-primary rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Two Column Layout: Filter Sidebar + Resource Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPricing={selectedPricing}
          onPricingChange={setSelectedPricing}
          selectedPlatforms={selectedPlatforms}
          onPlatformsChange={setSelectedPlatforms}
          verifiedOnly={verifiedOnly}
          onVerifiedOnlyChange={setVerifiedOnly}
          openSourceOnly={openSourceOnly}
          onOpenSourceOnlyChange={setOpenSourceOnly}
          onResetFilters={handleResetFilters}
        />

        <div className="flex-1 w-full min-w-0">
          <ResourceGrid
            resources={filteredResources}
            initialSort={sortBy}
            onSortChange={(sort) => setSortBy(sort as any)}
            emptyTitle={`No resources found matching "${query}"`}
            emptyMessage="Try clearing some filter tags or searching with broader keywords."
          />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-content-muted">Loading directory search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
