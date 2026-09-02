import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, filterResources, getAllCategories } from "@/lib/db/store";
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

import { CATEGORY_KEYWORDS_MAP, generateCategorySchema } from "@/lib/seo/schema";
import CategoryView, { PrivacySection } from "@/components/categories/CategoryView";
import allCategorySectionsData from "@/lib/db/allCategorySections.json";

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return { title: "Category Not Found | FreeWebStuff" };

  const keywords = CATEGORY_KEYWORDS_MAP[category.slug] || [
    `${category.name.toLowerCase()} free tools`,
    `best free ${category.name.toLowerCase()} websites`,
    `${category.name.toLowerCase()} directory`,
    "free internet stuff",
    "open source software",
    "freewebstuff"
  ];

  const title = `${category.name} Directory 2026 — Best Free Tools, Websites & Software`;
  const description = `Explore the best free ${category.name.toLowerCase()} websites, open-source software, and verified online resources. Clean, direct links without paywalls or ads.`;
  const canonicalUrl = `https://freewebstuff.site/categories/${category.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | FreeWebStuff`,
      description,
      url: canonicalUrl,
      siteName: "FreeWebStuff",
      type: "website",
      images: [
        {
          url: "https://freewebstuff.site/favicon.png",
          width: 512,
          height: 512,
          alt: `${category.name} FreeWebStuff Directory`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | FreeWebStuff`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

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

  // Generate top-tier Google SERP Schemas (CollectionPage + BreadcrumbList + FAQPage)
  const structuredBoxes = initialSections.map((sec) => ({
    id: sec.id,
    title: sec.title,
    websites: sec.items.map((item) => {
      const match = /(?:\*\*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/.exec(item.raw);
      return {
        name: match ? (match[1] || match[3] || "").trim() : "",
        url: match ? (match[2] || match[4] || "").trim() : "",
      };
    }).filter((w) => w.name && w.url),
  }));

  const jsonLd = generateCategorySchema(category, structuredBoxes);

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
