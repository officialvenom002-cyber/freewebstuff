import { NextRequest, NextResponse } from "next/server";
import { createReport } from "@/lib/db/store";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";

// Rate limit: max 5 reports per IP per 10 minutes
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  // ── Rate Limit ──────────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = rateLimit(`report:${ip}`, LIMIT, WINDOW_MS);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await request.json();
    const { resourceId, resourceName, reason, details, reporterEmail } = body;

    if (!resourceId || !resourceName || !reason || !details) {
      return NextResponse.json(
        { error: "Missing required fields for reporting." },
        { status: 400 }
      );
    }

    const report = createReport({
      resourceId,
      resourceName,
      reason,
      details,
      reporterEmail,
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
