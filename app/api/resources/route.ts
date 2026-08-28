import { NextRequest, NextResponse } from "next/server";
import { getAllResources, filterResources, createResource } from "@/lib/db/store";
import { FilterOptions } from "@/lib/types";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const subcategory = searchParams.get("subcategory") || undefined;
  const query = searchParams.get("q") || undefined;
  const sortBy = (searchParams.get("sort") as FilterOptions["sortBy"]) || "popular";
  const verifiedOnly = searchParams.get("verified") === "true";
  const openSourceOnly = searchParams.get("foss") === "true";

  const options: FilterOptions = {
    category,
    subcategory,
    query,
    sortBy,
    verifiedOnly,
    openSourceOnly,
  };

  const resources = filterResources(options);
  return NextResponse.json({ total: resources.length, resources });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.url || !body.categoryId) {
      return NextResponse.json({ error: "Missing required fields (name, url, categoryId)" }, { status: 400 });
    }

    const newResource = createResource(body);
    return NextResponse.json({ success: true, resource: newResource }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
