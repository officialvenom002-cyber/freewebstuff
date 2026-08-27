export type PricingType = "free" | "freemium" | "paid" | "free-trial" | "open-source";
export type LicenseType = "open-source" | "proprietary" | "creative-commons" | "mit" | "gpl" | "apache";
export type PlatformType = "web" | "windows" | "macos" | "linux" | "android" | "ios" | "browser-extension" | "cli";
export type SafetyStatus = "verified" | "needs-review" | "reported" | "pending";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type ReportStatus = "open" | "investigating" | "resolved" | "dismissed";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
  featured?: boolean;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Resource {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  url: string;
  logoUrl?: string;
  categoryId: string;
  subcategoryId?: string;
  pricingType: PricingType;
  pricingNote?: string;
  license: LicenseType;
  platforms: PlatformType[];
  tags: string[];
  features: string[];
  safetyStatus: SafetyStatus;
  verified: boolean;
  featured: boolean;
  editorsChoice?: boolean;
  communityRating: number; // 1.0 - 5.0
  reviewCount: number;
  helpfulCount: number;
  unhelpfulCount: number;
  viewCount: number;
  clickCount: number;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  featured: boolean;
  resourceIds: string[];
  createdAt: string;
}

export interface Submission {
  id: string;
  name: string;
  url: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  pricingType: PricingType;
  platforms: PlatformType[];
  tags: string[];
  reason: string;
  submitterEmail?: string;
  status: SubmissionStatus;
  adminNote?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  resourceId: string;
  resourceName: string;
  reason: "dead-link" | "malware" | "scam" | "misleading" | "wrong-category" | "duplicate" | "legal" | "other";
  details: string;
  reporterEmail?: string;
  status: ReportStatus;
  createdAt: string;
}

export interface ChangelogItem {
  id: string;
  date: string;
  version?: string;
  title: string;
  description: string;
  changes: {
    type: "added" | "improved" | "removed" | "fixed" | "security";
    text: string;
  }[];
}

export interface FilterOptions {
  query?: string;
  category?: string;
  subcategory?: string;
  pricing?: PricingType[];
  license?: LicenseType[];
  platforms?: PlatformType[];
  features?: string[];
  tags?: string[];
  verifiedOnly?: boolean;
  openSourceOnly?: boolean;
  sortBy?: "relevance" | "popular" | "newest" | "rating" | "az" | "trending";
}
