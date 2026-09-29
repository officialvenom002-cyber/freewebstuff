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
  CheckCircle2
} from "lucide-react";
import { DONATION_CONFIG } from "@/lib/config/donationConfig";
import { TopSupporter } from "@/lib/db/siteConfig";

type PaymentTab = "cards" | "paypal" | "crypto" | "upi";

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-24 space-y-20">
      
      {/* ── 1. Hero Section ── */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#14161C] text-[#A1A5B0] border border-[#252932] shadow-sm animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Independent &bull; Open Web Project &bull; Zero Tracker Ads</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-[#EDEDEE] leading-[1.08]">
          Fuel the Free Internet.
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#8E939E] leading-relaxed">
          FreeWebStuff indexes over 15,000+ free tools, privacy software, and educational vaults without commercial paywalls. 
          Your backing directly funds high-speed edge nodes, link verification bots, and platform upgrades.
        </p>

        {/* ── Preset Tiers in Matte Finish ── */}
        <div className="pt-4 max-w-4xl mx-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {DONATION_CONFIG.tiers.map((tier, idx) => {
              const isSelected = selectedTier === idx;
              return (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => setSelectedTier(idx)}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? "bg-[#181B22] border-[#52596A] ring-1 ring-[#646C80] shadow-xl scale-[1.02]"
                      : "bg-[#111317] border-[#22252C] hover:border-[#383D4A] hover:bg-[#14171E] hover:-translate-y-0.5"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDEDEE] text-[#0C0D10] shadow-sm">
                      Popular
                    </span>
                  )}
                  <div className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">{tier.amount}</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#A1A5B0] mt-1">{tier.label}</div>
                  <div className="text-xs text-[#6E7380] mt-2 line-clamp-2 leading-snug">
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
          <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#242831] text-[#9CA3AF] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#EDEDEE]">Zero Ads, Zero Trackers</h4>
          <p className="text-xs sm:text-sm text-[#8E939E] leading-relaxed">
            Keeps the platform clean, privacy-respecting, and free of sponsored commercial rankings.
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
