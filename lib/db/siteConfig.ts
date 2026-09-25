import fs from "fs";
import path from "path";

export interface CustomWebsite {
  id: string;
  boxSlug?: string;
  name: string;
  url: string;
  isStarred?: boolean;
}

export interface SiteCustomizations {
  categoryOrder: string[];
  deletedWebsites: string[]; // URLs of websites that have been cut/removed
  customWebsites: Record<string, CustomWebsite[]>; // categorySlug -> custom added websites
  lastUpdated: string;
}

const CONFIG_FILE = path.join(process.cwd(), "lib", "db", "siteCustomizations.json");

const DEFAULT_CATEGORY_ORDER = [
  "video",
  "audio",
  "gaming",
  "downloading",
  "iptv",
  "subtitles",
  "privacy",
  "ai",
  "reading",
  "torrenting",
  "educational",
  "mobile",
  "linux-macos",
  "non-english",
  "misc",
  "system-tools",
  "file-tools",
  "internet-tools",
  "social-media-tools",
  "text-tools",
  "gaming-tools",
  "image-tools",
  "video-tools",
  "developer-tools",
  "storage",
];

let memoryConfig: SiteCustomizations | null = null;

export function getSiteCustomizations(): SiteCustomizations {
  if (memoryConfig) {
    return memoryConfig;
  }

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf8");
      const parsed = JSON.parse(raw);
      memoryConfig = {
        categoryOrder: Array.isArray(parsed.categoryOrder) && parsed.categoryOrder.length > 0 ? parsed.categoryOrder : DEFAULT_CATEGORY_ORDER,
        deletedWebsites: Array.isArray(parsed.deletedWebsites) ? parsed.deletedWebsites : [],
        customWebsites: parsed.customWebsites || {},
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      };
      return memoryConfig;
    }
  } catch (e) {
    console.error("Failed to read siteCustomizations.json:", e);
  }

  memoryConfig = {
    categoryOrder: DEFAULT_CATEGORY_ORDER,
    deletedWebsites: [],
    customWebsites: {},
    lastUpdated: new Date().toISOString(),
  };

  return memoryConfig;
}

export function saveSiteCustomizations(config: Partial<SiteCustomizations>): SiteCustomizations {
  const current = getSiteCustomizations();
  const updated: SiteCustomizations = {
    ...current,
    ...config,
    lastUpdated: new Date().toISOString(),
  };

  memoryConfig = updated;

  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to write siteCustomizations.json:", e);
  }

  return updated;
}

/**
 * Reorders categories by providing an array of category slugs or IDs.
 */
export function updateCategoryOrder(newOrder: string[]): SiteCustomizations {
  return saveSiteCustomizations({ categoryOrder: newOrder });
}

/**
 * Cuts/removes a website by URL.
 */
export function removeWebsiteByUrl(url: string): SiteCustomizations {
  const current = getSiteCustomizations();
  const normalized = url.trim();
  const set = new Set(current.deletedWebsites);
  set.add(normalized);
  const trimmed = normalized.replace(/\/+$/, "");
  set.add(trimmed);
  set.add(trimmed + "/");

  // Also remove from any custom added websites
  const custom = { ...current.customWebsites };
  for (const cat of Object.keys(custom)) {
    custom[cat] = custom[cat].filter((w) => w.url !== normalized && w.url !== trimmed);
  }

  return saveSiteCustomizations({
    deletedWebsites: Array.from(set),
    customWebsites: custom,
  });
}

/**
 * Restores a previously removed website by URL.
 */
export function restoreWebsiteByUrl(url: string): SiteCustomizations {
  const current = getSiteCustomizations();
  const normalized = url.trim();
  const trimmed = normalized.replace(/\/+$/, "");
  const filtered = current.deletedWebsites.filter(
    (u) => u !== normalized && u !== trimmed && u !== trimmed + "/"
  );

  return saveSiteCustomizations({ deletedWebsites: filtered });
}

/**
 * Adds a new website to a category.
 */
export function addWebsiteToCategory(
  categorySlug: string,
  boxSlug: string,
  site: { name: string; url: string; isStarred?: boolean }
): SiteCustomizations {
  const current = getSiteCustomizations();
  const custom = { ...current.customWebsites };
  const list = custom[categorySlug] ? [...custom[categorySlug]] : [];

  const newSite: CustomWebsite = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    boxSlug,
    name: site.name.trim(),
    url: site.url.trim(),
    isStarred: Boolean(site.isStarred),
  };

  list.push(newSite);
  custom[categorySlug] = list;

  // Ensure it's not in deletedWebsites
  const deleted = current.deletedWebsites.filter(
    (u) => u !== site.url.trim() && u !== site.url.trim().replace(/\/+$/, "")
  );

  return saveSiteCustomizations({
    customWebsites: custom,
    deletedWebsites: deleted,
  });
}
