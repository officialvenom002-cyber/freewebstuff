const fs = require('fs');
const path = require('path');
const https = require('https');

const CATEGORY_MAP = [
  { slug: 'privacy', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/privacy.md' },
  { slug: 'ai', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/ai.md' },
  { slug: 'video', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/video.md' },
  { slug: 'audio', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/audio.md' },
  { slug: 'gaming', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/gaming.md' },
  { slug: 'reading', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/reading.md' },
  { slug: 'downloading', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/downloading.md' },
  { slug: 'torrenting', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/torrenting.md' },
  { slug: 'educational', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/educational.md' },
  { slug: 'mobile', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/android-ios.md' },
  { slug: 'linux-macos', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/linux-macos.md' },
  { slug: 'non-english', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/non-english.md' },
  { slug: 'misc', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/misc.md' },
  { slug: 'system-tools', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/system-tools.md' },
  { slug: 'file-tools', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/file-tools.md' },
  { slug: 'internet-tools', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/internet-tools.md' },
  { slug: 'social-media-tools', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/social-media-tools.md' },
  { slug: 'text-tools', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/text-tools.md' },
  { slug: 'gaming-tools', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/gaming-tools.md' },
  { slug: 'image-tools', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/image-tools.md' },
  { slug: 'video-tools', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/video-tools.md' },
  { slug: 'developer-tools', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/developer-tools.md' },
  { slug: 'storage', url: 'https://raw.githubusercontent.com/fmhy/edit/main/docs/storage.md' },
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return resolve(null);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(null));
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseMarkdownToSections(md, categorySlug) {
  const lines = md.split('\n');
  const sections = [];
  let currentSection = null;
  let currentTip = null;
  let itemIdCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // H1 / H2 / H3
    if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
      if (currentSection && currentSection.items.length > 0) {
        if (currentTip) {
          currentSection.tip = currentTip.trim();
          currentTip = null;
        }
        currentSection.items = shuffleArray(currentSection.items);
        sections.push(currentSection);
      }

      const level = line.startsWith('### ') ? 3 : line.startsWith('## ') ? 2 : 1;
      let title = line.replace(/^#{1,3}\s+/, '').replace(/^[►▷▸•]\s*/, '').trim();
      
      let titleUrl = null;
      const titleLinkMatch = title.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
      if (titleLinkMatch) {
        title = titleLinkMatch[1];
        titleUrl = titleLinkMatch[2];
      }

      if (title.toLowerCase().includes('back to wiki') || title.toLowerCase().includes('table of contents')) {
        currentSection = null;
        continue;
      }

      const baseSlug = slugify(title) || `sec-${sections.length + 1}`;
      currentSection = {
        id: baseSlug,
        slug: baseSlug,
        title: title,
        titleUrl: titleUrl,
        level: level === 1 ? 2 : level,
        tip: null,
        items: []
      };
      continue;
    }

    // Tip / Note
    if (line.startsWith('* **Note**') || line.startsWith('* **Tip**') || line.startsWith('**Note**') || line.startsWith('**Tip**')) {
      currentTip = line.replace(/^\*\s*/, '').replace(/^\*\*Note\*\*\s*-\s*/i, '').replace(/^\*\*Tip\*\*\s*-\s*/i, '');
      continue;
    }

    // Bullet items
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!currentSection) {
        currentSection = {
          id: `${categorySlug}-general`,
          slug: `${categorySlug}-general`,
          title: 'General',
          level: 2,
          tip: null,
          items: []
        };
      }

      let content = line.substring(2).trim();
      if (!content || content === '***' || content === '---') continue;

      const isStarred = content.includes('⭐');
      const isIndex = content.includes('🌐');
      const isCrossLink = content.includes('↪️') || content.includes('◄◄');

      content = content.replace(/^[⭐🌐↪️•\s]+/, '').trim();

      currentSection.items.push({
        id: `${categorySlug}-${itemIdCounter++}`,
        raw: content,
        isStarred: isStarred,
        isIndex: isIndex,
        isCrossLink: isCrossLink
      });
    }
  }

  if (currentSection && currentSection.items.length > 0) {
    if (currentTip) currentSection.tip = currentTip.trim();
    currentSection.items = shuffleArray(currentSection.items);
    sections.push(currentSection);
  }

  return sections;
}

async function run() {
  const allCategoryData = {};

  for (const cat of CATEGORY_MAP) {
    console.log(`Fetching ${cat.slug}...`);
    let md = await fetchUrl(cat.url);

    // Fallbacks if filename differs
    if (!md && cat.slug === 'mobile') {
      md = await fetchUrl('https://raw.githubusercontent.com/fmhy/edit/main/docs/android.md');
    }
    if (!md && cat.slug === 'linux-macos') {
      md = await fetchUrl('https://raw.githubusercontent.com/fmhy/edit/main/docs/linux.md');
    }
    if (!md && cat.slug === 'developer-tools') {
      md = await fetchUrl('https://raw.githubusercontent.com/fmhy/edit/main/docs/devtools.md');
    }

    if (md) {
      const sections = parseMarkdownToSections(md, cat.slug);
      allCategoryData[cat.slug] = sections;
      console.log(`✔ Processed ${cat.slug}: ${sections.length} sections, ${sections.reduce((a, s) => a + s.items.length, 0)} tools`);
    } else {
      console.log(`⚠ Failed to fetch ${cat.slug} from ${cat.url}`);
    }
  }

  const outPath = path.join(__dirname, '../lib/db/allCategorySections.json');
  fs.writeFileSync(outPath, JSON.stringify(allCategoryData, null, 2), 'utf-8');
  console.log(`\n🎉 Successfully generated allCategorySections.json with ${Object.keys(allCategoryData).length} categories!`);
}

run().catch(console.error);
