"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";

interface AnnouncementBannerProps {
  message: string;
  linkText: string;
  linkHref: string;
  dismissKey: string;
}

export default function AnnouncementBanner({
  message,
  linkText,
  linkHref,
  dismissKey,
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(`banner_dismissed_${dismissKey}`);
    if (!dismissed) setVisible(true);
  }, [dismissKey]);

  const dismiss = () => {
    localStorage.setItem(`banner_dismissed_${dismissKey}`, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="w-full bg-brand-900/60 border-b border-brand-500/25 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-content-secondary">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span>{message}</span>
          <Link
            href={linkHref}
            className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2 transition-colors"
          >
            {linkText} →
          </Link>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="p-1 rounded text-content-muted hover:text-content-primary transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
