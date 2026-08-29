"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Send, MessageSquare, ArrowRight, ShieldCheck, Bell } from "lucide-react";

export default function CommunityPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("fwsf_community_modal_dismissed");
      if (!dismissed) {
        // Show after a subtle 1.2s delay for seamless entrance
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleClose = () => {
    try {
      if (dontShowAgain) {
        localStorage.setItem("fwsf_community_modal_dismissed", "true");
      } else {
        sessionStorage.setItem("fwsf_community_modal_session_dismissed", "true");
      }
    } catch {
      // Ignore storage errors
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0e131f] border border-sky-500/30 shadow-[0_0_50px_rgba(56,189,248,0.25)] p-6 sm:p-8 space-y-6 animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow ambient decorations */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors duration-150 cursor-pointer"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Community</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Join the <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">FreeWebStuff</span> Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            Get instant updates on newly curated tools, exclusive software drops, and community discussions.
          </p>
        </div>

        {/* Community Channel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Telegram Card */}
          <a
            href="https://t.me/+N7tYaUKT2q44NGU1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-b from-[#1b2a47]/80 to-[#101b30]/80 hover:from-[#21355a] hover:to-[#162544] border border-[#229ED9]/40 hover:border-[#229ED9] shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9] group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#229ED9]/20 text-sky-300 border border-[#229ED9]/30">
                  Instant Channel
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-sky-300 transition-colors">
                  Telegram
                </h3>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  Daily updates, latest mirrors &amp; notifications
                </p>
              </div>
            </div>
            
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:text-sky-300 transition-colors">
              <span>Join Channel</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </a>

          {/* Discord Card */}
          <a
            href="https://discord.gg/mHpBcYJHM"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-b from-[#1f2040]/80 to-[#14152e]/80 hover:from-[#282a54] hover:to-[#1b1c3c] border border-[#5865F2]/40 hover:border-[#5865F2] shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#5865F2]/20 text-indigo-300 border border-[#5865F2]/30">
                  Community Chat
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                  Discord
                </h3>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  Tool discussions, support &amp; member requests
                </p>
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
              <span>Join Server</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </a>

        </div>

        {/* Footer controls */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded accent-sky-400 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Don&apos;t show again</span>
          </label>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white font-medium hover:underline transition-colors cursor-pointer"
          >
            Continue to Site &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}
