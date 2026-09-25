import { NextRequest, NextResponse } from "next/server";

/**
 * Uptime probe endpoint.
 * Client calls: GET /api/uptime?url=https://example.com
 * We do a HEAD request server-side (no CORS issues) and return {ok, status, latency}.
 * Cached for 5 minutes in the CDN / edge cache so we don't hammer sites.
 */
export const runtime = "edge";

const TIMEOUT_MS = 7000;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url || !/^https?:\/\/.+/.test(url)) {
    return NextResponse.json({ ok: false, status: 400, latency: 0 }, { status: 400 });
  }

  // SSRF Protection: block local/internal network requests
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      host.startsWith("172.16.") ||
      host.startsWith("169.254.")
    ) {
      return NextResponse.json({ ok: false, status: 403, error: "Forbidden target" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ ok: false, status: 400, error: "Invalid URL" }, { status: 400 });
  }

  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; FreeWebStuffBot/1.0; +https://freewebstuff.site)",
      },
    });

    clearTimeout(timer);
    const latency = Date.now() - start;
    const ok = res.status < 400;
    const updatedUrl = res.url && res.url !== url ? res.url : undefined;

    return NextResponse.json(
      { ok, status: res.status, latency, updatedUrl },
      {
        status: 200,
        headers: {
          // Cache result for 24 hours in CDN
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err: unknown) {
    const latency = Date.now() - start;
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { ok: false, status: isTimeout ? 408 : 0, latency },
      {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30" },
      }
    );
  }
}
