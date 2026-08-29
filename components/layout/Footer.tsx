import Logo from "../ui/Logo";
import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Heart, ExternalLink, Github, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface/80 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-surface-border/60">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Logo className="w-8 h-8" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white group-hover:text-sky-300 transition-colors">
                  FWSF
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  (FreeWebStuff)
                </span>
              </div>
            </Link>
            <p className="text-sm text-content-muted leading-relaxed max-w-sm">
              A curated, privacy-first directory and search engine for useful websites, software, developer utilities, AI models, and community tools.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-secondary text-content-secondary border border-surface-border">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Community Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-secondary text-content-secondary border border-surface-border">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                24+ Categories
              </span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-secondary">Directory</h4>
            <ul className="space-y-2 text-sm text-content-muted">
              <li><Link href="/search" className="hover:text-brand-400 transition-colors">Explore All Tools</Link></li>
              <li><Link href="/categories" className="hover:text-brand-400 transition-colors">Categories</Link></li>
              <li><Link href="/collections" className="hover:text-brand-400 transition-colors">Curated Collections</Link></li>
              <li><Link href="/trending" className="hover:text-brand-400 transition-colors">Trending Tools</Link></li>
              <li><Link href="/new" className="hover:text-brand-400 transition-colors">Recently Added</Link></li>
            </ul>
          </div>

          {/* Community & Moderation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-secondary">Community</h4>
            <ul className="space-y-2 text-sm text-content-muted">
              <li><a href="https://t.me/+N7tYaUKT2q44NGU1" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition-colors flex items-center gap-1">Join Telegram</a></li>
              <li><a href="https://discord.gg/mHpBcYJHM" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition-colors flex items-center gap-1">Join Discord</a></li>
              <li><Link href="/submit" className="hover:text-brand-400 transition-colors">Submit a Resource</Link></li>
              <li><Link href="/report" className="hover:text-brand-400 transition-colors">Report Broken Link</Link></li>
              <li><Link href="/guidelines" className="hover:text-brand-400 transition-colors">Inclusion Guidelines</Link></li>
              <li><Link href="/admin" className="hover:text-brand-400 transition-colors flex items-center gap-1">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-secondary">Legal & Safety</h4>
            <ul className="space-y-2 text-sm text-content-muted">
              <li><Link href="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms#indexing-disclaimer" className="hover:text-brand-400 transition-colors">Indexing Disclaimer</Link></li>
              <li><Link href="/report" className="hover:text-brand-400 transition-colors">Takedown Requests</Link></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Notice */}
        <div className="py-6 text-xs text-content-muted/80 border-b border-surface-border/40 leading-relaxed">
          <strong className="text-content-secondary">Notice & Indexing Policy:</strong> FreeWebStuff operates solely as an index and discovery directory of publicly available web resources, open-source software, and developer tools. FreeWebStuff does not host third-party files, binaries, or streams on its servers. All product names, logos, and brands are property of their respective owners.
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-muted">
          <div>
            &copy; {new Date().getFullYear()} FreeWebStuff. Free and community curated.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="hover:text-brand-400 transition-colors">
              Sitemap
            </Link>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for the Open Web
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
