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
    default: "FreeWebStuff | Modern Curated Directory & Search Engine for Web Tools",
    template: "%s | FreeWebStuff",
  },
  description:
    "Discover the internet's best resources, software, developer tools, AI models, and privacy utilities. A lightning-fast, community-curated index without clutter.",
  keywords: [
    "resource directory",
    "developer tools",
    "best free software",
    "open source tools",
    "curated web directory",
    "privacy tools",
    "AI models",
    "productive tools",
  ],
  authors: [{ name: "FreeWebStuff Community" }],
  creator: "FreeWebStuff",
  metadataBase: new URL("https://freewebstuff.site"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freewebstuff.site",
    siteName: "FreeWebStuff",
    title: "FreeWebStuff | Discover Curated Web Resources & Software",
    description: "Search and explore 12,000+ curated tools, open-source software, and AI assistants across 24 categories.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeWebStuff | Discover Curated Web Resources & Software",
    description: "Search and explore 12,000+ curated tools, open-source software, and AI assistants.",
  },
  robots: {
    index: true,
    follow: true,
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
      <body className="font-sans min-h-screen flex flex-col antialiased bg-[#0f0d0b] text-[#f8fafc]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
