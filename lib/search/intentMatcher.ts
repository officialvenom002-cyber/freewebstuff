/**
 * FreeWebStuff Smart Intent & Multilingual Search Matcher
 * Understands natural language queries, Hinglish, Hindi, Spanish, 
 * action intents ("what it does"), and differentiates exact keyword searches.
 */

export interface TopicIntent {
  id: string;
  name: string;
  categories: string[];
  boxKeywords: string[];
  actionKeywords: string[];
  synonyms: string[];
}

export const TOPIC_INTENTS: TopicIntent[] = [
  {
    id: "movies-streaming",
    name: "Movies & Video Streaming",
    categories: ["video", "non-english"],
    boxKeywords: ["movie", "streaming", "anime", "cinema", "tv shows", "cartoon", "documentaries", "live tv"],
    actionKeywords: ["watch", "stream", "dekhna", "dekhne", "ver", "regarder", "kino"],
    synonyms: [
      // English
      "movie", "movies", "film", "films", "cinema", "stream", "streaming", "tv shows", "tv show", "series", "web series", 
      "anime", "cartoons", "cartoon", "dramas", "netflix", "ott", "watch online", "free movies", "free anime",
      // Hindi / Hinglish
      "film dekhna", "movie dekhna", "filme", "filmon", "cinema hall", "dekhna hai", "dekhne ke liye", 
      "kaha dekhe", "hindi dubbed", "south movie", "hollywood movie", "bollywood", "web series hindi", "natak",
      // Spanish / French / German / Russian
      "pelicula", "peliculas", "pelis", "cine", "regarder", "kino", "kinozal", "filme kostenlos", "ver peliculas"
    ]
  },
  {
    id: "video-download",
    name: "Video & YouTube Downloaders",
    categories: ["downloading", "video-tools"],
    boxKeywords: ["video downloaders", "youtube downloaders", "media downloaders", "yt-dlp", "cobalt"],
    actionKeywords: ["download", "save", "rip", "extract", "convert video"],
    synonyms: [
      // English
      "download video", "video download", "youtube download", "yt download", "video downloader", "save video", 
      "insta download", "instagram reel download", "reel download", "tiktok download", "cobalt", "yt-dlp", 
      "video grabber", "extract video",
      // Hindi / Hinglish
      "video download kaise kare", "video download karna", "video download karne ke liye", "video save karna",
      "youtube se video kaise nikale", "reel kaise download kare", "gana video download",
      // Multilingual
      "telecharger video", "descargar video", "видео скачать"
    ]
  },
  {
    id: "photo-editing",
    name: "Photo & Image Editing",
    categories: ["image-tools"],
    boxKeywords: ["image editing", "photo editors", "background removal", "upscalers", "graphic design", "vectors", "icons"],
    actionKeywords: ["edit photo", "remove background", "upscale", "enhance", "crop", "resize"],
    synonyms: [
      // English
      "photo edit", "photo editing", "image editor", "image editing", "remove background", "background remover", 
      "upscale photo", "image upscale", "photopea", "photoshop free", "graphic design", "vector", "canva alternative",
      // Hindi / Hinglish
      "photo banana", "photo kaise banaye", "photo edit karna", "photo editing karne ke liye", "photo ka background hatana", 
      "tasveer", "photo saaf karna", "photo hd karna", "background kaise hataye",
      // Multilingual
      "editar fotos", "quitar fondo", "retouche photo", "редактировать фото"
    ]
  },
  {
    id: "audio-music",
    name: "Music & Audio Tools",
    categories: ["audio"],
    boxKeywords: ["music streaming", "spotify tools", "audio editors", "vocal removers", "radio", "audiobooks"],
    actionKeywords: ["listen", "sunna", "stream music", "download song", "isolate vocals", "convert mp3"],
    synonyms: [
      // English
      "music", "songs", "song", "audio", "mp3", "music streaming", "spotify", "vocal remover", "audio editor", 
      "sound effects", "flac", "free music", "podcast", "radio",
      // Hindi / Hinglish
      "gana", "gaana", "gana download", "geet", "gana sunna", "gana sunne ke liye", "music download", 
      "gana kaise download kare", "mp3 gana", "voice alag karna",
      // Multilingual
      "musica gratis", "chansons", "escuchar musica", "скачать музыку"
    ]
  },
  {
    id: "books-reading",
    name: "Books, Ebooks & Manga",
    categories: ["reading", "educational"],
    boxKeywords: ["books", "ebooks", "manga", "comics", "audiobooks", "newspapers", "magazines", "academic"],
    actionKeywords: ["read", "padhna", "study", "download book", "manga read"],
    synonyms: [
      // English
      "books", "book", "ebooks", "ebook", "manga", "comics", "comic", "novel", "novels", "audiobooks", 
      "free books", "pdf books", "z-library", "anna archive", "reading",
      // Hindi / Hinglish
      "kitab", "kitabein", "kitab download", "padhai", "padhai ke liye", "padhna", "pustak", "novel hindi", 
      "kahani", "notes", "ncert", "manga padhna",
      // Multilingual
      "libros gratis", "livres", "lire manga", "читать книги"
    ]
  },
  {
    id: "gaming",
    name: "Games & Emulation",
    categories: ["gaming", "gaming-tools"],
    boxKeywords: ["pc games", "repacks", "emulators", "roms", "game trainers", "mods", "free games"],
    actionKeywords: ["play", "khelna", "emulate", "download game", "crack game"],
    synonyms: [
      // English
      "game", "games", "pc games", "free games", "emulators", "emulator", "roms", "rom", "repacks", 
      "repack", "fitgirl", "steam", "switch emulator", "ps2 emulator", "retro games", "game trainer",
      // Hindi / Hinglish
      "khel", "khelna", "game download", "game kaise download kare", "pc me game", "android game", "khelne ke liye",
      // Multilingual
      "juegos gratis", "jeux gratuits", "скачать игры"
    ]
  },
  {
    id: "adblocking-privacy",
    name: "Adblocking & Privacy",
    categories: ["privacy"],
    boxKeywords: ["adblocking", "adblock filters", "dns adblocking", "antivirus", "privacy", "anti-tracker"],
    actionKeywords: ["block ads", "remove ads", "hide ads", "protect", "stop ads"],
    synonyms: [
      // English
      "adblock", "adblocker", "block ads", "remove ads", "youtube adblock", "popup blocker", "sponsorblock", 
      "skip sponsor", "ublock", "adguard", "anti tracker", "stop ads",
      // Hindi / Hinglish
      "ad band karna", "ads kaise band kare", "ad kaise hataye", "prachar band", "vigyapan rokna", "faltu ads band",
      // Multilingual
      "bloquear publicidad", "bloqueur pub", "блокировщик рекламы"
    ]
  },
  {
    id: "vpn-proxy",
    name: "VPN, Proxy & Unblock",
    categories: ["privacy", "internet-tools"],
    boxKeywords: ["vpn", "proxy", "tor", "dns", "secure browsers", "privacy guides"],
    actionKeywords: ["unblock", "hide ip", "bypass geo", "secure", "private browsing"],
    synonyms: [
      // English
      "vpn", "free vpn", "proxy", "proxies", "hide ip", "change ip", "unblock website", "bypass restriction", 
      "tor browser", "dns", "private browsing",
      // Hindi / Hinglish
      "block website kholna", "ip kaise badle", "website open nahi ho rahi", "bina vpn ke", "free proxy",
      // Multilingual
      "desbloquear sitios", "vpn gratuit", "разблокировать сайт"
    ]
  },
  {
    id: "paywall-bypass",
    name: "Paywall Bypass & Article Reading",
    categories: ["internet-tools", "privacy"],
    boxKeywords: ["bypass article paywalls", "paywall bypass", "read paywalled", "web archiving"],
    actionKeywords: ["bypass", "remove paywall", "read free", "unlock article"],
    synonyms: [
      // English
      "paywall", "bypass paywall", "remove paywall", "paywall bypass", "read paywalled", "unlock article", 
      "12ft", "ladder", "news paywall", "medium paywall", "archive today",
      // Hindi / Hinglish
      "paywall hatana", "paid article free me", "lock article kaise padhe", "article unlock"
    ]
  },
  {
    id: "coding-dev",
    name: "Coding & Developer Utilities",
    categories: ["developer-tools", "text-tools"],
    boxKeywords: ["code editors", "apis", "git", "github", "hosting", "regex", "json formatters", "css", "databases"],
    actionKeywords: ["code", "program", "develop", "test api", "format json", "debug"],
    synonyms: [
      // English
      "coding", "code", "programming", "developer", "dev tools", "code editor", "api", "github", "git", 
      "free hosting", "json formatter", "regex", "css generator", "learn to code",
      // Hindi / Hinglish
      "coding sikhna", "programming kaise kare", "code likhna", "developer tools", "website banana"
    ]
  },
  {
    id: "ai-tools",
    name: "Artificial Intelligence & Chatbots",
    categories: ["ai"],
    boxKeywords: ["ai chatbots", "image generation", "llms", "voice ai", "code ai", "prompting"],
    actionKeywords: ["generate", "chat", "create image", "write with ai", "transcribe"],
    synonyms: [
      // English
      "ai", "artificial intelligence", "chatgpt", "chatbot", "chat bot", "image generation", "ai writer", 
      "free ai", "midjourney alternative", "claude", "voice ai", "text to speech",
      // Hindi / Hinglish
      "ai tool", "chatgpt jaisa", "ai se photo banana", "ai se likhwana", "ai bot", "free ai tools"
    ]
  },
  {
    id: "pdf-office",
    name: "PDF & Document Utilities",
    categories: ["file-tools", "text-tools"],
    boxKeywords: ["pdf tools", "document converters", "compression", "ocr", "office suites"],
    actionKeywords: ["compress pdf", "merge pdf", "convert pdf", "edit pdf", "ocr"],
    synonyms: [
      // English
      "pdf", "pdf edit", "pdf editor", "compress pdf", "merge pdf", "pdf to word", "word to pdf", "convert pdf", 
      "office free", "excel alternative", "ocr", "extract text from image",
      // Hindi / Hinglish
      "pdf chota karna", "pdf kaise banaye", "pdf convert karna", "photo se text nikalna", "pdf jodna"
    ]
  },
  {
    id: "torrenting",
    name: "Torrenting & P2P",
    categories: ["torrenting"],
    boxKeywords: ["torrent clients", "trackers", "search engines", "qbittorrent", "magnets"],
    actionKeywords: ["torrent", "download torrent", "magnet link", "seed"],
    synonyms: [
      // English
      "torrent", "torrents", "torrenting", "qbittorrent", "magnet link", "torrent search", "trackers", "p2p",
      // Hindi / Hinglish
      "torrent download", "torrent se download kaise kare", "magnet link open karna"
    ]
  },
  {
    id: "mobile-mod",
    name: "Mobile & Android APKs",
    categories: ["mobile"],
    boxKeywords: ["android apks", "modded apps", "f-droid", "ios sideloading", "revanced"],
    actionKeywords: ["sideload", "mod apk", "install", "adfree mobile"],
    synonyms: [
      // English
      "apk", "mod apk", "android apps", "revanced", "youtube revanced", "f-droid", "ios sideload", "altstore", "mobile apps",
      // Hindi / Hinglish
      "mod app", "bina ads wala app", "apk download", "phone ke liye apps", "android mod"
    ]
  },
  {
    id: "system-pc",
    name: "System, Windows & PC Tools",
    categories: ["system-tools", "file-tools"],
    boxKeywords: ["windows activation", "debloat", "drivers", "os customization", "benchmarks", "unzip"],
    actionKeywords: ["clean pc", "activate windows", "speed up pc", "extract zip", "update driver"],
    synonyms: [
      // English
      "windows", "activate windows", "windows activation", "clean pc", "speed up pc", "debloat windows", 
      "7zip", "unzip", "driver update", "pc utility",
      // Hindi / Hinglish
      "computer fast karna", "laptop slow chal raha", "windows activate kaise kare", "pc safai"
    ]
  }
];

/**
 * Conversational / stop-word patterns that indicate general topic intent
 */
const CONVERSATIONAL_PATTERNS = [
  /\b(how\s+to|best|free|top|online|karna|karne|ke\s+liye|kaise|chahiye|hai|karo|batao|dekhna|sunna|padhna|khelna|download)\b/i,
  /\b(for|with|without|in|of|and|or|alternative|alternatives|gratis|kostenlos|gratuit)\b/i
];

export interface QueryAnalysis {
  rawQuery: string;
  normalizedQuery: string;
  isSpecificKeyword: boolean;
  matchedIntents: TopicIntent[];
  targetCategories: string[];
  expandedTerms: string[];
}

/**
 * Analyze any query and determine if it's an exact specific keyword or a broader intent/topic query.
 */
export function analyzeSearchQuery(query: string): QueryAnalysis {
  const raw = query.trim();
  const lower = raw.toLowerCase();

  // Clean punctuation
  const cleanTokens = lower.split(/[\s,+/_-]+/).filter(Boolean);

  const matchedIntents: TopicIntent[] = [];
  const targetCategories = new Set<string>();
  const expandedTerms = new Set<string>();

  // Check matching intents with scoring to pick the most accurate intent first
  const intentScores: { intent: TopicIntent; score: number }[] = [];

  for (const intent of TOPIC_INTENTS) {
    let score = 0;

    // Check direct category match
    if (intent.categories.some((c) => lower === c || cleanTokens.includes(c))) {
      score += 25;
    }

    // Check synonyms (higher score for longer, more specific multi-word phrases)
    for (const syn of intent.synonyms) {
      if (lower === syn) {
        score += 100;
        break;
      } else if (lower.includes(syn)) {
        score += Math.max(30, syn.length * 5);
        break;
      }
    }

    // Check action and box keywords
    for (const action of intent.actionKeywords) {
      if (lower.includes(action)) {
        score += 25;
        break;
      }
    }

    for (const kw of intent.boxKeywords) {
      const kwLower = kw.toLowerCase();
      if (lower.includes(kwLower)) {
        score += 25;
        break;
      } else if (cleanTokens.some((t) => t.length > 3 && kwLower === t)) {
        score += 15;
        break;
      }
    }

    if (score > 0) {
      intentScores.push({ intent, score });
    }
  }

  // Sort matched intents by highest relevance score
  intentScores.sort((a, b) => b.score - a.score);

  for (const item of intentScores) {
    matchedIntents.push(item.intent);
    item.intent.categories.forEach((c) => targetCategories.add(c));
    item.intent.boxKeywords.forEach((b) => expandedTerms.add(b.toLowerCase()));
    item.intent.actionKeywords.forEach((a) => expandedTerms.add(a.toLowerCase()));
  }

  // Determine if it is a specific keyword search:
  // 1. It's 1 or 2 words without conversational stop-words
  // 2. Or exact brand name (e.g. "photoshop", "canva", "vlc", "obs", "photopea", "qbittorrent")
  const hasConversationalWords = CONVERSATIONAL_PATTERNS.some(p => p.test(lower));
  const isSingleWord = cleanTokens.length === 1;

  // If user searched a single specific word that isn't purely a generic category name (e.g. "photoshop" vs "video"):
  const genericCategoryNames = new Set(["video", "audio", "games", "gaming", "books", "ai", "tools", "privacy", "vpn", "free"]);
  const isGenericCategoryWord = isSingleWord && genericCategoryNames.has(cleanTokens[0]);

  const isSpecificKeyword = (isSingleWord && !isGenericCategoryWord && !hasConversationalWords) ||
    (!hasConversationalWords && cleanTokens.length <= 2 && matchedIntents.length === 0);

  return {
    rawQuery: raw,
    normalizedQuery: lower,
    isSpecificKeyword,
    matchedIntents,
    targetCategories: Array.from(targetCategories),
    expandedTerms: Array.from(expandedTerms),
  };
}
