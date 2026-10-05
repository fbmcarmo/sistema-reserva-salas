import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/cadastro";
  const isProtectedArea =
    pathname.startsWith("/salas") ||
    pathname.startsWith("/reservas") ||
    pathname.startsWith("/perfil");

  // Redireciona para login se não autenticado
  if (!token && isProtectedArea) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redireciona para salas se já autenticado
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/salas", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};