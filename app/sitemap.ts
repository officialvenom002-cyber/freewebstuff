import { MetadataRoute } from "next";
import { getAllCategories, getAllResources, getAllCollections } from "@/lib/db/store";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://freewebstuff.net";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/trending`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/new`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/submit`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/guidelines`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = getAllCategories().map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const resourcePages: MetadataRoute.Sitemap = getAllResources().map((res) => ({
    url: `${baseUrl}/resource/${res.slug}`,
    lastModified: new Date(res.updatedAt || res.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionPages: MetadataRoute.Sitemap = getAllCollections().map((col) => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticPages, ...categoryPages, ...resourcePages, ...collectionPages];
}
