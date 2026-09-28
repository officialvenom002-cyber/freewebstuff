/**
 * Donation & Support Configuration
 * 
 * Update these details with your actual payment handles, UPI IDs,
 * Ko-fi / BuyMeACoffee links, and crypto wallet addresses to accept
 * payments from anyone worldwide.
 */

export interface CryptoWallet {
  symbol: string;
  name: string;
  network: string;
  address: string;
  note?: string;
  iconColor: string;
  explorerUrl: string;
}

export const DONATION_CONFIG = {
  // Global Card & Wallets (Apple Pay, Google Pay, Cards, PayPal via Ko-fi)
  kofi: {
    enabled: true,
    username: "freewebstuff",
    url: "https://ko-fi.com/freewebstuff",
    displayName: "Support on Ko-fi",
  },
  
  // Buy Me A Coffee (Alternative)
  buyMeACoffee: {
    enabled: true,
    username: "freewebstuff",
    url: "https://buymeacoffee.com/freewebstuff",
    displayName: "Buy Me a Coffee",
  },

  // Direct PayPal
  paypal: {
    enabled: true,
    username: "ShobhitVerma02",
    url: "https://paypal.me/ShobhitVerma02?locale.x=en_GB&country.x=IN",
    displayName: "PayPal.me",
  },

  // UPI (Disabled until real UPI ID is added)
  upi: {
    enabled: false,
    id: "",
    recipientName: "FreeWebStuff Project",
    note: "Donation for FreeWebStuff server costs",
  },

  // Borderless Cryptocurrency Wallets
  crypto: [
    {
      symbol: "USDT",
      name: "Tether USD",
      network: "TRON (TRC-20)",
      address: "TQGCXTG2PDEjvWXhacvxsv48E4BnzxPvJe",
      note: "Recommended for USDT & lowest transfer fees (<$1). Please send only TRC-20 tokens.",
      iconColor: "#A1A7B5",
      explorerUrl: "https://tronscan.org/#/address/TQGCXTG2PDEjvWXhacvxsv48E4BnzxPvJe",
    },
    {
      symbol: "SOL",
      name: "Solana",
      network: "Solana Network",
      address: "3CKrHLV3TeggSyYok8MvrCY34B5b2G73HRGA22BZRCgd",
      note: "Ultra-fast 400ms confirmation & near-zero gas fee. Supports SOL & SPL tokens.",
      iconColor: "#B4BAC7",
      explorerUrl: "https://solscan.io/account/3CKrHLV3TeggSyYok8MvrCY34B5b2G73HRGA22BZRCgd",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      network: "Bitcoin Network",
      address: "1CY7JZgw6XjXBPpDFjQRc9r9HzAc1uEdhk",
      note: "Supports standard Bitcoin transfers from all wallets, exchanges, and cold storage worldwide.",
      iconColor: "#C7CBD4",
      explorerUrl: "https://www.blockchain.com/explorer/addresses/btc/1CY7JZgw6XjXBPpDFjQRc9r9HzAc1uEdhk",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      network: "Ethereum Mainnet / Arbitrum (ERC-20)",
      address: "0x6fec5ab2f5d5dd8f1761cc4a91e0ebbaccba4c62",
      note: "Supports ETH and standard ERC-20 tokens, as well as Arbitrum / Polygon L2 networks.",
      iconColor: "#9CA3AF",
      explorerUrl: "https://etherscan.io/address/0x6fec5ab2f5d5dd8f1761cc4a91e0ebbaccba4c62",
    },
    {
      symbol: "BNB",
      name: "BNB Chain",
      network: "BNB Smart Chain (BEP-20)",
      address: "0x6fec5ab2f5d5dd8f1761cc4a91e0ebbaccba4c62",
      note: "Supports BNB and BEP-20 tokens (BSC USDT, BUSD, etc.) with low BSC transaction fees.",
      iconColor: "#ACB2BF",
      explorerUrl: "https://bscscan.com/address/0x6fec5ab2f5d5dd8f1761cc4a91e0ebbaccba4c62",
    },
  ] as CryptoWallet[],

  // Preset donation tiers
  tiers: [
    { amount: "$3", label: "Coffee", perk: "Keeps our search index bots fueled for a week" },
    { amount: "$10", label: "Supporter", perk: "Funds server uptime & database hosting for 1 month", popular: true },
    { amount: "$25", label: "Champion", perk: "Helps verify 5,000+ new community links & tools" },
    { amount: "$100", label: "Patron", perk: "Covers dedicated proxy infrastructure & annual domain renewals" },
  ],

  // Supporter Perks & Website Promotion Benefits
  perks: [
    {
      id: "top-listing",
      title: "Free Top Category Placement",
      description: "Get your website or tool permanently pinned at the very top of its category with a 'Featured Partner' badge.",
      badge: "Highest Value",
      icon: "Award",
    },
    {
      id: "homepage-spotlight",
      title: "Homepage Promotion & Spotlight",
      description: "Showcase your project on the FreeWebStuff homepage hero banner, seen by over 100,000+ monthly active visitors.",
      badge: "Max Visibility",
      icon: "Sparkles",
    },
    {
      id: "verified-badge",
      title: "Verified Creator Gold Badge",
      description: "Distinctive verified creator badge next to your tool across global search, collections, and category archives.",
      badge: "Authority",
      icon: "ShieldCheck",
    },
    {
      id: "seo-backlink",
      title: "High-Authority Clean Backlink",
      description: "Clean do-follow link to your product, open-source repository, or portfolio to supercharge your domain authority.",
      badge: "SEO Boost",
      icon: "Globe",
    },
    {
      id: "fast-track",
      title: "Instant 1-Hour Link Review",
      description: "Skip the community queue — submitted tools and updates from supporters are verified and published within 1 hour.",
      badge: "Instant",
      icon: "Zap",
    },
    {
      id: "vip-community",
      title: "VIP Discord & Telegram Role",
      description: "Exclusive @Supporter role, private channels, direct founder chat access, and early voting on upcoming platform features.",
      badge: "Community",
      icon: "Crown",
    },
  ],

  // Community Channels for Supporter Role Claiming & Direct Chat
  community: {
    telegram: {
      url: "https://t.me/+N7tYaUKT2q44NGU1",
      handle: "FreeWebStuff Community",
      members: "2,400+ Members",
      tagline: "Instant tool drops, link alerts & direct founder chat",
    },
    discord: {
      url: "https://discord.gg/mHpBcYJHM",
      handle: "FreeWebStuff Discord",
      members: "1,800+ Members",
      tagline: "VIP Supporter lounge, tool requests & dev channels",
    },
  },

  // Hall of Fame / Top Donators Leaderboard
  topSupporters: [
    {
      rank: 1,
      name: "Anonymous Patron",
      amount: "$150",
      tier: "Legendary Backer",
      date: "September 2026",
      website: "https://freewebstuff.site",
      websiteName: "Privacy First Initiative",
      message: "Keep the web open, free, and tracker-less.",
      isTop1: true,
    },
    {
      rank: 2,
      name: "CyberSentinel",
      amount: "$75",
      tier: "Diamond Supporter",
      date: "September 2026",
      website: "https://github.com",
      websiteName: "Open Security Lab",
      message: "Incredible resource for developers and creators worldwide.",
    },
    {
      rank: 3,
      name: "DevNerd99",
      amount: "$50",
      tier: "Gold Supporter",
      date: "September 2026",
      website: "https://freewebstuff.site",
      websiteName: "Personal Portfolio",
      message: "Proud to support independent hosting.",
    },
    {
      rank: 4,
      name: "WebCrafter",
      amount: "$30",
      tier: "Silver Supporter",
      date: "August 2026",
      website: "",
      websiteName: "",
      message: "Best bookmark hub on the internet!",
    },
  ],
};
