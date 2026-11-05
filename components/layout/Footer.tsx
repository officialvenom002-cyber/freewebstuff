import React from "react";
import Link from "next/link";
import Logo from "../ui/Logo";
import { Heart, Send, MessageSquare } from "lucide-react";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-[#1C1F26] bg-[#0A0B0D] pt-12 pb-8 mt-16 sm:mt-20 text-zinc-400 text-sm">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        
        {/* Top: Brand & Minimal Navigation */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-8 border-b border-[#1C1F26]">
          
          {/* Brand Summary */}
          <div className="space-y-3 max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <Logo className="w-7 h-7" />
              <span className="font-heading font-bold text-base tracking-tight text-zinc-100 group-hover:text-sky-400 transition-colors duration-200">
                FreeWebStuff
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Curated directory of verified free web tools, open-source software, and privacy utilities.
            </p>

            {/* Quick Community & Support links */}
            <div className="flex items-center gap-3 pt-1 text-xs">
              <a
                href="https://t.me/+N7tYaUKT2q44NGU1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors duration-200"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram</span>
              </a>
              <span className="text-zinc-700">•</span>
              <a
                href="https://discord.gg/mHpBcYJHM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors duration-200"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Discord</span>
              </a>
              <span className="text-zinc-700">•</span>
              <Link
                href="/support"
                className="text-zinc-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors duration-200"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" />
                <span>Support</span>
              </Link>
            </div>
          </div>

          {/* Clean 3-Column Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 text-xs">
            
            {/* Directory */}
            <div className="space-y-2.5">
              <div className="font-medium text-zinc-200">Directory</div>
              <ul className="space-y-2">
                <li>
                  <Link href="/categories" className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/trending" className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200">
                    Trending
                  </Link>
                </li>
                <li>
                  <Link href="/beginners-guide" className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200">
                    Quick Start
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contribute */}
            <div className="space-y-2.5">
              <div className="font-medium text-zinc-200">Contribute</div>
              <ul className="space-y-2">
                <li>
                  <Link href="/submit" className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200">
                    Submit Tool
                  </Link>
                </li>
                <li>
                  <Link href="/report" className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200">
                    Report Link
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200">
                    Guidelines
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-2.5 col-span-2 sm:col-span-1">
              <div className="font-medium text-zinc-200">Legal</div>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200">
                    Terms & DMCA
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap.xml" className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div>
            © {currentYear} FreeWebStuff. Free and community curated.
          </div>
          <div className="text-[11px] text-zinc-400">
            Independent search index • No files or streams are hosted on this server.
          </div>
        </div>

      </div>
    </footer>
  );
}
