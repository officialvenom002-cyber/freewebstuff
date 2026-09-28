"use client";

import React, { useState } from "react";
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
  UserCheck
} from "lucide-react";
import { DONATION_CONFIG } from "@/lib/config/donationConfig";

type PaymentTab = "cards" | "paypal" | "crypto" | "upi";

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState<PaymentTab>("cards");
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [selectedCrypto, setSelectedCrypto] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
  const upiQrUrl = isUpiEnabled
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiDeepLink)}`
    : "";
  const cryptoQrUrl = currentCrypto
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(currentCrypto.address)}`
    : "";

  const activeTierObj = DONATION_CONFIG.tiers[selectedTier] || DONATION_CONFIG.tiers[1];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-20 space-y-16">
      
      {/* ── Header / Hero Section ── */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#14161C] text-[#9CA3AF] border border-[#242832]">
          <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
          <span>Independent &bull; Open Web Index &bull; Zero Tracker Ads</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-[#EDEDEE] leading-[1.1]">
          Support FreeWebStuff
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#8E939E] leading-relaxed">
          FreeWebStuff is completely free, non-profit, and open for everyone. 
          Your contributions cover edge server hosting, automated 24/7 link verification bots, and keep over 15,000 tools active worldwide.
        </p>

        {/* ── Preset Tiers (Bigger, Bold, Matte) ── */}
        <div className="pt-4 max-w-3xl mx-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DONATION_CONFIG.tiers.map((tier, idx) => {
              const isSelected = selectedTier === idx;
              return (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => setSelectedTier(idx)}
                  className={`relative p-4 sm:p-5 rounded-2xl border text-left transition-all duration-150 ${
                    isSelected 
                      ? "bg-[#181B22] border-[#4E5566] ring-1 ring-[#60697D] shadow-lg"
                      : "bg-[#111317] border-[#22252C] hover:border-[#353A47] hover:bg-[#15171E]"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDEDEE] text-[#0C0D10] shadow-sm">
                      Popular
                    </span>
                  )}
                  <div className="text-2xl sm:text-3xl font-black text-[#EDEDEE] tracking-tight">{tier.amount}</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#A1A5B0] mt-0.5">{tier.label}</div>
                  <div className="text-xs text-[#6E7380] mt-2 line-clamp-2 leading-snug">
                    {tier.perk}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Action Bar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#111317] border border-[#22252C] flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <span className="text-[#8E939E] text-center md:text-left">
              Selected: <strong className="text-[#EDEDEE] font-bold">{activeTierObj.amount} ({activeTierObj.label})</strong> &mdash; {activeTierObj.perk}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <a
                href={DONATION_CONFIG.kofi.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] font-bold text-xs transition-colors"
              >
                <span>Give on Ko-fi</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5A606E]" />
              </a>
              <a
                href={DONATION_CONFIG.buyMeACoffee.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181B22] hover:bg-[#20242D] text-[#D8DBE2] border border-[#2A2E38] font-bold text-xs transition-colors"
              >
                <span>Buy Me a Coffee</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#6E7380]" />
              </a>
              <a
                href={DONATION_CONFIG.paypal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181B22] hover:bg-[#20242D] text-[#D8DBE2] border border-[#2A2E38] font-bold text-xs transition-colors"
              >
                <span>PayPal</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#6E7380]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Donation Card ── */}
      <div className="bg-[#111317] border border-[#22252C] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Method Switcher Tabs (Seamless, Responsive, Single-Row Bar) */}
        <div className="flex items-center overflow-x-auto no-scrollbar border-b border-[#22252C] bg-[#0C0D10] px-2 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab("cards")}
            className={`flex items-center justify-center gap-2.5 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 shrink-0 ${
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
            className={`flex items-center justify-center gap-2.5 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 shrink-0 ${
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
            className={`flex items-center justify-center gap-2.5 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 shrink-0 ${
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
            className={`flex items-center justify-center gap-2.5 py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 shrink-0 ${
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

                  {/* Coin Selector Pills (Bigger, Spaced) */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                    {DONATION_CONFIG.crypto.map((coin, idx) => {
                      const isSelected = selectedCrypto === idx;
                      return (
                        <button
                          key={coin.symbol}
                          type="button"
                          onClick={() => setSelectedCrypto(idx)}
                          className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
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

                  {/* Interactive Selected Coin Details Card (Spacious & Clean) */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#242831]">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      
                      {/* Big QR Viewfinder Container */}
                      <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#14161C] border border-[#242831]">
                        <div className="p-4 bg-white rounded-2xl shadow-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cryptoQrUrl}
                            alt={`${currentCrypto.symbol} QR Code`}
                            width={220}
                            height={220}
                            className="w-48 h-48 sm:w-52 sm:h-52 block"
                          />
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-[#8E939E] font-medium text-center">
                          <QrCode className="w-4 h-4 text-[#C5C9D3]" />
                          <span>Scan with any {currentCrypto.name} wallet</span>
                        </div>
                      </div>

                      {/* Details & Copy Container */}
                      <div className="md:col-span-7 space-y-5">
                        
                        {/* Token Header & Network badge */}
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
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] transition-colors shadow-sm active:scale-95"
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

                  {/* All Addresses at a Glance (Spacious Table) */}
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
                              <code className="text-xs font-mono text-[#6E7380] truncate max-w-[200px] sm:max-w-[360px]">
                                {coin.address}
                              </code>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(coin.address, `quick-${coin.symbol}`)}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] border border-[#2B2F3A] transition-colors flex items-center gap-1.5"
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

          {/* ── TAB 4: UPI & Identity Protection Guide ── */}
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
                  Below are the official ways to support FreeWebStuff without compromising your privacy or personal identity.
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
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] border border-[#2B2F3A] font-bold text-xs transition-colors"
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
                    Contact us to suggest a gateway
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Impact Section (Spacious, Clean Matte) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 sm:p-7 rounded-2xl bg-[#111317] border border-[#22252C] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#242831] text-[#9CA3AF] flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#EDEDEE]">Edge Infrastructure</h4>
          <p className="text-xs sm:text-sm text-[#8E939E] leading-relaxed">
            Funds fast, sub-50ms search query response times and instant autocomplete caching globally.
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

      {/* ── Non-Financial Contributions ── */}
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
  );
}
