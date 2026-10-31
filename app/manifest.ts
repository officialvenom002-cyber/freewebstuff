import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FreeWebStuff — Curated Directory of 20,000+ Best Free Tools & Software",
    short_name: "FreeWebStuff",
    description:
      "Explore the internet's definitive directory of 20,000+ verified free websites, open-source software, streaming sites, AI assistants, and developer vaults.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0C0E",
    theme_color: "#0B0C0E",
    icons: [
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
