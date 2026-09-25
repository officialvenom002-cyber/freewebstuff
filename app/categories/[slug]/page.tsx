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
import CategoryView from "@/components/categories/CategoryView";
import { buildTypedBoxes, TypedBox, PrivacySection } from "@/lib/categories/boxExtractor";
import { getPrecomputedBoxesForCategory } from "@/lib/categories/serverBoxLoader";

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

interface CategoryPageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const slug = category.slug || category.id;
  
  // Instant retrieval from precomputed cache (0ms)
  let initialBoxes = getPrecomputedBoxesForCategory(slug);

  if (!initialBoxes || initialBoxes.length === 0) {
    try {
      const allCategorySectionsData = require("@/lib/db/allCategorySections.json") as Record<string, PrivacySection[]>;
      let initialSections: PrivacySection[] = allCategorySectionsData[slug] || [];

      if (!initialSections || initialSections.length === 0) {
        const slugKey = Object.keys(allCategorySectionsData).find(
          (k) => slug.toLowerCase().includes(k) || k.includes(slug.toLowerCase())
        );
        if (slugKey && allCategorySectionsData[slugKey]) {
          initialSections = allCategorySectionsData[slugKey];
        }
      }
      initialBoxes = buildTypedBoxes(slug, initialSections);
    } catch {
      initialBoxes = [];
    }
  }

  // Generate top-tier Google SERP Schemas (CollectionPage + BreadcrumbList + FAQPage)
  const structuredBoxes = initialBoxes.map((box) => ({
    id: box.id,
    title: box.title,
    websites: box.websites.map((w) => ({
      name: w.name,
      url: w.url,
    })),
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
        initialBoxesProp={initialBoxes}
      />
    </>
  );
}
