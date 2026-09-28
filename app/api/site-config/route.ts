import { NextResponse } from "next/server";
import { getSiteCustomizations } from "@/lib/db/siteConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getSiteCustomizations();
  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
