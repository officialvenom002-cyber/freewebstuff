import { NextRequest, NextResponse } from "next/server";
import { getAllResources, filterResources } from "@/lib/db/store";
import { searchResources } from "@/lib/search/engine";
import { analyzeSearchQuery } from "@/lib/search/intentMatcher";

// Server-side fast in-memory response cache
const serverSearchCache = new Map<string, any>();
const MAX_SERVER_CACHE = 500;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const trimmedQ = q.trim().toLowerCase();
  const cacheKey = `${trimmedQ}_${category}_${limit}`;

  // Instant response (<1ms) if cached
  if (serverSearchCache.has(cacheKey)) {
    return NextResponse.json(serverSearchCache.get(cacheKey), {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        "X-Cache": "HIT",
      },
    });
  }

  let resources = getAllResources();

  if (category && category !== "all") {
    resources = filterResources({ category });
  }

  const analysis = trimmedQ ? analyzeSearchQuery(q) : null;

  if (trimmedQ) {
    resources = searchResources(resources, q);
  }

  const payload = {
    total: resources.length,
    intent: analysis
      ? {
          isSpecificKeyword: analysis.isSpecificKeyword,
          matchedTopics: analysis.matchedIntents.map((i) => i.name),
          targetCategories: analysis.targetCategories,
        }
      : null,
    resources: resources.slice(0, limit),
  };

  // Cache in server memory
  if (serverSearchCache.size >= MAX_SERVER_CACHE) {
    const oldestKey = serverSearchCache.keys().next().value;
    if (oldestKey) serverSearchCache.delete(oldestKey);
  }
  serverSearchCache.set(cacheKey, payload);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      "X-Cache": "MISS",
    },
  });
}
