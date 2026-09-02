import { Resource, Category, Collection } from "../types";

export interface CategorySectionItem {
  id: string;
  name: string;
  url: string;
}

export interface CategoryBoxItem {
  id: string;
  title: string;
  websites: Array<{ name: string; url: string }>;
}

// ── Global Site Keywords (High-Volume Search Queries) ───────────────
export const GLOBAL_SEO_KEYWORDS = [
  "free internet stuff",
  "freewebstuff",
  "free web stuff",
  "fmhy directory",
  "freemediaheckyeah",
  "free tools directory",
  "best free software",
  "open source software",
  "curated web directory",
  "free movie streaming sites",
  "free anime streaming",
  "watch movies online free",
  "free tv shows",
  "hindi movies download",
  "bollywood movies free",
  "free adblockers",
  "ublock origin",
  "privacy tools",
  "free ai tools",
  "chatgpt alternatives",
  "free games download",
  "game repacks",
  "free ebooks download",
  "pdf search engine",
  "torrent sites 2026",
  "direct download sites",
  "developer tools free",
  "open source alternatives",
  "free courses online",
  "foss android apps",
  "safe download sites",
  "free streaming sites"
];

// ── Category Specific Keywords (Targeting Long-tail & High Intent) ──
export const CATEGORY_KEYWORDS_MAP: Record<string, string[]> = {
  "video": [
    "free movie streaming sites", "watch movies online free", "free tv shows streaming",
    "hindi movies free download", "bollywood movies streaming", "anime english sub and dub",
    "hindi dubbed anime online", "live sports streaming free", "free cricket live streaming",
    "watch cartoons online free", "4k movie direct download", "yts movies", "cineby",
    "flixer", "hianime", "vegamovies", "asian drama free", "k drama streaming free",
    "free series streaming", "stream movies without sign up", "best free movie sites 2026"
  ],
  "privacy": [
    "best adblockers 2026", "ublock origin setup", "free adblock for chrome", "dns adblocking",
    "nextdns free", "adguard dns", "free vpn no logs", "temporary email generator",
    "open source password manager", "bitwarden free", "private search engine",
    "browser anti tracking", "cookie blocker extension", "privacy hardening guide",
    "librewolf", "brave browser privacy", "bypass paywalls clean"
  ],
  "ai": [
    "free ai tools directory", "best free llm models", "free chatgpt alternatives",
    "google ai studio free", "claude ai free", "uncensored ai chat", "local ai frontends",
    "jan ai", "ollama models free", "free ai image generator", "stable diffusion free online",
    "ai voice generator free", "ai code assistant free", "ai productivity tools", "notebooklm free"
  ],
  "audio": [
    "free music streaming sites", "spotify alternatives free", "youtube music web player free",
    "download flac music free", "free mp3 downloader", "lossless music streaming",
    "free web radio stations", "free podcast player online", "royalty free music download",
    "free audio editors online", "music production free vst plugins"
  ],
  "gaming": [
    "free pc games download", "trusted game repacks", "fitgirl repacks official",
    "dodi repacks", "retro game emulators online", "roms download free",
    "nintendo switch emulator pc", "rpcs3 ps3 emulator", "free abandonware games",
    "steam free games tracker", "game mods download free", "indie games free"
  ],
  "reading": [
    "free ebooks download pdf", "free epub books online", "open library free books",
    "project gutenberg books", "read manga online free", "free comics online reader",
    "free audiobooks online", "ebook search engine", "anna's archive", "libgen book search",
    "calibre web reader", "scientific papers free sci hub"
  ],
  "torrenting": [
    "best torrent sites 2026", "safe torrent search engines", "1337x proxy",
    "rutracker free", "qbittorrent best setup", "open source torrent clients",
    "free p2p file sharing", "verified torrent trackers", "magnet link search engine"
  ],
  "downloading": [
    "free direct download sites", "best debrid services", "fast file downloader",
    "youtube video downloader free", "cobalt downloader", "yt-dlp gui",
    "free software download sites", "foss programs directory", "freeware download"
  ],
  "developer-tools": [
    "free web hosting platforms", "free database tier", "free api testing tools",
    "open source developer tools", "free git hosting", "css tools free",
    "json formatter online", "free icon libraries", "free dev APIs", "free dev learning"
  ],
  "educational": [
    "free online courses with certificates", "learn programming free", "mit opencourseware free",
    "free textbooks pdf download", "free university lectures", "learn math online free",
    "science educational resources", "free coding tutorials", "the odin project"
  ],
  "mobile": [
    "free android apk download", "revanced manager official", "f-droid best apps",
    "open source android apps", "ios sideloading altstore", "ad-free youtube android",
    "foss mobile tools", "obtainium app updater"
  ],
  "linux-macos": [
    "best linux distributions", "linux apps directory", "macos free open source apps",
    "cli cheat sheets", "terminal tools linux", "linux software sites", "foss mac apps"
  ],
  "system-tools": [
    "windows 11 debloat tools", "pc optimization software free", "free disk cleaner",
    "uninstaller software free", "driver update free", "hardware monitoring tools",
    "task automation tools"
  ],
  "storage": [
    "free cloud storage", "free file hosting without limits", "fast temporary file host",
    "free pastebin services", "encrypted cloud storage free", "free file transfer tools"
  ]
};

// ── Category Frequently Asked Questions (FAQPage Schema) ─────────────
export const CATEGORY_FAQ_MAP: Record<string, Array<{ question: string; answer: string }>> = {
  "video": [
    {
      question: "Are the movie and TV streaming sites on FreeWebStuff completely free?",
      answer: "Yes, all sites listed in our Video directory offer free access to stream or download movies, TV shows, anime, cartoons, and live sports without requiring subscriptions."
    },
    {
      question: "Do I need an adblocker when using free movie and streaming sites?",
      answer: "We strongly recommend using uBlock Origin or Brave Browser with ad-shield enabled to protect against aggressive popups, redirect ads, and unwanted tracking scripts."
    },
    {
      question: "What are the best sites for watch movies in English and Hindi?",
      answer: "For English movies and TV shows, top picks include Cineby, Flixer, Movy, and Moovie. For Bollywood and Hindi dubbed content, VegaMovies, BollyFlix, and DesiCinemas are highly recommended."
    },
    {
      question: "Where can I stream anime with English subtitles and Hindi dubs?",
      answer: "HiAnime, AniWatch, and AnimePahe provide high-quality English sub/dub streaming. For Hindi dubbed anime, AnimeTM and RareToonsIndia offer dedicated Hindi audio anime episodes."
    }
  ],
  "privacy": [
    {
      question: "What is the single most effective adblocker recommended by FreeWebStuff?",
      answer: "uBlock Origin is the gold standard for adblocking. It is completely open-source, lightweight, and blocks tracking domains, crypto-miners, and aggressive video ads across all browsers."
    },
    {
      question: "What is DNS adblocking and how does it protect my devices?",
      answer: "DNS adblocking (like NextDNS or AdGuard DNS) filters malicious domains and ad networks before they reach your device, effectively blocking ads inside apps, smart TVs, and mobile games."
    },
    {
      question: "Are free VPNs safe to use for browsing privacy?",
      answer: "Most free VPNs log user data or show ads. We only recommend audited, zero-log providers that offer legitimate free tiers, such as ProtonVPN."
    }
  ],
  "ai": [
    {
      question: "Can I use advanced AI models and chatbots completely for free?",
      answer: "Yes. Google AI Studio provides free access to Gemini 1.5 Pro and Flash with high rate limits. Platforms like Together.ai, NVIDIA NIM, and Hugging Face offer access to open-source models like Llama 3, Qwen, and Mistral."
    },
    {
      question: "What are the best local AI frontends to run models on my own computer?",
      answer: "Jan, LM Studio, Ollama, and LibreChat are top-tier open-source frontends that allow you to download and run AI models 100% locally on your PC with full privacy and zero internet required."
    }
  ],
  "gaming": [
    {
      question: "Are the game download sites on FreeWebStuff safe from malware?",
      answer: "The curated gaming section lists only vetted, community-trusted repackers and direct download sites like FitGirl Repacks, KaOsKrew, and SteamGG. We advise scanning every download with VirusTotal."
    },
    {
      question: "What emulators are recommended for playing console games on PC?",
      answer: "Popular verified emulators include RPCS3 for PS3, PCSX2 for PS2, Dolphin for GameCube/Wii, Ryujinx for Switch, and RetroArch for multi-console classic retro games."
    }
  ],
  "reading": [
    {
      question: "Where can I find and download free textbooks, books, and scientific papers?",
      answer: "Anna's Archive, Open Library, Project Gutenberg, and Sci-Hub provide millions of free public domain, academic, and research books in PDF, EPUB, and MOBI formats."
    },
    {
      question: "What are the best free ebook readers for Windows, Mac, and mobile?",
      answer: "Foliate (Linux), Calibre (Windows/macOS), and Aquile Reader (Windows) are outstanding free and open-source applications for reading and organizing your digital library."
    }
  ]
};

// ── WebSite Structured Data (Root JSON-LD) ───────────────────────────
export function generateWebSiteSchema(baseUrl = "https://freewebstuff.site") {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "FreeWebStuff",
        alternateName: [
          "Free Web Stuff",
          "FreeWebStuff.site",
          "FMHY Curated Directory",
          "FreeInternetStuff",
          "FreeMediaHeckYeah Index",
          "Best Free Web Tools Directory"
        ],
        description:
          "Discover 20,000+ curated free tools, open-source software, AI assistants, streaming websites, books, dev APIs, and utilities. Fast, community-verified directory without clutter.",
        inLanguage: "en-US",
        publisher: {
          "@id": `${baseUrl}/#organization`
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "FreeWebStuff",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          "@id": `${baseUrl}/#logo`,
          url: `${baseUrl}/favicon.png`,
          contentUrl: `${baseUrl}/favicon.png`,
          width: 512,
          height: 512,
          caption: "FreeWebStuff Logo"
        },
        image: {
          "@id": `${baseUrl}/#logo`
        },
        sameAs: [
          "https://t.me/+N7tYaUKT2q44NGU1",
          "https://discord.gg/mHpBcYJHM",
          "https://github.com/officialvenom002-cyber/freewebstuff"
        ],
        knowsAbout: [
          "Adblocking and Online Privacy",
          "Free Movie and TV Show Streaming",
          "Free Anime Streaming Sub and Dub",
          "Open Source Software and FOSS",
          "Artificial Intelligence and LLM Models",
          "Free PC Games and Video Game Emulation",
          "Digital Books, Manga, and Audiobooks",
          "Torrent Trackers and Direct Downloads",
          "Developer Tools, APIs, and Free Web Hosting",
          "Android APKs and iOS Sideloading"
        ]
      }
    ]
  };
}

// ── Category Structured Data (Category Page JSON-LD) ─────────────────
export function generateCategorySchema(
  category: Category,
  boxes: CategoryBoxItem[] = [],
  baseUrl = "https://freewebstuff.site"
) {
  const categoryKeywords = CATEGORY_KEYWORDS_MAP[category.slug] || GLOBAL_SEO_KEYWORDS.slice(0, 15);
  const faqs = CATEGORY_FAQ_MAP[category.slug] || [
    {
      question: `Are all resources in the ${category.name} directory free?`,
      answer: `Yes, every tool and website in the FreeWebStuff ${category.name} index is verified as free to use, open-source, or offers a generous free tier.`
    },
    {
      question: `How frequently is the FreeWebStuff ${category.name} list updated?`,
      answer: `Our team and community review links daily to replace dead mirrors, remove degraded services, and add newly discovered tools.`
    }
  ];

  // Compile top 30 prominent website items across boxes for ItemList
  const allWebsites: Array<{ name: string; url: string }> = [];
  boxes.forEach((box) => {
    box.websites.forEach((site) => {
      if (site.url && site.url !== "#" && allWebsites.length < 35) {
        allWebsites.push({ name: site.name, url: site.url });
      }
    });
  });

  const graph: any[] = [
    // 1. CollectionPage / DataCatalog
    {
      "@type": ["CollectionPage", "DataCatalog"],
      "@id": `${baseUrl}/categories/${category.slug}#webpage`,
      url: `${baseUrl}/categories/${category.slug}`,
      name: `${category.name} Directory — Best Free Websites, Tools & Resources`,
      headline: `Explore Verified Free ${category.name} Sites & Tools`,
      description: `${category.description} Curated index indexing ${allWebsites.length > 0 ? allWebsites.length + "+" : "hundreds of"} verified tools and community recommendations.`,
      inLanguage: "en-US",
      keywords: categoryKeywords.join(", "),
      isPartOf: {
        "@id": `${baseUrl}/#website`
      },
      about: {
        "@type": "Thing",
        name: category.name,
        description: category.description
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: allWebsites.length,
        itemListElement: allWebsites.map((site, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: site.name,
          url: site.url
        }))
      }
    },

    // 2. BreadcrumbList Schema
    {
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/categories/${category.slug}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Categories",
          item: `${baseUrl}/categories`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category.name,
          item: `${baseUrl}/categories/${category.slug}`
        }
      ]
    },

    // 3. FAQPage Schema for Rich Snippets on SERP
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}/categories/${category.slug}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    }
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

// ── Resource Structured Data ─────────────────────────────────────────
export function generateResourceSchema(resource: Resource, baseUrl = "https://freewebstuff.site") {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: resource.name,
    headline: resource.tagline,
    description: resource.description,
    url: `${baseUrl}/resource/${resource.slug}`,
    sameAs: resource.url,
    applicationCategory: resource.categoryId,
    operatingSystem: resource.platforms.join(", "),
    offers: {
      "@type": "Offer",
      price: resource.pricingType === "free" || resource.pricingType === "open-source" ? "0" : undefined,
      priceCurrency: "USD",
      category: resource.pricingType,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: resource.communityRating || "5.0",
      ratingCount: resource.reviewCount || 42,
      bestRating: "5",
      worstRating: "1",
    },
  };
}

// ── Collection Structured Data ───────────────────────────────────────
export function generateCollectionSchema(collection: Collection, resources: Resource[], baseUrl = "https://freewebstuff.site") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    description: collection.description,
    url: `${baseUrl}/collections/${collection.slug}`,
    numberOfItems: resources.length,
    itemListElement: resources.map((res, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: res.name,
      url: `${baseUrl}/resource/${res.slug}`,
    })),
  };
}
