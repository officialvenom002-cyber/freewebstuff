import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow maximum serverless execution duration

/**
 * Daily Cron Endpoint
 * Scheduled once daily via vercel.json:
 * "schedule": "0 3 * * *"
 *
 * Verifies and returns health check status without exceeding serverless resource limits.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const healthFilePath = path.join(process.cwd(), "public", "data", "site-health.json");
    let existingData = null;

    if (fs.existsSync(healthFilePath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(healthFilePath, "utf8"));
      } catch {}
    }

    return NextResponse.json({
      ok: true,
      message: "Daily health check endpoint active",
      lastCheck: existingData?.generatedAt || null,
      stats: existingData?.stats || null,
      totalTracked: existingData ? Object.keys(existingData.sites || {}).length : 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
