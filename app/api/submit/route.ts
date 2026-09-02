import { NextRequest, NextResponse } from "next/server";
import { createSubmission, getAllResources } from "@/lib/db/store";
import { validateAndParseUrl } from "@/lib/validation/urlChecker";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";

// Rate limit: max 3 submissions per IP per 10 minutes
const LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  // ── Rate Limit ──────────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = rateLimit(`submit:${ip}`, LIMIT, WINDOW_MS);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await request.json();
    const { name, url, description, categoryId, subcategoryId, pricingType, platforms, tags, reason, submitterEmail } = body;

    if (!name || !url || !description || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: Name, URL, Description, and Category are required." },
        { status: 400 }
      );
    }

    const validation = validateAndParseUrl(url);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check duplicate URL / Domain against existing resources
    const existing = getAllResources().find(
      (r) => r.url.toLowerCase().includes(validation.domain) || r.name.toLowerCase() === name.toLowerCase().trim()
    );

    if (existing) {
      return NextResponse.json(
        { error: `A resource for this domain already exists in the directory (${existing.name}).` },
        { status: 409 }
      );
    }

    const submission = createSubmission({
      name: name.trim(),
      url: validation.normalizedUrl,
      description: description.trim(),
      categoryId,
      subcategoryId: subcategoryId || undefined,
      pricingType: pricingType || "free",
      platforms: platforms || ["web"],
      tags: tags || [],
      reason: reason || "Community submitted",
      submitterEmail: submitterEmail || undefined,
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
  }
}
