"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function CharityPledgeCard() {
  return (
    <section className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-6 my-2">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#11141C] via-[#141824] to-[#0E1118] border border-[#232938] hover:border-emerald-500/40 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden transition-all duration-300 group">
        
        {/* Soft atmospheric ambient background light */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Mission Content */}
          <div className="lg:col-span-8 space-y-5 text-left">
            
            {/* Pulsing Tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-emerald-500/15 via-rose-500/15 to-amber-500/15 text-[#EDEDEE] border border-emerald-500/30 shadow-sm animate-pulse">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>The 75% Compassion Pledge &bull; Tech with a Soul</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black tracking-tight text-[#EDEDEE] leading-tight">
              Feed a Stray Dog &amp; Help the Poor. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                75% of Every Donation Feeds a Life.
              </span>
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-[#9AA0AD] leading-relaxed max-w-2xl">
              FreeWebStuff is 100% free and open, but we believe tech should heal the world. 
              <strong> 75% of all donor contributions are directly used to buy warm meals for homeless families, feed hungry street dogs, and distribute winter survival blankets.</strong> 
              The remaining 25% funds our high-speed edge servers and link verification bots.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-[#C5CAD4]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1016] border border-[#202636]">
                <span className="text-base">🍲</span>
                <span className="font-semibold">Warm Meals for Hungry</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1016] border border-[#202636]">
                <span className="text-base">🐕</span>
                <span className="font-semibold">Street Dog Food &amp; Rescue</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1016] border border-[#202636]">
                <span className="text-base">🤝</span>
                <span className="font-semibold">Winter Blankets &amp; Aid</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Overhead Waste</span>
              </span>
            </div>

          </div>

          {/* Right Column: Visual Card + 1-Click Redirect Button */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4">
            
            {/* Visual Graphic Display */}
            <div className="w-full p-5 rounded-2xl bg-[#0B0E14] border border-[#1F2536] shadow-xl relative overflow-hidden group/graphic flex flex-col items-center text-center">
              
              {/* Illustration Art */}
              <div className="relative w-28 h-28 my-1 flex items-center justify-center">
                {/* Outer revolving ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30 animate-[spin_20s_linear_infinite]" />
                
                {/* Center Badge Icon Graphic */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-[#182030] to-rose-500/20 border border-emerald-500/40 flex flex-col items-center justify-center shadow-lg group-hover/graphic:scale-105 transition-transform duration-300">
                  <span className="text-3xl select-none">🐕</span>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-[#0B0C0E] flex items-center justify-center font-black text-[11px] shadow-md">
                    75%
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="mt-2 space-y-0.5">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  1-Click Humanitarian Impact
                </div>
                <div className="text-[11px] text-[#7E8494]">
                  $3 feeds 3 street dogs &bull; $10 feeds 8+ hot meals
                </div>
              </div>

              {/* 1-Click Direct Button */}
              <Link
                href="/support"
                className="mt-4 w-full inline-flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-[#090B0E] font-black text-xs sm:text-sm tracking-tight transition-all duration-200 active:scale-95 shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:shadow-[0_0_32px_rgba(16,185,129,0.5)] cursor-pointer"
              >
                <span>Feed a Dog &amp; Support</span>
                <ArrowRight className="w-4 h-4 text-[#090B0E]" />
              </Link>
            </div>

            <div className="text-[11px] text-[#717786] text-center flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Ad-Free Support &bull; Transparent Relief</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
