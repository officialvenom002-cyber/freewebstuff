import { NextResponse } from "next/server";
import { getSiteCustomizations } from "@/lib/db/siteConfig";

export const revalidate = 3600;

export async function GET() {
  const config = getSiteCustomizations();
  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Cloudflare-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
