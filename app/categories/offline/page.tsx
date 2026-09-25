import React from "react";
import OfflineDirectoryClient from "./OfflineDirectoryClient";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Offline & Inactive Websites Directory 2026 — FreeWebStuff",
  description: "Real-time automated registry of websites, tools, and resources that are currently offline, unreachable, or dead across all 23 categories.",
  alternates: {
    canonical: "https://freewebstuff.site/categories/offline",
  },
};

interface PrecomputedBoxWebsite {
  id: string;
  name: string;
  url: string;
  isStarred?: boolean;
}

interface PrecomputedBox {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  websites: PrecomputedBoxWebsite[];
}

interface PrecomputedCategory {
  id: string;
  slug: string;
  name: string;
  boxes: PrecomputedBox[];
}

interface SiteHealthItem {
  status: "up" | "down";
  httpStatus?: number;
  latency?: number;
  updatedUrl?: string;
  checkedAt?: number;
}

export interface OfflineSiteRecord {
  id: string;
  name: string;
  url: string;
  categoryName: string;
  categorySlug: string;
  boxTitle: string;
  status: "down";
  httpStatus?: number;
  latency?: number;
  checkedAt?: number;
}

function loadAllOfflineSites(): { offlineSites: OfflineSiteRecord[]; stats: { totalTracked: number; totalOffline: number; totalUp: number } } {
  try {
    const healthPath = path.join(process.cwd(), "public", "data", "site-health.json");
    const boxesPath = path.join(process.cwd(), "public", "data", "all-categories-boxes.json");

    if (!fs.existsSync(healthPath) || !fs.existsSync(boxesPath)) {
      return { offlineSites: [], stats: { totalTracked: 0, totalOffline: 0, totalUp: 0 } };
    }

    const healthData = JSON.parse(fs.readFileSync(healthPath, "utf8")) as {
      stats?: { up: number; down: number; shifted: number };
      sites?: Record<string, SiteHealthItem>;
    };

    const categoriesData = JSON.parse(fs.readFileSync(boxesPath, "utf8")) as Record<string, PrecomputedCategory>;

    const healthSites = healthData.sites || {};
    const offlineSites: OfflineSiteRecord[] = [];

    // Map each down site to its category and box
    for (const [catSlug, cat] of Object.entries(categoriesData)) {
      for (const box of cat.boxes || []) {
        for (const site of box.websites || []) {
          const clean = site.url.replace(/\/+$/, "");
          const health = healthSites[site.url] || healthSites[clean] || healthSites[clean + "/"];
          if (health?.status === "down") {
            offlineSites.push({
              id: site.id,
              name: site.name,
              url: site.url,
              categoryName: cat.name,
              categorySlug: cat.slug || catSlug,
              boxTitle: box.title,
              status: "down",
              httpStatus: health.httpStatus,
              latency: health.latency,
              checkedAt: health.checkedAt,
            });
          }
        }
      }
    }

    const totalOffline = offlineSites.length;
    const totalTracked = Object.keys(healthSites).length;
    const totalUp = Math.max(0, totalTracked - totalOffline);

    return {
      offlineSites,
      stats: {
        totalTracked,
        totalOffline,
        totalUp,
      },
    };
  } catch {
    return { offlineSites: [], stats: { totalTracked: 0, totalOffline: 0, totalUp: 0 } };
  }
}

export default function OfflineCategoryPage() {
  const { offlineSites, stats } = loadAllOfflineSites();

  return <OfflineDirectoryClient initialSites={offlineSites} stats={stats} />;
}
