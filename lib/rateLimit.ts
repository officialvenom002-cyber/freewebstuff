/**
 * Lightweight, high-performance sliding-window IP rate limiter — zero external dependencies.
 * Automatically cleans expired windows to prevent memory leaks and protects against abuse.
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// Max memory entries safety cap (prevents unbounded memory growth during high burst)
const MAX_STORE_ENTRIES = 10_000;
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
  resetAt: number; // Unix timestamp in milliseconds
  retryAfter: number; // Seconds remaining until reset
}

/**
 * Check if an action is permitted within a sliding rate window.
 *
 * @param key       Unique identifier (e.g., "submit:1.2.3.4" or "vote:1.2.3.4")
 * @param limit     Maximum requests allowed per window
 * @param windowMs  Window length in milliseconds (e.g., 60_000 for 1 min)
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  scheduleCleanup();

  const now = Date.now();
  const entry = store.get(key);

  // If store exceeds max capacity, prune oldest expired items to protect server memory
  if (store.size > MAX_STORE_ENTRIES) {
    let count = 0;
    for (const [k, val] of store.entries()) {
      if (now > val.resetAt || count < 500) {
        store.delete(k);
        count++;
      }
    }
  }

  if (!entry || now > entry.resetAt) {
    // Start fresh window
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      resetAt,
      retryAfter: 0,
    };
  }

  const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
    retryAfter: 0,
  };
}

/**
 * Extracts client IP from proxies and CDN headers (Cloudflare, Vercel, Nginx).
 */
export function getClientIp(request: Request): string {
  const headers = (request as any).headers;
  if (!headers?.get) return "127.0.0.1";

  // 1. Cloudflare CDN header
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  // 2. Standard real IP header
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // 3. Forwarded for header (first client IP in comma chain)
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return "127.0.0.1";
}

/**
 * Formats a duration in seconds into a friendly text string for users.
 */
function formatRemainingTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

/**
 * Builds a clear, user-friendly 429 Too Many Requests response with countdown information.
 */
export function rateLimitResponse(
  resetAt: number,
  customMessage?: string
): Response {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  const friendlyTime = formatRemainingTime(retryAfter);

  const message =
    customMessage ||
    `Rate limit reached. Please wait ${friendlyTime} before trying again.`;

  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      retryAfter,
      resetAt,
      friendlyTime,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}
