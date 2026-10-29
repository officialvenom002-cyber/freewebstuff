import { NextResponse } from "next/server";
import { getCategoriesWithCounts } from "@/lib/db/store";


export const revalidate = 86400;

export async function GET() {
  const categories = getCategoriesWithCounts();
  return NextResponse.json(
    { categories },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "Cloudflare-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
