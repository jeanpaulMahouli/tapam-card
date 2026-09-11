import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
const COOKIE = "tapam_session";
const secret = process.env.AUTH_SECRET || "development-secret-change-me";
type Session = { userId: string; role: "USER" | "ADMIN" | "SUPER_ADMIN"; exp: number };
const sign = (payload: string) => crypto.createHmac("sha256", secret).update(payload).digest("base64url");
export function encodeSession(value: Session) { const payload = Buffer.from(JSON.stringify(value)).toString("base64url"); return `${payload}.${sign(payload)}`; }
function decodeSession(value?: string): Session | null { if (!value) return null; const [payload, signature] = value.split("."); if (!payload || !signature || !crypto.timingSafeEqual(Buffer.from(sign(payload)), Buffer.from(signature))) return null; try { const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session; return session.exp > Date.now() ? session : null; } catch { return null; } }
export async function getSession() { return decodeSession((await cookies()).get(COOKIE)?.value); }
export async function setSession(userId: string, role: Session["role"]) { const jar = await cookies(); jar.set(COOKIE, encodeSession({ userId, role, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 }); }
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function requireUser() { const session = await getSession(); if (!session) redirect("/login"); const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { profile: true, cards: true } }); if (!user || user.status !== "ACTIVE") redirect("/login"); return user; }
export async function requireAdmin() { const user = await requireUser(); if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") redirect("/dashboard"); return user; }
