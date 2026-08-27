import React from "react";

export const metadata = {
  title: "Terms of Service & Indexing Disclaimer | FreeInternetStuff",
  description: "Terms of service, directory indexing disclaimer, and copyright notices.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 text-sm text-content-secondary leading-relaxed">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
          Terms of Service &amp; Indexing Disclaimer
        </h1>
        <p className="text-xs text-content-muted">Last revised: August 20, 2026</p>
      </div>

      <section id="indexing-disclaimer" className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
        <h2 className="text-lg font-bold text-content-primary">1. Search Directory &amp; Indexing Disclaimer</h2>
        <p>
          FreeInternetStuff functions exclusively as an informational search engine, discovery directory, and bookmarking aggregator for public third-party websites, software utilities, and digital tools.
        </p>
        <p>
          FreeInternetStuff <strong>does not host, store, mirror, or directly distribute</strong> any third-party software binaries, installer files, or media files. Outbound hyperlinks direct users directly to original developer and publisher domains.
        </p>
      </section>

      <section className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
        <h2 className="text-lg font-bold text-content-primary">2. External Links &amp; User Discretion</h2>
        <p>
          While FreeInternetStuff implements regular automated and community verification reviews, we do not control external third-party sites and assume no liability for content, software changes, or privacy practices on third-party domains.
        </p>
      </section>

      <section className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
        <h2 className="text-lg font-bold text-content-primary">3. Takedown and Moderation Requests</h2>
        <p>
          If you are a copyright holder or developer representative and wish to request removal or update of an indexed listing, please use our <a href="/report" className="text-brand-400 underline">Report &amp; Takedown form</a>. Requests are processed within 48 business hours.
        </p>
      </section>
    </div>
  );
}
