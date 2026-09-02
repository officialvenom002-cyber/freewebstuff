import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Well-behaved crawlers — allow all public content, block admin + API
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/adminshobhit/",
          "/api/",       // Block all API routes from crawlers — saves serverless invocations
          "/api/admin/",
        ],
      },
      {
        // Block AI training scrapers entirely
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "Google-Extended",
          "Bytespider",
          "Applebot-Extended",
          "cohere-ai",
          "Diffbot",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://freewebstuff.site/sitemap.xml",
  };
}
