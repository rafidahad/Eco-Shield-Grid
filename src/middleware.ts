import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_NAME } from "@/lib/auth";

// Routes that don't require authentication
const publicRoutes = ["/login", "/api/auth/login", "/api/telemetry"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Check for session cookie
  const session = request.cookies.get(SESSION_NAME)?.value;

  if (!session) {
    // Redirect to login if accessing protected route
    if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // 3. Verify session
    const parsed = await decrypt(session);
    
    // Check if session is expired
    if (new Date(parsed.expires) < new Date()) {
        throw new Error("Session expired");
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid or expired session
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set(SESSION_NAME, "", { expires: new Date(0) });
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
