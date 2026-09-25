import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In-memory active user presence registry
const activeSessions = new Map<string, number>();
const SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

// Prune expired sessions
function cleanupSessions(now: number) {
  for (const [key, timestamp] of activeSessions.entries()) {
    if (now - timestamp > SESSION_TIMEOUT_MS) {
      activeSessions.delete(key);
    }
  }
}

export async function GET(req: NextRequest) {
  const now = Date.now();
  
  // Extract identifier (header, IP, or fallback)
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous-user";
  const userAgent = req.headers.get("user-agent") || "";
  const sessionId = `${ip}-${userAgent.slice(0, 32)}`;

  activeSessions.set(sessionId, now);
  cleanupSessions(now);

  const realCount = activeSessions.size;

  // Realistic dynamic baseline jitter for high-engagement community look (min 8-19)
  const minuteSeed = Math.floor(now / (1000 * 60));
  const baseOffset = ((minuteSeed * 7 + 13) % 11) + 8; // between 8 and 18
  const displayCount = Math.max(realCount + baseOffset, realCount);

  return NextResponse.json(
    {
      onlineUsers: displayCount,
      realtimeActive: realCount,
      timestamp: now,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  return GET(req);
}
