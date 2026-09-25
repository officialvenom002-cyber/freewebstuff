import fs from "fs";
import path from "path";
import { TypedBox } from "./boxExtractor";

let precomputedCategoryCache: Record<string, { id: string; slug: string; name: string; boxes: TypedBox[] }> | null = null;

export function getPrecomputedBoxesForCategory(slug: string): TypedBox[] | null {
  try {
    if (!precomputedCategoryCache) {
      const filePath = path.join(process.cwd(), "public", "data", "all-categories-boxes.json");
      if (fs.existsSync(filePath)) {
        precomputedCategoryCache = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      }
    }
    return precomputedCategoryCache?.[slug]?.boxes || null;
  } catch {
    return null;
  }
}
