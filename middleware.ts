import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { protectGeneral, getClientIP } from "./lib/security";

// Your existing authentication middleware
async function authMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Security middleware using our custom system
async function securityMiddleware(request: NextRequest) {
  // Skip security checks for static assets and auth routes
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/auth/') ||
    request.nextUrl.pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Get identifier for rate limiting
  const clientIP = getClientIP(request);
  const identifier = clientIP || 'unknown';

  // Apply general protection
  const securityCheck = await protectGeneral(request, identifier, {
    maxRequests: 50, // Allow more requests for general browsing
    windowMs: 60000 // 1 minute window
  });

  if (!securityCheck.success) {
    return new NextResponse(
      JSON.stringify({ error: securityCheck.error }),
      { 
        status: securityCheck.status || 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export default async function middleware(request: NextRequest) {
  // First apply security middleware
  const securityResponse = await securityMiddleware(request);
  if (securityResponse.status !== 200) {
    return securityResponse;
  }

  // Apply auth middleware to admin and teacher routes
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/teacher")) {
    return authMiddleware(request);
  }

  // For non-protected routes, just continue
  return NextResponse.next();
}
