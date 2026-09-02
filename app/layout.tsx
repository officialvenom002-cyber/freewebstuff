import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { generateWebSiteSchema } from "@/lib/seo/schema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
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
    default: "FreeWebStuff — Curated Directory of 20,000+ Best Free Tools, Movies, AI & Software",
    template: "%s | FreeWebStuff",
  },
  description:
    "Explore the internet's definitive directory of 20,000+ verified free websites, open-source software, streaming sites, AI assistants, developer tools, ebooks, and privacy utilities.",
  keywords: [
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
      className={`dark ${inter.variable} ${jakarta.variable} ${mono.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("fwsf-theme")||localStorage.getItem("fins-theme")||"matte-sepia";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col antialiased bg-[#090b10] text-[#f8fafc]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
