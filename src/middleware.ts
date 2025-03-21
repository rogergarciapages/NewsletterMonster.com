import { NextResponse } from "next/server";

import { withAuth } from "next-auth/middleware";

// Define public and excluded paths
const PUBLIC_PATHS = ["/", "/tag", "/trending", "/api/"];

// Helper function to check if a path starts with any of the given prefixes
const pathStartsWith = (path: string, prefixes: string[]): boolean => {
  return prefixes.some(prefix => path.startsWith(prefix));
};

export default withAuth(
  req => {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // Handle /user route for redirect to personal profile
    if (path === "/user") {
      if (token?.user_id) {
        // If user has a username, redirect to username-based URL
        if (token.username) {
          return NextResponse.redirect(new URL(`/user/${token.username}`, req.url));
        }
        // Otherwise use the UUID
        return NextResponse.redirect(new URL(`/user/${token.user_id}`, req.url));
      }
    }

    // For user profile routes, ensure we're getting fresh token data
    if (path.startsWith("/user/")) {
      // Add cache control headers to prevent stale session data
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "no-store, max-age=0");
      return response;
    }

    // Skip redirection for public paths and API routes
    if (pathStartsWith(path, PUBLIC_PATHS) || path.includes(".")) {
      return NextResponse.next();
    }

    // No onboarding redirect - letting users with null username continue

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    "/user",
    "/user/:path*",
    "/settings/:path*",
    "/bookmarks/:path*",
    "/following/:path*",
    "/followers/:path*",
    "/drafts/:path*",
  ],
};
