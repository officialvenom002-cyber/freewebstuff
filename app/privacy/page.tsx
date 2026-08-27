import React from "react";

export const metadata = {
  title: "Privacy Policy | FreeInternetStuff",
  description: "Privacy-first architecture, zero tracking policies, and local data storage details.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 text-sm text-content-secondary leading-relaxed">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-content-muted">Last revised: August 20, 2026</p>
      </div>

      <section className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
        <h2 className="text-lg font-bold text-content-primary">1. Our Commitment to Zero Telemetry</h2>
        <p>
          FreeInternetStuff was built with a strict privacy-first architecture. We do not sell user data, utilize invasive cross-site tracking cookies, or fingerprint user browser configurations.
        </p>
      </section>

      <section className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
        <h2 className="text-lg font-bold text-content-primary">2. Local Storage &amp; Offline Bookmarks</h2>
        <p>
          Your saved bookmarks and satisfaction votes are stored entirely inside your browser&apos;s <code>localStorage</code> by default. This data never leaves your computer unless you explicitly export it.
        </p>
      </section>

      <section className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
        <h2 className="text-lg font-bold text-content-primary">3. Outbound Link Security</h2>
        <p>
          All external destination links use <code>rel=&quot;noopener noreferrer&quot;</code> to prevent window hijacking and prevent referrer token leakage to destination domains.
        </p>
      </section>
    </div>
  );
}
