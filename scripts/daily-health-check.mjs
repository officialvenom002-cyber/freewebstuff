/**
 * FreeWebStuff Daily Site Health & Domain Shift Checker
 *
 * Runs once daily (via GitHub Actions, Cron, or npm run check:sites).
 * 1. Collects all listed websites from category databases.
 * 2. Probes URLs using lightweight HEAD (or GET) requests in bounded concurrent pools.
 * 3. Follows HTTP 301/302/307/308 redirects to detect domain migrations/shifts.
 * 4. Outputs results to `public/data/site-health.json`.
 * 5. Consumes ZERO Vercel/Cloudflare serverless compute during regular visitor traffic.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const OUTPUT_PATH = path.join(ROOT_DIR, "public", "data", "site-health.json");
const ALL_SECTIONS_PATH = path.join(ROOT_DIR, "lib", "db", "allCategorySections.json");

const CONCURRENCY = 20; // safe parallel connections
const TIMEOUT_MS = 4000; // 4s timeout per check
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 FreeWebStuffBot/1.0";

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to normalize domains
function getHostname(urlStr) {
  try {
    return new URL(urlStr).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Collect unique URLs to test
function collectUrls(limit = null) {
  const urlMap = new Map(); // url -> { name, category }

  // 1. From allCategorySections.json
  if (fs.existsSync(ALL_SECTIONS_PATH)) {
    try {
      const sectionsData = JSON.parse(fs.readFileSync(ALL_SECTIONS_PATH, "utf8"));
      for (const [catSlug, secList] of Object.entries(sectionsData)) {
        if (!Array.isArray(secList)) continue;
        for (const sec of secList) {
          for (const item of sec.items || []) {
            const match = /(?:\*\*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/.exec(item.raw);
            if (match) {
              const name = (match[1] || match[3] || "").trim();
              const url = (match[2] || match[4] || "").trim();
              if (url && !urlMap.has(url)) {
                urlMap.set(url, { name, category: catSlug });
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not read allCategorySections.json:", e.message);
    }
  }

  // 2. Video specialized boxes from CategoryView
  const catViewPath = path.join(ROOT_DIR, "components", "categories", "CategoryView.tsx");
  if (fs.existsSync(catViewPath)) {
    const content = fs.readFileSync(catViewPath, "utf8");
    const regex = /\{[^}]*name:\s*"([^"]+)"\s*,\s*url:\s*"([^"]+)"/g;
    let m;
    while ((m = regex.exec(content)) !== null) {
      const name = m[1].trim();
      const url = m[2].trim();
      if (url && !urlMap.has(url)) {
        urlMap.set(url, { name, category: "video" });
      }
    }
  }

  let list = Array.from(urlMap.entries()).map(([url, meta]) => ({ url, ...meta }));
  if (limit && limit > 0) {
    list = list.slice(0, limit);
  }
  return list;
}

// Probe a single URL with redirect detection
async function probeUrl(targetUrl) {
  const start = Date.now();
  const originalHost = getHostname(targetUrl);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let res = await fetch(targetUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "*/*",
      },
    });

    // Some web servers reject HEAD with 405 Method Not Allowed; fallback to GET
    if (res.status === 405) {
      clearTimeout(timer);
      const getController = new AbortController();
      const getTimer = setTimeout(() => getController.abort(), TIMEOUT_MS);
      res = await fetch(targetUrl, {
        method: "GET",
        redirect: "follow",
        signal: getController.signal,
        headers: {
          "User-Agent": USER_AGENT,
          "Range": "bytes=0-1024", // download only first 1KB
        },
      });
      clearTimeout(getTimer);
    } else {
      clearTimeout(timer);
    }

    const latency = Date.now() - start;
    const finalUrl = res.url || targetUrl;
    const finalHost = getHostname(finalUrl);

    // Check if domain shifted to a new domain
    let updatedUrl = null;
    if (finalUrl && finalUrl !== targetUrl) {
      if (finalHost && originalHost && finalHost !== originalHost) {
        updatedUrl = finalUrl;
      }
    }

    const isUp = res.status < 400 || res.status === 403; // 403 often means Cloudflare protection, site is alive

    return {
      status: isUp ? "up" : "down",
      httpStatus: res.status,
      latency,
      updatedUrl: updatedUrl || undefined,
      checkedAt: Date.now(),
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      status: "down",
      httpStatus: 0,
      latency: Date.now() - start,
      checkedAt: Date.now(),
    };
  }
}

// Run pool
async function runHealthCheck(options = {}) {
  const { limit = null, priorityOnly = false } = options;
  console.log("🔍 Collecting website URLs...");
  const allUrls = collectUrls(limit);
  console.log(`📋 Found ${allUrls.length} sites to check.`);

  // Load existing registry if available to merge
  let existing = { sites: {} };
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
    } catch {}
  }

  const results = { ...existing.sites };
  let upCount = 0;
  let downCount = 0;
  let redirectCount = 0;

  console.log(`⚡ Running health checks with concurrency ${CONCURRENCY}...`);

  const shiftedMap = new Map(); // oldUrl -> newUrl

  for (let i = 0; i < allUrls.length; i += CONCURRENCY) {
    const chunk = allUrls.slice(i, i + CONCURRENCY);
    const promises = chunk.map(async (item) => {
      const outcome = await probeUrl(item.url);
      results[item.url] = outcome;
      if (outcome.status === "up") upCount++;
      else downCount++;
      if (outcome.updatedUrl) {
        redirectCount++;
        shiftedMap.set(item.url, outcome.updatedUrl);
        console.log(`\n 🔀 Domain shift detected: ${item.url} → ${outcome.updatedUrl}`);
      }
    });

    await Promise.all(promises);

    const progress = Math.min(i + CONCURRENCY, allUrls.length);
    if (progress % 100 === 0 || progress === allUrls.length) {
      process.stdout.write(`\r  Progress: ${progress} / ${allUrls.length} (${Math.round((progress/allUrls.length)*100)}%) | Up: ${upCount} | Down: ${downCount} | Shifted: ${redirectCount}`);
    }
  }

  console.log("\n💾 Saving updated registry to", OUTPUT_PATH);
  const payload = {
    generatedAt: new Date().toISOString(),
    timestamp: Date.now(),
    totalChecked: allUrls.length,
    stats: { up: upCount, down: downCount, shifted: redirectCount },
    sites: results,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2), "utf8");

  if (options.updateSources && shiftedMap.size > 0) {
    updateSourceFiles(shiftedMap);
  }

  console.log("✅ Daily health check completed successfully!");
}

function updateSourceFiles(shiftedMap) {
  console.log(`\n🔄 Updating ${shiftedMap.size} shifted domains directly in source files...`);

  // 1. Update allCategorySections.json
  if (fs.existsSync(ALL_SECTIONS_PATH)) {
    try {
      let content = fs.readFileSync(ALL_SECTIONS_PATH, "utf8");
      let changed = 0;
      for (const [oldUrl, newUrl] of shiftedMap.entries()) {
        if (content.includes(oldUrl)) {
          content = content.replaceAll(oldUrl, newUrl);
          changed++;
        }
      }
      if (changed > 0) {
        fs.writeFileSync(ALL_SECTIONS_PATH, content, "utf8");
        console.log(`  ✅ Updated ${changed} URLs in allCategorySections.json`);
      }
    } catch (e) {
      console.warn("  ⚠️ Failed to update allCategorySections.json:", e.message);
    }
  }

  // 2. Update CategoryView.tsx
  const catViewPath = path.join(ROOT_DIR, "components", "categories", "CategoryView.tsx");
  if (fs.existsSync(catViewPath)) {
    try {
      let content = fs.readFileSync(catViewPath, "utf8");
      let changed = 0;
      for (const [oldUrl, newUrl] of shiftedMap.entries()) {
        if (content.includes(oldUrl)) {
          content = content.replaceAll(oldUrl, newUrl);
          changed++;
        }
      }
      if (changed > 0) {
        fs.writeFileSync(catViewPath, content, "utf8");
        console.log(`  ✅ Updated ${changed} URLs in CategoryView.tsx`);
      }
    } catch (e) {
      console.warn("  ⚠️ Failed to update CategoryView.tsx:", e.message);
    }
  }
}

// Run if called directly
const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : null;
const updateSources = args.includes("--update-sources");

runHealthCheck({ limit, updateSources });

