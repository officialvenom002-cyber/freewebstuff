import { Resource, Category, Collection, Submission, Report, ChangelogItem, FilterOptions } from "../types";
import { CATEGORIES } from "./categories";
import { SEED_RESOURCES, SEED_COLLECTIONS, SEED_CHANGELOG } from "./seedData";

// In-memory persistent state (simulating database layer with realistic initial state)
let resources: Resource[] = SEED_RESOURCES.map((r: any) => ({
  ...r,
  communityRating: typeof r.communityRating === "number" ? r.communityRating : parseFloat(r.communityRating) || 4.5,
  reviewCount: typeof r.reviewCount === "number" ? r.reviewCount : parseInt(r.reviewCount, 10) || 0,
  helpfulCount: typeof r.helpfulCount === "number" ? r.helpfulCount : parseInt(r.helpfulCount, 10) || 0,
  unhelpfulCount: typeof r.unhelpfulCount === "number" ? r.unhelpfulCount : parseInt(r.unhelpfulCount, 10) || 0,
  viewCount: typeof r.viewCount === "number" ? r.viewCount : parseInt(r.viewCount, 10) || 0,
  clickCount: typeof r.clickCount === "number" ? r.clickCount : parseInt(r.clickCount, 10) || 0,
  bookmarkCount: typeof r.bookmarkCount === "number" ? r.bookmarkCount : parseInt(r.bookmarkCount, 10) || 0,
}));
let collections: Collection[] = [...SEED_COLLECTIONS];
let changelog: ChangelogItem[] = [...SEED_CHANGELOG];
let submissions: Submission[] = [
  {
    id: "sub-1",
    name: "Ghostty Terminal",
    url: "https://ghostty.org",
    description: "Fast, feature-rich, and cross-platform terminal emulator written in Zig.",
    categoryId: "dev-tools",
    subcategoryId: "dev-cli",
    pricingType: "open-source",
    platforms: ["macos", "linux"],
    tags: ["Terminal", "GPU Accelerated", "Zig", "Open Source"],
    reason: "One of the most anticipated and fastest new terminal emulators.",
    submitterEmail: "dev@example.com",
    status: "pending",
    createdAt: "2026-08-19T10:00:00Z"
  },
  {
    id: "sub-2",
    name: "Penpot",
    url: "https://penpot.app",
    description: "Open-source web-based design and prototyping tool for cross-domain teams.",
    categoryId: "design",
    subcategoryId: "des-ui",
    pricingType: "open-source",
    platforms: ["web", "linux", "macos", "windows"],
    tags: ["UI/UX", "Open Source", "Figma Alternative", "SVG Native"],
    reason: "Great open source alternative to Figma with native SVG output.",
    submitterEmail: "designer@example.com",
    status: "pending",
    createdAt: "2026-08-18T14:30:00Z"
  }
];

let reports: Report[] = [
  {
    id: "rep-1",
    resourceId: "res-v0-dev",
    resourceName: "v0 by Vercel",
    reason: "wrong-category",
    details: "Could also be tagged with Design since it generates full React UI components.",
    reporterEmail: "feedback@user.com",
    status: "open",
    createdAt: "2026-08-19T12:00:00Z"
  }
];

// Stats cache
export function getPlatformStats() {
  const totalResources = resources.length;
  const verifiedResources = resources.filter(r => r.verified).length;
  const totalCategories = CATEGORIES.length;
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(s => s.status === "pending").length;
  const totalReports = reports.length;
  const openReports = reports.filter(r => r.status === "open").length;
  const totalBookmarks = resources.reduce((acc, r) => acc + r.bookmarkCount, 0);
  const totalClicks = resources.reduce((acc, r) => acc + r.clickCount, 0);

  return {
    totalResources,
    verifiedResources,
    totalCategories,
    totalSubmissions,
    pendingSubmissions,
    totalReports,
    openReports,
    totalBookmarks,
    totalClicks,
  };
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): (Category & { resourceCount: number }) | undefined {
  const cat = CATEGORIES.find(c => c.slug === slug || c.id === slug);
  if (!cat) return undefined;
  const count = resources.filter(r => r.categoryId === cat.id).length;
  return { ...cat, resourceCount: count };
}

export function getCategoriesWithCounts(): (Category & { resourceCount: number })[] {
  return CATEGORIES.map(cat => ({
    ...cat,
    resourceCount: resources.filter(r => r.categoryId === cat.id).length
  }));
}

export function getAllResources(): Resource[] {
  return [...resources];
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find(r => r.slug === slug || r.id === slug);
}

export function getFeaturedResources(limit = 8): Resource[] {
  return resources.filter(r => r.featured).slice(0, limit);
}

export function getRecentlyAddedResources(limit = 10): Resource[] {
  return [...resources]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getCommunityPicks(limit = 6): Resource[] {
  return [...resources]
    .sort((a, b) => b.helpfulCount - a.helpfulCount)
    .slice(0, limit);
}

/**
 * Multi-factor trending score formula:
 * Score = (30% visits) + (25% clicks) + (20% bookmarks) + (15% helpful rating) + (10% recency factor)
 */
export function getTrendingResources(limit = 12): (Resource & { trendingScore: number })[] {
  const now = new Date().getTime();

  return [...resources]
    .map(resource => {
      const ageInDays = Math.max(1, (now - new Date(resource.updatedAt || resource.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const recencyBonus = Math.max(0, 100 - ageInDays * 2);
      
      const score = 
        (resource.viewCount * 0.003) +
        (resource.clickCount * 0.005) +
        (resource.bookmarkCount * 0.01) +
        (resource.helpfulCount * 0.02) +
        (recencyBonus * 0.1);

      return {
        ...resource,
        trendingScore: Math.round(score * 10) / 10
      };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);
}

export function getRelatedResources(resource: Resource, limit = 4): Resource[] {
  return resources
    .filter(r => r.id !== resource.id && (r.categoryId === resource.categoryId || r.tags.some(t => resource.tags.includes(t))))
    .slice(0, limit);
}

export function filterResources(options: FilterOptions): Resource[] {
  let result = [...resources];

  if (options.category && options.category !== "all") {
    result = result.filter(r => r.categoryId === options.category || CATEGORIES.find(c => c.slug === options.category)?.id === r.categoryId);
  }

  if (options.subcategory && options.subcategory !== "all") {
    result = result.filter(r => r.subcategoryId === options.subcategory);
  }

  if (options.pricing && options.pricing.length > 0) {
    result = result.filter(r => options.pricing!.includes(r.pricingType));
  }

  if (options.license && options.license.length > 0) {
    result = result.filter(r => options.license!.includes(r.license));
  }

  if (options.platforms && options.platforms.length > 0) {
    result = result.filter(r => r.platforms.some(p => options.platforms!.includes(p)));
  }

  if (options.features && options.features.length > 0) {
    result = result.filter(r => options.features!.some(f => r.features.includes(f)));
  }

  if (options.tags && options.tags.length > 0) {
    result = result.filter(r => options.tags!.some(t => r.tags.map(x => x.toLowerCase()).includes(t.toLowerCase())));
  }

  if (options.verifiedOnly) {
    result = result.filter(r => r.verified);
  }

  if (options.openSourceOnly) {
    result = result.filter(r => r.pricingType === "open-source" || r.license === "open-source" || r.license === "mit" || r.license === "gpl" || r.license === "apache");
  }

  if (options.query && options.query.trim()) {
    const q = options.query.toLowerCase().trim();
    result = result.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.tagline.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)) ||
      r.features.some(f => f.toLowerCase().includes(q))
    );
  }

  // Sorting
  switch (options.sortBy) {
    case "popular":
      result.sort((a, b) => b.clickCount - a.clickCount);
      break;
    case "newest":
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "rating":
      result.sort((a, b) => b.communityRating - a.communityRating || b.reviewCount - a.reviewCount);
      break;
    case "az":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "trending":
      result.sort((a, b) => (b.clickCount + b.bookmarkCount * 2) - (a.clickCount + a.bookmarkCount * 2));
      break;
    case "relevance":
    default:
      // Keep natural or default sort
      break;
  }

  return result;
}

// Collections
export function getAllCollections(): Collection[] {
  return [...collections];
}

export function getCollectionBySlug(slug: string): (Collection & { resources: Resource[] }) | undefined {
  const col = collections.find(c => c.slug === slug || c.id === slug);
  if (!col) return undefined;
  const colResources = col.resourceIds.map(id => resources.find(r => r.id === id)).filter((r): r is Resource => !!r);
  return { ...col, resources: colResources };
}

// Changelog
export function getChangelog(): ChangelogItem[] {
  return [...changelog];
}

// Interactivity handlers
export function recordResourceClick(id: string) {
  const res = resources.find(r => r.id === id || r.slug === id);
  if (res) {
    res.clickCount += 1;
  }
}

export function recordResourceView(id: string) {
  const res = resources.find(r => r.id === id || r.slug === id);
  if (res) {
    res.viewCount += 1;
  }
}

export function voteResourceHelpful(id: string, isHelpful: boolean) {
  const res = resources.find(r => r.id === id || r.slug === id);
  if (res) {
    if (isHelpful) res.helpfulCount += 1;
    else res.unhelpfulCount += 1;
  }
}

// Submissions & Reports
export function getAllSubmissions(): Submission[] {
  return [...submissions];
}

export function createSubmission(sub: Omit<Submission, "id" | "status" | "createdAt">): Submission {
  const newSub: Submission = {
    ...sub,
    id: `sub-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  submissions.unshift(newSub);
  return newSub;
}

export function updateSubmissionStatus(id: string, status: Submission["status"], adminNote?: string): boolean {
  const sub = submissions.find(s => s.id === id);
  if (sub) {
    sub.status = status;
    if (adminNote !== undefined) sub.adminNote = adminNote;
    return true;
  }
  return false;
}

export function getAllReports(): Report[] {
  return [...reports];
}

export function createReport(report: Omit<Report, "id" | "status" | "createdAt">): Report {
  const newRep: Report = {
    ...report,
    id: `rep-${Date.now()}`,
    status: "open",
    createdAt: new Date().toISOString()
  };
  reports.unshift(newRep);
  return newRep;
}

export function updateReportStatus(id: string, status: Report["status"]): boolean {
  const rep = reports.find(r => r.id === id);
  if (rep) {
    rep.status = status;
    return true;
  }
  return false;
}

// Admin Resource Management
export function createResource(resData: Omit<Resource, "id" | "createdAt" | "updatedAt" | "lastVerifiedAt" | "viewCount" | "clickCount" | "bookmarkCount" | "helpfulCount" | "unhelpfulCount" | "reviewCount">): Resource {
  const now = new Date().toISOString();
  const slug = resData.slug || resData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const newRes: Resource = {
    ...resData,
    id: `res-${Date.now()}`,
    slug,
    viewCount: 0,
    clickCount: 0,
    bookmarkCount: 0,
    helpfulCount: 0,
    unhelpfulCount: 0,
    reviewCount: 1,
    createdAt: now,
    updatedAt: now,
    lastVerifiedAt: now,
  };
  resources.unshift(newRes);
  return newRes;
}

export function updateResource(id: string, updates: Partial<Resource>): Resource | undefined {
  const index = resources.findIndex(r => r.id === id || r.slug === id);
  if (index !== -1) {
    resources[index] = {
      ...resources[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return resources[index];
  }
  return undefined;
}

export function deleteResource(id: string): boolean {
  const initialLen = resources.length;
  resources = resources.filter(r => r.id !== id && r.slug !== id);
  return resources.length < initialLen;
}
