import Fuse from "fuse.js";
import { Resource } from "../types";

export function createSearchIndex(resources: Resource[]) {
  const options = {
    keys: [
      { name: "name", weight: 0.35 },
      { name: "tagline", weight: 0.25 },
      { name: "tags", weight: 0.2 },
      { name: "description", weight: 0.1 },
      { name: "features", weight: 0.05 },
      { name: "platforms", weight: 0.05 },
    ],
    threshold: 0.35, // 0.0 is perfect match, 1.0 matches anything
    distance: 100,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  };

  return new Fuse(resources, options);
}

export function searchResources(resources: Resource[], query: string): Resource[] {
  if (!query || !query.trim()) return resources;
  const fuse = createSearchIndex(resources);
  const results = fuse.search(query.trim());
  return results.map(res => res.item);
}
