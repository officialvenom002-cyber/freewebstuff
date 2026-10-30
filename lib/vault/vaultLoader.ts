/**
 * Zero-Vercel-Load Autonomous Vault Loader
 *
 * 1. Primary: Fetches latest community updates from jsDelivr Global Edge CDN
 *    (updated automatically by GitHub Actions with [skip ci]).
 * 2. Fallback: Local precomputed /data/all-categories-boxes.json.
 * 3. Result: ZERO Vercel deployments, ZERO build minutes, ZERO serverless invocations.
 */

const CDN_VAULT_URL = "https://cdn.jsdelivr.net/gh/officialvenom002-cyber/freewebstuff@main/public/data/all-categories-boxes.json";
const LOCAL_VAULT_URL = "/data/all-categories-boxes.json";

let cachedVaultData: Record<string, any> | null = null;
let activeFetchPromise: Promise<Record<string, any>> | null = null;

export async function fetchLiveVaultBoxes(): Promise<Record<string, any>> {
  if (cachedVaultData) return cachedVaultData;
  if (activeFetchPromise) return activeFetchPromise;

  activeFetchPromise = (async () => {
    try {
      // 1. Try free jsDelivr global edge CDN first (has latest GitHub commits without Vercel builds)
      const cdnRes = await fetch(CDN_VAULT_URL, { cache: "default" });
      if (cdnRes.ok) {
        const data = await cdnRes.json();
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          cachedVaultData = data;
          return data;
        }
      }
    } catch {
      // CDN failed, fallback to local
    }

    try {
      // 2. Fallback to local /data/ static copy
      const localRes = await fetch(LOCAL_VAULT_URL, { cache: "default" });
      if (localRes.ok) {
        const data = await localRes.json();
        cachedVaultData = data;
        return data;
      }
    } catch {
      // Fallback
    }

    return {};
  })();

  return activeFetchPromise;
}

