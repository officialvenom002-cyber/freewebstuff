import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  return NextResponse.json({ authenticated: isAuth });
}
