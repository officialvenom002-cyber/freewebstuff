import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ClientLayout from "@/components/layout/ClientLayout";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MonetagGuardian from "@/components/ads/MonetagGuardian";
import { generateWebSiteSchema } from "@/lib/seo/schema";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FreeWebStuff (freewebstuff.site) — Curated Directory of 20,000+ Best Free Tools & Software",
    template: "%s | FreeWebStuff",
  },
  description:
    "Explore the internet's definitive directory of 20,000+ verified free websites, open-source software, streaming sites, AI assistants, developer tools, ebooks, and privacy utilities.",
  keywords: [
    "freewebstuff",
    "freewebstuff.site",
    "freewebstuff site",
    "FreeWebStuff",
    "free web stuff",
    "free internet stuff",
    "freewebstuff",
    "free web stuff",
    "fmhy",
    "freemediaheckyeah",
    "best free software",
    "free movie streaming sites",
    "free anime streaming",
    "watch movies online free",
    "hindi movies download",
    "bollywood movies free",
    "free tv shows",
    "free adblockers",
    "ublock origin",
    "free ai tools",
    "chatgpt alternatives free",
    "free games download",
    "fitgirl repacks",
    "free ebooks download",
    "pdf book search engine",
    "torrent sites 2026",
    "direct download sites",
    "open source software",
    "curated web directory",
    "developer tools free",
    "foss android apps",
    "free online courses",
    "safe download sites",
    "free streaming sites"
  ],
  authors: [{ name: "FreeWebStuff Community", url: "https://freewebstuff.site" }],
  creator: "FreeWebStuff",
  publisher: "FreeWebStuff",
  metadataBase: new URL("https://freewebstuff.site"),
  alternates: {
    canonical: "https://freewebstuff.site",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freewebstuff.site",
    siteName: "FreeWebStuff",
    title: "FreeWebStuff — Curated Directory of 20,000+ Free Tools & Web Resources",
    description:
      "The definitive community-verified index of free streaming sites, AI models, developer tools, open-source software, and media resources.",
    images: [
      {
        url: "https://freewebstuff.site/favicon.png",
        width: 512,
        height: 512,
        alt: "FreeWebStuff Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeWebStuff — 20,000+ Curated Free Tools & Resources",
    description:
      "Browse 20,000+ verified free tools, streaming sites, AI assistants, and open-source software.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateWebSiteSchema();

  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`dark ${jakarta.variable} ${mono.variable}`}
    >
      <head>
        {/* High-speed CDN preconnect for maximum fill rate & low latency CPM */}
        <link rel="preconnect" href="https://bibleearthquake.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://bibleearthquake.com" />
        <link rel="preconnect" href="https://quge5.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://quge5.com" />
        {/* Verification & Ad Network Tags (Monetag & Adsterra verbatim) */}
        <script
          id="ad-network-tags"
          dangerouslySetInnerHTML={{
            __html: `</script><script src="https://quge5.com/88/tag.min.js" data-zone="286666" async data-cfasync="false"></script><script async="async" data-cfasync="false" src="https://bibleearthquake.com/940525bed6a894c4f710e89328b26e59/invoke.js"></script><script src="https://bibleearthquake.com/b7/ae/5a/b7ae5af830f6bf0bc3210b84a8a94fe7.js"></script><script src="https://bibleearthquake.com/0e/99/fa/0e99fa0311152f33953e4d7b110510ee.js"></script><script>`,
          }}
        />
        {/* Service Worker Auto-Registration for Monetag Push Notifications */}
        <script
          id="monetag-sw-register"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== "undefined" && "serviceWorker" in navigator) {
                window.addEventListener("load", function() {
                  navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function(){});
                });
              }
            `,
          }}
        />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-3T4ZJ0VR0G"
        />
        <Script
          id="google-analytics-inline"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3T4ZJ0VR0G', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body 
        suppressHydrationWarning
        className="font-sans min-h-screen flex flex-col antialiased bg-[#0B0C0E] text-[#F2F3F5]"
      >
        <script
          id="fwsf-theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("fwsf-theme")||localStorage.getItem("fins-theme")||"dark";if(t!=="white"&&t!=="light")t="dark";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
        <script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        {/* ── Live revolving background orbs (matte, very dim, full-site) ── */}
        <div id="bg-canvas" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <GoogleAnalytics />
        <MonetagGuardian />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
