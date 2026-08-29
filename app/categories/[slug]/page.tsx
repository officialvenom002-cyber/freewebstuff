import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, filterResources, getAllCategories } from "@/lib/db/store";
import { generateCategorySchema } from "@/lib/seo/schema";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceGrid from "@/components/resources/ResourceGrid";
import { 
  ArrowLeft, 
  Sparkles, 
  Filter, 
  Bot, 
  ShieldCheck, 
  Code2, 
  AppWindow, 
  Palette, 
  Video, 
  Gamepad2, 
  GraduationCap, 
  CheckSquare,
  Headphones,
  BookOpen,
  Download,
  Share2,
  Smartphone,
  Terminal,
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


interface CategoryPageProps {
  params: { slug: string };
  searchParams?: { sub?: string; sort?: string };
}

export async function generateStaticParams() {
  const { getAllCategories } = await import("@/lib/db/store");
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

const iconMap: Record<string, React.ElementType> = {
  Bot,
  ShieldCheck,
  Code2,
  AppWindow,
  Palette,
  Video,
  Gamepad2,
  GraduationCap,
  CheckSquare,
  Headphones,
  BookOpen,
  Download,
  Share2,
  Smartphone,
  Terminal,
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

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Tools & Resources`,
    description: category.description,
    openGraph: {
      title: `${category.name} Tools & Resources | FreeWebStuff`,
      description: category.description,
    },
  };
}

import CategoryView, { PrivacySection } from "@/components/categories/CategoryView";
import allCategorySectionsData from "@/lib/db/allCategorySections.json";

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const selectedSub = searchParams?.sub;
  const currentSort = searchParams?.sort || "popular";

  const allCategoryResources = filterResources({
    category: category.id,
  });

  const slug = category.slug || category.id;
  const categoryDict = allCategorySectionsData as Record<string, PrivacySection[]>;
  let initialSections: PrivacySection[] = categoryDict[slug] || [];

  if (!initialSections || initialSections.length === 0) {
    const slugKey = Object.keys(categoryDict).find(
      (k) => slug.toLowerCase().includes(k) || k.includes(slug.toLowerCase())
    );
    if (slugKey && categoryDict[slugKey]) {
      initialSections = categoryDict[slugKey];
    }
  }

  const jsonLd = generateCategorySchema(category, allCategoryResources.length);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryView
        category={category}
        allResources={allCategoryResources}
        initialSectionsProp={initialSections}
        initialSub={selectedSub}
        initialSort={currentSort}
      />
    </>
  );
}
