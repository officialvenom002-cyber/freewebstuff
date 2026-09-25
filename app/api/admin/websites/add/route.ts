import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/admin-auth";
import { addWebsiteToCategory } from "@/lib/db/siteConfig";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { categorySlug, boxSlug, name, url, isStarred } = body;

    if (!categorySlug || !name || !url) {
      return NextResponse.json({ ok: false, error: "categorySlug, name, and url are required" }, { status: 400 });
    }

    const updated = addWebsiteToCategory(categorySlug, boxSlug || "general", {
      name,
      url,
      isStarred: Boolean(isStarred),
    });

    return NextResponse.json({ ok: true, customWebsites: updated.customWebsites });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: "Failed to add website" }, { status: 500 });
  }
}
