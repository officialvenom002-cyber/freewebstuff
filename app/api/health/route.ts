import { NextResponse } from "next/server";
import { getAllResources, getAllCategories } from "@/lib/db/store";

const START_TIME = Date.now();

/**
 * Health check endpoint — used by uptime monitors (UptimeRobot, BetterStack, etc.)
 * Returns 200 as long as the app is alive and the data store is responding.
 * Connect to: https://freewebstuff.net/api/health
 */
export async function GET() {
  try {
    // Quick sanity check — confirm the in-memory store is readable
    const resourceCount = getAllResources().length;
    const categoryCount = getAllCategories().length;
    const uptimeSeconds = Math.floor((Date.now() - START_TIME) / 1000);

    return NextResponse.json(
      {
        status: "ok",
        uptime: uptimeSeconds,
        resources: resourceCount,
        categories: categoryCount,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
      },
      {
        status: 200,
        headers: {
          // Never cache the health endpoint — monitors need live status
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Health check failed" },
      { status: 503 }
    );
  }
}
