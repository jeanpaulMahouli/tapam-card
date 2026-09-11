"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
export async function login(formData: FormData) { const username = String(formData.get("username") || "").trim(); const password = String(formData.get("password") || ""); const user = await prisma.user.findUnique({ where: { username } }); if (!user || user.status !== "ACTIVE" || !(await bcrypt.compare(password, user.passwordHash))) redirect("/login?error=1"); await setSession(user.id, user.role); redirect(user.mustChangePassword ? "/dashboard/security?first=1" : user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard"); }
