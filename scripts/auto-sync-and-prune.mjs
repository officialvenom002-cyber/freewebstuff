/**
 * FreeWebStuff Autonomous Vault Engine
 *
 * 1. AUTO-SYNC: Pulls latest community-verified tools from FMHY upstream repos.
 * 2. AUTO-PRUNE: Probes links with parallel async streams; updates domain shifts & archives dead sites.
 * 3. ZERO-VERCEL-LOAD: Runs in GitHub Actions; outputs precomputed static JSON.
 *
 * Usage:
 *   node scripts/auto-sync-and-prune.mjs --sync    (Sync new tools from upstream)
 *   node scripts/auto-sync-and-prune.mjs --prune   (Check health & prune dead sites)
 *   node scripts/auto-sync-and-prune.mjs --all     (Full sync + prune pipeline)
 *   node scripts/auto-sync-and-prune.mjs --limit=50 (Quick test run)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const ALL_SECTIONS_PATH = path.join(ROOT_DIR, "lib", "db", "allCategorySections.json");
const ALL_BOXES_PATH = path.join(ROOT_DIR, "public", "data", "all-categories-boxes.json");
const SITE_HEALTH_PATH = path.join(ROOT_DIR, "public", "data", "site-health.json");
const OFFLINE_REGISTRY_PATH = path.join(ROOT_DIR, "public", "data", "offline-registry.json");

const CONCURRENCY = 25; // Safe parallel probe pool
const TIMEOUT_MS = 3800; // 3.8s per probe
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 FreeWebStuffBot/1.0";

const CATEGORY_MAP = [
  { slug: "privacy", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/privacy.md" },
  { slug: "ai", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/ai.md" },
  { slug: "video", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/video.md" },
  { slug: "audio", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/audio.md" },
  { slug: "gaming", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/gaming.md" },
  { slug: "reading", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/reading.md" },
  { slug: "downloading", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/downloading.md" },
  { slug: "torrenting", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/torrenting.md" },
  { slug: "educational", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/educational.md" },
  { slug: "mobile", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/android-ios.md" },
  { slug: "linux-macos", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/linux-macos.md" },
  { slug: "non-english", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/non-english.md" },
  { slug: "misc", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/misc.md" },
  { slug: "system-tools", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/system-tools.md" },
  { slug: "file-tools", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/file-tools.md" },
  { slug: "internet-tools", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/internet-tools.md" },
  { slug: "social-media-tools", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/social-media-tools.md" },
  { slug: "text-tools", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/text-tools.md" },
  { slug: "gaming-tools", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/gaming-tools.md" },
  { slug: "image-tools", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/image-tools.md" },
  { slug: "video-tools", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/video-tools.md" },
  { slug: "developer-tools", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/developer-tools.md" },
  { slug: "storage", url: "https://raw.githubusercontent.com/fmhy/edit/main/docs/storage.md" },
];

const ACCENT_CYCLE = ["sky", "violet", "emerald", "amber", "rose", "indigo", "cyan", "fuchsia"];

// Clean & sanitize URLs
function sanitizeUrl(rawUrl) {
  try {
    let u = rawUrl.trim();
    // Remove unwanted punctuation at the end
    u = u.replace(/[),;.]+$/, "");
    if (!u.startsWith("http://") && !u.startsWith("https://")) {
      return null;
    }
    const parsed = new URL(u);
    // Remove common tracking queries
    ["utm_source", "utm_medium", "utm_campaign", "ref", "fbclid"].forEach((p) =>
      parsed.searchParams.delete(p)
    );
    // Strip trailing slash unless root path
    if (parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. AUTO-SYNC: Fetch Upstream FMHY Markdown & Extract Verified Tools
// ─────────────────────────────────────────────────────────────────────────────

async function fetchUpstreamCategory(cat) {
  try {
    const res = await fetch(cat.url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function parseMarkdownToSections(md, categorySlug) {
  const lines = md.split("\n");
  const sections = [];
  let currentSection = null;
  let currentTip = null;
  let itemId = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip table of contents and back to wiki
    if (/back to wiki|table of contents/i.test(line)) continue;

    // Heading (H1, H2, H3)
    if (line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### ")) {
      if (currentSection && currentSection.items.length > 0) {
        if (currentTip) currentSection.tip = currentTip.trim();
        sections.push(currentSection);
      }

      const level = line.startsWith("### ") ? 3 : line.startsWith("## ") ? 2 : 1;
      let title = line.replace(/^#{1,3}\s+/, "").replace(/^[►▷▸•]\s*/, "").trim();
      let titleUrl = null;

      const linkMatch = title.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
      if (linkMatch) {
        title = linkMatch[1];
        titleUrl = linkMatch[2];
      }

      const baseSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") || `sec-${sections.length + 1}`;

      currentSection = {
        id: baseSlug,
        slug: baseSlug,
        title,
        titleUrl,
        level: level === 1 ? 2 : level,
        tip: null,
        items: [],
      };
      currentTip = null;
      continue;
    }

    // Tip / Note
    if (/^\*?\s*\*\*(?:Note|Tip|Notice)\*\*\s*-\s*/i.test(line)) {
      currentTip = line.replace(/^\*?\s*\*\*(?:Note|Tip|Notice)\*\*\s*-\s*/i, "");
      continue;
    }

    // Bullet tool items
    if (line.startsWith("* ") || line.startsWith("- ")) {
      if (!currentSection) {
        currentSection = {
          id: `${categorySlug}-general`,
          slug: `${categorySlug}-general`,
          title: "General",
          level: 2,
          tip: null,
          items: [],
        };
      }

      let content = line.substring(2).trim();
      if (!content || content === "***" || content === "---") continue;

      const isStarred = content.includes("⭐");
      const isIndex = content.includes("🌐");
      const isCrossLink = content.includes("↪️") || content.includes("◄◄");
      content = content.replace(/^[⭐🌐↪️•\s]+/, "").trim();

      // Only add lines that contain valid markdown links
      if (/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/.test(content)) {
        currentSection.items.push({
          id: `${categorySlug}-${itemId++}`,
          raw: content,
          isStarred,
          isIndex,
          isCrossLink,
        });
      }
    }
  }

  if (currentSection && currentSection.items.length > 0) {
    if (currentTip) currentSection.tip = currentTip.trim();
    sections.push(currentSection);
  }

  return sections;
}

async function runAutoSync() {
  console.log("🚀 Starting Upstream Sync (Auto-Add New Verified Tools)...");
  let existingSections = {};

  if (fs.existsSync(ALL_SECTIONS_PATH)) {
    try {
      existingSections = JSON.parse(fs.readFileSync(ALL_SECTIONS_PATH, "utf8"));
    } catch {
      existingSections = {};
    }
  }

  let totalNewSections = 0;
  let totalNewTools = 0;

  for (const cat of CATEGORY_MAP) {
    process.stdout.write(`  Fetching ${cat.slug.padEnd(20)} ... `);
    const md = await fetchUpstreamCategory(cat);

    if (md) {
      const parsedSections = parseMarkdownToSections(md, cat.slug);
      const prevCount = existingSections[cat.slug]?.reduce((acc, s) => acc + s.items.length, 0) || 0;
      const newCount = parsedSections.reduce((acc, s) => acc + s.items.length, 0);

      existingSections[cat.slug] = parsedSections;
      totalNewSections += parsedSections.length;
      totalNewTools += newCount;

      console.log(`✔ ${parsedSections.length} boxes, ${newCount} tools (${newCount - prevCount >= 0 ? `+${newCount - prevCount}` : newCount - prevCount})`);
    } else {
      console.log(`⚠️ Skipped (using cached database)`);
    }
  }

  fs.writeFileSync(ALL_SECTIONS_PATH, JSON.stringify(existingSections, null, 2), "utf8");
  console.log(`\n✅ Upstream sync completed! Saved to ${ALL_SECTIONS_PATH}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. AUTO-PRUNE: Parallel Health Checker, Domain Shifts & Dead Site Pruner
// ─────────────────────────────────────────────────────────────────────────────

async function probeUrl(targetUrl) {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let res = await fetch(targetUrl, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "*/*",
      },
      redirect: "follow",
    });

    // Fallback to range GET if HEAD is not allowed (HTTP 405)
    if (res.status === 405) {
      res = await fetch(targetUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
          "Range": "bytes=0-100",
        },
        redirect: "follow",
      });
    }

    clearTimeout(timer);
    const latency = Date.now() - start;
    const finalUrl = sanitizeUrl(res.url) || targetUrl;
    const isShifted = finalUrl !== targetUrl && new URL(finalUrl).hostname !== new URL(targetUrl).hostname;

    if (res.status >= 200 && res.status < 400) {
      return {
        status: "up",
        httpStatus: res.status,
        latency,
        updatedUrl: isShifted ? finalUrl : null,
      };
    } else if (res.status === 404 || res.status === 410) {
      return { status: "dead", httpStatus: res.status, latency, reason: "404/410 Not Found" };
    } else {
      // 403 / 503 might be Cloudflare challenge, keep as live with warning
      return { status: "up", httpStatus: res.status, latency, warning: true };
    }
  } catch (err) {
    clearTimeout(timer);
    const latency = Date.now() - start;

    if (err.name === "AbortError") {
      return { status: "dead", httpStatus: 408, latency, reason: "Request Timeout (>3.8s)" };
    }
    return { status: "dead", httpStatus: 0, latency, reason: err.code || err.message };
  }
}

async function runAutoPrune(limit = null) {
  console.log("🛡️ Starting Health Prober & Dead Site Pruner...");

  if (!fs.existsSync(ALL_SECTIONS_PATH)) {
    console.error("❌ allCategorySections.json not found. Run --sync first.");
    return;
  }

  const sectionsData = JSON.parse(fs.readFileSync(ALL_SECTIONS_PATH, "utf8"));
  const urlMap = new Map(); // url -> { name, catSlug }

  for (const [catSlug, secList] of Object.entries(sectionsData)) {
    if (!Array.isArray(secList)) continue;
    for (const sec of secList) {
      for (const item of sec.items || []) {
        const regex = /(?:\*\*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
        let m;
        while ((m = regex.exec(item.raw)) !== null) {
          const name = (m[1] || m[3] || "").trim();
          const rawUrl = (m[2] || m[4] || "").trim();
          const clean = sanitizeUrl(rawUrl);
          if (clean && !urlMap.has(clean)) {
            urlMap.set(clean, { name, catSlug });
          }
        }
      }
    }
  }

  let allUrls = Array.from(urlMap.entries()).map(([url, meta]) => ({ url, ...meta }));
  if (limit && limit > 0) allUrls = allUrls.slice(0, limit);

  console.log(`  Probing ${allUrls.length} unique website endpoints with pool concurrency: ${CONCURRENCY}...`);

  const results = {};
  const shiftedMap = new Map(); // oldUrl -> newUrl
  const deadSet = new Set();
  let upCount = 0;
  let deadCount = 0;
  let shiftCount = 0;

  for (let i = 0; i < allUrls.length; i += CONCURRENCY) {
    const batch = allUrls.slice(i, i + CONCURRENCY);
    const promises = batch.map(async (item) => {
      const outcome = await probeUrl(item.url);
      results[item.url] = outcome;

      if (outcome.status === "up") {
        upCount++;
        if (outcome.updatedUrl) {
          shiftCount++;
          shiftedMap.set(item.url, outcome.updatedUrl);
        }
      } else {
        deadCount++;
        deadSet.add(item.url);
      }
    });

    await Promise.all(promises);

    const done = Math.min(i + CONCURRENCY, allUrls.length);
    process.stdout.write(`\r  Progress: ${done}/${allUrls.length} (${Math.round((done / allUrls.length) * 100)}%) | Online: ${upCount} | Dead: ${deadCount} | Shifted: ${shiftCount}`);
  }

  console.log("\n\n📊 Health Check Summary:");
  console.log(`  ✔ Online: ${upCount}`);
  console.log(`  🔀 Domain Shifts (Redirected): ${shiftCount}`);
  console.log(`  ❌ Dead / Parked Sites: ${deadCount}`);

  // Save site-health.json
  const healthPayload = {
    generatedAt: new Date().toISOString(),
    timestamp: Date.now(),
    totalChecked: allUrls.length,
    stats: { up: upCount, dead: deadCount, shifted: shiftCount },
    sites: results,
  };
  fs.writeFileSync(SITE_HEALTH_PATH, JSON.stringify(healthPayload, null, 2), "utf8");

  // Save dead sites to offline registry
  const offlineEntries = Array.from(deadSet).map((url) => ({
    url,
    name: urlMap.get(url)?.name || url,
    category: urlMap.get(url)?.catSlug || "misc",
    prunedAt: new Date().toISOString(),
    reason: results[url]?.reason || "Unreachable",
  }));
  fs.writeFileSync(OFFLINE_REGISTRY_PATH, JSON.stringify(offlineEntries, null, 2), "utf8");
  console.log(`  💾 Archived ${deadCount} dead sites to ${OFFLINE_REGISTRY_PATH}`);

  // Auto-Update Domain Shifts in allCategorySections.json
  if (shiftedMap.size > 0 || deadSet.size > 0) {
    let content = fs.readFileSync(ALL_SECTIONS_PATH, "utf8");
    let replacedCount = 0;

    for (const [oldUrl, newUrl] of shiftedMap.entries()) {
      if (content.includes(oldUrl)) {
        content = content.replaceAll(oldUrl, newUrl);
        replacedCount++;
      }
    }

    fs.writeFileSync(ALL_SECTIONS_PATH, content, "utf8");
    console.log(`  🔀 Updated ${replacedCount} shifted domains in allCategorySections.json`);
  }

  // Generate clean all-categories-boxes.json (pruning dead links)
  rebuildPrecomputedBoxes(deadSet);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. REBUILD BOXES: Build Static Precomputed Boxes JSON (Instant Cloudflare Cache)
// ─────────────────────────────────────────────────────────────────────────────

function rebuildPrecomputedBoxes(deadSet = new Set()) {
  console.log("\n📦 Rebuilding precomputed category boxes (Zero-Latency Edge Cache)...");

  if (!fs.existsSync(ALL_SECTIONS_PATH)) return;
  const sectionsData = JSON.parse(fs.readFileSync(ALL_SECTIONS_PATH, "utf8"));

  const outBoxes = {};
  let totalBoxes = 0;
  let totalLiveWebsites = 0;

  for (const [slug, sections] of Object.entries(sectionsData)) {
    const boxes = [];
    let accentIdx = 0;

    for (const sec of sections) {
      const websites = [];

      for (const item of sec.items || []) {
        const regex = /(?:\*\*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
        let m;
        while ((m = regex.exec(item.raw)) !== null) {
          const name = (m[1] || m[3] || "").trim();
          const rawUrl = (m[2] || m[4] || "").trim();
          const clean = sanitizeUrl(rawUrl);

          // Exclude dead links
          if (clean && !deadSet.has(clean)) {
            websites.push({
              id: `${sec.id}-${websites.length}`,
              name,
              url: clean,
              isStarred: Boolean(item.isStarred),
            });
          }
        }
      }

      if (websites.length > 0) {
        boxes.push({
          id: sec.id,
          slug: sec.slug || sec.id,
          title: sec.title,
          emoji: sec.title.includes("Anime") ? "⛩️" : sec.title.includes("Movie") ? "🎬" : "📁",
          tagline: sec.tip || undefined,
          accent: ACCENT_CYCLE[accentIdx % ACCENT_CYCLE.length],
          websites,
        });
        accentIdx++;
        totalLiveWebsites += websites.length;
      }
    }

    outBoxes[slug] = {
      id: slug,
      slug,
      name: slug.toUpperCase().replace(/-/g, " "),
      boxes,
    };
    totalBoxes += boxes.length;
  }

  fs.writeFileSync(ALL_BOXES_PATH, JSON.stringify(outBoxes), "utf8");
  console.log(`✅ Precomputed boxes generated successfully! (${totalBoxes} boxes, ${totalLiveWebsites} verified active links)`);
  console.log(`💾 Saved to ${ALL_BOXES_PATH}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Execution Controller
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const doSync = args.includes("--sync") || args.includes("--all");
  const doPrune = args.includes("--prune") || args.includes("--all");
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : null;

  console.log("==========================================================");
  console.log("       FREEWEBSTUFF AUTONOMOUS VAULT ENGINE               ");
  console.log("==========================================================");

  if (doSync) {
    await runAutoSync();
  }

  if (doPrune) {
    await runAutoPrune(limit);
  }

  if (!doSync && !doPrune) {
    console.log("Please specify an action:");
    console.log("  node scripts/auto-sync-and-prune.mjs --sync    (Sync new upstream tools)");
    console.log("  node scripts/auto-sync-and-prune.mjs --prune   (Check health & prune dead sites)");
    console.log("  node scripts/auto-sync-and-prune.mjs --all     (Full sync + health pipeline)");
  }

  console.log("\n🎯 All operations completed with Zero Vercel Serverless Load!");
}

main().catch(console.error);

