const fs = require('fs');
const path = require('path');

const rawMd = fs.readFileSync(path.join(__dirname, 'privacy_raw.md'), 'utf8');
const lines = rawMd.split('\n');

const sections = [];
let currentSection = null;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Skip top wiki index links and horizontal rules
  if (line.includes('Back to Wiki Index') || line === '***' || line === '---') {
    continue;
  }

  // Heading Level 1 or 2
  if (line.startsWith('# ►') || line.startsWith('## ▷') || line.startsWith('### ▸')) {
    const isH2 = line.startsWith('# ►');
    const isH3 = line.startsWith('## ▷') || line.startsWith('### ▸');
    const rawTitle = line.replace(/^[#►▷▸\s]+/, '').trim();
    
    // Check if title has a link like [Linux Adblocking](url)
    const titleLinkMatch = rawTitle.match(/\[([^\]]+)\]\(([^\)]+)\)/);
    const title = titleLinkMatch ? titleLinkMatch[1] : rawTitle;
    const titleUrl = titleLinkMatch ? titleLinkMatch[2] : null;
    const slug = slugify(title);

    currentSection = {
      id: slug,
      slug,
      title,
      titleUrl,
      level: isH2 ? 2 : 3,
      tip: null,
      items: []
    };
    sections.push(currentSection);
    continue;
  }

  // Check for Note / Tip
  if (line.startsWith('* **Note** -') || line.startsWith('**Note** -') || line.startsWith('> **Note** -')) {
    const tipText = line.replace(/^[*\s>]*\*\*Note\*\*\s*-\s*/, '').trim();
    if (currentSection) {
      currentSection.tip = tipText;
    }
    continue;
  }

  // Check for List item
  if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ')) {
    if (!currentSection) {
      currentSection = {
        id: 'general',
        slug: 'general',
        title: 'General',
        level: 2,
        tip: null,
        items: []
      };
      sections.push(currentSection);
    }

    const isStarred = line.includes('⭐') || line.includes('🌟');
    const isIndex = line.includes('🌐');
    const isCrossLink = line.includes('↪️') || line.includes('↩️');

    // Clean line from bullet & emoji markers
    let cleanLine = line
      .replace(/^[*\-•\s]+/, '')
      .replace(/^(⭐|🌟|🌐|↪️|↩️)\s*/, '')
      .trim();

    currentSection.items.push({
      id: `item-${currentSection.slug}-${currentSection.items.length}`,
      raw: cleanLine,
      isStarred,
      isIndex,
      isCrossLink
    });
  }
}

// Filter sections that have items or tips
const validSections = sections.filter(s => s.items.length > 0 || s.tip);

console.log(`Parsed ${validSections.length} sections.`);
for (const s of validSections) {
  console.log(`- [H${s.level}] ${s.title} (#${s.slug}) -> ${s.items.length} items ${s.tip ? '(has tip)' : ''}`);
}

const outputPath = path.join(__dirname, '../lib/db/privacySections.json');
fs.writeFileSync(outputPath, JSON.stringify(validSections, null, 2), 'utf8');
console.log(`Saved to ${outputPath}`);
