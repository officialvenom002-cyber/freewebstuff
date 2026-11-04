/**
 * FreeWebStuff Autonomous Category Match & Hygiene Filter System
 *
 * Automatically verifies whether a website matches its assigned category.
 * Hides non-matching websites, auxiliary noise (Discord/GitHub/Mirrors/etc.),
 * and dead/mismatched links after FMHY sync or during runtime display.
 */

export interface WebsiteItem {
  id: string;
  name: string;
  url: string;
  isStarred?: boolean;
}

// Auxiliary words, numeric counters, and noise names that should NEVER appear as standalone website items
export const AUXILIARY_JUNK_NAMES = new Set([
  "discord", "github", "reddit", "twitter", "x", "telegram", "wiki", "guide", "docs",
  "documentation", "mirror", "mirrors", "backup", "apk", "ios", "android", "grading",
  "status", "web", "app", "source", "client", "code", "script", "userscript", "addon",
  "extension", "firefox", "chrome", "changelog", "discussion", "discussions", "issues",
  "faq", "support", "download", "download guide", "ratings", "fix", "tutorial", "video guide",
  "demo", "subreddit", "presets", "themes", "redirect bypass", "translator", "gitlab",
  "ports", "bookmarklet", "cli", "uploader", "lite version", "note", "whitelist note",
  "plugins", "config", "telegram bot", "bot", "proxy", "basement",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
]);

// URL patterns that represent auxiliary community channels or mirrors rather than actual category tools
export const AUXILIARY_URL_PATTERNS = [
  /^https?:\/\/(?:www\.)?discord\.(?:gg|com\/invite)\//i,
  /^https?:\/\/(?:www\.)?t\.me\/(?:\+|joinchat\/|[a-zA-Z0-9_]+(?:\?start=)?)/i,
  /^https?:\/\/(?:www\.)?twitter\.com\//i,
  /^https?:\/\/(?:www\.)?x\.com\//i,
  /^https?:\/\/(?:www\.)?reddit\.com\/r\/[^\/]+\/?$/i,
  /^https?:\/\/(?:www\.)?github\.com\/[^\/]+\/[^\/]+\/(?:issues|discussions|wiki|pulls|releases\/tag)/i,
];

// Negative category domain patterns (websites that explicitly belong to other categories and clash)
const CATEGORY_DISALLOWED_PATTERNS: Record<string, RegExp[]> = {
  video: [
    /torrent.*client|qbittorrent|transmission-bt|deluge-torrent/i,
    /audio-editor|audacity|sound-recorder/i,
  ],
  audio: [
    /video-editor|davinci-resolve|handbrake|ffmpeg-gui/i,
    /movie-streaming|vegamovies|hianime|123movies/i,
  ],
  privacy: [
    /movie-download|anime-stream|repack-games/i,
  ],
  gaming: [
    /video-converter|audio-transcriber|subtitle-downloader/i,
  ],
  ai: [
    /torrent-tracker|movie-indexer|direct-download-movies/i,
  ],
};

/**
 * Checks if an entry is a legitimate standalone website/tool for the category.
 */
export function isValidCategoryWebsite(
  site: WebsiteItem,
  categorySlug: string,
  boxTitle?: string
): boolean {
  if (!site || !site.name || !site.url) return false;

  const rawName = site.name.trim();
  const lowerName = rawName.toLowerCase();
  const rawUrl = site.url.trim();

  // 1. Must be a valid HTTP/HTTPS URL
  if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
    return false;
  }

  // 2. Filter out pure auxiliary labels & numbers (e.g. "Discord", "2", "3", "GitHub", "Status")
  if (AUXILIARY_JUNK_NAMES.has(lowerName)) {
    return false;
  }

  // 3. Name length check
  if (rawName.length < 2 || rawName.length > 55) {
    return false;
  }

  // 4. Must not start with URL protocols or markdown anchors
  if (/^(https?:\/\/|\/|#|www\.)/i.test(rawName)) {
    return false;
  }

  // 5. Must not start with generic action/guide prefixes
  if (/^(guide|how to|tutorial|installation|note|notice|whitelist):/i.test(lowerName)) {
    return false;
  }

  // 6. Filter out pure social media / chat invites masquerading as website tools
  for (const pattern of AUXILIARY_URL_PATTERNS) {
    if (pattern.test(rawUrl)) {
      return false;
    }
  }

  // 7. Check category-specific mismatch patterns
  const disallowed = CATEGORY_DISALLOWED_PATTERNS[categorySlug];
  if (disallowed) {
    for (const pat of disallowed) {
      if (pat.test(rawUrl) || pat.test(lowerName)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Automatically filters an array of website items, removing any non-matching
 * tools, auxiliary links, or category mismatches.
 */
export function filterCategoryWebsites<T extends WebsiteItem>(
  websites: T[],
  categorySlug: string,
  boxTitle?: string
): T[] {
  if (!Array.isArray(websites)) return [];
  const seenUrls = new Set<string>();

  return websites.filter((site) => {
    if (!isValidCategoryWebsite(site, categorySlug, boxTitle)) {
      return false;
    }

    // Deduplicate by clean canonical URL within the same box
    const cleanUrl = site.url.trim().toLowerCase().replace(/\/+$/, "");
    if (seenUrls.has(cleanUrl)) {
      return false;
    }
    seenUrls.add(cleanUrl);

    return true;
  });
}

