// src/middleware.ts
import { NextResponse } from "next/server";

import { withAuth } from "next-auth/middleware";

export default withAuth(
  req => {
    const path = req.nextUrl.pathname;

    // Handle /user route for redirect to personal profile
    if (path === "/user") {
      const token = req.nextauth.token;
      if (token?.user_id) {
        return NextResponse.redirect(new URL(`/user/${token.user_id}`, req.url));
      }
    }

    // Allow public paths even if not authenticated
    if (path === "/") {
      return NextResponse.next();
    }

    // Protected paths logic
    if (
      path.startsWith("/settings") ||
      path.startsWith("/bookmarks") ||
      path.startsWith("/following") ||
      path.startsWith("/followers") ||
      path.startsWith("/drafts")
    ) {
      return NextResponse.next();
    }

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
