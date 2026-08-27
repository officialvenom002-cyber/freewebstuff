import { NextRequest, NextResponse } from "next/server";
import { voteResourceHelpful } from "@/lib/db/store";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    voteResourceHelpful(params.slug, Boolean(body.isHelpful));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid vote payload" }, { status: 400 });
  }
}
