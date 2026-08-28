import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollectionBySlug } from "@/lib/db/store";
import { generateCollectionSchema } from "@/lib/seo/schema";
import ResourceCard from "@/components/resources/ResourceCard";
import { ArrowLeft, Layers, Sparkles, Bot, Code2, ShieldCheck, CheckSquare } from "lucide-react";


interface CollectionPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const { getAllCollections } = await import("@/lib/db/store");
  return getAllCollections().map((c) => ({ slug: c.slug }));
}

const iconMap: Record<string, React.ElementType> = {
  Bot,
  Code2,
  ShieldCheck,
  CheckSquare,
  Sparkles,
};

export async function generateMetadata({ params }: CollectionPageProps) {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) return { title: "Collection Not Found" };

  return {
    title: `${collection.title} | Curated Collections`,
    description: collection.description,
  };
}

export default function CollectionDetailPage({ params }: CollectionPageProps) {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const jsonLd = generateCollectionSchema(collection, collection.resources);
  const Icon = iconMap[collection.icon] || Sparkles;

  return (
    <div className="space-y-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-muted hover:text-content-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to collections
        </Link>
      </div>

      {/* Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7 text-brand-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 uppercase tracking-wider">
                Featured Collection
              </span>
              <span className="text-xs text-content-muted">
                {collection.resources.length} Handpicked Tools
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
              {collection.title}
            </h1>
            <p className="text-xs sm:text-sm text-content-muted max-w-2xl leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Tools in Collection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {collection.resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
