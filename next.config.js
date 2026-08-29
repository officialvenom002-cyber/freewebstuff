/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/mHpBcYJHM",
        permanent: false,
      },
      {
        source: "/telegram",
        destination: "https://t.me/+N7tYaUKT2q44NGU1",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
