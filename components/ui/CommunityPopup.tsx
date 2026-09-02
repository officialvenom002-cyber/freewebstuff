"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Send, MessageSquare, ArrowRight, ShieldCheck, Check } from "lucide-react";

export default function CommunityPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    try {
      const localDismissed = localStorage.getItem("fwsf_community_modal_dismissed");
      const sessionDismissed = sessionStorage.getItem("fwsf_community_modal_session_dismissed");
      if (localDismissed || sessionDismissed) {
        return;
      }
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    } catch {
      // Fallback
    }
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      localStorage.setItem("fwsf_community_modal_dismissed", "true");
      sessionStorage.setItem("fwsf_community_modal_session_dismissed", "true");
    } catch {
      // Ignore storage errors
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={() => handleClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090b10]/85 backdrop-blur-xl animate-fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#0e121a] border border-white/[0.12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-6 sm:p-7 space-y-5 animate-scale-up cursor-default"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Matte Top Edge Highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent pointer-events-none" />

        {/* Subtle Matte Background Dot Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
          }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => handleClose(e)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-[rgba(20,26,38,0.85)] border border-white/[0.12] text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 active:scale-95 transition-all duration-150 cursor-pointer z-50 shadow-md"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Content */}
        <div className="space-y-2 pt-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(20,26,38,0.85)] border border-white/[0.1] text-slate-300 text-xs font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Community Channels</span>
          </div>

          <h2 className="text-2xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300">
            Join the FreeWebStuff Hub
          </h2>

          <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-sm">
            Get instant notifications on fresh tools, software mirrors, and community discussions.
          </p>
        </div>

        {/* Matte Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
          
          {/* Telegram Matte Card */}
          <a
            href="https://t.me/+N7tYaUKT2q44NGU1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="group relative flex flex-col justify-between p-4 rounded-xl bg-[rgba(15,19,28,0.92)] border border-white/[0.08] hover:border-[#229ED9]/50 hover:bg-[rgba(20,27,42,0.96)] transition-all duration-200 cursor-pointer shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#229ED9]/15 border border-[#229ED9]/30 flex items-center justify-center text-[#229ED9] group-hover:scale-105 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-[#229ED9]/15 text-[#38bdf8] border border-[#229ED9]/25">
                  Telegram
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-[14px] group-hover:text-sky-300 transition-colors">
                  Instant Channel
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Daily tool updates &amp; mirrors
                </p>
              </div>
            </div>
            
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] inline-flex items-center justify-between text-xs font-semibold text-[#38bdf8] group-hover:text-sky-200 transition-colors">
              <span>Join Channel</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </a>

          {/* Discord Matte Card */}
          <a
            href="https://discord.gg/mHpBcYJHM"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="group relative flex flex-col justify-between p-4 rounded-xl bg-[rgba(15,19,28,0.92)] border border-white/[0.08] hover:border-[#5865F2]/50 hover:bg-[rgba(22,23,45,0.96)] transition-all duration-200 cursor-pointer shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#5865F2]/15 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-[#5865F2]/15 text-indigo-300 border border-[#5865F2]/25">
                  Discord
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-[14px] group-hover:text-indigo-300 transition-colors">
                  Community Chat
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Discussions &amp; resource requests
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] inline-flex items-center justify-between text-xs font-semibold text-[#818cf8] group-hover:text-indigo-200 transition-colors">
              <span>Join Server</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </a>

        </div>

        {/* Footer controls (Matte Finish) */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs text-slate-400 relative z-10">
          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded accent-sky-400 w-3.5 h-3.5 cursor-pointer bg-[rgba(20,26,38,0.85)] border border-white/20"
            />
            <span>Don&apos;t show again</span>
          </label>

          <button
            onClick={handleClose}
            className="px-3.5 py-1.5 rounded-lg bg-[rgba(20,26,38,0.85)] border border-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white font-medium transition-all duration-150 cursor-pointer"
          >
            Continue to Site &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}
