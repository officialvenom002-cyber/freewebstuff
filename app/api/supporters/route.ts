import { NextResponse } from "next/server";
import { getSiteCustomizations } from "@/lib/db/siteConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getSiteCustomizations();
  return NextResponse.json({
    supporters: config.topSupporters || [],
    lastUpdated: config.lastUpdated,
  }, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
