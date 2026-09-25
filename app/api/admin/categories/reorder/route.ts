import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/admin-auth";
import { updateCategoryOrder } from "@/lib/db/siteConfig";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { categoryOrder } = body;

    if (!Array.isArray(categoryOrder)) {
      return NextResponse.json({ ok: false, error: "categoryOrder array required" }, { status: 400 });
    }

    const updated = updateCategoryOrder(categoryOrder);
    return NextResponse.json({ ok: true, config: updated });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: "Failed to reorder categories" }, { status: 500 });
  }
}
