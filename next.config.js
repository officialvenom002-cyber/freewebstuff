/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
