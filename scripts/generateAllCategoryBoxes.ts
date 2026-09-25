import fs from 'fs';
import path from 'path';
import { buildTypedBoxes } from '../lib/categories/boxExtractor.ts';
import { CATEGORIES } from '../lib/db/categories.ts';

const allSections = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'lib/db/allCategorySections.json'), 'utf8')
);

const result: Record<string, any> = {};

for (const cat of CATEGORIES) {
  const slug = cat.slug || cat.id;
  const sections = allSections[slug] || [];
  const boxes = buildTypedBoxes(slug, sections);
  result[slug] = {
    id: cat.id,
    slug: slug,
    name: cat.name,
    description: cat.description,
    boxes: boxes
  };
}

// Ensure public/data directory exists
const outDir = path.join(process.cwd(), 'public/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outDir, 'all-categories-boxes.json'),
  JSON.stringify(result)
);

console.log('SUCCESS: Generated public/data/all-categories-boxes.json');
console.log('Categories count:', Object.keys(result).length);
