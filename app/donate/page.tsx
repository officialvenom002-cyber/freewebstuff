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
  Lock
} from "lucide-react";
import { DONATION_CONFIG } from "@/lib/config/donationConfig";

type PaymentTab = "cards" | "upi" | "crypto" | "paypal";

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
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(upiDeepLink)}`
    : "";
  const cryptoQrUrl = currentCrypto
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(currentCrypto.address)}`
    : "";

  const activeTierObj = DONATION_CONFIG.tiers[selectedTier] || DONATION_CONFIG.tiers[1];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* ── Header / Hero ── */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-[#15171C] text-[#9CA3AF] border border-[#242831]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
          <span>Independent &bull; Open Web Project</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#EDEDEE]">
          Support FreeWebStuff
        </h1>

        <p className="max-w-xl mx-auto text-sm sm:text-[15px] text-[#8E939E] leading-relaxed">
          FreeWebStuff is 100% free, community-curated, and tracker-free. 
          Contributions directly fund edge servers, 24/7 link verification bots, and domain hosting.
        </p>

        {/* Preset Tiers in Matte Finish */}
        <div className="pt-3 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DONATION_CONFIG.tiers.map((tier, idx) => {
              const isSelected = selectedTier === idx;
              return (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => setSelectedTier(idx)}
                  className={`relative p-3.5 rounded-xl border text-left transition-all duration-150 ${
                    isSelected 
                      ? "bg-[#181B22] border-[#444A58] ring-1 ring-[#52596A]"
                      : "bg-[#111317] border-[#22252C] hover:border-[#323642] hover:bg-[#15171D]"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#EDEDEE] text-[#0C0D10]">
                      Popular
                    </span>
                  )}
                  <div className="text-lg font-bold text-[#EDEDEE]">{tier.amount}</div>
                  <div className="text-xs font-medium text-[#9CA3AF]">{tier.label}</div>
                  <div className="text-[11px] text-[#6E7380] mt-1 line-clamp-2 leading-tight">
                    {tier.perk}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Action Bar */}
          <div className="mt-3.5 p-3 rounded-xl bg-[#111317] border border-[#22252C] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#8E939E]">
              Selected: <strong className="text-[#EDEDEE] font-semibold">{activeTierObj.amount} ({activeTierObj.label})</strong> &mdash; {activeTierObj.perk}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={DONATION_CONFIG.kofi.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] font-semibold text-[11px] transition-colors"
              >
                <span>Ko-fi</span>
                <ExternalLink className="w-3 h-3 text-[#5A606E]" />
              </a>
              <a
                href={DONATION_CONFIG.buyMeACoffee.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181B22] hover:bg-[#20242D] text-[#D8DBE2] border border-[#2A2E38] font-semibold text-[11px] transition-colors"
              >
                <span>Buy Me a Coffee</span>
                <ExternalLink className="w-3 h-3 text-[#6E7380]" />
              </a>
              <a
                href={DONATION_CONFIG.paypal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181B22] hover:bg-[#20242D] text-[#D8DBE2] border border-[#2A2E38] font-semibold text-[11px] transition-colors"
              >
                <span>PayPal</span>
                <ExternalLink className="w-3 h-3 text-[#6E7380]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Donation Card ── */}
      <div className="bg-[#111317] border border-[#22252C] rounded-2xl overflow-hidden shadow-xl">
        
        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#22252C] bg-[#0C0D10]">
          <button
            type="button"
            onClick={() => setActiveTab("cards")}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
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
            className={`flex items-center justify-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === "paypal"
                ? "border-[#EDEDEE] text-[#EDEDEE] bg-[#14161C]"
                : "border-transparent text-[#717684] hover:text-[#C5C9D3] hover:bg-[#101216]"
            }`}
          >
            <Lock className="w-4 h-4 text-[#9CA3AF]" />
            <span>PayPal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("crypto")}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
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
            className={`flex items-center justify-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === "upi"
                ? "border-[#EDEDEE] text-[#EDEDEE] bg-[#14161C]"
                : "border-transparent text-[#717684] hover:text-[#C5C9D3] hover:bg-[#101216]"
            }`}
          >
            <QrCode className="w-4 h-4 text-[#9CA3AF]" />
            <span>UPI &amp; QR Code</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="p-6 sm:p-8">

          {/* TAB 1: Cards & Digital Wallets */}
          {activeTab === "cards" && (
            <div className="space-y-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#181B22] text-[#9CA3AF] border border-[#262A34]">
                  <span>200+ Countries Supported</span>
                </div>
                <h3 className="text-xl font-bold text-[#EDEDEE]">
                  Card &amp; Digital Wallet Checkout
                </h3>
                <p className="text-xs text-[#8E939E]">
                  Contribute with Visa, MasterCard, American Express, Apple Pay, Google Pay, or PayPal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {/* Ko-fi Card */}
                <a
                  href={DONATION_CONFIG.kofi.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl border border-[#242831] hover:border-[#3E4452] bg-[#14161C] hover:bg-[#181B22] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#EDEDEE] text-sm group-hover:text-[#FFFFFF] transition-colors">
                        Ko-fi
                      </span>
                      <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#1B1E26] px-2 py-0.5 rounded-md border border-[#2A2E38]">
                        0% Platform Fee
                      </span>
                    </div>
                    <p className="text-xs text-[#8E939E] leading-relaxed">
                      Official verified profile. Supports one-time or monthly donations with Cards, Apple Pay, Google Pay &amp; PayPal.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Cards</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Apple Pay</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Google Pay</span>
                    </div>
                  </div>
                  <div className="mt-5 inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-lg bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] font-semibold text-xs transition-colors">
                    <span>Open Ko-fi</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#5A606E]" />
                  </div>
                </a>

                {/* Buy Me A Coffee Card */}
                <a
                  href={DONATION_CONFIG.buyMeACoffee.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl border border-[#242831] hover:border-[#3E4452] bg-[#14161C] hover:bg-[#181B22] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#EDEDEE] text-sm group-hover:text-[#FFFFFF] transition-colors">
                        Buy Me a Coffee
                      </span>
                      <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#1B1E26] px-2 py-0.5 rounded-md border border-[#2A2E38]">
                        1-Click Tip
                      </span>
                    </div>
                    <p className="text-xs text-[#8E939E] leading-relaxed">
                      Send a coffee tip instantly with debit cards, credit cards, Apple Pay, or Google Pay without requiring an account.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Quick Tip</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Cards</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Wallets</span>
                    </div>
                  </div>
                  <div className="mt-5 inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-lg bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] border border-[#2C303B] font-semibold text-xs transition-colors">
                    <span>Open Buy Me a Coffee</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6E7380]" />
                  </div>
                </a>

                {/* PayPal Direct Card */}
                <a
                  href={DONATION_CONFIG.paypal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl border border-[#242831] hover:border-[#3E4452] bg-[#14161C] hover:bg-[#181B22] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#EDEDEE] text-sm group-hover:text-[#FFFFFF] transition-colors">
                        PayPal.me
                      </span>
                      <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#1B1E26] px-2 py-0.5 rounded-md border border-[#2A2E38]">
                        Direct
                      </span>
                    </div>
                    <p className="text-xs text-[#8E939E] leading-relaxed">
                      Transfer directly via PayPal.me balance or any linked bank card in 200+ countries with buyer &amp; donor protection.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">PayPal Balance</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0E1014] text-[#8E939E] border border-[#1E2129]">Global</span>
                    </div>
                  </div>
                  <div className="mt-5 inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-lg bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] border border-[#2C303B] font-semibold text-xs transition-colors">
                    <span>Open PayPal.me</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6E7380]" />
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: PayPal Dedicated */}
          {activeTab === "paypal" && (
            <div className="space-y-6 text-center sm:text-left">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#181B22] text-[#9CA3AF] border border-[#262A34]">
                  <span>200+ Countries Supported</span>
                </div>
                <h3 className="text-xl font-bold text-[#EDEDEE]">
                  Direct PayPal Transfer
                </h3>
                <p className="text-xs text-[#8E939E]">
                  Transfer funds directly to our PayPal account or pay using any international card linked to PayPal.
                </p>
              </div>

              <div className="max-w-md p-5 rounded-xl bg-[#14161C] border border-[#242831] space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E939E]">Official Handle</span>
                  <span className="font-mono text-[#EDEDEE] font-medium">
                    paypal.me/{DONATION_CONFIG.paypal.username}
                  </span>
                </div>

                <a
                  href={DONATION_CONFIG.paypal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] font-semibold text-xs transition-colors"
                >
                  <span>Open PayPal.me/{DONATION_CONFIG.paypal.username}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#5A606E]" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: Borderless Cryptocurrency */}
          {activeTab === "crypto" && (
            <div className="space-y-6">
              {hasCrypto && currentCrypto ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#22252C] pb-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#181B22] text-[#9CA3AF] border border-[#262A34]">
                        <span>100% Borderless &bull; Decentralized</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#EDEDEE]">
                        Cryptocurrency Donations
                      </h3>
                      <p className="text-xs text-[#8E939E]">
                        Instant confirmation, zero foreign exchange fees, and works from any wallet worldwide.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#22252C] text-xs text-[#8E939E] shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      <span>Verified Official Wallets</span>
                    </div>
                  </div>

                  {/* Coin Selector Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                    {DONATION_CONFIG.crypto.map((coin, idx) => {
                      const isSelected = selectedCrypto === idx;
                      return (
                        <button
                          key={coin.symbol}
                          type="button"
                          onClick={() => setSelectedCrypto(idx)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                            isSelected
                              ? "bg-[#1C1F27] text-[#EDEDEE] border border-[#444A58] ring-1 ring-[#52596A]"
                              : "bg-[#14161C] text-[#8E939E] border border-[#242831] hover:text-[#C5C9D3] hover:bg-[#181B22]"
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8E939E] shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-[#EDEDEE]">{coin.symbol}</div>
                            <div className="text-[10px] text-[#6E7380] truncate">{coin.network.split(" ")[0]}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Selected Coin Details Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0F12] border border-[#242831]">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      
                      {/* QR Viewfinder Container */}
                      <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#14161C] border border-[#242831]">
                        <div className="p-3 bg-white rounded-xl shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cryptoQrUrl}
                            alt={`${currentCrypto.symbol} QR Code`}
                            width={180}
                            height={180}
                            className="w-40 h-40 block"
                          />
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#8E939E] font-medium text-center">
                          <QrCode className="w-3.5 h-3.5 text-[#C5C9D3]" />
                          <span>Scan with any {currentCrypto.name} wallet</span>
                        </div>
                      </div>

                      {/* Details & Copy Container */}
                      <div className="md:col-span-7 space-y-4">
                        
                        {/* Token Header & Network badge */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-bold text-[#EDEDEE]">
                              {currentCrypto.name} ({currentCrypto.symbol})
                            </h4>

                            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-[#181B22] text-[#9CA3AF] border border-[#2B2F3A]">
                              {currentCrypto.network}
                            </span>
                          </div>

                          {currentCrypto.note && (
                            <p className="text-xs text-[#8E939E] leading-relaxed">
                              {currentCrypto.note}
                            </p>
                          )}
                        </div>

                        {/* Address Box */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-medium uppercase tracking-wider text-[#6E7380] flex items-center justify-between">
                            <span>Receiving Address</span>
                            <span className="text-[10px] text-[#8E939E] font-normal">
                              Double-check network before sending
                            </span>
                          </label>

                          <div className="p-3 bg-[#14161C] border border-[#242831] rounded-xl space-y-3">
                            <code className="text-xs sm:text-[13px] font-mono text-[#EDEDEE] break-all block select-all bg-[#0B0C0E] p-2.5 rounded-lg border border-[#1E2129]">
                              {currentCrypto.address}
                            </code>

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(currentCrypto.address, currentCrypto.symbol)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold bg-[#EDEDEE] hover:bg-[#F5F5F7] text-[#0C0D10] transition-colors"
                              >
                                {copiedKey === currentCrypto.symbol ? (
                                  <>
                                    <Check className="w-4 h-4 text-[#0C0D10]" />
                                    <span>Address Copied!</span>
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
                                  className="inline-flex items-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium bg-[#1C1F26] hover:bg-[#252831] text-[#9CA3AF] hover:text-[#EDEDEE] border border-[#2C303B] transition-colors shrink-0"
                                  title="Verify address on blockchain explorer"
                                >
                                  <span>Explorer</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-[#6E7380]" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* All Addresses at a Glance */}
                  <div className="pt-1">
                    <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#22252C] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#EDEDEE] flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          All Wallets at a Glance
                        </span>
                        <span className="text-[#6E7380] text-[11px]">Click to copy address</span>
                      </div>

                      <div className="space-y-1.5">
                        {DONATION_CONFIG.crypto.map((coin) => (
                          <div
                            key={coin.symbol}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[#14161C] border border-[#20232B] hover:border-[#2C303B] transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2 h-2 rounded-full bg-[#8E939E] shrink-0" />
                              <span className="text-xs font-bold text-[#EDEDEE] shrink-0">{coin.symbol}</span>
                              <span className="text-[10px] text-[#717684] truncate hidden sm:inline">({coin.network})</span>
                              <code className="text-[11px] font-mono text-[#6E7380] truncate max-w-[200px] sm:max-w-[320px]">
                                {coin.address}
                              </code>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(coin.address, `quick-${coin.symbol}`)}
                                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#1C1F26] hover:bg-[#252831] text-[#D8DBE2] border border-[#2B2F3A] transition-colors flex items-center gap-1"
                              >
                                {copiedKey === `quick-${coin.symbol}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#EDEDEE]" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-[#6E7380]" />
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
                <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-[#EDEDEE]">Crypto Addresses Coming Soon</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("cards")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#EDEDEE] text-[#0C0D10]"
                  >
                    <span>Use Cards &amp; Wallets</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: UPI */}
          {activeTab === "upi" && (
            <div className="space-y-6">
              {isUpiEnabled ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#EDEDEE]">Instant UPI Transfer</h3>
                  <p className="text-xs text-[#8E939E]">Works with PhonePe, Google Pay, Paytm, or any UPI app.</p>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3 max-w-md mx-auto">
                  <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#262A34] text-[#9CA3AF] mx-auto flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#EDEDEE]">Direct UPI Coming Soon</h3>
                  <p className="text-xs text-[#8E939E] leading-relaxed">
                    Direct UPI QR transfer is being configured. In the meantime, you can donate using any Indian debit card, credit card, or Google Pay via Ko-fi.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("cards")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#EDEDEE] text-[#0C0D10] hover:bg-[#F5F5F7] transition-colors"
                  >
                    <span>Use Cards / Google Pay via Ko-fi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Impact Section ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-5 rounded-xl bg-[#111317] border border-[#22252C] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#181B22] border border-[#242831] text-[#9CA3AF] flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-[#EDEDEE]">Edge Infrastructure</h4>
          <p className="text-xs text-[#8E939E] leading-relaxed">
            Funds fast sub-50ms search response times and global edge caching worldwide.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111317] border border-[#22252C] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#181B22] border border-[#242831] text-[#9CA3AF] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-[#EDEDEE]">24/7 Link Health Bot</h4>
          <p className="text-xs text-[#8E939E] leading-relaxed">
            Automated verification bots inspect thousands of tools to eliminate dead mirrors and broken redirects.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111317] border border-[#22252C] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#181B22] border border-[#242831] text-[#9CA3AF] flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-[#EDEDEE]">Zero Ads, Zero Trackers</h4>
          <p className="text-xs text-[#8E939E] leading-relaxed">
            Ensures the platform stays clean, unbiased, and free of sponsored rankings.
          </p>
        </div>
      </div>

      {/* ── Other Ways to Contribute ── */}
      <div className="p-5 rounded-xl bg-[#111317] border border-[#22252C] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-semibold text-[#EDEDEE] flex items-center justify-center sm:justify-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#9CA3AF]" />
            Can&apos;t donate financially right now?
          </h4>
          <p className="text-xs text-[#8E939E]">
            Submit new verified web tools or report broken links to help keep the index fresh.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/submit"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#EDEDEE] text-[#0C0D10] hover:bg-[#F5F5F7] transition-colors"
          >
            Submit a Resource
          </Link>
          <Link
            href="/report"
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#8E939E] hover:text-[#EDEDEE] border border-[#22252C] hover:bg-[#15171D] transition-colors"
          >
            Report an Issue
          </Link>
        </div>
      </div>
    </div>
  );
}
