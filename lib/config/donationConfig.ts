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
      iconColor: "#26A17B",
      explorerUrl: "https://tronscan.org/#/address/TQGCXTG2PDEjvWXhacvxsv48E4BnzxPvJe",
    },
    {
      symbol: "SOL",
      name: "Solana",
      network: "Solana Network",
      address: "3CKrHLV3TeggSyYok8MvrCY34B5b2G73HRGA22BZRCgd",
      note: "Ultra-fast 400ms confirmation & near-zero gas fee. Supports SOL & SPL tokens.",
      iconColor: "#14F195",
      explorerUrl: "https://solscan.io/account/3CKrHLV3TeggSyYok8MvrCY34B5b2G73HRGA22BZRCgd",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      network: "Bitcoin Network",
      address: "1CY7JZgw6XjXBPpDFjQRc9r9HzAc1uEdhk",
      note: "Supports standard Bitcoin transfers from all wallets, exchanges, and cold storage worldwide.",
      iconColor: "#F7931A",
      explorerUrl: "https://www.blockchain.com/explorer/addresses/btc/1CY7JZgw6XjXBPpDFjQRc9r9HzAc1uEdhk",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      network: "Ethereum Mainnet / Arbitrum (ERC-20)",
      address: "0x6fec5ab2f5d5dd8f1761cc4a91e0ebbaccba4c62",
      note: "Supports ETH and standard ERC-20 tokens, as well as Arbitrum / Polygon L2 networks.",
      iconColor: "#627EEA",
      explorerUrl: "https://etherscan.io/address/0x6fec5ab2f5d5dd8f1761cc4a91e0ebbaccba4c62",
    },
    {
      symbol: "BNB",
      name: "BNB Chain",
      network: "BNB Smart Chain (BEP-20)",
      address: "0x6fec5ab2f5d5dd8f1761cc4a91e0ebbaccba4c62",
      note: "Supports BNB and BEP-20 tokens (BSC USDT, BUSD, etc.) with low BSC transaction fees.",
      iconColor: "#F3BA2F",
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
};
