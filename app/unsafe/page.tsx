import React from "react";
import Link from "next/link";
import { ShieldOff, AlertTriangle, Shield } from "lucide-react";

export const metadata = {
  title: "Unsafe Sites — FreeWebStuff SafeGuard",
  description: "Sites flagged for malware, trackers, deceptive practices, or security issues.",
};

const unsafeSites = [
  { name: "FMovies variants (unofficial)", category: "Video", threat: "Malvertising", severity: "high" as const, note: "Aggressive ad networks known to serve drive-by malware. Always use uBlock Origin if visiting any streaming site." },
  { name: "uTorrent (pre-3.6)", category: "Downloads", threat: "Bundled Adware / Cryptominer", severity: "medium" as const, note: "Older versions bundled a cryptocurrency miner and adware. Use qBittorrent instead (open-source)." },
  { name: "Hola VPN", category: "Privacy & Security", threat: "Peer Botnet / Data Selling", severity: "high" as const, note: "Sells user bandwidth to a commercial botnet. Your connection is used as an exit node by others. Do not install." },
  { name: "CCleaner (post-2017)", category: "Software", threat: "Past Supply-chain Attack", severity: "medium" as const, note: "Compromised by hackers in 2017 to distribute malware. Now owned by Avast — ongoing privacy concerns." },
  { name: "Rainmeter skins (unofficial sites)", category: "Software", threat: "Trojan Distribution", severity: "high" as const, note: "Many unofficial Rainmeter skin sites bundle keyloggers. Only download from the official rainmeter.net." },
  { name: "YMovies / GoMovies clones", category: "Video", threat: "Phishing / Fake Captcha", severity: "medium" as const, note: "Numerous clone sites use fake CAPTCHA prompts to push browser notification spam or install adware." },
];

const sev = {
  high:   { label: "High Risk",   dot: "bg-red-400",    color: "text-red-400",    bg: "bg-red-500/5",    border: "border-red-500/25" },
  medium: { label: "Medium Risk", dot: "bg-orange-400", color: "text-orange-400", bg: "bg-orange-500/5", border: "border-orange-500/25" },
  low:    { label: "Low Risk",    dot: "bg-yellow-400", color: "text-yellow-400", bg: "bg-yellow-500/5", border: "border-yellow-500/25" },
};

export default function UnsafePage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          <ShieldOff className="w-3.5 h-3.5" /> SafeGuard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">Unsafe Sites</h1>
        <p className="text-sm text-content-muted leading-relaxed">
          Sites flagged for malware, aggressive tracking, deceptive practices, or known security issues. Proceed with extreme caution or avoid entirely.
        </p>
      </div>

      <div className="p-5 rounded-xl border border-brand-500/25 bg-brand-500/5 flex gap-4">
        <Shield className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm font-semibold text-content-primary">SafeGuard Protection Checklist</p>
          <ul className="space-y-1.5">
            {["Install uBlock Origin or Brave Shields before browsing","Never disable your ad-blocker for sites that ask","Download software only from official / verified sources","Use a reputable antivirus and keep it updated"].map((tip) => (
              <li key={tip} className="text-xs text-content-muted flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />{tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        {unsafeSites.map((site) => {
          const s = sev[site.severity];
          return (
            <div key={site.name} className={`p-4 rounded-xl border ${s.border} ${s.bg} space-y-2`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-content-primary">{site.name}</span>
                    <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${s.color} ${s.bg} ${s.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-content-muted">{site.category}</span>
                    <span className="text-content-subtle">·</span>
                    <span className={`text-xs font-medium ${s.color}`}>{site.threat}</span>
                  </div>
                </div>
                <AlertTriangle className={`w-5 h-5 shrink-0 ${s.color}`} />
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">{site.note}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4 border-t border-surface-border">
        <p className="text-xs text-content-muted">
          Know a dangerous site?{" "}
          <Link href="/report" className="text-brand-400 hover:underline">Report it here →</Link>
        </p>
      </div>
    </div>
  );
}
