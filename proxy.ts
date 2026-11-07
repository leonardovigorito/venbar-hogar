import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedApiWrite =
    (pathname.startsWith("/api/productos") || pathname.startsWith("/api/categorias")) &&
    req.method !== "GET";

  if (!isAdminPage && !isProtectedApiWrite) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    if (isProtectedApiWrite) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/productos",
    "/api/productos/:path*",
    "/api/categorias",
    "/api/categorias/:path*",
  ],
};
