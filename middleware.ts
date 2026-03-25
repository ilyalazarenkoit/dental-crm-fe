import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@constants/routes";

// Define public routes that don't require authentication
// These routes are accessible to everyone (including unauthenticated users)
const PUBLIC_ROUTES = [
  ROUTES.signin,
  ROUTES.recovery,
  ROUTES.setPassword,
  ROUTES.register,
  ROUTES.resendVerification,
  ROUTES.verifyEmail,
  "/",
  // Add any other public routes here
];

// Define routes that should redirect to dashboard if already authenticated
// These are auth-related pages that authenticated users shouldn't see
const AUTH_ROUTES = [
  ROUTES.signin,
  ROUTES.recovery,
  ROUTES.setPassword,
  ROUTES.register,
  ROUTES.resendVerification,
  ROUTES.verifyEmail,
  ROUTES.landing,
];

/**
 * Middleware function that runs on every request
 * Handles authentication checks and redirects
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // isAuthenticated is determined by the long-lived is_authenticated cookie (7 days).
  // The short-lived accessToken cookie (15 min) is refreshed automatically by
  // httpClient on the first API call after expiry, so we must NOT require it here.
  // If the refresh token is also expired/revoked, the next API call will return 401,
  // httpClient will dispatch logout(), and the user will be redirected to sign-in.
  const accessToken = request.cookies.get("accessToken")?.value;
  const isAuthenticatedFlag =
    request.cookies.get("is_authenticated")?.value === "true";
  const isAuthenticated = isAuthenticatedFlag;

  // Keep accessToken in scope — may be used for future route-level token inspection.
  void accessToken;

  // Check if the current path is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is an auth route (signin, forgot password, etc.)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if user has valid authentication
  const hasValidAuth = isAuthenticated;

  // Redirect authenticated users away from auth pages to dashboard
  if (hasValidAuth && isAuthRoute) {
    // Redirect to dashboard or home
    return NextResponse.redirect(new URL(ROUTES.home, request.url));
  }

  // Case 2: User is not authenticated and tries to access a protected route
  // ALL routes that are NOT in PUBLIC_ROUTES require authentication
  // This includes: /home, /analytics, /appointments, /profile, etc.
  if (!hasValidAuth && !isPublicRoute) {
    // Store the original URL to redirect back after login
    const url = new URL(ROUTES.signin, request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));

    return NextResponse.redirect(url);
  }

  // Case 3: All other cases - allow the request to proceed
  // This covers:
  // - Authenticated users accessing protected routes (✅ Allow)
  // - Unauthenticated users accessing public routes (✅ Allow)
  const response = NextResponse.next();

  // Prevent the browser from caching protected pages in bfcache.
  // Without this, clicking the Back button after logout can restore
  // a protected page from cache, bypassing the middleware auth check.
  if (!isPublicRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

/**
 * Configure which paths the middleware should run on
 * Excludes static files, images, and API routes that handle their own auth
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Static files (/_next/, /static/, etc.)
     * - Images (/images/, etc.)
     * - API routes that handle their own auth
     * - Favicon and other browser files
     */
    "/((?!_next/static|_next/image|favicon.ico|images|static|api/auth).*)",
  ],
};
