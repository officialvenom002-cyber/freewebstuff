import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/admin-auth";
import { removeWebsiteByUrl } from "@/lib/db/siteConfig";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ ok: false, error: "URL is required" }, { status: 400 });
    }

    const updated = removeWebsiteByUrl(url);
    return NextResponse.json({ ok: true, deletedWebsites: updated.deletedWebsites });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: "Failed to remove website" }, { status: 500 });
  }
}
