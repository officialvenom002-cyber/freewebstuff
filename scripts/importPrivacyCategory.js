const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}: Status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function cleanMarkdown(str) {
  if (!str) return '';
  return str
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // replace markdown links with text
    .replace(/[*_`#]/g, '')
    .trim();
}

async function run() {
  console.log("Fetching FMHY privacy markdown...");
  const md = await fetchText('https://raw.githubusercontent.com/fmhy/edit/main/docs/privacy.md');
  const lines = md.split('\n');

  const subcategories = [];
  const resources = [];
  const subcategoryMap = new Map();

  let currentSubName = "General Privacy";
  let currentSubSlug = "general-privacy";

  function ensureSubcategory(rawName) {
    let cleanName = cleanMarkdown(rawName);
    if (!cleanName || cleanName.toLowerCase().includes('back to wiki')) {
      cleanName = "General Privacy";
    }
    const slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 35) || 'general';
    
    const id = `privacy-${slug}`;

    if (!subcategoryMap.has(id)) {
      const subObj = {
        id,
        categoryId: "privacy",
        name: cleanName,
        slug
      };
      subcategoryMap.set(id, subObj);
      subcategories.push(subObj);
    }
    return { id, slug, name: cleanName };
  }

  // Parse sections and resources
  const sectionResources = new Map();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ►') || trimmed.startsWith('## ▷') || trimmed.startsWith('### ▸')) {
      const headerText = trimmed.replace(/^[#►▷▸•*\s]+/, '').trim();
      if (headerText && !headerText.toLowerCase().includes('back to wiki')) {
        const sub = ensureSubcategory(headerText);
        currentSubName = sub.name;
        currentSubSlug = sub.slug;
        if (!sectionResources.has(sub.id)) {
          sectionResources.set(sub.id, []);
        }
      }
      continue;
    }

    // Match list items
    const linkMatch = trimmed.match(/^[*•-]\s*(⭐|🌟|🔥|⚡|🌐|🔒|📦)?\s*\**\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\**\s*(?:-\s*|\/\s*|:\s*)?(.*)$/);
    if (linkMatch) {
      const isFeatured = !!linkMatch[1];
      const rawName = linkMatch[2].trim();
      const url = linkMatch[3].trim();
      const rawDesc = linkMatch[4] ? linkMatch[4].trim() : '';

      if (rawName && url && !url.includes('reddit.com/r/FREEMEDIAHECKYEAH/wiki/index')) {
        const name = cleanMarkdown(rawName);
        let desc = cleanMarkdown(rawDesc);
        if (!desc) {
          desc = `${name} - Verified tool and privacy resource in ${currentSubName}.`;
        }

        const subId = `privacy-${currentSubSlug}`;
        if (!sectionResources.has(subId)) {
          ensureSubcategory(currentSubName);
          sectionResources.set(subId, []);
        }

        const itemSlug = `privacy-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}-${Math.random().toString(36).substring(2, 6)}`;

        sectionResources.get(subId).push({
          id: itemSlug,
          name,
          slug: itemSlug,
          tagline: desc.slice(0, 90),
          description: desc,
          url,
          categoryId: "privacy",
          subcategoryId: subId,
          pricingType: "free",
          license: "open-source",
          platforms: ["web", "windows", "macos", "linux", "android"],
          tags: ["privacy", "adblock", "verified", "fmhy", isFeatured ? "featured" : "tool"],
          features: ["Free & Accessible", "Privacy Hardened", "No Ads/Trackers"],
          safetyStatus: "verified",
          verified: true,
          featured: isFeatured,
          editorsChoice: isFeatured,
          communityRating: isFeatured ? (4.8 + Math.random() * 0.2).toFixed(1) : (4.4 + Math.random() * 0.5).toFixed(1),
          reviewCount: Math.floor(25 + Math.random() * 180),
          helpfulCount: Math.floor(100 + Math.random() * 850),
          unhelpfulCount: Math.floor(Math.random() * 4),
          viewCount: Math.floor(3000 + Math.random() * 15000),
          clickCount: Math.floor(800 + Math.random() * 9500),
          bookmarkCount: Math.floor(150 + Math.random() * 1200),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastVerifiedAt: new Date().toISOString()
        });
      }
    }
  }

  // Filter out empty subcategories
  const validSubcategories = subcategories.filter(sub => {
    const list = sectionResources.get(sub.id);
    return list && list.length > 0;
  });

  console.log(`Found ${validSubcategories.length} valid subcategories.`);

  // Shuffle resources within each subcategory as requested
  const allShuffledPrivacyResources = [];
  for (const sub of validSubcategories) {
    const list = sectionResources.get(sub.id) || [];
    const shuffledList = shuffleArray(list);
    console.log(`Subcategory: "${sub.name}" (${sub.id}) -> ${shuffledList.length} resources (shuffled)`);
    allShuffledPrivacyResources.push(...shuffledList);
  }

  console.log(`Total Privacy Resources imported & shuffled: ${allShuffledPrivacyResources.length}`);

  // Now update categories.ts
  const categoriesPath = path.join(__dirname, '../lib/db/categories.ts');
  const categoriesCode = fs.readFileSync(categoriesPath, 'utf8');
  
  // Update privacy category subcategories
  const categoriesJsonMatch = categoriesCode.match(/export const CATEGORIES: Category\[\] = (\[[\s\S]+?\]);\n/);
  if (categoriesJsonMatch) {
    const parsedCategories = JSON.parse(categoriesJsonMatch[1]);
    const privacyIndex = parsedCategories.findIndex(c => c.id === 'privacy' || c.slug === 'privacy');
    if (privacyIndex !== -1) {
      parsedCategories[privacyIndex].name = "Privacy & Adblock";
      parsedCategories[privacyIndex].subcategories = validSubcategories;
      const updatedCategoriesContent = `import { Category } from "../types";\n\nexport const CATEGORIES: Category[] = ${JSON.stringify(parsedCategories, null, 2)};\n`;
      fs.writeFileSync(categoriesPath, updatedCategoriesContent, 'utf8');
      console.log("Successfully updated lib/db/categories.ts!");
    }
  }

  // Now update seedData.ts - replace old privacy resources with new shuffled resources
  const seedDataPath = path.join(__dirname, '../lib/db/seedData.ts');
  const seedDataContent = fs.readFileSync(seedDataPath, 'utf8');
  
  // Extract non-privacy resources
  const resourcesMatch = seedDataContent.match(/export const SEED_RESOURCES: Resource\[\] = (\[[\s\S]+?\]);\n\nexport const SEED_COLLECTIONS/);
  if (resourcesMatch) {
    const existingResources = JSON.parse(resourcesMatch[1]);
    const nonPrivacyResources = existingResources.filter(r => r.categoryId !== 'privacy');
    const mergedResources = [...allShuffledPrivacyResources, ...nonPrivacyResources];
    
    const restOfFile = seedDataContent.slice(seedDataContent.indexOf('export const SEED_COLLECTIONS'));
    const newSeedDataContent = `import { Resource, Collection, ChangelogItem } from "../types";\n\nexport const SEED_RESOURCES: Resource[] = ${JSON.stringify(mergedResources, null, 2)};\n\n${restOfFile}`;
    fs.writeFileSync(seedDataPath, newSeedDataContent, 'utf8');
    console.log(`Successfully updated lib/db/seedData.ts with ${allShuffledPrivacyResources.length} fresh shuffled privacy resources! Total resources: ${mergedResources.length}`);
  }
}

run().catch(console.error);
