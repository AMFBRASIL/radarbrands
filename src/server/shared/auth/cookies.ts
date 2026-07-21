import { createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE = "rb_session";
export const ORGANIZATION_COOKIE = "rb_org";

export const SESSION_MAX_AGE_REMEMBER_SEC = 60 * 60 * 24 * 30;
export const SESSION_MAX_AGE_DEFAULT_SEC = 60 * 60 * 24;

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function buildSessionCookie(token: string, maxAgeSec: number, secure: boolean): string {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function buildOrganizationCookie(organizationUuid: string, maxAgeSec: number, secure: boolean): string {
  const parts = [
    `${ORGANIZATION_COOKIE}=${encodeURIComponent(organizationUuid)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearCookie(name: string): string {
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, decodeURIComponent(rest.join("="))];
    }),
  );
}
