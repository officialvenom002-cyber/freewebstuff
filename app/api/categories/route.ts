import { NextResponse } from "next/server";
import { getCategoriesWithCounts } from "@/lib/db/store";


export async function GET() {
  const categories = getCategoriesWithCounts();
  return NextResponse.json(
    { categories },
    {
      headers: {
        // Categories are semi-static — cache at CDN edge for 1 hour, serve stale for 2h
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    }
  );
}
