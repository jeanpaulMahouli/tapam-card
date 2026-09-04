import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);

const SESSION_COOKIE = "tapam_session";

/**
 * Middleware de protection des routes.
 * - /dashboard/**  -> nécessite une session valide (tout rôle)
 * - /admin/**      -> nécessite une session valide avec rôle ADMIN ou SUPER_ADMIN
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  if (!isDashboard && !isAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string;

    if (isAdmin && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
