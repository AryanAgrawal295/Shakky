import crypto from "node:crypto";
import { cookies } from "next/headers";
const cookieName = "shake_lab_admin"; const secret = () => process.env.SHAKE_LAB_ADMIN_SECRET || "change-this-admin-secret"; const password = () => process.env.SHAKE_LAB_ADMIN_PASSWORD || "change-me-admin";
const sign = (value: string) => crypto.createHmac("sha256", secret()).update(value).digest("base64url");
export function validAdminPassword(value: string) { return value.length === password().length && crypto.timingSafeEqual(Buffer.from(value), Buffer.from(password())); }
export function adminCookie() { const expires = Date.now() + 1000*60*60*12; const value = String(expires); return `${value}.${sign(value)}`; }
export async function isAdmin() { const value=(await cookies()).get(cookieName)?.value; if (!value) return false; const [expiry, hash]=value.split("."); if (!expiry || !hash || Number(expiry)<Date.now()) return false; const expected=sign(expiry); return hash.length===expected.length && crypto.timingSafeEqual(Buffer.from(hash),Buffer.from(expected)); }
export async function requireAdmin() { if (!await isAdmin()) throw new Error("UNAUTHORIZED"); return "staff"; }
export const adminCookieName = cookieName;
