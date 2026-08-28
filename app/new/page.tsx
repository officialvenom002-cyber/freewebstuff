import React from "react";
import { getRecentlyAddedResources } from "@/lib/db/store";
import ResourceCard from "@/components/resources/ResourceCard";
import { Clock, PlusCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Recently Added Resources | FreeWebStuff",
  description: "Freshly approved and indexed websites, software, and tools submitted by the community.",
};

export default function RecentlyAddedPage() {
  const recent = getRecentlyAddedResources(24);

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/25">
            <Clock className="w-3.5 h-3.5" />
            Live Feed
          </div>
          <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
            Recently Added to the Index
          </h1>
          <p className="text-xs sm:text-sm text-content-muted">
            The newest verified entries added to FreeWebStuff through the community submission queue.
          </p>
        </div>

        <Link
          href="/submit"
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Submit a Resource
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recent.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
