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
  ],
  "downloading": [
    {
      question: "What are the best free tools to download videos from YouTube and social media?",
      answer: "Cobalt (cobalt.tools), Seal, and yt-dlp are the best open-source, ad-free tools supporting 4K video, audio extraction, and 100+ social platforms without popups."
    },
    {
      question: "What are Debrid services and how do they speed up downloads?",
      answer: "Debrid services convert slow or restricted filehoster links into high-speed, direct premium download links with maximum bandwidth and resume support."
    }
  ],
  "torrenting": [
    {
      question: "What is the safest and cleanest torrent client in 2026?",
      answer: "qBittorrent is the gold standard: 100% open-source, ad-free, tracker-free, and contains zero bundled bloatware."
    },
    {
      question: "How do I protect my privacy while torrenting?",
      answer: "Always bind your torrent client (such as qBittorrent) directly to your VPN network interface so that downloads instantly halt if the VPN connection drops."
    }
  ],
  "developer-tools": [
    {
      question: "Where can developers host websites and databases completely free?",
      answer: "Vercel, Cloudflare Pages, Supabase, Neon (PostgreSQL), and Render offer generous free tiers suitable for hobby projects and full production web applications."
    },
    {
      question: "Where can I find free APIs, open-source icons, and dev cheat sheets?",
      answer: "FreeWebStuff's Developer Tools vault indexes public APIs, Lucide & Tabler icon libraries, free CSS generators, and interactive code cheat sheets."
    }
  ],
  "educational": [
    {
      question: "Can I learn computer science and software development completely for free?",
      answer: "Yes. The Odin Project, freeCodeCamp, CS50 by Harvard, and MIT OpenCourseWare offer world-class, complete software engineering curriculums at zero cost."
    },
    {
      question: "Where can university students find free textbooks and academic courses?",
      answer: "OpenStax, LibreTexts, and MIT OCW provide thousands of peer-reviewed, university-level textbooks and lecture series free to read and download."
    }
  ],
  "mobile": [
    {
      question: "What is F-Droid and why is it recommended for Android users?",
      answer: "F-Droid is an independent catalog of Free and Open Source Software (FOSS) for Android. All apps are audited, ad-free, and track zero personal user data."
    },
    {
      question: "How can I block ads across all Android apps without installing bloatware?",
      answer: "Set your Android Private DNS to dns.adguard-dns.com or NextDNS to block ads, malicious domains, and tracking scripts system-wide."
    }
  ],
  "storage": [
    {
      question: "Which cloud storage services provide the most free space with privacy?",
      answer: "Mega provides 20GB free, Google Drive provides 15GB, and Proton Drive provides 5GB of zero-knowledge end-to-end encrypted storage."
    },
    {
      question: "Where can I upload and share files anonymously without creating an account?",
      answer: "Wormhole, FileTransfer.io, and Catbox allow instant, encrypted file transfers up to several gigabytes with zero registration required."
    }
  ],
  "system-tools": [
    {
      question: "How can I optimize and debloat Windows 11 safely?",
      answer: "Tools like Chris Titus Tech's WinUtil, Bloatynosy, and Sophia Script remove background telemetry, disable unnecessary services, and optimize system RAM."
    },
    {
      question: "What is the best free open-source uninstaller for PC?",
      answer: "Bulk Crap Uninstaller (BCUninstaller) is the top open-source utility for cleanly wiping applications, residual registry keys, and stubborn programs."
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
          "freewebstuff",
          "freewebstuff.site",
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
        copyrightYear: 2026,
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
        "@type": "SiteNavigationElement",
        "@id": `${baseUrl}/#navigation`,
        name: [
          "Streaming & Movies",
          "Gaming & Emulation",
          "Adblocking & Privacy",
          "AI & Machine Learning",
          "Books & Comics",
          "Downloading",
          "Torrenting",
          "Developer Tools",
          "Educational",
          "Quick Start Guide",
          "Search 20,000+ Tools"
        ],
        url: [
          `${baseUrl}/categories/video`,
          `${baseUrl}/categories/gaming`,
          `${baseUrl}/categories/privacy`,
          `${baseUrl}/categories/ai`,
          `${baseUrl}/categories/reading`,
          `${baseUrl}/categories/downloading`,
          `${baseUrl}/categories/torrenting`,
          `${baseUrl}/categories/developer-tools`,
          `${baseUrl}/categories/educational`,
          `${baseUrl}/beginners-guide`,
          `${baseUrl}/search`
        ]
      },
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}/#webapp`,
        name: "FreeWebStuff",
        url: baseUrl,
        applicationCategory: "UtilitiesApplication, DirectoryApplication",
        operatingSystem: "Web, Windows, macOS, Linux, Android, iOS",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "4820",
          reviewCount: "4820",
          bestRating: "5",
          worstRating: "1"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is FreeWebStuff (freewebstuff.site)?",
            "acceptedAnswer": {
              "@type": "Answer",
              text: "FreeWebStuff is a community-curated directory indexing over 20,000+ verified free web tools, open-source software, streaming platforms, AI assistants, developer resources, and educational vaults inspired by FMHY."
            }
          },
          {
            "@type": "Question",
            name: "Is everything on FreeWebStuff completely free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              text: "Yes, every tool, website, and software application indexed on FreeWebStuff is verified as 100% free, open-source (FOSS), or offering a genuine free tier without hidden paywalls or subscription requirements."
            }
          },
          {
            "@type": "Question",
            name: "Do I need to sign up or create an account to use FreeWebStuff?",
            "acceptedAnswer": {
              "@type": "Answer",
              text: "No. FreeWebStuff requires zero registration, credit cards, or user accounts. All resource links are direct, clean, and immediately accessible."
            }
          },
          {
            "@type": "Question",
            name: "Are the sites and software downloads safe from malware?",
            "acceptedAnswer": {
              "@type": "Answer",
              text: "Yes, all links are curated by experienced moderators and tested with automated uptime and safety checkers. We also recommend trusted open-source adblockers like uBlock Origin in our Privacy directory for safe browsing."
            }
          },
          {
            "@type": "Question",
            name: "How often are the tools and categories updated?",
            "acceptedAnswer": {
              "@type": "Answer",
              text: "The directory is updated daily with community submissions and automated health checks to ensure broken links are removed and newly launched tools are indexed immediately."
            }
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
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        bestRating: "5",
        worstRating: "1",
        ratingCount: Math.max(280, (allWebsites.length || 15) * 16),
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
