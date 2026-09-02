/**
 * Lightweight sliding-window IP rate limiter — no Redis, no external deps.
 * Uses an in-memory Map. On Vercel each function instance has its own Map,
 * so this is per-instance, which is still highly effective against burst abuse.
 *
 * Auto-cleans expired entries every 60s to prevent memory growth.
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// Cleanup expired windows every 60 seconds
let cleanupScheduled = false;
function scheduleCleanup() {
  if (cleanupScheduled) return;
  cleanupScheduled = true;
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (now > entry.resetAt) store.delete(key);
    });
  }, 60_000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;  // unix ms
}

/**
 * @param key     Unique key — combine route + IP, e.g. "submit:1.2.3.4"
 * @param limit   Max allowed requests in the window
 * @param windowMs Window duration in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  scheduleCleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // Start fresh window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract the real client IP from Vercel/Cloudflare forwarded headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = (request as any).headers?.get?.("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = (request as any).headers?.get?.("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/**
 * Build a standard 429 Too Many Requests response.
 */
export function rateLimitResponse(resetAt: number): Response {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return new Response(
    JSON.stringify({ error: "Too many requests. Please slow down and try again later." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
      },
    }
  );
}
