"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAllCategories } from "@/lib/db/store";
import { validateAndParseUrl } from "@/lib/validation/urlChecker";
import { Category, PricingType, PlatformType } from "@/lib/types";
import { PlusCircle, Sparkles, CheckCircle2, AlertCircle, Globe, ExternalLink } from "lucide-react";

function SubmitResourceContent() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(initialName);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pricingType, setPricingType] = useState<PricingType>("free");
  const [platforms, setPlatforms] = useState<PlatformType[]>(["web"]);
  const [tagsInput, setTagsInput] = useState("");
  const [reason, setReason] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");

  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; domain?: string; isHttps?: boolean; faviconUrl?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const cats = getAllCategories();
    setCategories(cats);
    if (cats.length > 0) setCategoryId(cats[0].id);
  }, []);

  const handleUrlBlur = () => {
    if (!url.trim()) {
      setUrlValidation(null);
      return;
    }
    const res = validateAndParseUrl(url);
    if (res.isValid) {
      setUrl(res.normalizedUrl);
      setUrlValidation({
        isValid: true,
        domain: res.domain,
        isHttps: res.isHttps,
        faviconUrl: res.faviconUrl,
      });
    } else {
      setUrlValidation({ isValid: false });
    }
  };

  const handlePlatformToggle = (p: PlatformType) => {
    if (platforms.includes(p)) {
      if (platforms.length > 1) setPlatforms(platforms.filter((x) => x !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !url.trim() || !description.trim() || !categoryId) {
      setErrorMessage("Please complete all required fields (Name, URL, Category, Description).");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    setSubmitting(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          url,
          description,
          categoryId,
          pricingType,
          platforms,
          tags,
          reason,
          submitterEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit resource.");
      } else {
        setSuccess(true);
      }
    } catch {
      setErrorMessage("Network error submitting resource. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary">
          Resource Submitted for Review!
        </h1>
        <p className="text-sm text-content-muted leading-relaxed">
          Thank you for contributing to FreeWebStuff. Our moderation team will verify the link integrity, safety status, and categorization before publishing it to the live directory.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setSuccess(false);
              setName("");
              setUrl("");
              setDescription("");
              setUrlValidation(null);
            }}
            className="px-4 py-2 rounded-xl bg-surface-secondary text-content-primary border border-surface-border text-xs font-semibold hover:bg-surface-hover"
          >
            Submit Another Resource
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/25">
          <Sparkles className="w-3.5 h-3.5" />
          Community Powered Index
        </div>
        <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
          Submit a Resource
        </h1>
        <p className="text-xs sm:text-sm text-content-muted">
          Recommend useful websites, open-source software, developer tools, or AI models to be indexed.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border space-y-6">
        
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content-secondary block">
              Resource / Tool Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cursor, Ollama, Bitwarden"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content-secondary block">
              Official Website URL *
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {urlValidation && (
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
            urlValidation.isValid ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            <div className="flex items-center gap-2">
              {urlValidation.isValid && urlValidation.faviconUrl && (
                <img src={urlValidation.faviconUrl} alt="favicon" className="w-4 h-4 rounded" />
              )}
              <span>{urlValidation.isValid ? `✓ Valid Domain: ${urlValidation.domain}` : "✗ Invalid Website URL format"}</span>
            </div>
            {urlValidation.isHttps && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                HTTPS Enabled
              </span>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content-secondary block">
            Short Description / What does it do? *
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A concise summary of features, capabilities, and what makes this tool notable..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content-secondary block">
              Primary Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500 transition-colors"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-surface">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content-secondary block">
              Pricing Model
            </label>
            <select
              value={pricingType}
              onChange={(e) => setPricingType(e.target.value as PricingType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500 transition-colors"
            >
              <option value="free" className="bg-surface">100% Completely Free</option>
              <option value="open-source" className="bg-surface">Open Source (FOSS)</option>
              <option value="freemium" className="bg-surface">Freemium (Free tier available)</option>
              <option value="free-trial" className="bg-surface">Free Trial</option>
              <option value="paid" className="bg-surface">Paid / Commercial</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-content-secondary block">
            Supported Platforms (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {(["web", "windows", "macos", "linux", "android", "ios", "browser-extension", "cli"] as PlatformType[]).map((p) => {
              const isSelected = platforms.includes(p);
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => handlePlatformToggle(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
                    isSelected
                      ? "bg-brand-500/20 text-brand-300 border-brand-500/40"
                      : "bg-surface-secondary text-content-muted border-surface-border hover:text-content-primary"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content-secondary block">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. AI, Code, Privacy, React, Self-Hosted"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content-secondary block">
            Why should this resource be included? (Optional notes for moderators)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Top rated open-source alternative to proprietary app X"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-glow flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{submitting ? "Validating & Submitting..." : "Submit Resource for Moderation"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

export default function SubmitResourcePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-content-muted">Loading submission form...</div>}>
      <SubmitResourceContent />
    </Suspense>
  );
}
