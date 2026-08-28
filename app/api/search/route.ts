import { NextRequest, NextResponse } from "next/server";
import { getAllResources, filterResources } from "@/lib/db/store";
import { searchResources } from "@/lib/search/engine";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  let resources = getAllResources();

  if (category && category !== "all") {
    resources = filterResources({ category });
  }

  if (q.trim()) {
    resources = searchResources(resources, q);
  }

  return NextResponse.json({
    total: resources.length,
    resources: resources.slice(0, limit),
  });
}
