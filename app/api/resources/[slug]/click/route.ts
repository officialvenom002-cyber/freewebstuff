import { NextRequest, NextResponse } from "next/server";
import { recordResourceClick } from "@/lib/db/store";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";

// Rate limit: max 30 click events per IP per minute (generous for real users, blocks bots)
const LIMIT = 30;
const WINDOW_MS = 60 * 1000;

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // ── Rate Limit ──────────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = rateLimit(`click:${ip}`, LIMIT, WINDOW_MS);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  recordResourceClick(params.slug);
  return NextResponse.json({ success: true });
}
