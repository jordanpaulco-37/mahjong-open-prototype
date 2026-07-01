import crypto from "node:crypto";

export const ADMIN_COOKIE_NAME = "tmo_admin_session";
const COOKIE_TTL_MS = 1000 * 60 * 60 * 8;

export function createAdminCookieValue(secret: string | undefined) {
  if (!secret) {
    return "";
  }

  const timestamp = Date.now().toString();
  const signature = crypto.createHmac("sha256", secret).update(timestamp).digest("hex");
  return `${timestamp}.${signature}`;
}

export function isValidAdminCookie(cookieValue: string | undefined, secret: string | undefined) {
  if (!cookieValue || !secret) {
    return false;
  }

  const [timestamp, signature] = cookieValue.split(".");

  if (!timestamp || !signature) {
    return false;
  }

  const now = Date.now();
  const issuedAt = Number(timestamp);

  if (!Number.isFinite(issuedAt) || now - issuedAt > COOKIE_TTL_MS) {
    return false;
  }

  const expectedSignature = crypto.createHmac("sha256", secret).update(timestamp).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}
