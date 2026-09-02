import { NextRequest, NextResponse } from "next/server";
import { getResourceBySlug, updateResource, deleteResource } from "@/lib/db/store";


export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const resource = getResourceBySlug(params.slug);
  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
  return NextResponse.json(
    { resource },
    {
      headers: {
        // Individual resource detail is semi-static — cache for 1 hour at CDN edge.
        // Stale-while-revalidate gives 24h grace window before a fresh fetch is forced.
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const updated = updateResource(params.slug, body);
    if (!updated) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, resource: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update resource" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const deleted = deleteResource(params.slug);
  if (!deleted) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
