"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Flag, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

function ReportContent() {
  const searchParams = useSearchParams();
  const prepopulatedName = searchParams.get("resource") || "";
  const prepopulatedId = searchParams.get("id") || "";

  const [resourceName, setResourceName] = useState(prepopulatedName);
  const [resourceId, setResourceId] = useState(prepopulatedId || "manual-entry");
  const [reason, setReason] = useState<string>("dead-link");
  const [details, setDetails] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const reasons = [
    { value: "dead-link", label: "Dead or Broken Link (404/Timeout)" },
    { value: "malware", label: "Malware, Phishing or Security Threat" },
    { value: "scam", label: "Scam or Deceptive Billing/Monetization" },
    { value: "misleading", label: "Misleading Information / False Claims" },
    { value: "wrong-category", label: "Wrong Category or Outdated Tags" },
    { value: "duplicate", label: "Duplicate Entry in Directory" },
    { value: "legal", label: "Copyright / DMCA Takedown Notice" },
    { value: "other", label: "Other Issue" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resourceName.trim() || !details.trim()) {
      setError("Please provide both the resource name and description of the issue.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resourceId || "general-report",
          resourceName,
          reason,
          details,
          reporterEmail,
        }),
      });

      if (!res.ok) {
        setError("Failed to record report. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-content-primary">Report Received</h1>
        <p className="text-sm text-content-muted leading-relaxed">
          Thank you for keeping FreeWebStuff clean and safe. Our moderation team has queued this item for investigation.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div className="space-y-2 text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/25">
          <ShieldAlert className="w-3.5 h-3.5" />
          Integrity &amp; Safety
        </div>
        <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
          Report a Resource
        </h1>
        <p className="text-xs sm:text-sm text-content-muted">
          Help us maintain a trustworthy index by reporting dead links, security threats, or inaccurate categorizations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content-secondary block">
            Resource Name / URL *
          </label>
          <input
            type="text"
            required
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="Name or URL of the affected resource"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content-secondary block">
            Reason for Report *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
          >
            {reasons.map((r) => (
              <option key={r.value} value={r.value} className="bg-surface">
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content-secondary block">
            Detailed Explanation *
          </label>
          <textarea
            required
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe what is wrong with the resource (e.g. website has been taken down, software now contains adware, incorrect category)..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content-secondary block">
            Your Email (Optional, for status updates)
          </label>
          <input
            type="email"
            value={reporterEmail}
            onChange={(e) => setReporterEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Flag className="w-4 h-4" />
            <span>{submitting ? "Submitting Report..." : "Submit Report to Moderation"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-content-muted">Loading report form...</div>}>
      <ReportContent />
    </Suspense>
  );
}
