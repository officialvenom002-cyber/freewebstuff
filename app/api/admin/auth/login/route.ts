import { NextRequest, NextResponse } from "next/server";
import { validateAdminCredentials, createSessionToken, COOKIE_NAME, SESSION_TTL_SECONDS } from "@/lib/auth/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: "Username and password required" }, { status: 400 });
    }

    const isValid = validateAdminCredentials(String(username).trim(), String(password).trim());

    if (!isValid) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = createSessionToken(username);
    const res = NextResponse.json({ ok: true, message: "Authentication successful" });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return res;
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: "Authentication failed" }, { status: 500 });
  }
}
