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
export const revalidate = 3600;

export const metadata = {
  title: "All Categories | FreeWebStuff Directory",
  description: "Browse 23 curated categories indexing over 15,000 verified free resources, software, media, tools, and community picks.",
};

export default function CategoriesPage() {
  const categories = getCategoriesWithCounts();

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2 max-w-2xl animate-fade-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
          Directory Categories
        </h1>
        <p className="text-sm text-content-muted">
          Browse 23 specialized categories indexing over 15,000 verified tools, open-source apps, and curated community recommendations.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, idx) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const delayMs = Math.min(idx * 50, 600);
          return (
            <div
              key={cat.id}
              className="animate-fade-up p-6 rounded-2xl bg-surface border border-surface-border interactive-card flex flex-col justify-between group"
              style={{ animationDelay: `${delayMs}ms` }}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-surface-border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"
                    style={{ backgroundColor: `${cat.color}15`, borderColor: `${cat.color}35` }}
                  >
                    <Icon className="w-6 h-6 transition-transform" style={{ color: cat.color }} />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-secondary text-content-secondary border border-surface-border">
                    {cat.resourceCount} {cat.resourceCount === 1 ? "tool" : "tools"}
                  </span>
                </div>

                <Link href={`/categories/${cat.slug}`} prefetch={true}>
                  <h2 className="text-lg font-bold text-content-primary group-hover:text-brand-400 transition-colors duration-200">
                    {cat.name}
                  </h2>
                </Link>
                <p className="text-xs text-content-muted mt-2 leading-relaxed">
                  {cat.description}
                </p>

                {/* Subcategories tags */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/categories/${cat.slug}?sub=${sub.id}`}
                        prefetch={true}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-surface-secondary text-content-muted hover:text-content-primary hover:border-brand-500/30 border border-surface-border/60 transition-all duration-150 hover:bg-surface-hover"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-surface-border/50 flex items-center justify-between">
                <Link
                  href={`/categories/${cat.slug}`}
                  prefetch={true}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors duration-150 flex items-center gap-1 group/link"
                >
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
