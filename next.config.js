/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],

  // ─── Performance ────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ─── TypeScript / ESLint (build without blocking) ───────────────────────────
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ─── Images ─────────────────────────────────────────────────────────────────
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // ─── Redirects ──────────────────────────────────────────────────────────────
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/adminshobhit",
        permanent: false,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/mHpBcYJHM",
        permanent: true, // 308 — browser + CDN cache forever
      },
      {
        source: "/telegram",
        destination: "https://t.me/+N7tYaUKT2q44NGU1",
        permanent: true, // 308 — browser + CDN cache forever
      },
    ];
  },

  // ─── HTTP Headers ────────────────────────────────────────────────────────────
  async headers() {
    return [
      // Verification files & TXT roots: instant delivery, zero cache
      {
        source: "/:path(pftn.*\\.txt|0a15.*\\.txt|profiton.*\\.txt)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
          },
          {
            key: "CDN-Cache-Control",
            value: "no-store",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "no-store",
          },
        ],
      },
      // Root homepage: cached at edge for 24h, Cloudflare 7 days, browser 120s
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=120, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=604800",
          },
        ],
      },
      // JSON data vaults: Cache at edge & Cloudflare for 7 days (saves gigabytes of Fast Origin Transfer)
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=604800, stale-while-revalidate=604800",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=604800",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=604800",
          },
        ],
      },
      // SEO endpoints: cached at Cloudflare for 7 days (prevents bot crawl spikes)
      {
        source: "/:path(sitemap\\.xml|robots\\.txt|manifest\\.webmanifest)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=604800, stale-while-revalidate=604800",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=604800",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=604800",
          },
        ],
      },
      // Individual Resource Pages: Long-term cache (7d Vercel edge + 30d Cloudflare)
      {
        source: "/resource/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=2592000",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, s-maxage=2592000, stale-while-revalidate=2592000",
          },
        ],
      },
      // Category pages: Long-term cache (7d Vercel edge + 30d Cloudflare)
      {
        source: "/categories/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=604800, stale-while-revalidate=2592000",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=2592000",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, s-maxage=2592000, stale-while-revalidate=2592000",
          },
        ],
      },
      // Content pages: Long-lived edge cache (24h Vercel edge + 7d Cloudflare + 7d stale revalidate)
      {
        source: "/((?!api/|data/|_next/static|_next/image|favicon|logo|images|shobhitadmin|adminshobhit|support|donate|sw\\.js|service-worker\\.js).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=604800",
          },
        ],
      },
      // Cache-friendly APIs with automatic background revalidation
      {
        source: "/api/(site-config|categories|settings)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=604800",
          },
        ],
      },
      // Support & Donate pages: never cache stale so updates and ad-free experience reflect instantly
      {
        source: "/(support|donate)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
          },
          {
            key: "CDN-Cache-Control",
            value: "no-store",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "no-store",
          },
        ],
      },
      // Admin dashboard must never be cached by CDN or browser
      {
        source: "/(shobhitadmin|adminshobhit)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
        ],
      },
      {
        source: "/(shobhitadmin|adminshobhit)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
        ],
      },
      // Immutable cache for Next.js hashed build assets (/_next/static/*)
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Long-lived cache for public images and logos
      {
        source: "/logos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
      // Favicon and logo at root
      {
        source: "/favicon:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, immutable",
          },
        ],
      },
      {
        source: "/logo:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, immutable",
          },
        ],
      },
      // Service worker headers (cached at edge for 24h, browser validates with edge)
      {
        source: "/:path(sw\\.js|service-worker\\.js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      // Security headers — Cloudflare Full (Strict) SSL compatible
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
