const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
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

async function run() {
  console.log('Fetching gaming.md from FMHY...');
  const md = await fetchUrl('https://raw.githubusercontent.com/fmhy/edit/main/docs/gaming.md');
  
  const lines = md.split('\n');
  const sections = [];
  let currentSection = null;
  let currentTip = null;
  let itemIdCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // H1 or H2 or H3
    if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
      if (currentSection) {
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

      currentSection = {
        id: slugify(title) || `section-${sections.length + 1}`,
        slug: slugify(title) || `section-${sections.length + 1}`,
        title: title,
        titleUrl: titleUrl,
        level: level === 1 ? 2 : level,
        tip: null,
        items: []
      };
      continue;
    }

    // Tip / Note lines
    if (line.startsWith('* **Note**') || line.startsWith('* **Tip**') || line.startsWith('**Note**') || line.startsWith('**Tip**')) {
      currentTip = line.replace(/^\*\s*/, '').replace(/^\*\*Note\*\*\s*-\s*/i, '').replace(/^\*\*Tip\*\*\s*-\s*/i, '');
      continue;
    }

    // List item lines
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!currentSection) {
        currentSection = {
          id: 'general-gaming',
          slug: 'general-gaming',
          title: 'General Gaming',
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

      // Clean leading emojis from raw text
      content = content.replace(/^[⭐🌐↪️•\s]+/, '').trim();

      currentSection.items.push({
        id: `gitem-${itemIdCounter++}`,
        raw: content,
        isStarred: isStarred,
        isIndex: isIndex,
        isCrossLink: isCrossLink
      });
    }
  }

  if (currentSection) {
    if (currentTip) currentSection.tip = currentTip.trim();
    currentSection.items = shuffleArray(currentSection.items);
    sections.push(currentSection);
  }

  const outPath = path.join(__dirname, '../lib/db/gamingSections.json');
  fs.writeFileSync(outPath, JSON.stringify(sections, null, 2), 'utf-8');
  console.log(`Saved ${sections.length} gaming sections to ${outPath}`);
}

run().catch(console.error);
