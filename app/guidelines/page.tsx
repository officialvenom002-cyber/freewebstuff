import React from "react";
import Link from "next/link";
import { ShieldCheck, Check, X, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Inclusion Guidelines & Safety Standards | FreeInternetStuff",
  description: "Standards and policies for verifying, indexing, and moderating external software and website links.",
};

export default function GuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/25">
          <ShieldCheck className="w-3.5 h-3.5" />
          Safety &amp; Curation Standards
        </div>
        <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
          Directory Inclusion Guidelines
        </h1>
        <p className="text-sm text-content-muted">
          How we review, verify, categorize, and moderate external tools before inclusion in FreeInternetStuff.
        </p>
      </div>

      <div className="space-y-6 text-sm text-content-secondary leading-relaxed">
        
        {/* Core Principles */}
        <section className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h2 className="text-lg font-bold text-content-primary">1. Core Inclusion Criteria</h2>
          <p>
            To be considered for indexing on FreeInternetStuff, a website, tool, or software application must meet our baseline criteria:
          </p>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>Genuine Utility:</strong> Delivers tangible value to developers, creators, power users, or students without deceptive dark patterns.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>Active Maintenance:</strong> The domain is accessible over HTTPS with zero SSL certificate errors or known DNS hijacking.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>Transparent Licensing &amp; Pricing:</strong> Clearly specifies whether the tool is Free, Open Source (MIT/GPL/Apache), Freemium, or Paid.</span>
            </li>
          </ul>
        </section>

        {/* Prohibited Content */}
        <section className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h2 className="text-lg font-bold text-content-primary">2. Strictly Prohibited Submissions</h2>
          <p>
            The following categories of websites and tools will be immediately rejected and banned from indexing:
          </p>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5 text-red-300">
              <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-3.5 h-3.5" />
              </div>
              <span>Malware, trojans, cryptominers, spyware, or keyloggers.</span>
            </li>
            <li className="flex items-start gap-2.5 text-red-300">
              <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-3.5 h-3.5" />
              </div>
              <span>Phishing sites, credit card scams, or fake download landing pages.</span>
            </li>
            <li className="flex items-start gap-2.5 text-red-300">
              <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-3.5 h-3.5" />
              </div>
              <span>Websites that host or distribute unlicensed copyrighted commercial binaries directly.</span>
            </li>
          </ul>
        </section>

        {/* Verification System */}
        <section className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h2 className="text-lg font-bold text-content-primary">3. The Verification Badge System</h2>
          <p>
            Resources marked with <span className="text-emerald-400 font-bold">✓ Verified Safe</span> have undergone manual inspection by human maintainers, domain security reputation checks, and HTTPS certificate validation. We re-audit links every 90 days.
          </p>
        </section>

      </div>
    </div>
  );
}
