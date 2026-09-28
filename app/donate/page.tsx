"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Server, 
  Sparkles,
  Globe,
  Coins,
  ArrowRight,
  HelpCircle,
  Coffee,
  CheckCircle2
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
  const isPaypalEnabled = DONATION_CONFIG.paypal.enabled && Boolean(DONATION_CONFIG.paypal.username);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* ── Header / Hero ── */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FF6B8B]/10 text-[#FF6B8B] border border-[#FF6B8B]/25 shadow-sm">
          <Heart className="w-3.5 h-3.5 fill-[#FF6B8B]" />
          <span>Support FreeWebStuff &bull; 100% Free &amp; Open Forever</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-[#F2F3F5]">
          Keep Useful Tools{" "}
          <span className="bg-gradient-to-r from-sky-400 via-[#8B7CFF] to-[#FF6B8B] bg-clip-text text-transparent">
            Free For Everyone.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#9298A3] leading-relaxed">
          FreeWebStuff is completely independent, tracker-free, and free of sponsored ads. 
          Your contributions fund server hosting, automated 24/7 link verification bots, 
          and keep open-web resources accessible worldwide.
        </p>

        {/* Preset Tiers */}
        <div className="pt-2 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DONATION_CONFIG.tiers.map((tier, idx) => {
              const isSelected = selectedTier === idx;
              return (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => setSelectedTier(idx)}
                  className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 ${
                    isSelected 
                      ? "bg-[#1E222B] border-[#8B7CFF] shadow-[0_0_20px_rgba(139,124,255,0.15)] ring-1 ring-[#8B7CFF]"
                      : "bg-[#111316] border-[#262A30] hover:border-[#383E48] hover:bg-[#15181D]"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8B7CFF] text-[#0B0C0E]">
                      Popular
                    </span>
                  )}
                  <div className="text-lg font-black text-[#F2F3F5]">{tier.amount}</div>
                  <div className="text-xs font-semibold text-[#8B7CFF]">{tier.label}</div>
                  <div className="text-[11px] text-[#9298A3] mt-1 line-clamp-2 leading-tight">
                    {tier.perk}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Action for Selected Tier */}
          <div className="mt-4 p-3 rounded-xl bg-[#14171C] border border-[#262A30] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#9298A3]">
              Selected: <strong className="text-[#F2F3F5]">{activeTierObj.amount} ({activeTierObj.label})</strong> &mdash; {activeTierObj.perk}
            </span>
            <div className="flex items-center gap-2">
              <a
                href={DONATION_CONFIG.kofi.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B7CFF] hover:bg-[#9d90ff] text-[#0B0C0E] font-bold transition-colors"
              >
                <span>Give on Ko-fi</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={DONATION_CONFIG.buyMeACoffee.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F59E0B] hover:bg-[#f6a827] text-[#0B0C0E] font-bold transition-colors"
              >
                <span>Give on BMC</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={DONATION_CONFIG.paypal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0070BA] hover:bg-[#0086dc] text-white font-bold transition-colors"
              >
                <span>PayPal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Donation Card ── */}
      <div className="bg-[#111316] border border-[#262A30] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#262A30] bg-[#0D0F11]">
          <button
            type="button"
            onClick={() => setActiveTab("cards")}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === "cards"
                ? "border-[#8B7CFF] text-[#F2F3F5] bg-[#15181D]"
                : "border-transparent text-[#9298A3] hover:text-[#E2E4E8] hover:bg-[#121418]"
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#8B7CFF]" />
            <span>Cards &amp; Wallets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upi")}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === "upi"
                ? "border-[#22C55E] text-[#F2F3F5] bg-[#15181D]"
                : "border-transparent text-[#9298A3] hover:text-[#E2E4E8] hover:bg-[#121418]"
            }`}
          >
            <QrCode className="w-4 h-4 text-[#22C55E]" />
            <span>UPI &amp; QR Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("crypto")}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === "crypto"
                ? "border-[#F59E0B] text-[#F2F3F5] bg-[#15181D]"
                : "border-transparent text-[#9298A3] hover:text-[#E2E4E8] hover:bg-[#121418]"
            }`}
          >
            <Coins className="w-4 h-4 text-[#F59E0B]" />
            <span>Crypto (Global)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("paypal")}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === "paypal"
                ? "border-[#38BDF8] text-[#F2F3F5] bg-[#15181D]"
                : "border-transparent text-[#9298A3] hover:text-[#E2E4E8] hover:bg-[#121418]"
            }`}
          >
            <Globe className="w-4 h-4 text-[#38BDF8]" />
            <span>PayPal</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="p-6 sm:p-8">

          {/* TAB 1: Credit / Debit / Apple Pay / Google Pay */}
          {activeTab === "cards" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#8B7CFF]/10 text-[#8B7CFF]">
                  <Globe className="w-3.5 h-3.5" /> 200+ Countries &bull; All Major Cards
                </div>
                <h3 className="text-xl font-bold text-[#F2F3F5]">
                  Instant Checkout with Any Card or Wallet
                </h3>
                <p className="text-sm text-[#9298A3]">
                  Choose your preferred platform below to contribute with Visa, MasterCard, American Express, Apple Pay, Google Pay, or PayPal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Ko-fi Card */}
                <a
                  href={DONATION_CONFIG.kofi.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl border border-[#262A30] hover:border-[#8B7CFF]/70 bg-[#16181D] hover:bg-[#1B1E24] transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-[0_4px_24px_rgba(139,124,255,0.15)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#F2F3F5] text-base group-hover:text-[#8B7CFF] transition-colors flex items-center gap-2">
                        ☕ Ko-fi
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        0% Fee
                      </span>
                    </div>
                    <p className="text-xs text-[#9298A3] leading-relaxed">
                      Official verified profile. Supports one-time or monthly support via Cards, Apple Pay, Google Pay &amp; PayPal.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#111316] text-[#A6ACB8] border border-[#262A30]">Cards</span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#111316] text-[#A6ACB8] border border-[#262A30]">Apple Pay</span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#111316] text-[#A6ACB8] border border-[#262A30]">Google Pay</span>
                    </div>
                  </div>
                  <div className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#8B7CFF] hover:bg-[#9b8eff] text-[#0B0C0E] font-bold text-xs transition-colors">
                    <span>Open Ko-fi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>

                {/* Buy Me A Coffee Card */}
                <a
                  href={DONATION_CONFIG.buyMeACoffee.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl border border-[#262A30] hover:border-[#F59E0B]/70 bg-[#16181D] hover:bg-[#1B1E24] transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-[0_4px_24px_rgba(245,158,11,0.15)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#F2F3F5] text-base group-hover:text-[#F59E0B] transition-colors flex items-center gap-2">
                        💛 Buy Me a Coffee
                      </span>
                      <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        1-Click
                      </span>
                    </div>
                    <p className="text-xs text-[#9298A3] leading-relaxed">
                      Send a $3 or $5 coffee tip instantly with any debit or credit card, Apple Pay, or Google Pay.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#111316] text-[#A6ACB8] border border-[#262A30]">Quick Tip</span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#111316] text-[#A6ACB8] border border-[#262A30]">Cards</span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#111316] text-[#A6ACB8] border border-[#262A30]">Google Pay</span>
                    </div>
                  </div>
                  <div className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#F59E0B] hover:bg-[#f6a827] text-[#0B0C0E] font-bold text-xs transition-colors">
                    <span>Open Buy Me a Coffee</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>

                {/* PayPal Direct Card */}
                <a
                  href={DONATION_CONFIG.paypal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl border border-[#262A30] hover:border-[#0070BA]/70 bg-[#16181D] hover:bg-[#1B1E24] transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-[0_4px_24px_rgba(0,112,186,0.15)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#F2F3F5] text-base group-hover:text-[#38BDF8] transition-colors flex items-center gap-2">
                        💙 PayPal
                      </span>
                      <span className="text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                        Direct
                      </span>
                    </div>
                    <p className="text-xs text-[#9298A3] leading-relaxed">
                      Send money directly from your PayPal balance or bank in 200+ countries with buyer &amp; donor protection.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#111316] text-[#A6ACB8] border border-[#262A30]">PayPal Balance</span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#111316] text-[#A6ACB8] border border-[#262A30]">Global</span>
                    </div>
                  </div>
                  <div className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#0070BA] hover:bg-[#0086dc] text-white font-bold text-xs transition-colors">
                    <span>Open PayPal.me</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: UPI & QR Code */}
          {activeTab === "upi" && (
            <div className="space-y-6 animate-fade-in">
              {isUpiEnabled ? (
                <>
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                      <Zap className="w-3.5 h-3.5" /> Instant &bull; 0% Fee
                    </div>
                    <h3 className="text-xl font-bold text-[#F2F3F5]">
                      Instant UPI Transfer (India &amp; Cross-Border UPI)
                    </h3>
                    <p className="text-sm text-[#9298A3]">
                      Works with Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay, or any bank UPI app directly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0D0F11] border border-[#262A30]">
                      <div className="p-3 bg-white rounded-xl shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={upiQrUrl}
                          alt="UPI QR Code"
                          width={200}
                          height={200}
                          className="w-48 h-48 block"
                        />
                      </div>
                      <p className="text-xs text-[#9298A3] mt-3 font-medium text-center">
                        Scan with any UPI app to pay
                      </p>
                      <a
                        href={upiDeepLink}
                        className="sm:hidden mt-3 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5" /> Open in UPI App
                      </a>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#9298A3]">
                          UPI ID (VPA)
                        </label>
                        <div className="flex items-center gap-2 p-2.5 bg-[#16181D] border border-[#262A30] rounded-xl">
                          <code className="text-sm font-mono text-[#F2F3F5] flex-1 truncate select-all">
                            {DONATION_CONFIG.upi.id}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(DONATION_CONFIG.upi.id, "upi")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#8B7CFF] text-[#0B0C0E] hover:bg-[#9d90ff] transition-all"
                          >
                            {copiedKey === "upi" ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-950" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#16181D]/60 border border-[#262A30] text-xs space-y-2 text-[#9298A3]">
                        <div className="flex items-center gap-2 text-[#F2F3F5] font-semibold">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          Zero Fee, Direct Project Funding
                        </div>
                        <p>
                          Every single rupee sent goes 100% to our infrastructure without any third-party gateway deductions.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F2F3F5]">Direct UPI Coming Soon</h3>
                  <p className="text-xs text-[#9298A3] leading-relaxed">
                    Direct UPI QR transfer is being configured. In the meantime, you can donate using any Indian debit or credit card, Google Pay, or Apple Pay via Ko-fi!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("cards")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#8B7CFF] text-[#0B0C0E] hover:bg-[#9b8eff] transition-colors"
                  >
                    <span>Use Card / Google Pay / Ko-fi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Borderless Cryptocurrency */}
          {activeTab === "crypto" && (
            <div className="space-y-6 animate-fade-in">
              {hasCrypto && currentCrypto ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262A30] pb-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400">
                        <Coins className="w-3.5 h-3.5" /> 100% Borderless &bull; Zero Bank Restrictions
                      </div>
                      <h3 className="text-xl font-bold text-[#F2F3F5]">
                        Pay with Cryptocurrency Worldwide
                      </h3>
                      <p className="text-xs text-[#9298A3]">
                        Instant confirmation, zero foreign exchange fees, and works from any country or wallet.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16181D] border border-[#262A30] text-xs text-[#9298A3] shrink-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
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
                          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all text-left ${
                            isSelected
                              ? "bg-[#1B1E26] text-[#F2F3F5] border shadow-lg ring-1"
                              : "bg-[#14161B] text-[#9298A3] border border-[#262A30] hover:text-[#E2E4E8] hover:bg-[#181B22]"
                          }`}
                          style={{
                            borderColor: isSelected ? coin.iconColor : undefined,
                            boxShadow: isSelected ? `0 0 16px ${coin.iconColor}25` : undefined,
                          }}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 flex items-center justify-center text-[8px] font-black text-slate-950"
                            style={{ backgroundColor: coin.iconColor }}
                          />
                          <div className="truncate">
                            <div className="text-xs font-bold text-[#F2F3F5]">{coin.symbol}</div>
                            <div className="text-[10px] text-[#5A6070] truncate">{coin.network.split(" ")[0]}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Selected Coin Details Card */}
                  <div 
                    className="p-5 sm:p-6 rounded-2xl bg-[#0D0F13] border transition-all duration-300 relative overflow-hidden"
                    style={{ borderColor: `${currentCrypto.iconColor}40` }}
                  >
                    {/* Ambient Glow */}
                    <div 
                      className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20"
                      style={{ backgroundColor: currentCrypto.iconColor }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                      
                      {/* QR Viewfinder Container */}
                      <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#14161C] border border-[#262A30]/80">
                        <div className="relative p-3 bg-white rounded-xl shadow-2xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cryptoQrUrl}
                            alt={`${currentCrypto.symbol} QR Code`}
                            width={190}
                            height={190}
                            className="w-44 h-44 block"
                          />
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#9298A3] font-medium text-center">
                          <QrCode className="w-3.5 h-3.5 text-[#F2F3F5]" />
                          <span>Scan with your {currentCrypto.name} wallet</span>
                        </div>
                      </div>

                      {/* Details & Copy Container */}
                      <div className="md:col-span-7 space-y-4">
                        
                        {/* Token Header & Network badge */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full"
                                style={{ backgroundColor: currentCrypto.iconColor }}
                              />
                              <h4 className="text-lg font-black text-[#F2F3F5]">
                                {currentCrypto.name} ({currentCrypto.symbol})
                              </h4>
                            </div>

                            <span 
                              className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border"
                              style={{ 
                                color: currentCrypto.iconColor,
                                backgroundColor: `${currentCrypto.iconColor}15`,
                                borderColor: `${currentCrypto.iconColor}35`
                              }}
                            >
                              {currentCrypto.network}
                            </span>
                          </div>

                          {currentCrypto.note && (
                            <p className="text-xs text-[#9298A3] leading-relaxed">
                              {currentCrypto.note}
                            </p>
                          )}
                        </div>

                        {/* Address Box */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#9298A3] flex items-center justify-between">
                            <span>Receiving Address</span>
                            <span className="text-[10px] text-amber-400 font-normal">
                              Double-check network before sending
                            </span>
                          </label>

                          <div className="p-3 bg-[#16181F] border border-[#262A30] rounded-xl space-y-3">
                            <code className="text-xs sm:text-[13px] font-mono text-[#F2F3F5] break-all block select-all bg-[#0B0C0E] p-2.5 rounded-lg border border-[#1E2228]">
                              {currentCrypto.address}
                            </code>

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(currentCrypto.address, currentCrypto.symbol)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold text-[#0B0C0E] transition-all shadow-md active:scale-95"
                                style={{ 
                                  backgroundColor: copiedKey === currentCrypto.symbol ? "#22C55E" : currentCrypto.iconColor,
                                  color: copiedKey === currentCrypto.symbol ? "#052e16" : "#0B0C0E"
                                }}
                              >
                                {copiedKey === currentCrypto.symbol ? (
                                  <>
                                    <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                                    <span>Address Copied to Clipboard!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span>Copy {currentCrypto.symbol} Address</span>
                                  </>
                                )}
                              </button>

                              {currentCrypto.explorerUrl && (
                                <a
                                  href={currentCrypto.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold bg-[#1F232D] hover:bg-[#272C38] text-[#9298A3] hover:text-[#F2F3F5] border border-[#2B303C] transition-colors shrink-0"
                                  title="Verify address on blockchain explorer"
                                >
                                  <span>Explorer</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Quick All-in-One Copy List for Power Users */}
                  <div className="pt-2">
                    <div className="p-4 rounded-xl bg-[#0E1014] border border-[#22262E] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#F2F3F5] flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-[#8B7CFF]" />
                          All Addresses at a Glance
                        </span>
                        <span className="text-[#5A6070] text-[11px]">Click to copy any coin</span>
                      </div>

                      <div className="space-y-1.5">
                        {DONATION_CONFIG.crypto.map((coin) => (
                          <div
                            key={coin.symbol}
                            className="flex items-center justify-between gap-3 p-2 rounded-lg bg-[#14161C] border border-[#1E2228] hover:border-[#2D323E] transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: coin.iconColor }}
                              />
                              <span className="text-xs font-bold text-[#F2F3F5] shrink-0">{coin.symbol}</span>
                              <span className="text-[10px] text-[#9298A3] truncate hidden sm:inline">({coin.network})</span>
                              <code className="text-[11px] font-mono text-[#5A6070] truncate max-w-[200px] sm:max-w-[280px]">
                                {coin.address}
                              </code>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(coin.address, `quick-${coin.symbol}`)}
                                className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#1E222B] hover:bg-[#282D39] text-[#E2E4E8] border border-[#2B303C] transition-colors flex items-center gap-1"
                              >
                                {copiedKey === `quick-${coin.symbol}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
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
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                    <Coins className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F2F3F5]">Direct Crypto Wallets Arriving Soon</h3>
                  <p className="text-xs text-[#9298A3] leading-relaxed">
                    USDT, Bitcoin, and Solana wallet addresses will be listed shortly. For now, you can support us directly using Ko-fi or Buy Me a Coffee!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("cards")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#8B7CFF] text-[#0B0C0E] hover:bg-[#9b8eff] transition-colors"
                  >
                    <span>Support on Ko-fi / Buy Me a Coffee</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PayPal */}
          {activeTab === "paypal" && (
            <div className="space-y-6 animate-fade-in text-center sm:text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400">
                  <Globe className="w-3.5 h-3.5" /> 200+ Countries &bull; Direct Transfer
                </div>
                <h3 className="text-xl font-bold text-[#F2F3F5]">
                  Donate via PayPal.me
                </h3>
                <p className="text-sm text-[#9298A3]">
                  Transfer funds directly to our PayPal account or pay using any international card linked to PayPal.
                </p>
              </div>

              <div className="max-w-lg p-6 rounded-2xl bg-[#16181D] border border-[#262A30] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#F2F3F5]">
                    PayPal Handle
                  </span>
                  <span className="text-xs font-mono text-[#38BDF8]">
                    paypal.me/{DONATION_CONFIG.paypal.username}
                  </span>
                </div>

                <a
                  href={DONATION_CONFIG.paypal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#0070BA] hover:bg-[#0086dc] text-white font-bold text-sm transition-colors shadow-lg shadow-[#0070BA]/20"
                >
                  <span>Open PayPal.me/ShobhitVerma02</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Impact / Where Money Goes ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#111316] border border-[#262A30] space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#F2F3F5]">High-Speed Edge Servers</h4>
          <p className="text-xs text-[#9298A3] leading-relaxed">
            Funds fast, sub-50ms search query response times and instant autocomplete caching globally.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111316] border border-[#262A30] space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#F2F3F5]">24/7 Link Health Bot</h4>
          <p className="text-xs text-[#9298A3] leading-relaxed">
            Runs automated background checks to eliminate 404 dead links, broken mirrors, and unsafe redirects.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111316] border border-[#262A30] space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-[#8B7CFF] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#F2F3F5]">Zero Ads, Zero Trackers</h4>
          <p className="text-xs text-[#9298A3] leading-relaxed">
            Keeps the platform clean, privacy-respecting, and free of annoying popup ads or paid sponsored rankings.
          </p>
        </div>
      </div>

      {/* ── Other Ways to Contribute ── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111316] via-[#16181D] to-[#111316] border border-[#262A30] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-[#F2F3F5] flex items-center justify-center sm:justify-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#8B7CFF]" />
            Can&apos;t donate financially right now?
          </h4>
          <p className="text-xs text-[#9298A3]">
            You can also contribute by submitting new verified tools or reporting broken links to help the entire community!
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/submit"
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#8B7CFF] text-[#0B0C0E] hover:bg-[#9d90ff] transition-colors"
          >
            Submit a Resource
          </Link>
          <Link
            href="/report"
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#9298A3] hover:text-[#F2F3F5] border border-[#262A30] hover:bg-[#15181C] transition-colors"
          >
            Report an Issue
          </Link>
        </div>
      </div>
    </div>
  );
}
