import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Simplified security check without heavy dependencies
function simpleRateLimit(identifier: string): boolean {
  // For now, allow all requests to avoid edge runtime issues
  return true;
}

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
}

// Your existing authentication middleware
async function authMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Simplified security middleware
async function securityMiddleware(request: NextRequest) {
  // Skip security checks for static assets and auth routes
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/auth/') ||
    request.nextUrl.pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Simplified rate limiting (can be enhanced later)
  const clientIP = getClientIP(request);
  const rateLimitOk = simpleRateLimit(clientIP);

  if (!rateLimitOk) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      { 
        status: 429,
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

  // Handle protected routes that require authentication
  if (
    request.nextUrl.pathname.startsWith("/admin") || 
    request.nextUrl.pathname.startsWith("/teacher") || 
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    const sessionCookie = getSessionCookie(request);
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Let the page components handle role verification
    // This avoids complex auth API calls in middleware
    return NextResponse.next();
  }

  // For non-protected routes, just continue
  return NextResponse.next();
}
