import { NextRequest, NextResponse } from "next/server";
import { getSiteCustomizations, updateTopSupporters, TopSupporter } from "@/lib/db/siteConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getSiteCustomizations();
  return NextResponse.json({
    supporters: config.topSupporters || [],
    lastUpdated: config.lastUpdated,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body.supporters)) {
      return NextResponse.json({ error: "supporters array is required" }, { status: 400 });
    }

    const updated = updateTopSupporters(body.supporters as TopSupporter[]);
    return NextResponse.json({
      success: true,
      supporters: updated.topSupporters || [],
      lastUpdated: updated.lastUpdated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update supporters" }, { status: 500 });
  }
}
