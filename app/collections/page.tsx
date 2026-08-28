import React from "react";
import Link from "next/link";
import { getAllCollections, getAllResources } from "@/lib/db/store";
import { Layers, Sparkles, ArrowRight, Bot, Code2, ShieldCheck, CheckSquare } from "lucide-react";

export const metadata = {
  title: "Curated Collections | FreeWebStuff Directory",
  description: "Thematic collections of the best free software, AI assistants, developer utilities, and privacy tools.",
};

const iconMap: Record<string, React.ElementType> = {
  Bot,
  Code2,
  ShieldCheck,
  CheckSquare,
  Sparkles,
};

export default function CollectionsPage() {
  const collections = getAllCollections();
  const allResources = getAllResources();

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          Thematic Guides
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
          Curated Collections
        </h1>
        <p className="text-sm text-content-muted">
          Hand-crafted toolkits, software packs, and workflow recommendations curated by experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => {
          const Icon = iconMap[col.icon] || Sparkles;
          const tools = col.resourceIds
            .map((id) => allResources.find((r) => r.id === id))
            .filter(Boolean);

          return (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="p-6 rounded-2xl bg-surface border border-surface-border interactive-card group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand-400" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-secondary text-brand-400 border border-surface-border">
                    {col.resourceIds.length} Recommended Tools
                  </span>
                </div>

                <h2 className="text-xl font-bold text-content-primary group-hover:text-brand-400 transition-colors">
                  {col.title}
                </h2>
                <p className="text-xs sm:text-sm text-content-muted mt-2 leading-relaxed">
                  {col.description}
                </p>

                {/* Preview sample tools */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-surface-border/50">
                  <span className="text-[11px] text-content-subtle font-medium">Includes:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tools.slice(0, 4).map((tool) => (
                      <span
                        key={tool?.id}
                        className="text-xs px-2 py-0.5 rounded bg-surface-secondary text-content-secondary border border-surface-border"
                      >
                        {tool?.name}
                      </span>
                    ))}
                    {tools.length > 4 && (
                      <span className="text-xs text-content-muted">+{tools.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 flex items-center justify-between text-xs font-semibold text-brand-400">
                <span>View Full Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
