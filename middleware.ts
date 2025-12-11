import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  const { pathname } = request.nextUrl

  // Si el usuario está en la página de login y ya tiene sesión, redirigir al dashboard
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si el usuario no tiene sesión y trata de acceder a rutas protegidas
  if (!session && pathname !== "/login") {
    // Permitir acceso a recursos estáticos y api si es necesario, pero bloquear rutas de la app
    if (!pathname.startsWith("/_next") && !pathname.startsWith("/static") && !pathname.includes(".")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
