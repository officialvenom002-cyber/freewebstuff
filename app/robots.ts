import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Well-behaved search engines - allow all public content, block admin + API
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/adminshobhit/",
          "/api/",
          "/api/admin/",
        ],
      },
      {
        // Block AI training scrapers and aggressive commercial SEO bots entirely
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "ClaudeBot",
          "Google-Extended",
          "Bytespider",
          "Applebot-Extended",
          "cohere-ai",
          "Diffbot",
          "PerplexityBot",
          "Omgilibot",
          "FacebookBot",
          "Amazonbot",
          "SemrushBot",
          "AhrefsBot",
          "PetalBot",
          "MJ12bot",
          "DotBot",
          "SeekportBot",
          "DataForSeoBot",
          "ZoominfoBot",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://freewebstuff.site/sitemap.xml",
  };
}
