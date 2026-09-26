import React from "react";
import Link from "next/link";
import { getCategoriesWithCounts } from "@/lib/db/store";
import { 
  Sparkles, 
  ArrowRight,
  Bot,
  ShieldCheck,
  Code2,
  AppWindow,
  Palette,
  Video,
  Headphones,
  Gamepad2,
  GraduationCap,
  CheckSquare,
  BookOpen,
  Layers,
  Terminal,
  Command,
  Smartphone,
  Tablet,
  BadgePercent,
  Briefcase,
  Newspaper,
  MapPin,
  ShoppingBag,
  Download,
  Share2,
  Globe,
  Boxes,
  Cpu,
  FolderArchive,
  Compass,
  MessageSquare,
  FileText,
  Crosshair,
  Film,
  HardDrive
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Bot,
  ShieldCheck,
  Code2,
  AppWindow,
  Palette,
  Video,
  Headphones,
  Gamepad2,
  GraduationCap,
  CheckSquare,
  BookOpen,
  Layers,
  Terminal,
  Command,
  Smartphone,
  Tablet,
  BadgePercent,
  Briefcase,
  Newspaper,
  MapPin,
  ShoppingBag,
  Download,
  Share2,
  Globe,
  Boxes,
  Cpu,
  FolderArchive,
  Compass,
  MessageSquare,
  FileText,
  Crosshair,
  Film,
  HardDrive,
  Sparkles
};

// ISR: revalidate category list + counts every hour
export const revalidate = 86400;

export const metadata = {
  title: "All Categories | FreeWebStuff Directory",
  description: "Browse 23 curated categories indexing over 15,000 verified free resources, software, media, tools, and community picks.",
};

export default function CategoriesPage() {
  const categories = getCategoriesWithCounts();

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-2xl animate-fade-up">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-content-primary tracking-tight">
          Directory Categories
        </h1>
        <p className="text-sm sm:text-base text-content-muted leading-relaxed">
          Browse 23 specialized categories indexing over 15,000 verified tools, open-source apps, and curated community recommendations.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {categories.map((cat, idx) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const delayMs = Math.min(idx * 40, 500);
          const visibleSubs = cat.subcategories ? cat.subcategories.slice(0, 4) : [];
          const remainingCount = (cat.subcategories?.length || 0) - visibleSubs.length;

          return (
            <div
              key={cat.id}
              className="animate-fade-up p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#131720]/80 to-[#0c0e14]/90 border border-white/[0.07] hover:border-white/20 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.6)] flex flex-col justify-between group transition-all duration-200 hover:-translate-y-1 h-full min-h-[230px]"
              style={{ animationDelay: `${delayMs}ms` }}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shrink-0"
                    style={{ backgroundColor: `${cat.color}15`, borderColor: `${cat.color}35` }}
                  >
                    <Icon className="w-5 h-5 transition-transform" style={{ color: cat.color }} />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.06] font-mono shrink-0">
                    {`${cat.resourceCount} ${cat.resourceCount === 1 ? "tool" : "tools"}`}
                  </span>
                </div>

                <Link href={`/categories/${cat.slug}`} prefetch={true} className="block min-w-0">
                  <h2 
                    className="font-heading font-bold text-[17px] text-white group-hover:text-sky-300 transition-colors duration-200 truncate"
                    title={cat.name}
                  >
                    {cat.name}
                  </h2>
                </Link>
                <p className="text-xs sm:text-[12.5px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2 min-h-[36px]">
                  {cat.description}
                </p>

                {/* Subcategories tags (cleanly bounded) */}
                {visibleSubs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {visibleSubs.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/categories/${cat.slug}?sub=${sub.id}`}
                        prefetch={true}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-150 max-w-[130px] truncate"
                        title={sub.name}
                      >
                        {sub.name}
                      </Link>
                    ))}
                    {remainingCount > 0 && (
                      <Link
                        href={`/categories/${cat.slug}`}
                        prefetch={true}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.02] text-slate-400 hover:text-white border border-white/[0.04] transition-all duration-150"
                      >
                        +{remainingCount} more
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-5 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  href={`/categories/${cat.slug}`}
                  prefetch={true}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors duration-150 flex items-center gap-1.5 group/link"
                >
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1 shrink-0" />
                </Link>
                <span className="text-[11px] text-slate-400 font-mono">
                  {cat.subcategories?.length || 0} subtopics
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
