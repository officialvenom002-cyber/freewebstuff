import Fuse from "fuse.js";
import { Resource } from "../types";
import { analyzeSearchQuery } from "./intentMatcher";

interface SearchIndex {
  resources: Resource[];
  tokenMap: Map<string, Resource[]>;
  categoryMap: Map<string, Resource[]>;
  getFuse: () => Fuse<Resource>;
}

let cachedIndex: SearchIndex | null = null;
let lazyFuse: Fuse<Resource> | null = null;

function getSearchIndex(resources: Resource[]): SearchIndex {
  if (cachedIndex) {
    return cachedIndex;
  }

  const categoryMap = new Map<string, Resource[]>();
  const tokenMap = new Map<string, Resource[]>();

  for (let i = 0; i < resources.length; i++) {
    const r = resources[i];

    // 1. Category bucket
    const cat = (r.categoryId || "").toLowerCase();
    if (cat) {
      if (!categoryMap.has(cat)) categoryMap.set(cat, []);
      categoryMap.get(cat)!.push(r);
    }

    // 2. Tokenize name, slug, subcategory, tags
    const nameStr = (r.name || "").toLowerCase();
    const slugStr = (r.slug || "").toLowerCase();
    const subCatStr = (r.subcategoryId || "").toLowerCase();
    const tagsStr = (r.tags || []).join(" ").toLowerCase();

    const words = `${nameStr} ${slugStr} ${subCatStr} ${tagsStr}`
      .split(/[\s,+/._-]+/)
      .filter((w) => w.length > 1);

    const seenInItem = new Set<string>();
    for (const w of words) {
      if (seenInItem.has(w)) continue;
      seenInItem.add(w);

      if (!tokenMap.has(w)) tokenMap.set(w, []);
      tokenMap.get(w)!.push(r);
    }
  }

  const getFuse = () => {
    if (!lazyFuse) {
      lazyFuse = new Fuse(resources, {
        keys: [
          { name: "name", weight: 0.50 },
          { name: "tagline", weight: 0.30 },
          { name: "tags", weight: 0.20 },
        ],
        threshold: 0.35,
        distance: 100,
        includeScore: true,
        minMatchCharLength: 2,
      });
    }
    return lazyFuse;
  };

  cachedIndex = {
    resources,
    tokenMap,
    categoryMap,
    getFuse,
  };

  return cachedIndex;
}

export function searchResources(resources: Resource[], query: string): Resource[] {
  if (!query || !query.trim()) return resources;

  const index = getSearchIndex(resources);
  const analysis = analyzeSearchQuery(query);
  const qLower = analysis.normalizedQuery;
  const tokens = qLower.split(/[\s,+/._-]+/).filter((t) => t.length > 1);

  // ─────────────────────────────────────────────────────────────
  // 1. SPECIFIC KEYWORD SEARCH
  // User typed a specific keyword / tool name (e.g. "photoshop", "canva", "vlc", "photopea")
  // Instant tokenMap lookup + name/slug match in <1ms!
  // ─────────────────────────────────────────────────────────────
  if (analysis.isSpecificKeyword && tokens.length > 0) {
    const keyword = tokens[0];

    // Check exact token map
    const candidates = new Set<Resource>(index.tokenMap.get(keyword) || []);

    // Also check prefix matches in tokenMap keys
    for (const [tokenKey, resList] of index.tokenMap.entries()) {
      if (tokenKey.startsWith(keyword) || keyword.startsWith(tokenKey)) {
        for (const item of resList) {
          candidates.add(item);
        }
      }
    }

    if (candidates.size > 0) {
      const scored: { item: Resource; score: number }[] = [];

      for (const r of candidates) {
        const nameLower = (r.name || "").toLowerCase();
        let matchScore = 0;

        // Massive score for exact or start name matches so keyword website is guaranteed #1 TOP
        if (nameLower === keyword) matchScore += 2000;
        else if (nameLower.startsWith(keyword)) matchScore += 1000;
        else if (nameLower.includes(keyword)) matchScore += 400;
        else matchScore += 50;

        if (r.verified) matchScore += 20;
        if (r.featured || r.editorsChoice) matchScore += 10;

        scored.push({ item: r, score: matchScore });
      }

      scored.sort((a, b) => b.score - a.score);
      return scored.map((s) => s.item);
    }

    // Typo fallback
    const fuseResults = index.getFuse().search(qLower, { limit: 30 });
    return fuseResults.map((res) => res.item);
  }

  // ─────────────────────────────────────────────────────────────
  // 2. BROAD TOPIC / MULTILINGUAL / INTENT SEARCH
  // User typed a topic, question, or action intent in any language
  // Directly grab relevant categories & intent tokens in <2ms!
  // ─────────────────────────────────────────────────────────────
  const candidateSet = new Set<Resource>();

  // A. Add tools from target categories
  for (const catId of analysis.targetCategories) {
    const catResources = index.categoryMap.get(catId.toLowerCase());
    if (catResources) {
      for (const r of catResources) {
        candidateSet.add(r);
      }
    }
  }

  // B. Add tools matching query tokens from tokenMap
  for (const token of tokens) {
    const tokenMatches = index.tokenMap.get(token);
    if (tokenMatches) {
      for (const r of tokenMatches) {
        candidateSet.add(r);
      }
    }
  }

  // C. Add tools matching expanded intent terms
  for (const exp of analysis.expandedTerms) {
    const expMatches = index.tokenMap.get(exp);
    if (expMatches) {
      for (const r of expMatches) {
        candidateSet.add(r);
      }
    }
  }

  // If candidates found from category & token indices, score and rank them
  if (candidateSet.size > 0) {
    const scoredItems: { item: Resource; score: number }[] = [];
    const targetCategorySet = new Set(analysis.targetCategories);

    for (const r of candidateSet) {
      let score = 0;
      const nameLower = (r.name || "").toLowerCase();
      const taglineLower = (r.tagline || "").toLowerCase();
      const catId = (r.categoryId || "").toLowerCase();
      const subCatId = (r.subcategoryId || "").toLowerCase();

      // Check direct name match with normalized query
      const cleanQ = qLower.trim();
      if (nameLower === cleanQ) score += 3000;
      else if (nameLower.startsWith(cleanQ)) score += 1500;
      else if (nameLower.includes(cleanQ)) score += 600;

      // Check query tokens
      for (const token of tokens) {
        if (nameLower === token) score += 500;
        else if (nameLower.startsWith(token)) score += 250;
        else if (nameLower.includes(token)) score += 100;
        if (taglineLower.includes(token)) score += 20;
      }

      // Target category boost
      if (targetCategorySet.has(catId)) score += 25;

      // Expanded intent boost ("what it does")
      for (const exp of analysis.expandedTerms) {
        if (taglineLower.includes(exp)) score += 15;
        if (subCatId.includes(exp)) score += 12;
        if (nameLower.includes(exp)) score += 10;
      }

      // Quality & importance boosts
      if (r.verified) score += 10;
      if (r.featured || r.editorsChoice) score += 8;
      if (r.communityRating && Number(r.communityRating) >= 4.5) score += 5;

      scoredItems.push({ item: r, score });
    }

    scoredItems.sort((a, b) => b.score - a.score);
    return scoredItems.map((m) => m.item);
  }

  // Fallback to fuzzy search if index missed
  const results = index.getFuse().search(qLower, { limit: 50 });
  return results.map((res) => res.item);
}
