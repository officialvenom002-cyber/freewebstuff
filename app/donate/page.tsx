"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  HelpCircle,
  Server,
  Layers,
  Sparkles,
  Lock,
  EyeOff,
  UserCheck,
  Crown,
  Award,
  Globe,
  Zap,
  MessageSquare,
  Send,
  Star,
  Flame,
  CheckCircle2,
  Heart
} from "lucide-react";
import { DONATION_CONFIG } from "@/lib/config/donationConfig";
import { TopSupporter } from "@/lib/db/siteConfig";

type PaymentTab = "cards" | "paypal" | "crypto" | "upi";

function PawIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="14" r="3.5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="7" cy="9.5" r="2.2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="10.2" cy="5.5" r="2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="13.8" cy="5.5" r="2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="17" cy="9.5" r="2.2" fill="currentColor" fillOpacity="0.25" />
    </svg>
  );
}

function FoodBowlIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 11h16a1 1 0 0 1 1 1c0 5-4.03 9-9 9s-9-4-9-9a1 1 0 0 1 1-1Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M6 7.5c1-1.2 2-1.2 3 0" />
      <path d="M10.5 6.5c1-1.2 2-1.2 3 0" />
      <path d="M15 7.5c1-1.2 2-1.2 3 0" />
    </svg>
  );
}

function HandHeartIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

const TIER_IMPACT_DETAILS = [
  {
    amount: "$3",
    charityAmount: "$2.25",
    serverAmount: "$0.75",
    summary: "Provides 3 wholesome hot meals for hungry street dwellers or fresh food for 3 stray dogs + covers search bot upkeep for 1 week.",
  },
  {
    amount: "$10",
    charityAmount: "$7.50",
    serverAmount: "$2.50",
    summary: "Feeds an impoverished family warm nutritious meals OR nourishes 10+ street dogs with food & medicine + funds 1 month server hosting.",
  },
  {
    amount: "$25",
    charityAmount: "$18.75",
    serverAmount: "$6.25",
    summary: "Distributes thick winter fleece blankets, 20+ hot meals to homeless elders, veterinary first-aid for injured street animals, and verifies 5,000+ links.",
  },
  {
    amount: "$100",
    charityAmount: "$75.00",
    serverAmount: "$25.00",
    summary: "Sponsors an entire weekend community food drive feeding 75+ poor individuals, 50+ stray dogs, and covers annual edge proxy & domain renewals.",
  },
];

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState<PaymentTab>("cards");
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [selectedCrypto, setSelectedCrypto] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Dynamic live supporters state
  const [liveSupporters, setLiveSupporters] = useState<TopSupporter[]>(
    ((DONATION_CONFIG.topSupporters || []) as unknown) as TopSupporter[]
  );
  const [isLoadingSupporters, setIsLoadingSupporters] = useState(true);

  useEffect(() => {
    fetch("/api/supporters")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.supporters)) {
          setLiveSupporters(data.supporters);
        }
      })
      .catch((err) => {
        console.error("Could not fetch live supporters:", err);
      })
      .finally(() => setIsLoadingSupporters(false));
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const hasCrypto = DONATION_CONFIG.crypto && DONATION_CONFIG.crypto.length > 0;
  const currentCrypto = hasCrypto ? (DONATION_CONFIG.crypto[selectedCrypto] || DONATION_CONFIG.crypto[0]) : null;
  const isUpiEnabled = DONATION_CONFIG.upi.enabled && Boolean(DONATION_CONFIG.upi.id);

  const upiDeepLink = isUpiEnabled
    ? `upi://pay?pa=${encodeURIComponent(DONATION_CONFIG.upi.id)}&pn=${encodeURIComponent(DONATION_CONFIG.upi.recipientName)}&tn=${encodeURIComponent(DONATION_CONFIG.upi.note)}&cu=INR`
    : "";
  const cryptoQrUrl = currentCrypto
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(currentCrypto.address)}`
    : "";

  const activeTierObj = DONATION_CONFIG.tiers[selectedTier] || DONATION_CONFIG.tiers[1];
  const currentTierImpact = TIER_IMPACT_DETAILS[selectedTier] || TIER_IMPACT_DETAILS[1];
  const top1Supporter = liveSupporters.find((s) => s.isTop1) || liveSupporters[0] || null;
  const otherSupporters = top1Supporter ? liveSupporters.filter((s) => s.id !== top1Supporter.id) : [];

  return (
    <div className="relative min-h-screen bg-[#090B0E] text-[#E5E7EB]">
      {/* Matte tactile dot grid layer */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, #000 50%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, #000 50%, transparent 100%)"
        }}
      />
      {/* Soft ambient overhead matte light */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(148,163,184,0.05),transparent_70%)] z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-20 space-y-16">
      
        {/* Top Floating 75% Impact Ribbon */}
        <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#141A24] to-rose-950/50 border border-emerald-500/40 text-xs sm:text-sm text-[#E2E5EC] flex flex-col md:flex-row items-center justify-between gap-3 shadow-[0_4px_30px_rgba(16,185,129,0.15)] backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="flex h-3.5 w-3.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <span className="leading-snug">
              <strong className="text-white font-extrabold tracking-wide uppercase text-xs bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 mr-1.5">75% Direct Impact Pledge</strong>
              75% of your total donation buys warm meals for the poor, wholesome food for stray dogs, and winter survival blankets.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px] font-bold text-emerald-300 bg-emerald-900/30 px-3 py-1 rounded-xl border border-emerald-500/30">
            <span>🍲 Food for Poor</span>
            <span>&bull;</span>
            <span>🐕 Stray Dogs</span>
            <span>&bull;</span>
            <span>🤝 Blankets</span>
          </div>
        </div>

      {/* ── 1. Hero Section ── */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-emerald-500/15 via-rose-500/15 to-amber-500/15 text-[#EDEDEE] border border-emerald-500/30 shadow-sm animate-fade-in">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>75% Donated to Food for the Poor &amp; Stray Dogs &bull; 25% Open Web Servers &bull; 100% Ad-Free</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-[#EDEDEE] leading-[1.08]">
          Fuel the Free Web.<br className="hidden sm:inline" /> Feed a Soul.
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#8E939E] leading-relaxed">
          FreeWebStuff indexes over 20,000+ free tools and educational vaults without paywalls. 
          When you contribute, <strong>75% goes directly toward buying warm meals for homeless families, feeding hungry street dogs, and emergency relief</strong>, while 25% sustains our high-speed edge nodes.
        </p>

        {/* ── Preset Tiers in Matte Finish ── */}
        <div className="pt-4 max-w-4xl mx-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {DONATION_CONFIG.tiers.map((tier, idx) => {
              const isSelected = selectedTier === idx;
              const impact = TIER_IMPACT_DETAILS[idx] || TIER_IMPACT_DETAILS[1];
              return (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => setSelectedTier(idx)}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? "bg-[#181B22] border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-xl scale-[1.02]"
                      : "bg-[#111317] border-[#22252C] hover:border-[#383D4A] hover:bg-[#14171E] hover:-translate-y-0.5"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-[#0C0D10] shadow-sm">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">{tier.amount}</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      75% = {impact.charityAmount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#A1A5B0] mt-1">{tier.label}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <span>🍲 {impact.charityAmount} to food &amp; dogs</span>
                  </div>
                  <div className="text-xs text-[#6E7380] mt-1 line-clamp-2 leading-snug">
                    {tier.perk}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Action Checkout Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#111317] border border-[#22252C] flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="text-center md:text-left space-y-0.5">
              <div className="text-[#8E939E]">
                Selected Tier: <strong className="text-[#EDEDEE] font-bold">{activeTierObj.amount} ({activeTierObj.label})</strong>
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  75% ({currentTierImpact.charityAmount}) for Food &amp; Rescue
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-[#6E7380]">
                {activeTierObj.perk} &bull; Includes Supporter VIP Perks
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              <a
                href={DONATION_CONFIG.kofi.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] font-bold text-xs sm:text-sm transition-all duration-150 active:scale-95 shadow-sm"
              >
                <span>Give on Ko-fi</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5A606E]" />
              </a>
              <a
                href={DONATION_CONFIG.buyMeACoffee.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181B22] hover:bg-[#20242D] text-[#D8DBE2] border border-[#2A2E38] font-bold text-xs sm:text-sm transition-all duration-150 active:scale-95"
              >
                <span>Buy Me a Coffee</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#6E7380]" />
              </a>
              <a
                href={DONATION_CONFIG.paypal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181B22] hover:bg-[#20242D] text-[#D8DBE2] border border-[#2A2E38] font-bold text-xs sm:text-sm transition-all duration-150 active:scale-95"
              >
                <span>PayPal</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#6E7380]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. The 75% Social Impact Pledge Section ── */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#131722] via-[#0F1219] to-[#0A0C10] border border-[#262C3D] p-6 sm:p-10 shadow-2xl overflow-hidden space-y-8 group transition-all duration-300">
        {/* Ambient subtle glow background */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Section Heading & Stat Badge */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-emerald-500/15 via-rose-500/15 to-amber-500/15 text-[#EDEDEE] border border-emerald-500/30 shadow-sm animate-pulse">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>The 75% Compassion Pledge &bull; Tech with a Soul</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-[#EDEDEE] leading-tight">
              75% of Every Donation Feeds the Hungry &amp; Rescues Stray Animals.
            </h2>

            <p className="text-sm sm:text-base text-[#9DA2B0] leading-relaxed">
              We believe free software and open knowledge should actively heal the real world. 
              <strong> 75% of all funds received are directly used to buy warm meals for homeless people, feed hungry street dogs, and distribute survival blankets to families living in poverty.</strong> 
              The remaining 25% keeps FreeWebStuff fast, independent, and 100% ad-free on this page.
            </p>
          </div>

          {/* Impact ratio visual badge */}
          <div className="shrink-0 p-5 rounded-2xl bg-[#0B0D12] border border-[#202534] flex flex-col items-center justify-center text-center space-y-1 shadow-inner min-w-[180px]">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              75% / 25%
            </div>
            <div className="text-xs font-semibold text-[#8E939E]">
              Charity &bull; Servers Split
            </div>
          </div>
        </div>

        {/* 75 / 25 Visual Progress Split Meter */}
        <div className="relative z-10 space-y-3">
          <div className="w-full h-5 rounded-full bg-[#0D0F14] border border-[#222736] p-0.5 overflow-hidden flex shadow-inner">
            {/* 75% Charity segment */}
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-rose-500 to-amber-500 shadow-[0_0_16px_rgba(16,185,129,0.4)] transition-all duration-700 ease-out"
              style={{ width: "75%" }}
            />
            {/* 25% Server segment */}
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-700 ease-out ml-1"
              style={{ width: "25%" }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#8E939E] gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-rose-400 shrink-0 shadow-sm" />
              <span className="font-semibold text-[#EDEDEE]">75% ($0.75 per $1)</span>
              <span>&mdash; Food for Poor, Stray Dog Feeding &amp; Winter Relief</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
              <span className="font-semibold text-[#EDEDEE]">25% ($0.25 per $1)</span>
              <span>&mdash; Edge Servers, Domain &amp; Link Health Bots</span>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Compassion Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Pillar 1: Food for Poor */}
          <div className="group/card p-6 rounded-2xl bg-[#0E1117] border border-[#202533] hover:border-emerald-500/50 hover:bg-[#121620] transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 shadow-md hover:shadow-emerald-500/10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                  <FoodBowlIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Zero Hunger
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#EDEDEE] group-hover/card:text-white transition-colors">
                Warm Meals for the Poor &amp; Hungry
              </h3>

              <p className="text-xs sm:text-[13px] text-[#8E939E] leading-relaxed">
                Daily freshly prepared, nutritious warm meals distributed directly to homeless elders, daily wage workers, and impoverished street children who struggle for a single square meal.
              </p>
            </div>

            <div className="pt-3 border-t border-[#1C212D] text-[11px] text-[#A1A5B0] flex items-center justify-between">
              <span>Direct field distribution</span>
              <span className="font-semibold text-emerald-400">Fresh hot food</span>
            </div>
          </div>

          {/* Pillar 2: Food for Dogs & Stray Animals */}
          <div className="group/card p-6 rounded-2xl bg-[#0E1117] border border-[#202533] hover:border-rose-500/50 hover:bg-[#121620] transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 shadow-md hover:shadow-rose-500/10">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                <PawIcon className="w-6 h-6 text-rose-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Animal Welfare
              </span>

              <h3 className="text-lg font-bold text-[#EDEDEE] group-hover/card:text-white transition-colors">
                Food &amp; Care for Stray Dogs &amp; Animals
              </h3>

              <p className="text-xs sm:text-[13px] text-[#8E939E] leading-relaxed">
                Street dogs and animals endure starvation, extreme weather, and accidents. We provide daily wholesome feeding, clean water bowls, emergency wound treatment, and winter jackets.
              </p>
            </div>

            <div className="pt-3 border-t border-[#1C212D] text-[11px] text-[#A1A5B0] flex items-center justify-between">
              <span>Daily street feeding rounds</span>
              <span className="font-semibold text-rose-400">Medicine &amp; Nutrition</span>
            </div>
          </div>

          {/* Pillar 3: Winter Relief & Basic Essentials */}
          <div className="group/card p-6 rounded-2xl bg-[#0E1117] border border-[#202533] hover:border-amber-500/50 hover:bg-[#121620] transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 shadow-md hover:shadow-amber-500/10">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                <HandHeartIcon className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Community Aid
              </span>

              <h3 className="text-lg font-bold text-[#EDEDEE] group-hover/card:text-white transition-colors">
                Blankets, Clothes &amp; Essential Aid
              </h3>

              <p className="text-xs sm:text-[13px] text-[#8E939E] leading-relaxed">
                Distributing thick fleece blankets to rough sleepers during harsh winter cold waves, dry grocery ration kits, clean drinking water, and school supplies for children in poverty.
              </p>
            </div>

            <div className="pt-3 border-t border-[#1C212D] text-[11px] text-[#A1A5B0] flex items-center justify-between">
              <span>Zero administrative waste</span>
              <span className="font-semibold text-amber-400">100% On-Ground</span>
            </div>
          </div>

        </div>

        {/* Dynamic Tier Impact Banner */}
        <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-[#0A0D12] border border-[#1E2433] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-rose-500/20 border border-emerald-500/30 flex items-center justify-center text-[#EDEDEE] shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-[#EDEDEE]">
                Impact for your selected {activeTierObj.amount} ({activeTierObj.label}) tier:
              </div>
              <div className="text-[#8E939E] text-xs">
                {currentTierImpact.summary}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141822] border border-[#232938] text-xs font-semibold text-emerald-400 shrink-0">
            <span>75% = {currentTierImpact.charityAmount} directly to food &amp; relief</span>
          </div>
        </div>

      </div>

      {/* ── 2. Top Donator Spotlight & Hall of Fame (Wall of Honor) ── */}
      <div className="space-y-6">
        <div className="text-center sm:text-left space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-[#141822] text-[#A1A5B0] border border-[#232938]">
            <Crown className="w-3.5 h-3.5 text-[#E5E7EB]" />
            <span>Wall of Honor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">
            Top Supporters &amp; Backers
          </h2>
          <p className="text-sm text-[#8E939E]">
            Meet the generous backers keeping FreeWebStuff independent. Backers receive homepage shoutouts, custom verified badges, and top site promotions.
          </p>
        </div>

        {/* Grid: #1 Spotlight Card + Honor Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* #1 Supporter Hero Card */}
          {top1Supporter ? (
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181B24] to-[#111318] border border-[#3A404F] shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Crown className="w-32 h-32 text-white" />
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EDEDEE] text-[#0C0D10] shadow-sm">
                    <Flame className="w-3.5 h-3.5 fill-[#0C0D10]" />
                    #1 Top Supporter
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#A1A5B0]">
                    {top1Supporter.date}
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">
                    {top1Supporter.name}
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#A1A5B0] mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>{top1Supporter.tier} &bull; {top1Supporter.amount} Contributed</span>
                  </div>
                </div>

                {top1Supporter.message && (
                  <blockquote className="p-4 rounded-xl bg-[#0D0F13] border border-[#242832] text-xs sm:text-sm text-[#D1D5DB] italic leading-relaxed">
                    &ldquo;{top1Supporter.message}&rdquo;
                  </blockquote>
                )}

                {top1Supporter.website && (
                  <div className="pt-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6E7380] mb-1.5">
                      Promoted Website / Project
                    </div>
                    <a
                      href={top1Supporter.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#14171E] hover:bg-[#1B1F28] border border-[#2B303C] text-xs font-semibold text-[#EDEDEE] transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      <span>{top1Supporter.websiteName || top1Supporter.website}</span>
                      <ExternalLink className="w-3 h-3 text-[#6E7380]" />
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-[#252A36] text-[11px] text-[#8E939E] flex items-center justify-between">
                <span>Pinned placement across category archives</span>
                <span className="font-mono text-[#A1A5B0]">Verified Partner</span>
              </div>
            </div>
          ) : (
            /* Blank #1 Spotlight (Open for Claim) */
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#13161F] to-[#0D0F14] border border-[#242A38] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_12px_36px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
                <Crown className="w-32 h-32 text-white" />
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1A1F2B] text-[#9CA3AF] border border-[#2B3346] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    #1 Spotlight Available
                  </span>
                  <span className="text-[11px] font-mono text-[#6E7380] uppercase tracking-wider">
                    Claimable Now
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">
                    Claim the #1 Crown Spot
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#8E939E] leading-relaxed">
                    Be the premier supporter of FreeWebStuff. Your name, personal message, and do-follow website link will be permanently highlighted in this spotlight card.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#090B0E]/80 border border-[#1A1F29] space-y-2 text-xs text-[#9AA0AD]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>Pinned top spot across category archives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>High-authority clean backlink for your domain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>Custom Gold Verified badge on directory</span>
                  </div>
                </div>

                <a
                  href="#payment-methods"
                  onClick={() => setActiveTab("cards")}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#EDEDEE] hover:bg-white text-[#0C0D10] font-bold text-xs sm:text-sm transition-all duration-150 active:scale-95 shadow-md cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-[#0C0D10]" />
                  <span>Become Our #1 Supporter</span>
                </a>
              </div>

              <div className="pt-5 mt-6 border-t border-[#1C212D] text-[11px] text-[#6E7380] flex items-center justify-between font-mono">
                <span>Slot: Open to first contributor</span>
                <span className="text-[#9CA3AF]">Instant Live Feature</span>
              </div>
            </div>
          )}

          {/* Honor Roll Leaderboard List */}
          <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#0E1117] border border-[#1E232E] shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#8E939E] pb-2 border-b border-[#1E232E]">
                <span>Supporter</span>
                <span>Tier &amp; Contribution</span>
              </div>

              <div className="space-y-2.5">
                {otherSupporters.length > 0 ? (
                  otherSupporters.map((supporter) => (
                    <div
                      key={supporter.id || supporter.rank}
                      className="p-3.5 rounded-2xl bg-[#121620] border border-[#1F2533] hover:border-[#353D50] transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#1A1F2C] border border-[#262E40] text-xs font-black text-[#EDEDEE] flex items-center justify-center shrink-0">
                          #{supporter.rank}
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-[#EDEDEE] flex items-center gap-2 truncate">
                            <span>{supporter.name}</span>
                            {supporter.website && (
                              <a
                                href={supporter.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#8E939E] hover:text-[#EDEDEE] inline-flex items-center gap-0.5"
                                title="Visit supporter website"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6E7380] truncate mt-0.5">
                            {supporter.message || supporter.websiteName || supporter.date}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-xs sm:text-sm text-[#EDEDEE]">{supporter.amount}</div>
                        <div className="text-[10px] font-medium text-[#8E939E]">{supporter.tier}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  /* Blank Open Ranking Slots */
                  [2, 3, 4].map((slotRank) => (
                    <div
                      key={slotRank}
                      className="p-3.5 rounded-2xl bg-[#10141C]/60 border border-[#1C222E] border-dashed flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#161B26] border border-[#202738] text-xs font-mono font-bold text-[#6E7380] flex items-center justify-center shrink-0">
                          #{slotRank}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-300 flex items-center gap-2">
                            <span>[ Open Supporter Spot ]</span>
                          </div>
                          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                            Available for next backer &bull; Website promotion eligible
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#141822] text-zinc-400 border border-[#202738]">
                          Open
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* How to get featured callout */}
            <div className="p-3.5 rounded-xl bg-[#090B0E] border border-[#1A1F29] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[#8E939E]">
              <span>
                Want your website, handle, or message featured on this Wall of Honor?
              </span>
              <a
                href={DONATION_CONFIG.community.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EDEDEE] hover:text-white shrink-0 underline decoration-[#4A5060]"
              >
                <span>Message on Telegram / Discord</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── 3. Exclusive Supporter Perks (Website Benefits Grid) ── */}
      <div className="space-y-6">
        <div className="text-center sm:text-left space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-[#181B22] text-[#A1A5B0] border border-[#262A34]">
            <Award className="w-3.5 h-3.5 text-[#E5E7EB]" />
            <span>Website Promotion Benefits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">
            How We Reward Our Supporters
          </h2>
          <p className="text-sm text-[#8E939E]">
            We value your backing. In return, all project supporters receive real, tangible perks across our platform.
          </p>
        </div>

        {/* 6 Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DONATION_CONFIG.perks.map((perk) => (
            <div
              key={perk.id}
              className="p-6 rounded-2xl bg-[#111317] border border-[#22252C] hover:border-[#383E4D] hover:bg-[#14161C] transition-all duration-200 flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#252932] flex items-center justify-center text-[#E5E7EB] group-hover:scale-105 transition-transform">
                    {perk.icon === "Award" && <Award className="w-5 h-5 text-[#9CA3AF]" />}
                    {perk.icon === "Sparkles" && <Sparkles className="w-5 h-5 text-[#9CA3AF]" />}
                    {perk.icon === "ShieldCheck" && <ShieldCheck className="w-5 h-5 text-[#9CA3AF]" />}
                    {perk.icon === "Globe" && <Globe className="w-5 h-5 text-[#9CA3AF]" />}
                    {perk.icon === "Zap" && <Zap className="w-5 h-5 text-[#9CA3AF]" />}
                    {perk.icon === "Crown" && <Crown className="w-5 h-5 text-[#9CA3AF]" />}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#181B22] text-[#A1A5B0] border border-[#252932]">
                    {perk.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#EDEDEE] group-hover:text-white transition-colors">
                  {perk.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-[#8E939E] leading-relaxed">
                  {perk.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1C1F26] flex items-center justify-between text-[11px] text-[#6E7380]">
                <span>Automatic on $10+ contribution</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Main Payment Card (Seamless Single-Row Tabs) ── */}
      <div id="payment-methods" className="bg-[#111317] border border-[#22252C] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Method Switcher Tabs (Seamless, Responsive Single-Row Bar) */}
        <div className="flex items-center overflow-x-auto no-scrollbar border-b border-[#22252C] bg-[#0C0D10] px-2 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab("cards")}
            className={`flex items-center justify-center gap-2.5 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 shrink-0 cursor-pointer ${
              activeTab === "cards"
                ? "border-[#EDEDEE] text-[#EDEDEE] bg-[#14161C]"
                : "border-transparent text-[#717684] hover:text-[#C5C9D3] hover:bg-[#101216]"
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#9CA3AF]" />
            <span>Cards &amp; Wallets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("paypal")}
            className={`flex items-center justify-center gap-2.5 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 shrink-0 cursor-pointer ${
              activeTab === "paypal"
                ? "border-[#EDEDEE] text-[#EDEDEE] bg-[#14161C]"
                : "border-transparent text-[#717684] hover:text-[#C5C9D3] hover:bg-[#101216]"
            }`}
          >
            <Lock className="w-4 h-4 text-[#9CA3AF]" />
            <span>PayPal Direct</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("crypto")}
            className={`flex items-center justify-center gap-2.5 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 shrink-0 cursor-pointer ${
              activeTab === "crypto"
                ? "border-[#EDEDEE] text-[#EDEDEE] bg-[#14161C]"
                : "border-transparent text-[#717684] hover:text-[#C5C9D3] hover:bg-[#101216]"
            }`}
          >
            <Coins className="w-4 h-4 text-[#9CA3AF]" />
            <span>Cryptocurrency</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upi")}
            className={`flex items-center justify-center gap-2.5 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 shrink-0 cursor-pointer ${
              activeTab === "upi"
                ? "border-[#EDEDEE] text-[#EDEDEE] bg-[#14161C]"
                : "border-transparent text-[#717684] hover:text-[#C5C9D3] hover:bg-[#101216]"
            }`}
          >
            <QrCode className="w-4 h-4 text-[#9CA3AF]" />
            <span>UPI &amp; Private QR</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="p-6 sm:p-10">

          {/* ── TAB 1: Cards & Digital Wallets ── */}
          {activeTab === "cards" && (
            <div className="space-y-8">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-[#181B22] text-[#9CA3AF] border border-[#262A34]">
                  <span>Global Checkout &bull; 200+ Countries</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">
                  Instant Checkout with Any Card or Wallet
                </h3>
                <p className="text-sm text-[#8E939E] max-w-xl">
                  Support using Visa, MasterCard, American Express, Apple Pay, Google Pay, or international debit cards without account creation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Ko-fi Card */}
                <a
                  href={DONATION_CONFIG.kofi.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 rounded-2xl border border-[#242831] hover:border-[#444A58] bg-[#14161C] hover:bg-[#181B22] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#EDEDEE] text-base group-hover:text-white transition-colors">
                        Ko-fi
                      </span>
                      <span className="text-[11px] font-semibold text-[#9CA3AF] bg-[#1B1E26] px-2.5 py-1 rounded-md border border-[#2A2E38]">
                        0% Platform Fee
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#8E939E] leading-relaxed">
                      Official verified profile. Supports one-time or monthly donations via Cards, Apple Pay, Google Pay &amp; PayPal.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] px-2.5 py-1 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Credit Cards</span>
                      <span className="text-[11px] px-2.5 py-1 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Apple Pay</span>
                      <span className="text-[11px] px-2.5 py-1 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Google Pay</span>
                    </div>
                  </div>
                  <div className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] font-bold text-xs sm:text-sm transition-colors">
                    <span>Open Ko-fi (freewebstuff)</span>
                    <ExternalLink className="w-4 h-4 text-[#5A606E]" />
                  </div>
                </a>

                {/* Buy Me A Coffee Card */}
                <a
                  href={DONATION_CONFIG.buyMeACoffee.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 rounded-2xl border border-[#242831] hover:border-[#444A58] bg-[#14161C] hover:bg-[#181B22] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#EDEDEE] text-base group-hover:text-white transition-colors">
                        Buy Me a Coffee
                      </span>
                      <span className="text-[11px] font-semibold text-[#9CA3AF] bg-[#1B1E26] px-2.5 py-1 rounded-md border border-[#2A2E38]">
                        1-Click Coffee Tip
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#8E939E] leading-relaxed">
                      Send a $3 or $5 tip instantly with credit/debit cards, Apple Pay, or Google Pay without creating an account.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] px-2.5 py-1 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Instant Tip</span>
                      <span className="text-[11px] px-2.5 py-1 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Debit Cards</span>
                      <span className="text-[11px] px-2.5 py-1 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">GPay / Apple</span>
                    </div>
                  </div>
                  <div className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] border border-[#2C303B] font-bold text-xs sm:text-sm transition-colors">
                    <span>Open Buy Me a Coffee</span>
                    <ExternalLink className="w-4 h-4 text-[#6E7380]" />
                  </div>
                </a>

                {/* PayPal Direct Card */}
                <a
                  href={DONATION_CONFIG.paypal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 rounded-2xl border border-[#242831] hover:border-[#444A58] bg-[#14161C] hover:bg-[#181B22] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#EDEDEE] text-base group-hover:text-white transition-colors">
                        PayPal.me
                      </span>
                      <span className="text-[11px] font-semibold text-[#9CA3AF] bg-[#1B1E26] px-2.5 py-1 rounded-md border border-[#2A2E38]">
                        Direct Transfer
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#8E939E] leading-relaxed">
                      Transfer directly via PayPal.me balance or any linked bank account in 200+ countries with donor protection.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] px-2.5 py-1 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">PayPal Balance</span>
                      <span className="text-[11px] px-2.5 py-1 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">International</span>
                    </div>
                  </div>
                  <div className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] border border-[#2C303B] font-bold text-xs sm:text-sm transition-colors">
                    <span>Open PayPal.me</span>
                    <ExternalLink className="w-4 h-4 text-[#6E7380]" />
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* ── TAB 2: PayPal Dedicated ── */}
          {activeTab === "paypal" && (
            <div className="space-y-8 text-center sm:text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-[#181B22] text-[#9CA3AF] border border-[#262A34]">
                  <span>200+ Countries &bull; Buyer &amp; Donor Protection</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">
                  Direct PayPal Donation
                </h3>
                <p className="text-sm text-[#8E939E] max-w-xl">
                  Transfer funds directly to our verified PayPal handle or checkout using any international debit or credit card linked to PayPal.
                </p>
              </div>

              <div className="max-w-lg p-6 rounded-2xl bg-[#14161C] border border-[#242831] space-y-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8E939E] font-medium">Official PayPal Handle</span>
                  <code className="font-mono text-[#EDEDEE] font-bold text-sm bg-[#0E1014] px-3 py-1 rounded-lg border border-[#22252C]">
                    paypal.me/{DONATION_CONFIG.paypal.username}
                  </code>
                </div>

                <a
                  href={DONATION_CONFIG.paypal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] font-bold text-sm transition-colors shadow-sm"
                >
                  <span>Open PayPal.me/{DONATION_CONFIG.paypal.username}</span>
                  <ExternalLink className="w-4 h-4 text-[#5A606E]" />
                </a>
              </div>
            </div>
          )}

          {/* ── TAB 3: Borderless Cryptocurrency ── */}
          {activeTab === "crypto" && (
            <div className="space-y-8">
              {hasCrypto && currentCrypto ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22252C] pb-5">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-[#181B22] text-[#9CA3AF] border border-[#262A34]">
                        <span>100% Borderless &bull; Completely Decentralized</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">
                        Cryptocurrency Donations
                      </h3>
                      <p className="text-sm text-[#8E939E]">
                        Instant confirmation, zero conversion fees, and works from any wallet worldwide.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#14161C] border border-[#22252C] text-xs text-[#8E939E] shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#9CA3AF]" />
                      <span>Verified Official Addresses</span>
                    </div>
                  </div>

                  {/* Coin Selector Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
                    {DONATION_CONFIG.crypto.map((coin, idx) => {
                      const isSelected = selectedCrypto === idx;
                      return (
                        <button
                          key={coin.symbol}
                          type="button"
                          onClick={() => setSelectedCrypto(idx)}
                          className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                            isSelected
                              ? "bg-[#1C1F27] text-[#EDEDEE] border border-[#4E5566] ring-1 ring-[#60697D] shadow-md"
                              : "bg-[#14161C] text-[#8E939E] border border-[#242831] hover:text-[#C5C9D3] hover:bg-[#181B22]"
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8E939E] shrink-0" />
                          <div className="truncate">
                            <div className="font-extrabold text-[#EDEDEE] text-sm">{coin.symbol}</div>
                            <div className="text-[11px] text-[#6E7380] truncate font-normal mt-0.5">{coin.network.split(" ")[0]}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Selected Coin Details Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#242831]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      
                      {/* Big QR Viewfinder Container */}
                      <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#14161C] border border-[#242831]">
                        <div className="p-4 bg-white rounded-2xl shadow-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cryptoQrUrl}
                            alt={`${currentCrypto.symbol} QR Code`}
                            width={220}
                            height={220}
                            className="w-44 h-44 sm:w-52 sm:h-52 block"
                          />
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-[#8E939E] font-medium text-center">
                          <QrCode className="w-4 h-4 text-[#C5C9D3]" />
                          <span>Scan with any {currentCrypto.name} wallet</span>
                        </div>
                      </div>

                      {/* Details & Copy Container */}
                      <div className="lg:col-span-7 space-y-5">
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl sm:text-2xl font-black text-[#EDEDEE] tracking-tight">
                              {currentCrypto.name} ({currentCrypto.symbol})
                            </h4>

                            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-[#181B22] text-[#9CA3AF] border border-[#2B2F3A]">
                              {currentCrypto.network}
                            </span>
                          </div>

                          {currentCrypto.note && (
                            <p className="text-xs sm:text-sm text-[#8E939E] leading-relaxed">
                              {currentCrypto.note}
                            </p>
                          )}
                        </div>

                        {/* Address Box */}
                        <div className="space-y-2.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#6E7380] flex items-center justify-between">
                            <span>Receiving Address</span>
                            <span className="text-xs text-[#8E939E] font-normal">
                              Double-check network before sending
                            </span>
                          </label>

                          <div className="p-4 bg-[#14161C] border border-[#242831] rounded-2xl space-y-3.5">
                            <code className="text-xs sm:text-sm font-mono text-[#EDEDEE] break-all block select-all bg-[#0B0C0E] p-3 rounded-xl border border-[#1E2129] leading-relaxed">
                              {currentCrypto.address}
                            </code>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(currentCrypto.address, currentCrypto.symbol)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] transition-colors shadow-sm active:scale-95 cursor-pointer"
                              >
                                {copiedKey === currentCrypto.symbol ? (
                                  <>
                                    <Check className="w-4 h-4 text-[#0C0D10] stroke-[3]" />
                                    <span>Address Copied to Clipboard!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 text-[#5A606E]" />
                                    <span>Copy {currentCrypto.symbol} Address</span>
                                  </>
                                )}
                              </button>

                              {currentCrypto.explorerUrl && (
                                <a
                                  href={currentCrypto.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#1C1F26] hover:bg-[#252831] text-[#9CA3AF] hover:text-[#EDEDEE] border border-[#2C303B] transition-colors shrink-0"
                                  title="Verify address on blockchain explorer"
                                >
                                  <span>Explorer</span>
                                  <ExternalLink className="w-4 h-4 text-[#6E7380]" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* All Addresses at a Glance */}
                  <div className="pt-2">
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0F12] border border-[#22252C] space-y-4">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-bold text-[#EDEDEE] flex items-center gap-2">
                          <Coins className="w-4 h-4 text-[#9CA3AF]" />
                          All Addresses at a Glance
                        </span>
                        <span className="text-[#6E7380] text-xs">Click to copy any wallet</span>
                      </div>

                      <div className="space-y-2">
                        {DONATION_CONFIG.crypto.map((coin) => (
                          <div
                            key={coin.symbol}
                            className="flex items-center justify-between gap-4 p-3 sm:p-3.5 rounded-xl bg-[#14161C] border border-[#20232B] hover:border-[#2C303B] transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#8E939E] shrink-0" />
                              <span className="text-xs sm:text-sm font-bold text-[#EDEDEE] shrink-0">{coin.symbol}</span>
                              <span className="text-xs text-[#717684] truncate hidden sm:inline">({coin.network})</span>
                              <code className="text-xs font-mono text-[#6E7380] truncate max-w-[160px] sm:max-w-[360px]">
                                {coin.address}
                              </code>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(coin.address, `quick-${coin.symbol}`)}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] border border-[#2B2F3A] transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                {copiedKey === `quick-${coin.symbol}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#EDEDEE]" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-[#6E7380]" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-[#EDEDEE]">Crypto Addresses Coming Soon</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("cards")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#EDEDEE] text-[#0C0D10]"
                  >
                    <span>Use Cards &amp; Wallets</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: UPI & Private Identity Protection ── */}
          {activeTab === "upi" && (
            <div className="space-y-8">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-[#181B22] text-[#9CA3AF] border border-[#262A34]">
                  <EyeOff className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span>Privacy-Preserving Indian Payment Methods</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">
                  UPI &amp; Private Donations in India
                </h3>
                <p className="text-sm text-[#8E939E] max-w-2xl leading-relaxed">
                  Standard personal UPI reveals your registered full legal bank name and phone number to every payer. 
                  Below are the recommended ways to support FreeWebStuff without compromising your privacy or personal identity.
                </p>
              </div>

              {/* 3 Privacy Alternatives for UPI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                
                {/* Method 1: Ko-fi with Indian Cards */}
                <div className="p-6 rounded-2xl bg-[#14161C] border border-[#242831] space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#282C36] flex items-center justify-center text-[#EDEDEE]">
                      <CreditCard className="w-5 h-5 text-[#9CA3AF]" />
                    </div>
                    <h4 className="text-base font-bold text-[#EDEDEE]">1. Ko-fi (Zero Identity Leaks)</h4>
                    <p className="text-xs text-[#8E939E] leading-relaxed">
                      Accepts Indian Debit &amp; Credit cards with international e-mandate. 
                      Your real name and bank details are <strong>100% hidden</strong>; donors only see <strong>&quot;FreeWebStuff&quot;</strong>.
                    </p>
                  </div>
                  <a
                    href={DONATION_CONFIG.kofi.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] font-bold text-xs transition-colors"
                  >
                    <span>Use Ko-fi (Recommended)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#5A606E]" />
                  </a>
                </div>

                {/* Method 2: Cryptocurrency */}
                <div className="p-6 rounded-2xl bg-[#14161C] border border-[#242831] space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#282C36] flex items-center justify-center text-[#EDEDEE]">
                      <Coins className="w-5 h-5 text-[#9CA3AF]" />
                    </div>
                    <h4 className="text-base font-bold text-[#EDEDEE]">2. USDT / SOL / BTC</h4>
                    <p className="text-xs text-[#8E939E] leading-relaxed">
                      100% anonymous and permissionless. 
                      No names, phone numbers, or bank identifiers are linked to the receiving addresses.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("crypto")}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] border border-[#2B2F3A] font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>View Crypto Wallets</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6E7380]" />
                  </button>
                </div>

                {/* Method 3: Merchant VPA */}
                <div className="p-6 rounded-2xl bg-[#14161C] border border-[#242831] space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#282C36] flex items-center justify-center text-[#EDEDEE]">
                      <UserCheck className="w-5 h-5 text-[#9CA3AF]" />
                    </div>
                    <h4 className="text-base font-bold text-[#EDEDEE]">3. Business / Brand VPA</h4>
                    <p className="text-xs text-[#8E939E] leading-relaxed">
                      Setting up a Google Pay for Business / Paytm Merchant account displays your brand name 
                      (<strong>&quot;FreeWebStuff&quot;</strong>) on the payer&apos;s screen instead of your legal personal name.
                    </p>
                  </div>
                  <div className="py-2.5 px-3 rounded-xl bg-[#0E1014] border border-[#1E2129] text-[11px] text-[#717684] text-center font-medium">
                    Free setup on Google Pay for Business
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── 5. Immersive Telegram & Discord Community Section ── */}
      <div className="space-y-6">
        <div className="text-center sm:text-left space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-[#181B22] text-[#A1A5B0] border border-[#262A34]">
            <MessageSquare className="w-3.5 h-3.5 text-[#E5E7EB]" />
            <span>Community &amp; VIP Supporter Lounge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">
            Connect with Us on Telegram &amp; Discord
          </h2>
          <p className="text-sm text-[#8E939E]">
            Join over 4,000+ members. Get early access to new category additions, claim your VIP Supporter role, and chat directly with creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Telegram Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#111317] border border-[#22252C] hover:border-[#383F50] transition-all flex flex-col justify-between space-y-6 group shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#171A22] border border-[#282E3B] flex items-center justify-center text-[#E5E7EB] group-hover:scale-105 transition-transform">
                  <Send className="w-6 h-6 text-[#9CA3AF]" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#161922] text-[#A1A5B0] border border-[#262B38]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>{DONATION_CONFIG.community.telegram.members}</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#EDEDEE] group-hover:text-white transition-colors">
                  {DONATION_CONFIG.community.telegram.handle}
                </h3>
                <p className="text-xs sm:text-sm text-[#8E939E] mt-1.5 leading-relaxed">
                  {DONATION_CONFIG.community.telegram.tagline}. Fast-paced alerts on new mirror links, tool releases, and platform status.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#717684]">
                <span className="px-2.5 py-1 rounded-lg bg-[#0E1014] border border-[#1E2129]">Instant Link Drops</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0E1014] border border-[#1E2129]">Founder DM Access</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0E1014] border border-[#1E2129]">Supporter Badge</span>
              </div>
            </div>

            <a
              href={DONATION_CONFIG.community.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] font-bold text-sm transition-all duration-150 active:scale-95 shadow-sm"
            >
              <span>Join Telegram Channel</span>
              <ExternalLink className="w-4 h-4 text-[#5A606E]" />
            </a>
          </div>

          {/* Discord Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#111317] border border-[#22252C] hover:border-[#383F50] transition-all flex flex-col justify-between space-y-6 group shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#171A22] border border-[#282E3B] flex items-center justify-center text-[#E5E7EB] group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6 text-[#9CA3AF]" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#161922] text-[#A1A5B0] border border-[#262B38]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>{DONATION_CONFIG.community.discord.members}</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#EDEDEE] group-hover:text-white transition-colors">
                  {DONATION_CONFIG.community.discord.handle}
                </h3>
                <p className="text-xs sm:text-sm text-[#8E939E] mt-1.5 leading-relaxed">
                  {DONATION_CONFIG.community.discord.tagline}. Exclusive VIP role room, feature polls, dev support, and bug reporting.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#717684]">
                <span className="px-2.5 py-1 rounded-lg bg-[#0E1014] border border-[#1E2129]">VIP Supporter Role</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0E1014] border border-[#1E2129]">Tool Voting</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0E1014] border border-[#1E2129]">Private Dev Lounge</span>
              </div>
            </div>

            <a
              href={DONATION_CONFIG.community.discord.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] hover:text-white border border-[#2B303C] font-bold text-sm transition-all duration-150 active:scale-95 shadow-sm"
            >
              <span>Join Discord Server</span>
              <ExternalLink className="w-4 h-4 text-[#6E7380]" />
            </a>
          </div>

        </div>
      </div>

      {/* ── 6. Platform Impact Pillars ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 sm:p-7 rounded-2xl bg-[#111317] border border-[#22252C] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#242831] text-[#9CA3AF] flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#EDEDEE]">Edge Infrastructure</h4>
          <p className="text-xs sm:text-sm text-[#8E939E] leading-relaxed">
            Funds ultra-fast sub-50ms search query response times and instant autocomplete caching globally.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-[#111317] border border-[#22252C] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#242831] text-[#9CA3AF] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#EDEDEE]">24/7 Link Health Bot</h4>
          <p className="text-xs sm:text-sm text-[#8E939E] leading-relaxed">
            Automated verification bots check thousands of tools daily to eliminate dead mirrors and broken redirects.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-[#111317] border border-[#22252C] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#242831] text-emerald-400 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-emerald-500/20 text-emerald-400" />
          </div>
          <h4 className="text-base font-bold text-[#EDEDEE]">75% Real-World Relief</h4>
          <p className="text-xs sm:text-sm text-[#8E939E] leading-relaxed">
            Feeds the hungry, provides warm food for stray dogs, and distributes blankets to homeless families in need.
          </p>
        </div>
      </div>

      {/* ── 7. Non-Financial Contributions ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111317] border border-[#22252C] flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center sm:text-left">
          <h4 className="text-base sm:text-lg font-bold text-[#EDEDEE] flex items-center justify-center sm:justify-start gap-2">
            <HelpCircle className="w-5 h-5 text-[#9CA3AF]" />
            Can&apos;t donate financially right now?
          </h4>
          <p className="text-xs sm:text-sm text-[#8E939E]">
            Submit new verified web tools or report broken links to help keep the index clean for everyone.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/submit"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#EDEDEE] text-[#0C0D10] hover:bg-[#F5F5F7] transition-colors shadow-sm"
          >
            Submit a Resource
          </Link>
          <Link
            href="/report"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#8E939E] hover:text-[#EDEDEE] border border-[#22252C] hover:bg-[#15171D] transition-colors"
          >
            Report an Issue
          </Link>
        </div>
      </div>

      </div>
    </div>
  );
}
