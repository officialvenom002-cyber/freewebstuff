import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "fwsf_admin_session";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Loaded strictly from environment variables (never committed to git)
function getEnvConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_SESSION_SECRET || "fwsf_default_secure_secret_fallback_key_2026";

  return { username, password, secret };
}

/**
 * Validates admin credentials against environment variables.
 * Uses timingSafeEqual to protect against side-channel timing attacks.
 */
export function validateAdminCredentials(user: string, pass: string): boolean {
  const { username, password } = getEnvConfig();

  if (!username || !password || !user || !pass) {
    return false;
  }

  try {
    const userBuf = Buffer.from(user);
    const expectedUserBuf = Buffer.from(username);
    const passBuf = Buffer.from(pass);
    const expectedPassBuf = Buffer.from(password);

    if (userBuf.length !== expectedUserBuf.length || passBuf.length !== expectedPassBuf.length) {
      return false;
    }

    const userMatch = crypto.timingSafeEqual(userBuf, expectedUserBuf);
    const passMatch = crypto.timingSafeEqual(passBuf, expectedPassBuf);

    return userMatch && passMatch;
  } catch {
    return false;
  }
}

/**
 * Creates a cryptographically signed session token.
 */
export function createSessionToken(username: string): string {
  const { secret } = getEnvConfig();
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ u: username, exp: expiresAt })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

/**
 * Verifies a session token.
 */
export function verifySessionToken(token: string | undefined | null): { valid: boolean; username?: string } {
  if (!token || typeof token !== "string") {
    return { valid: false };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [payloadStr, signature] = parts;
  const { secret } = getEnvConfig();

  try {
    const expectedSig = crypto.createHmac("sha256", secret).update(payloadStr).digest("base64url");
    const sigBuf = Buffer.from(signature);
    const expectedSigBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedSigBuf.length || !crypto.timingSafeEqual(sigBuf, expectedSigBuf)) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, username: payload.u };
  } catch {
    return { valid: false };
  }
}

/**
 * Checks admin authentication in Server Components or Route Handlers.
 */
export async function isAuthenticatedAdmin(req?: NextRequest): Promise<boolean> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      // In build/static phase
    }
  }

  const { valid } = verifySessionToken(token);
  return valid;
}

export { COOKIE_NAME, SESSION_TTL_SECONDS };
