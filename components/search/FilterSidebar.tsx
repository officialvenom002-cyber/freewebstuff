"use client";

import React from "react";
import { Filter, RotateCcw, Check, ShieldCheck, Sparkles } from "lucide-react";
import { Category, PricingType, PlatformType, LicenseType } from "@/lib/types";

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPricing: PricingType[];
  onPricingChange: (pricing: PricingType[]) => void;
  selectedPlatforms: PlatformType[];
  onPlatformsChange: (platforms: PlatformType[]) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (verified: boolean) => void;
  openSourceOnly: boolean;
  onOpenSourceOnlyChange: (openSource: boolean) => void;
  onResetFilters: () => void;
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedPricing,
  onPricingChange,
  selectedPlatforms,
  onPlatformsChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  openSourceOnly,
  onOpenSourceOnlyChange,
  onResetFilters,
}: FilterSidebarProps) {
  const pricingOptions: { label: string; value: PricingType }[] = [
    { label: "100% Free", value: "free" },
    { label: "Open Source", value: "open-source" },
    { label: "Freemium", value: "freemium" },
    { label: "Free Trial", value: "free-trial" },
    { label: "Paid", value: "paid" },
  ];

  const platformOptions: { label: string; value: PlatformType }[] = [
    { label: "Web", value: "web" },
    { label: "Windows", value: "windows" },
    { label: "macOS", value: "macos" },
    { label: "Linux", value: "linux" },
    { label: "Android", value: "android" },
    { label: "iOS", value: "ios" },
    { label: "Browser Extension", value: "browser-extension" },
    { label: "CLI / Terminal", value: "cli" },
  ];

  const togglePricing = (val: PricingType) => {
    if (selectedPricing.includes(val)) {
      onPricingChange(selectedPricing.filter((p) => p !== val));
    } else {
      onPricingChange([...selectedPricing, val]);
    }
  };

  const togglePlatform = (val: PlatformType) => {
    if (selectedPlatforms.includes(val)) {
      onPlatformsChange(selectedPlatforms.filter((p) => p !== val));
    } else {
      onPlatformsChange([...selectedPlatforms, val]);
    }
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedPricing.length > 0 ||
    selectedPlatforms.length > 0 ||
    verifiedOnly ||
    openSourceOnly;

  return (
    <aside className="w-full lg:w-64 space-y-6 shrink-0">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2 font-bold text-sm text-content-primary">
          <Filter className="w-4 h-4 text-brand-400" />
          <span>Filters &amp; Facets</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Trust & Safety Badges */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-content-muted uppercase tracking-wider">
          Safety &amp; License
        </h4>
        
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-content-secondary hover:text-content-primary">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
            className="rounded border-surface-border bg-surface text-brand-500 focus:ring-brand-500 w-4 h-4"
          />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Safe Only
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-content-secondary hover:text-content-primary">
          <input
            type="checkbox"
            checked={openSourceOnly}
            onChange={(e) => onOpenSourceOnlyChange(e.target.checked)}
            className="rounded border-surface-border bg-surface text-brand-500 focus:ring-brand-500 w-4 h-4"
          />
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            FOSS / Open Source
          </span>
        </label>
      </div>

      {/* Category Dropdown/List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-content-muted uppercase tracking-wider">
          Category
        </h4>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-surface border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
        >
          <option value="all">All 24 Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pricing Models */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-content-muted uppercase tracking-wider">
          Pricing Model
        </h4>
        <div className="space-y-1.5">
          {pricingOptions.map((opt) => {
            const isChecked = selectedPricing.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 cursor-pointer text-xs text-content-secondary hover:text-content-primary py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => togglePricing(opt.value)}
                  className="rounded border-surface-border bg-surface text-brand-500 focus:ring-brand-500 w-3.5 h-3.5"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Platforms */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-content-muted uppercase tracking-wider">
          Platform
        </h4>
        <div className="space-y-1.5">
          {platformOptions.map((opt) => {
            const isChecked = selectedPlatforms.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 cursor-pointer text-xs text-content-secondary hover:text-content-primary py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => togglePlatform(opt.value)}
                  className="rounded border-surface-border bg-surface text-brand-500 focus:ring-brand-500 w-3.5 h-3.5"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
