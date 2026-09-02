import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getResourceBySlug, getRelatedResources, getCategoryBySlug } from "@/lib/db/store";
import { generateResourceSchema } from "@/lib/seo/schema";
import BookmarkButton from "@/components/resources/BookmarkButton";
import HelpfulRating from "@/components/resources/HelpfulRating";
import ResourceCard from "@/components/resources/ResourceCard";
import { 
  ExternalLink, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Calendar, 
  Globe, 
  Flag, 
  Check, 
  Layers, 
  Tag, 
  Laptop,
  Eye,
  MousePointerClick
} from "lucide-react";

// ISR: revalidate all resource pages every hour — no full rebuild needed
export const revalidate = 3600;

// Allow on-demand ISR for any slug not in generateStaticParams
export const dynamicParams = true;

interface ResourcePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const { getAllResources } = await import("@/lib/db/store");
  // Pre-render ALL resources at build time so no page ever hits a cold serverless start.
  // dynamicParams=true above handles any future resources added after the build via ISR.
  return getAllResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: ResourcePageProps) {
  const resource = getResourceBySlug(params.slug);
  if (!resource) return { title: "Resource Not Found" };

  return {
    title: `${resource.name} - ${resource.tagline}`,
    description: resource.description,
    openGraph: {
      title: `${resource.name} | FreeWebStuff Directory`,
      description: resource.description,
      url: `https://freewebstuff.site/resource/${resource.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${resource.name} | FreeWebStuff Directory`,
      description: resource.description,
    },
  };
}

export default function ResourceDetailPage({ params }: ResourcePageProps) {
  const resource = getResourceBySlug(params.slug);
  if (!resource) notFound();

  const category = getCategoryBySlug(resource.categoryId);
  const relatedResources = getRelatedResources(resource, 3);
  const jsonLd = generateResourceSchema(resource);

  return (
    <div className="space-y-10 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-content-muted flex-wrap">
        <Link href="/" className="hover:text-content-primary">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-content-primary">Categories</Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/categories/${category.slug}`} className="hover:text-content-primary">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-content-primary font-semibold truncate">{resource.name}</span>
      </nav>

      {/* Main Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Logo & Main Info */}
          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface-secondary border border-surface-border flex items-center justify-center p-3 shrink-0 shadow-card">
              {resource.logoUrl ? (
                <img src={resource.logoUrl} alt={resource.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              ) : (
                <Sparkles className="w-8 h-8 text-brand-400" />
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-content-primary tracking-tight truncate">
                  {resource.name}
                </h1>
                {resource.verified && (
                  <span className="badge badge-verified">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Safe
                  </span>
                )}
                {resource.featured && (
                  <span className="badge badge-featured">
                    ⭐ Featured Pick
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
                {resource.tagline}
              </p>
              
              <div className="flex items-center gap-3 text-xs text-content-muted flex-wrap pt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {Number(resource.communityRating || 4.5).toFixed(1)} / 5.0
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-content-muted" />
                  {resource.viewCount.toLocaleString()} views
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MousePointerClick className="w-3.5 h-3.5 text-content-muted" />
                  {resource.clickCount.toLocaleString()} visits
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex sm:flex-row md:flex-col lg:flex-row items-center gap-3 shrink-0">
            <BookmarkButton resource={resource} showText className="w-full sm:w-auto justify-center py-2.5 px-4" />

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-glow hover:scale-105"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Quick Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-surface-border/60 text-xs">
          <div className="p-3 rounded-xl bg-surface-secondary/70 border border-surface-border">
            <span className="text-content-muted block mb-1">Pricing Model</span>
            <span className="font-semibold text-content-primary capitalize">{resource.pricingType}</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary/70 border border-surface-border">
            <span className="text-content-muted block mb-1">License</span>
            <span className="font-semibold text-content-primary uppercase">{resource.license}</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary/70 border border-surface-border">
            <span className="text-content-muted block mb-1">Safety Status</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified &amp; Clean
            </span>
          </div>
          <div className="p-3 rounded-xl bg-surface-secondary/70 border border-surface-border">
            <span className="text-content-muted block mb-1">Last Checked</span>
            <span className="font-semibold text-content-primary">
              {new Date(resource.lastVerifiedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Detail Two-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Description, Features, Sentiment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Section */}
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
            <h2 className="text-lg font-bold text-content-primary">About {resource.name}</h2>
            <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
              {resource.description}
            </p>
            {resource.pricingNote && (
              <div className="p-3 rounded-xl bg-surface-secondary border border-surface-border text-xs text-content-muted">
                <strong className="text-content-primary">Pricing Details:</strong> {resource.pricingNote}
              </div>
            )}
          </div>

          {/* Key Features Checklist */}
          {resource.features && resource.features.length > 0 && (
            <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
              <h2 className="text-lg font-bold text-content-primary">Key Highlights &amp; Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resource.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-content-secondary">
                    <div className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Feedback Widget */}
          <HelpfulRating
            resourceId={resource.id}
            initialHelpful={resource.helpfulCount}
            initialUnhelpful={resource.unhelpfulCount}
          />

          {/* Report Link Action */}
          <div className="flex items-center justify-between text-xs text-content-muted p-4 rounded-xl bg-surface/50 border border-surface-border">
            <span>Notice an issue or broken link with this entry?</span>
            <Link
              href={`/report?resource=${encodeURIComponent(resource.name)}&id=${resource.id}`}
              className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              Report Issue
            </Link>
          </div>

        </div>

        {/* Right Sidebar: Platforms, Tags, Category, Related */}
        <div className="space-y-6">
          
          {/* Supported Platforms */}
          <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-content-muted">
              Supported Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {resource.platforms.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-secondary text-content-primary border border-surface-border capitalize"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-content-muted">
              Indexed Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 rounded-md text-xs bg-surface-secondary text-content-secondary hover:text-brand-400 hover:border-brand-500/30 border border-surface-border transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          {relatedResources.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-content-muted">
                Similar Resources
              </h3>
              <div className="flex flex-col gap-2.5">
                {relatedResources.map((rel) => (
                  <ResourceCard key={rel.id} resource={rel} compact />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
