const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return resolve(null);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(null));
  });
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
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

    if (line.startsWith('* **Note**') || line.startsWith('* **Tip**') || line.startsWith('**Note**') || line.startsWith('**Tip**')) {
      currentTip = line.replace(/^\*\s*/, '').replace(/^\*\*Note\*\*\s*-\s*/i, '').replace(/^\*\*Tip\*\*\s*-\s*/i, '');
      continue;
    }

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

async function fixMobile() {
  const urls = [
    'https://raw.githubusercontent.com/fmhy/edit/main/docs/android-ios.md',
    'https://raw.githubusercontent.com/fmhy/edit/main/docs/mobile.md',
    'https://raw.githubusercontent.com/fmhy/edit/main/docs/android.md',
    'https://raw.githubusercontent.com/fmhy/edit/main/docs/ios.md'
  ];

  let md = null;
  for (const u of urls) {
    console.log(`Trying ${u}...`);
    md = await fetchUrl(u);
    if (md) {
      console.log(`Found mobile docs at: ${u}`);
      break;
    }
  }

  if (md) {
    const sections = parseMarkdownToSections(md, 'mobile');
    const allData = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/db/allCategorySections.json'), 'utf-8'));
    allData['mobile'] = sections;
    fs.writeFileSync(path.join(__dirname, '../lib/db/allCategorySections.json'), JSON.stringify(allData, null, 2), 'utf-8');
    console.log(`Saved ${sections.length} mobile sections!`);
  }
}

fixMobile().catch(console.error);
