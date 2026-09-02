import { NextRequest, NextResponse } from "next/server";
import { voteResourceHelpful } from "@/lib/db/store";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";

// Rate limit: max 10 votes per IP per 10 minutes
const LIMIT = 10;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // ── Rate Limit ──────────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = rateLimit(`vote:${ip}`, LIMIT, WINDOW_MS);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await request.json();
    voteResourceHelpful(params.slug, Boolean(body.isHelpful));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid vote payload" }, { status: 400 });
  }
}
