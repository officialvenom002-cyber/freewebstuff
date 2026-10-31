import fs from "fs";
import path from "path";

// Load .env.local if present
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim().replace(/^['"](.*)['"]$/, "$1");
      if (!process.env[key]) process.env[key] = value;
    }
  });
}

const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const cfEmail = process.env.CLOUDFLARE_EMAIL;
const cfApiKey = process.env.CLOUDFLARE_API_KEY;

if (!zoneId || (!apiToken && (!cfEmail || !cfApiKey))) {
  console.error("Error: Missing Cloudflare credentials.");
  console.error("Please provide either:");
  console.error("1. CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN");
  console.error("OR");
  console.error("2. CLOUDFLARE_ZONE_ID, CLOUDFLARE_EMAIL, and CLOUDFLARE_API_KEY");
  process.exit(1);
}

async function purgeCache() {
  console.log(`Purging Cloudflare cache for Zone: ${zoneId}...`);
  try {
    const headers = apiToken
      ? {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        }
      : {
          "X-Auth-Email": cfEmail,
          "X-Auth-Key": cfApiKey,
          "Content-Type": "application/json",
        };

    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: "POST",
      headers,
      body: JSON.stringify({ purge_everything: true }),
    });

    const data = await res.json();
    if (data.success) {
      console.log("✅ Cloudflare cache purged successfully! Entire site cache is now fresh.");
    } else {
      console.error("❌ Cloudflare API Error:", JSON.stringify(data.errors, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Network error connecting to Cloudflare API:", err);
    process.exit(1);
  }
}

purgeCache();

